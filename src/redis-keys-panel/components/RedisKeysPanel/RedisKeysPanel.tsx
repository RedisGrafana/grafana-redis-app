import React, { ChangeEvent, createRef, PureComponent, RefObject } from 'react';
import { lastValueFrom, Observable } from 'rxjs';
import {
  DataFrame,
  DataQueryRequest,
  DataQueryResponse,
  DataSourceRef,
  FieldType,
  getDisplayProcessor,
  PanelProps,
  toDataFrame,
} from '@grafana/data';
import { config, getDataSourceSrv } from '@grafana/runtime';
import { Button, InlineFormLabel, Input, Table, TableSortByFieldState } from '@grafana/ui';
import {
  DefaultCount,
  DefaultInterval,
  DefaultPattern,
  DefaultSize,
  DisplayNameByFieldName,
  FieldName,
  QueryType,
} from '../../constants';
import { PanelOptions, Progress, QueryConfig, RedisKey, RedisQuery } from '../../types';

/**
 * Properties
 */
interface Props extends PanelProps<PanelOptions> {}

/**
 * State
 */
interface State {
  /**
   * Data Frame
   *
   * @type {DataFrame}
   */
  dataFrame: DataFrame | null;

  /**
   * Sorted fields
   */
  sortedFields: TableSortByFieldState[];

  /**
   * Requesting in progress
   */
  isUpdating: boolean;

  /**
   * Iterator for requesting keys
   */
  cursor: string;

  /**
   * Showing redis keys array
   */
  redisKeys: RedisKey[];

  /**
   * Config for datasource
   */
  queryConfig: QueryConfig;

  /**
   * Form height
   */
  formHeight: number;

  /**
   * Progress in scanning keys
   */
  progress: Progress;
}

/**
 * Redis Keys Panel
 */
export class RedisKeysPanel extends PureComponent<Props, State> {
  /**
   * Convert data frame to redis keys array
   *
   * @param dataFrame
   */
  static getRedisKeys(dataFrame: DataFrame): RedisKey[] {
    const keyValues: string[] = dataFrame.fields.find((field) => field.name === FieldName.Key)?.values.toArray() || [];
    const typeValues: string[] =
      dataFrame.fields.find((field) => field.name === FieldName.Type)?.values.toArray() || [];
    const memoryValues: number[] =
      dataFrame.fields.find((field) => field.name === FieldName.Memory)?.values.toArray() || [];

    /**
     * Result
     */
    const result: RedisKey[] = [];
    for (let i = 0; i < dataFrame.length; i++) {
      result.push({
        key: keyValues[i],
        type: typeValues[i],
        memory: memoryValues[i],
      });
    }

    return result;
  }

  /**
   * Get sorted keys
   *
   * @param currentKeys
   * @param newKeys
   * @param count
   */
  static getSortedRedisKeys(currentKeys: RedisKey[], newKeys: RedisKey[], count: number): RedisKey[] {
    const allRedisKeys: RedisKey[] = [...currentKeys, ...newKeys];

    /**
     * Create object with unique keys. If there are the same keys, should be used max memory value.
     */
    const redisKeysMap = allRedisKeys.reduce((acc: { [key: string]: RedisKey }, item) => {
      const alreadyExistItem = acc[item.key];
      let memory = item.memory;

      /**
       * Already Exists
       */
      if (alreadyExistItem) {
        memory = Math.max(item.memory, alreadyExistItem.memory);
      }

      return {
        ...acc,
        [item.key]: {
          ...item,
          memory,
        },
      };
    }, {});

    /**
     * Sort keys
     */
    const uniqueKeys: RedisKey[] = Object.values(redisKeysMap);
    uniqueKeys.sort((a, b) => b.memory - a.memory);

    /**
     * Return only Top keys
     */
    return uniqueKeys.slice(0, count);
  }

