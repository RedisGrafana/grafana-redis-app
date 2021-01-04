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
  dateTime,
  GraphSeriesValue,
  GraphSeriesXY,
  DateTime,
  getSeriesTimeStep,
} from '@grafana/data';
import { getDataSourceSrv } from '@grafana/runtime';
import { Graph, Table } from '@grafana/ui';
import {
  DefaultInterval,
  DisplayNameByFieldName,
  FieldName,
  Props,
  RedisQuery,
  State,
  ValuesForCalculation,
  ViewMode,
  SeriesValue,
  SeriesMap,
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

  static getSeriesMap(seriesMap: SeriesMap, dataFrame: DataFrame, values: any[], time: DateTime): SeriesMap {
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
      } else {
        result[command] = result[command].concat(value);
      }
    });
    return result;
  }

  static getGraphSeries(seriesMap: SeriesMap): GraphSeriesXY[] {
    return Object.entries(seriesMap).map(([command, seriesValues]: [string, SeriesValue[]], index) => {
      const { times, values } = seriesValues.reduce(
        (acc: { times: DateTime[]; values: number[] }, { time, value }) => ({
          times: acc.times.concat([time]),
          values: acc.values.concat([value]),
        }),
        { times: [], values: [] }
      );
      const seriesDataFrame = toDataFrame({
        name: command,
        fields: [
          {
            type: FieldType.time,
            name: 'time',
            values: times,
          },
          {
            type: FieldType.number,
            name: 'value',
            values,
            config: {
              unit: 'µs',
            },
          },
        ],
      });
      seriesDataFrame.fields = seriesDataFrame.fields.map((field) => ({
        ...field,
        display: getDisplayProcessor({ field }),
      }));
      const data: GraphSeriesValue[][] = [];
      for (let i = 0; i < times.length; i++) {
        data.push([times[i].valueOf(), values[i]]);
      }
      return {
        seriesIndex: index,
        yAxis: { index: 0 },
        label: command,
        isVisible: true,
        data,
        timeField: seriesDataFrame.fields[0],
        valueField: seriesDataFrame.fields[1],
        timeStep: getSeriesTimeStep(seriesDataFrame.fields[0]),
      };
    });
  }

  /**
   * State
   */
  state = {
    currentDataFrame: this.props.data.series[0],
    tableDataFrame: RedisLatencyPanel.getTableDataFrame(this.props.data.series[0], this.props.data.series[0]),
    seriesMap: RedisLatencyPanel.getSeriesMap({}, this.props.data.series[0], [], dateTime()),
    firstUpdatedTime: dateTime(),
    lastUpdatedTime: dateTime(),
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
      const latencyValues = RedisLatencyPanel.getLatencyValues(
        RedisLatencyPanel.getValuesForCalculation(this.state.currentDataFrame),
        RedisLatencyPanel.getValuesForCalculation(newDataFrame),
        newDataFrame.length
      );
      const lastUpdatedTime = dateTime();
      const newSeriesMap = RedisLatencyPanel.getSeriesMap(
        this.state.seriesMap,
        newDataFrame,
        latencyValues,
        lastUpdatedTime
      );

      /**
       * Set State
       */
      this.setState({
        currentDataFrame: newDataFrame,
        tableDataFrame: newTableDataFrame,
        seriesMap: newSeriesMap,
        lastUpdatedTime,
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
    const { width, height, options } = this.props;
    const { tableDataFrame, seriesMap, firstUpdatedTime, lastUpdatedTime } = this.state;

    if (!tableDataFrame) {
      return null;
    }

    if (options.viewMode === ViewMode.Graph) {
      return (
        <Graph
          width={width}
          height={height}
          series={RedisLatencyPanel.getGraphSeries(seriesMap)}
          timeRange={{
            from: firstUpdatedTime,
            to: lastUpdatedTime,
            raw: {
              from: firstUpdatedTime,
              to: lastUpdatedTime,
            },
          }}
          showLines
        />
      );
    }

    /**
     * Return Table
     */
    return (
      <Table
        data={tableDataFrame}
        initialSortBy={[{ displayName: DisplayNameByFieldName[FieldName.Latency], desc: true }]}
        width={width}
        height={height}
      />
    );
  }
}
