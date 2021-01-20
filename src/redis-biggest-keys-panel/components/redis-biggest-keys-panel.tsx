import React, { PureComponent, ChangeEvent, createRef, RefObject } from 'react';
import { css } from 'emotion';
import { Observable } from 'rxjs';
import {
  DataFrame,
  DataQueryRequest,
  DataQueryResponse,
  PanelProps,
  toDataFrame,
  getDisplayProcessor,
  FieldType,
} from '@grafana/data';
import { getDataSourceSrv } from '@grafana/runtime';
import { Table, TableSortByFieldState, Button, Input, InlineFormLabel } from '@grafana/ui';
import { DefaultInterval, PanelOptions, RedisQuery, DisplayNameByFieldName, FieldName } from '../types';

/**
 * Query Type
 */
enum QueryType {
  Data = 'Data',
  TotalKeys = 'TotalKeys',
}

/**
 * Properties
 */
interface Props extends PanelProps<PanelOptions> {}

/**
 * Redis Keys
 */
interface RedisKey {
  key: string;
  type: string;
  memory: number;
}

/**
 * Query Config
 */
interface QueryConfig {
  size: number;
  count: number;
  matchPattern: string;
}

/**
 * Progress
 */
interface Progress {
  total: number;
  processed: number;
}

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
   * Progress
   */
  progress: Progress;
}

/**
 * Redis Biggest Keys Panel
 */
export class RedisBiggestKeysPanel extends PureComponent<Props, State> {
  /**
   * Convert data frame to redis keys array
   * @param dataFrame
   */
  static getRedisKeys(dataFrame: DataFrame): RedisKey[] {
    const keyValues: string[] = dataFrame.fields.find((field) => field.name === FieldName.Key)?.values.toArray() || [];
    const typeValues: string[] =
      dataFrame.fields.find((field) => field.name === FieldName.Type)?.values.toArray() || [];
    const memoryValues: number[] =
      dataFrame.fields.find((field) => field.name === FieldName.Memory)?.values.toArray() || [];

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
   * Get sorted biggest keys
   * @param currentKeys
   * @param newKeys
   * @param count
   */
  static getBiggestRedisKeys(currentKeys: RedisKey[], newKeys: RedisKey[], count: number): RedisKey[] {
    const allRedisKeys: RedisKey[] = [...currentKeys, ...newKeys];
    const redisKeysMap = allRedisKeys.reduce((acc: { [key: string]: RedisKey }, item) => {
      const alreadyExistItem = acc[item.key];
      let memory = item.memory;
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
    const uniqueKeys: RedisKey[] = Object.values(redisKeysMap);
    uniqueKeys.sort((a, b) => b.memory - a.memory);
    return uniqueKeys.slice(0, count);
  }

  /**
   * Convert redisKeys to data frame for showing in table
   * @param redisKeys
   */
  static getTableDataFrame(redisKeys: RedisKey[]): DataFrame {
    const keyValues: string[] = [];
    const typeValues: string[] = [];
    const memoryValues: number[] = [];

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
      display: getDisplayProcessor({ field }),
    }));

    return tableDataFrame;
  }

  /**
   * Get cursor value from dataFrame
   * @param dataFrame
   */
  static getCursorValue(dataFrame?: DataFrame): string {
    if (!dataFrame) {
      return '0';
    }
    const field = dataFrame.fields.find((field) => field.name === 'cursor');
    if (!field) {
      return '0';
    }
    return field.values.toArray()[0];
  }