  /**
   * Convert redisKeys to data frame for showing in table
   *
   * @param redisKeys
   */
  static getTableDataFrame(redisKeys: RedisKey[]): DataFrame {
    const keyValues: string[] = [];
    const typeValues: string[] = [];
    const memoryValues: number[] = [];

    /**
     * Redis Keys
     */
    redisKeys.forEach((redisKey) => {
      keyValues.push(redisKey.key);
      typeValues.push(redisKey.type);
      memoryValues.push(redisKey.memory);
    });

    /**
     * Fields
     */
    const fields = [
      {
        name: FieldName.Key,
        type: FieldType.string,
        values: keyValues,
        config: {
          displayName: DisplayNameByFieldName[FieldName.Key],
        },
      },
      {
        name: FieldName.Type,
        type: FieldType.string,
        values: typeValues,
        config: {
          displayName: DisplayNameByFieldName[FieldName.Type],
        },
      },
      {
        name: FieldName.Memory,
        type: FieldType.number,
        values: memoryValues,
        config: {
          unit: 'decbytes',
          displayName: DisplayNameByFieldName[FieldName.Memory],
        },
      },
    ];

    /**
     * Data Frame
     */
    const tableDataFrame = toDataFrame({
      name: 'TableDataFrame',
      fields,
    });

    /**
     * Set Fields
     */
    tableDataFrame.fields = tableDataFrame.fields.map((field) => ({
      ...field,
      display: getDisplayProcessor({ field, theme: config.theme2 }),
    }));

    return tableDataFrame;
  }

  /**
   * Get cursor value from dataFrame
   *
   * @param dataFrame
   */
  static getCursorValue(dataFrame?: DataFrame): string {
    if (!dataFrame) {
      return '0';
    }

    /**
     * Get from data frame
     */
    const field = dataFrame.fields.find((field) => field.name === 'cursor');
    if (!field) {
      return '0';
    }

    return field.values.toArray()[0];
  }

  /**
   * Get count from dataFrame
   *
   * @param dataFrame
   */
  static getCount(dataFrame?: DataFrame): number {
    if (!dataFrame) {
      return 0;
    }

    /**
     * Get from data frame
     */
    const field = dataFrame.fields.find((field) => field.name === 'count');
    if (!field) {
      return 0;
    }

    return field.values.toArray()[0];
  }

  /**
   * Initialization
   *
   * @param props
   */
  constructor(props: Props) {
    super(props);

    /**
     * Targets
     */
    const targets: RedisQuery[] = this.props.data?.request?.targets as RedisQuery[];

    /**
     * Default Query Config
     */
    const queryConfig = {
      size: DefaultSize,
      count: DefaultCount,
      matchPattern: DefaultPattern,
    };

    /**
     * Override queryConfig if was defined
     */
    if (targets && targets[0]) {
      const { size = queryConfig.size, count = queryConfig.count, match = queryConfig.matchPattern } = targets[0];
      queryConfig.size = size;
      queryConfig.count = count;
      queryConfig.matchPattern = match;
    }

    /**
     * State
     */
    this.state = {
      sortedFields: [{ displayName: DisplayNameByFieldName[FieldName.Memory], desc: true }],
      redisKeys: [],
      isUpdating: false,
      cursor: '0',
      dataFrame: null,
      queryConfig,
      formHeight: 0,
      progress: {
        total: 0,
        processed: 0,
      },
    };
  }

  /**
   * Form html element
   */
  formRef: RefObject<HTMLDivElement> = createRef();

  /**
   * Request Data Timer
   */
  requestDataTimer?: NodeJS.Timeout | undefined;

  /**
   * Mount
   */
  componentDidMount(): void {
    if (this.formRef.current) {
      this.setState({
        formHeight: this.formRef.current.getBoundingClientRect().height,
      });
    }

    this.updateTotalKeys();
  }

