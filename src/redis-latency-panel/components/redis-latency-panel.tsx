import React, { PureComponent } from 'react';
import { Observable } from 'rxjs';
import { switchMap as switchMap$ } from 'rxjs/operators';
import {
  DataFrame,
  DataQueryRequest,
  DataQueryResponse,
  FieldType,
  getDisplayProcessor,
  toDataFrame,
} from '@grafana/data';
import { getDataSourceSrv } from '@grafana/runtime';
import { Table } from '@grafana/ui';
import {
  DefaultInterval,
  DisplayNameByFieldName,
  FieldName,
  Props,
  RedisQuery,
  State,
  ValuesForCalculation,
} from '../types';

/**
 * Redis Latency Panel
 */
export class RedisLatencyPanel extends PureComponent<Props, State> {
  /**
   * Calculate Latency
   */
  static getLatencyValue({
    duration,
    prevDuration,
    calls,
    prevCalls,
  }: {
    duration: number;
    prevDuration?: number;
    calls: number;
    prevCalls?: number;
  }): number {
    if (prevDuration === undefined || prevCalls === undefined) {
      return duration / calls;
    }

    const diffDuration = duration - prevDuration;
    const diffCalls = calls - prevCalls;
    if (diffCalls === 0) {
      return 0;
    }

    /**
     * Return Latency
     */
    return diffDuration / diffCalls;
  }

  /**
   * Get Values
   *
   * @param dataFrame {DataFrame} Data Frame
   */
  static getValuesForCalculation(dataFrame: DataFrame): ValuesForCalculation {
    const numberOfCallsField = dataFrame.fields.find((field) => field.name === FieldName.Calls);
    const totalDurationField = dataFrame.fields.find((field) => field.name === FieldName.Duration);

    /**
     * Result
     */
    const result: ValuesForCalculation = {
      calls: [],
      duration: [],
    };

    if (numberOfCallsField) {
      result.calls = numberOfCallsField.values.toArray().map((value) => value);
    }

    if (totalDurationField) {
      result.duration = totalDurationField.values.toArray().map((value) => value);
    }

    return result;
  }

  /**
   * Get Values
   */
  static getLatencyValues(
    prevValues: ValuesForCalculation,
    currentValues: ValuesForCalculation,
    rowsCount: number
  ): number[] {
    const latencyValues: number[] = [];

    /**
     * Processing rows
     */
    for (let row = 0; row < rowsCount; row++) {
      const prevDuration = prevValues.duration[row];
      const duration = currentValues.duration[row];
      const prevCalls = prevValues.calls[row];
      const calls = currentValues.calls[row];

      latencyValues.push(
        RedisLatencyPanel.getLatencyValue({
          prevDuration,
          duration,
          prevCalls,
          calls,
        })
      );
    }

    return latencyValues;
  }

  static getTableDataFrame(previous: DataFrame, current: DataFrame): DataFrame {
    const previousValuesMap = RedisLatencyPanel.getValuesForCalculation(previous);
    const currentValuesMap = RedisLatencyPanel.getValuesForCalculation(current);

    /**
     * Latency
     */
    const latencyValues: number[] = RedisLatencyPanel.getLatencyValues(
      previousValuesMap,
      currentValuesMap,
      current.length
    );

    /**
     * Fields
     */
    const fields = [
      ...current.fields.map((field) => ({
        ...field,
        config: {
          ...(field?.config || {}),
          displayName: DisplayNameByFieldName[field.name as FieldName],
        },
      })),
      {
        name: FieldName.Latency,
        type: FieldType.number,
        values: latencyValues,
        config: {
          ...(current.fields.find((field) => field.name === FieldName.Duration)?.config || {}),
          displayName: DisplayNameByFieldName[FieldName.Latency],
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

    /**
     * Return Data Frame
     */
    return tableDataFrame;
  }

  /**
   * State
   */
  state = {
    currentDataFrame: this.props.data.series[0],
    tableDataFrame: RedisLatencyPanel.getTableDataFrame(this.props.data.series[0], this.props.data.series[0]),
  };

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
   * Request Interval
   */
  async setRequestDataInterval() {
    if (this.requestDataTimer !== undefined) {
      this.clearRequestDataInterval();
    }

    const targets = this.props.data.request?.targets;
    let datasource = '';
    if (targets && targets.length && targets[0].datasource) {
      datasource = targets[0].datasource;
    }

    /**
     * Data Source
     */
    const ds = await getDataSourceSrv().get(datasource);

    /**
     * Interval
     */
    this.requestDataTimer = setInterval(async () => {
      /**
       * Query
       */
      const newDataFrame: DataFrame = await ((ds.query(
        this.props.data.request as DataQueryRequest<RedisQuery>
      ) as unknown) as Observable<DataQueryResponse>)
        .pipe(switchMap$((response) => response.data))
        .toPromise();

      /**
       * Data Frame Table
       */
      const newTableDataFrame = RedisLatencyPanel.getTableDataFrame(this.state.currentDataFrame, newDataFrame);

      /**
       * Set State
       */
      this.setState({
        currentDataFrame: newDataFrame,
        tableDataFrame: newTableDataFrame,
      });
    }, this.props.options.interval || DefaultInterval);
  }

  /**
   * Clear Interval
   */
  clearRequestDataInterval() {
    if (this.requestDataTimer !== undefined) {
      clearTimeout(this.requestDataTimer);
      delete this.requestDataTimer;
    }
  }

  /**
   * Render
   */
  render() {
    const { width, height } = this.props;
    const { tableDataFrame } = this.state;

    if (!tableDataFrame) {
      return null;
    }

    /**
     * Return Table
     */
    return <Table data={tableDataFrame} width={width} height={height} />;
  }
}