  /**
   * Initialization
   * @param props
   */
  constructor(props: Props) {
    super(props);

    const series = this.props.data?.series || [];
    const dataFrame = series[0];
    const cursor = RedisBiggestKeysPanel.getCursorValue(series[1]);
    let redisKeys: RedisKey[] = [];
    if (dataFrame) {
      redisKeys = RedisBiggestKeysPanel.getRedisKeys(dataFrame);
    }
    const targets: RedisQuery[] = this.props.data?.request?.targets as RedisQuery[];
    const queryConfig = {
      size: 10,
      count: 10,
      matchPattern: '*',
    };
    if (targets && targets[0]) {
      const { size = queryConfig.size, count = queryConfig.count, match = queryConfig.matchPattern } = targets[0];
      queryConfig.size = size;
      queryConfig.count = count;
      queryConfig.matchPattern = match;
    }

    this.state = {
      sortedFields: [{ displayName: DisplayNameByFieldName[FieldName.Memory], desc: true }],
      redisKeys,
      isUpdating: false,
      cursor,
      dataFrame: RedisBiggestKeysPanel.getTableDataFrame(redisKeys),
      queryConfig,
      formHeight: 0,
      progress: {
        total: 0,
        processed: queryConfig.count,
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
  componentDidUpdate(prevProps: Readonly<Props>): void {
    if (prevProps.options.interval !== this.props.options.interval) {
      this.clearRequestDataInterval();
    }
    if (prevProps.width !== this.props.width || prevProps.height !== this.props.height) {
      if (this.formRef.current) {
        this.setState({
          formHeight: this.formRef.current.getBoundingClientRect().height,
        });
      }
    }
  }

  /**
   * Unmount
   */
  componentWillUnmount(): void {
    this.clearRequestDataInterval();
  }

  /**
   * makeQuery using request.targets with default commands
   */
  async makeQuery(queryType: QueryType = QueryType.Data): Promise<DataQueryResponse | null> {
    const targets = this.props.data.request?.targets;
    let datasource = '';
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
    if (queryType === QueryType.TotalKeys) {
      targetsWithCommands = targets.map((target: RedisQuery) => ({
        ...target,
        type: 'cli',
        query: 'dbsize',
      }));
    }

    return ((ds.query({
      ...this.props.data.request,
      targets: targetsWithCommands,
    } as DataQueryRequest<RedisQuery>) as unknown) as Observable<DataQueryResponse>).toPromise();
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

    const biggestKeys = RedisBiggestKeysPanel.getBiggestRedisKeys(
      this.state.redisKeys,
      RedisBiggestKeysPanel.getRedisKeys(newDataFrame),
      this.state.queryConfig.size
    );

    const progress = {
      ...this.state.progress,
    };
    const newProcessed = this.state.queryConfig.count + progress.processed;
    progress.processed = Math.min(newProcessed, progress.total);

    this.setState({
      dataFrame: RedisBiggestKeysPanel.getTableDataFrame(biggestKeys),
      redisKeys: biggestKeys,
      cursor: RedisBiggestKeysPanel.getCursorValue(response.data[1]),
      progress,
    });

    return Promise.resolve(newDataFrame);
  }

  async updateTotalKeys() {
    const response = await this.makeQuery(QueryType.TotalKeys);
    if (!response || !response.data) {
      return Promise.resolve();
    }

    const [total] = response.data[0].fields[0].values.toArray();
    this.setState({
      progress: {
        ...this.state.progress,
        total,
      },
    });
  }

  /**
   * Request Interval
   */
  setRequestDataInterval = () => {
    if (this.requestDataTimer !== undefined) {
      this.clearRequestDataInterval();
    }

    this.setState({
      isUpdating: true,
    });

    const startUpdatingData = () => {
      this.updateData().then(() => {
        if (this.state.isUpdating) {
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
      this.setState({
        isUpdating: false,
      });

      clearTimeout(this.requestDataTimer);
      delete this.requestDataTimer;
    }
  };

  /**
   * Change sort
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
    this.setState({
      queryConfig: {
        ...this.state.queryConfig,
        size: parseInt(event.target.value, 10),
      },
    });
  };

  /**
   * Change Count
   */
  onChangeCount = (event: ChangeEvent<HTMLInputElement>) => {
    this.setState({
      queryConfig: {
        ...this.state.queryConfig,
        count: parseInt(event.target.value, 10),
      },
    });
  };

  /**
   * Change Match Pattern
   */
  onChangeMatchPattern = (event: ChangeEvent<HTMLInputElement>) => {
    this.setState({
      queryConfig: {
        ...this.state.queryConfig,
        matchPattern: event.target.value,
      },
    });
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
            <InlineFormLabel width={4}>Size</InlineFormLabel>
            <Input name="size" value={queryConfig.size} css="" type="number" onChange={this.onChangeSize} width={8} />
          </div>
          <div className="gf-form gf-form-spacing">
            <InlineFormLabel width={4}>Count</InlineFormLabel>
            <Input
              name="count"
              value={queryConfig.count}
              css=""
              type="number"
              onChange={this.onChangeCount}
              width={10}
            />
          </div>
          <div className="gf-form gf-form-spacing">
            <InlineFormLabel width={6}>Match pattern</InlineFormLabel>
            <Input
              name="matchPattern"
              value={queryConfig.matchPattern}
              css=""
              onChange={this.onChangeMatchPattern}
              width={12}
            />
          </div>
          <div className="gf-form gf-form-spacing">
            <Button onClick={isUpdating ? this.clearRequestDataInterval : this.setRequestDataInterval}>
              {isUpdating ? 'Stop scanning' : 'Start scanning'}
            </Button>
          </div>
          {progress.total > 0 && (
            <div className={css(`display: flex; align-items: center; height: 32px;`)}>
              Processed {progress.processed} of {progress.total}
            </div>
          )}
        </div>

        {!dataFrame || redisKeys.length === 0 ? (
          <div>No keys found.</div>
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