  /**
   * Update
   */
  componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>): void {
    /**
     * Stop scanning data when interval is changed
     */
    if (prevProps.options.interval !== this.props.options.interval) {
      this.clearRequestDataInterval();
    }

    /**
     * Calc formHeight when panel width is changed
     */
    if (prevProps.width !== this.props.width) {
      if (this.formRef.current) {
        this.setState({
          formHeight: this.formRef.current.getBoundingClientRect().height,
        });
      }
    }

    /**
     * Stop scanning data when cursor becomes 0
     */
    if (this.state.cursor === '0') {
      this.clearRequestDataInterval();
    }

    /**
     * Update query config fields when data is changed
     */
    if (prevProps.data !== this.props.data) {
      this.clearRequestDataInterval();

      const targets: RedisQuery[] = this.props.data?.request?.targets as RedisQuery[];
      const queryConfig = {
        ...this.state.queryConfig,
      };

      /**
       * Targets
       */
      if (targets && targets[0]) {
        const { size = queryConfig.size, count = queryConfig.count, match = queryConfig.matchPattern } = targets[0];
        queryConfig.size = size;
        queryConfig.count = count;
        queryConfig.matchPattern = match;
      }

      /**
       * Set State
       */
      this.setState({
        queryConfig,
      });
    }
  }

  /**
   * Unmount
   */
  componentWillUnmount(): void {
    this.clearRequestDataInterval();
  }

  /**
   * Make Query using request.targets with default commands
   */
  async makeQuery(queryType: QueryType = QueryType.Data): Promise<DataQueryResponse | null> {
    const targets = this.props.data.request?.targets;

    /**
     * Data Source
     */
    let datasource: string | DataSourceRef = '';
    if (targets && targets.length && targets[0].datasource) {
      datasource = targets[0].datasource;
    }

    if (!datasource || !targets) {
      return Promise.resolve(null);
    }

    /**
     * Data Source
     */
    const ds = await getDataSourceSrv().get(datasource);

    /**
     * Override default values if was set query params
     */
    let targetsWithCommands = targets;

    /**
     * TMSCAN
     */
    if (queryType === QueryType.Data) {
      targetsWithCommands = targets.map((target: RedisQuery) => ({
        command: 'tmscan',
        type: 'command',
        ...target,
        count: this.state.queryConfig.count,
        size: this.state.queryConfig.size,
        match: this.state.queryConfig.matchPattern,
        cursor: this.state.cursor,
      }));
    }

    /**
     * DBSIZE
     */
    if (queryType === QueryType.TotalKeys) {
      targetsWithCommands = targets.map((target: RedisQuery) => ({
        ...target,
        type: 'cli',
        query: 'dbsize',
      }));
    }

    const query = ds.query({
      ...this.props.data.request,
      targets: targetsWithCommands,
    } as DataQueryRequest<RedisQuery>) as unknown;

    return lastValueFrom(query as Observable<DataQueryResponse>);
  }

  /**
   * Request data and update dataFrame and seriesMap in state
   */
  async updateData() {
    const response = await this.makeQuery();
    if (response === null) {
      return Promise.resolve();
    }

    const newDataFrame = response.data[0] as DataFrame;
    if (!newDataFrame) {
      return Promise.resolve();
    }

    /**
     * Calc actual keys
     */
    const keys = RedisKeysPanel.getSortedRedisKeys(
      this.state.redisKeys,
      RedisKeysPanel.getRedisKeys(newDataFrame),
      this.state.queryConfig.size
    );

    /**
     * Update progress
     */
    const progress = {
      ...this.state.progress,
    };

    /**
     * Calculate processed
     */
    const count = RedisKeysPanel.getCount(response.data[1]);
    const newProcessed = progress.processed + count;
    progress.processed = Math.min(newProcessed, progress.total);

    /**
     * Set State
     */
    this.setState({
      dataFrame: RedisKeysPanel.getTableDataFrame(keys),
      redisKeys: keys,
      cursor: RedisKeysPanel.getCursorValue(response.data[1]),
      progress,
    });

    return Promise.resolve(newDataFrame);
  }

  /**
   * Update Total Keys
   */
  async updateTotalKeys() {
    const response = await this.makeQuery(QueryType.TotalKeys);
    if (!response || !response.data) {
      return Promise.resolve();
    }

    /**
     * Get number of keys
     */
    const [total] = response.data[0].fields[0].values.toArray();

    /**
     * Set State
     */
    this.setState((prevState) => ({
      progress: {
        ...prevState.progress,
        total,
      },
    }));
  }

  /**
   * Request Interval
   */
  setRequestDataInterval = () => {
    if (this.requestDataTimer !== undefined) {
      this.clearRequestDataInterval();
    }

    /**
     * Set state
     */
    this.setState((prevState) => ({
      isUpdating: true,
      dataFrame: null,
      redisKeys: [],
      progress: {
        total: prevState.progress.total,
        processed: 0,
      },
    }));

    /**
     * Scanning
     */
    const startUpdatingData = () => {
      this.updateData().then(() => {
        if (this.state.isUpdating) {
          /**
           * Add new timeout for scanning data, If isUpdating=true
           */
          this.requestDataTimer = setTimeout(startUpdatingData, this.props.options.interval || DefaultInterval);
        }
      });
    };

    /**
     * Interval
     */
    startUpdatingData();
  };

  /**
   * Clear Interval
   */
  clearRequestDataInterval = () => {
    if (this.requestDataTimer !== undefined) {
      /**
       * Set State
       */
      this.setState({
        isUpdating: false,
      });

      /**
       * Clear
       */
      clearTimeout(this.requestDataTimer);
      delete this.requestDataTimer;
    }
  };

  /**
   * Change sort
   *
   * @param sortedFields
   */
  onChangeSort = (sortedFields: TableSortByFieldState[]) => {
    this.setState({
      sortedFields,
    });
  };

  /**
   * Change Size
   */
  onChangeSize = (event: ChangeEvent<HTMLInputElement>) => {
    this.setState((prevState) => ({
      queryConfig: {
        ...prevState.queryConfig,
        size: parseInt(event.target.value || '0', 10),
      },
    }));
  };

  /**
   * Change Count
   */
  onChangeCount = (event: ChangeEvent<HTMLInputElement>) => {
    this.setState((prevState) => ({
      queryConfig: {
        ...prevState.queryConfig,
        count: parseInt(event.target.value || '0', 10),
      },
    }));
  };

  /**
   * Change Match Pattern
   */
  onChangeMatchPattern = (event: ChangeEvent<HTMLInputElement>) => {
    this.setState((prevState) => ({
      queryConfig: {
        ...prevState.queryConfig,
        matchPattern: event.target.value,
      },
    }));
  };

  /**
   * Render
   */
  render() {
    const { dataFrame, sortedFields, isUpdating, redisKeys, queryConfig, formHeight, progress } = this.state;

    return (
      <>
        <div className="gf-form gf-form-inline" ref={this.formRef}>
          <div className="gf-form gf-form-spacing">
            <InlineFormLabel width={5}>Top keys</InlineFormLabel>
            <Input
              name="size"
              value={queryConfig.size}
              type="number"
              onChange={this.onChangeSize}
              width={8}
              disabled={isUpdating}
            />
          </div>

          <div className="gf-form gf-form-spacing">
            <InlineFormLabel
              tooltip="The amount of work that should be done at every call in order to retrieve elements from the collection."
              width={5}
            >
              Count
            </InlineFormLabel>
            <Input
              name="count"
              value={queryConfig.count}
              type="number"
              onChange={this.onChangeCount}
              width={10}
              disabled={isUpdating}
            />
          </div>

          <div className="gf-form gf-form-spacing">
            <InlineFormLabel width={6}>Match pattern</InlineFormLabel>
            <Input
              name="matchPattern"
              value={queryConfig.matchPattern}
              onChange={this.onChangeMatchPattern}
              width={12}
              disabled={isUpdating}
            />
          </div>

          <div className="gf-form gf-form-spacing">
            <Button onClick={isUpdating ? this.clearRequestDataInterval : this.setRequestDataInterval}>
              {isUpdating ? `Stop scanning (${progress.processed}/${progress.total})` : 'Start scanning'}
            </Button>
          </div>
        </div>

        {!dataFrame || redisKeys.length === 0 ? (
          <div>{this.state.isUpdating ? 'No keys found.' : 'No keys found. Please start scanning.'}</div>
        ) : (
          <Table
            data={dataFrame}
            width={this.props.width}
            height={this.props.height - formHeight}
            initialSortBy={sortedFields}
            onSortByChange={this.onChangeSort}
          />
        )}
      </>
    );
  }
}
