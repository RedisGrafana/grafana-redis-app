import React, { PureComponent } from 'react';
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
import { Table, TableSortByFieldState, Button } from '@grafana/ui';
import { DefaultInterval, PanelOptions, RedisQuery, DisplayNameByFieldName, FieldName } from '../types';

/**
 * Properties
 */
interface Props extends PanelProps<PanelOptions> {}

interface RedisKey {
  key: string;
  type: string;
  memory: number;
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
    const field = dataFrame.fields.find((field) => field.name === 'Cursor');
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

    this.state = {
      sortedFields: [{ displayName: DisplayNameByFieldName[FieldName.Memory], desc: true }],
      redisKeys,
      isUpdating: false,
      cursor,
      dataFrame: RedisBiggestKeysPanel.getTableDataFrame(redisKeys),
    };
  }

  /**
   * Request Data Timer
   */
  requestDataTimer?: NodeJS.Timeout | undefined;

  /**
   * Mount
   */
  componentDidMount(): void {
    if (this.props.options.interval !== undefined) {
      this.setRequestDataInterval();
    }
  }

  /**
   * Update
   */
  componentDidUpdate(prevProps: Readonly<Props>): void {
    if (prevProps.options.interval !== this.props.options.interval) {
      this.setRequestDataInterval();
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
  async makeQuery(): Promise<DataQueryResponse | null> {
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
    const targetsWithCommands = targets.map((target: RedisQuery) => ({
      command: 'tmscan',
      type: 'command',
      count: 10,
      ...target,
      cursor: this.state.cursor,
    }));

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

    const target: any = this.props.data.request?.targets[0] || {};
    const biggestKeys = RedisBiggestKeysPanel.getBiggestRedisKeys(
      this.state.redisKeys,
      RedisBiggestKeysPanel.getRedisKeys(newDataFrame),
      target.count || 10
    );

    this.setState({
      dataFrame: RedisBiggestKeysPanel.getTableDataFrame(biggestKeys),
      redisKeys: biggestKeys,
      cursor: RedisBiggestKeysPanel.getCursorValue(response.data[1]),
    });

    return Promise.resolve(newDataFrame);
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

  render() {
    /**
     * If no dataFrame return null
     */
    if (!this.state.dataFrame || this.state.redisKeys.length === 0) {
      return null;
    }

    const { dataFrame, sortedFields, isUpdating } = this.state;

    return (
      <>
        <div className="gf-form">
          <Button onClick={isUpdating ? this.clearRequestDataInterval : this.setRequestDataInterval}>
            {isUpdating ? 'Stop updating data' : 'Start updating data'}
          </Button>
        </div>
        <Table
          data={dataFrame}
          width={this.props.width}
          height={this.props.height - 36}
          initialSortBy={sortedFields}
          onSortByChange={this.onChangeSort}
        />
      </>
    );
  }
}
