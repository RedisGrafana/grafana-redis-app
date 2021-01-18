import React, { PureComponent } from 'react';
import { Observable } from 'rxjs';
import { DataFrame, DataQueryRequest, DataQueryResponse, DateTime, dateTime, PanelProps } from '@grafana/data';
import { getDataSourceSrv } from '@grafana/runtime';
import {
  DefaultInterval,
  FieldName,
  MaxItemsPerSeries,
  PanelOptions,
  RedisQuery,
  SeriesMap,
  ValuesForCalculation,
  ViewMode,
} from '../../types';
import { RedisLatencyPanelGraph } from '../redis-latency-panel-graph';
import { RedisLatencyPanelTable } from '../redis-latency-panel-table';

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
  dataFrame?: DataFrame;

  /**
   * Series
   *
   * @type {SeriesMap}
   */
  seriesMap: SeriesMap;
}

/**
 * Redis Latency Panel
 */
export class RedisLatencyPanel extends PureComponent<Props, State> {
  /**
   * Calc latency value per command
   * @param duration
   * @param prevDuration
   * @param calls
   * @param prevCalls
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
   * Calc latency values
   * @param prevValues
   * @param currentValues
   * @param rowsCount
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

  /**
   * Get updated series map and limit max items per series
   * @param seriesMap
   * @param dataFrame
   * @param values
   * @param time
   * @param itemsLimit
   */
  static getSeriesMap(
    seriesMap: SeriesMap,
    dataFrame: DataFrame,
    values: any[],
    time: DateTime,
    itemsLimit = 1000
  ): SeriesMap {
    const commandField = dataFrame.fields.find((field) => field.name === FieldName.Command);
    const commands = commandField?.values.toArray() || [];
    const result = {
      ...seriesMap,
    };

    commands.forEach((command: string, index: number) => {
      const value = {
        time,
        value: values[index],
      };
      if (!result[command]) {
        result[command] = [value];
      } else if (result[command].length + 1 > itemsLimit) {
        /**
         * Remove 1 item if length > itemsLimit
         */
        result[command] = [...result[command].slice(1, result[command].length), value];
      } else {
        result[command] = result[command].concat(value);
      }
    });

    return result;
  }

  /**
   * State
   */
  state: State = {
    seriesMap: {},
  };

  /**
   * Request Data Timer
   */
  requestDataTimer?: NodeJS.Timeout | undefined;

  /**
   * Mount
   */
  componentDidMount(): void {
    this.updateData();
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
      command: 'info',
      section: 'commandstats',
      type: 'command',
      ...target,
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

    const { dataFrame, seriesMap } = this.state;
    const newDataFrame = response.data[0] as DataFrame;

    if (!newDataFrame) {
      return Promise.resolve();
    }

    const latencyValues = RedisLatencyPanel.getLatencyValues(
      RedisLatencyPanel.getValuesForCalculation(dataFrame ? dataFrame : newDataFrame),
      RedisLatencyPanel.getValuesForCalculation(newDataFrame),
      newDataFrame.length
    );

    const lastUpdatedTime = dateTime();
    const itemsLimit = this.props.options?.maxItemsPerSeries || MaxItemsPerSeries;

    const newSeriesMap = RedisLatencyPanel.getSeriesMap(
      seriesMap,
      newDataFrame,
      latencyValues,
      lastUpdatedTime,
      itemsLimit
    );

    this.setState({
      dataFrame: newDataFrame,
      seriesMap: newSeriesMap,
    });
  }

  /**
   * Request Interval
   */
  setRequestDataInterval() {
    if (this.requestDataTimer !== undefined) {
      this.clearRequestDataInterval();
    }

    /**
     * Interval
     */
    this.requestDataTimer = setInterval(() => {
      /**
       * Update data
       */
      this.updateData();
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

  render() {
    /**
     * If no dataFrame return null
     */
    if (!this.state.dataFrame) {
      return null;
    }

    /**
     * Return RedisLatencyPanelTable
     */
    if (this.props.options?.viewMode === ViewMode.Table) {
      return (
        <RedisLatencyPanelTable {...this.props} dataFrame={this.state.dataFrame} seriesMap={this.state.seriesMap} />
      );
    }

    /**
     * Return RedisLatencyPanelGraph
     */
    if (this.props.options?.viewMode === ViewMode.Graph) {
      return <RedisLatencyPanelGraph {...this.props} seriesMap={this.state.seriesMap} />;
    }

    /**
     * Return null by default
     */
    return null;
  }
}
