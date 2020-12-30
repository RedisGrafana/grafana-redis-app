import React, { PureComponent } from 'react';
import { Observable } from 'rxjs';
import { switchMap as switchMap$ } from 'rxjs/operators';
import {
  PanelProps,
  DataFrame,
  toDataFrame,
  FieldType,
  DataQueryRequest,
  DataQueryResponse,
  getDisplayProcessor,
} from '@grafana/data';
import { getDataSourceSrv } from '@grafana/runtime';
import { Table } from '@grafana/ui';
import { DISPLAY_NAME_BY_FIELD_NAME, DEFAULT_INTERVAL } from './constants';
import { PanelOptions, RedisQuery, FieldName } from '../types';

interface Props extends PanelProps<PanelOptions> {}

interface State {
  tableDataFrame: DataFrame | null;
  currentDataFrame: DataFrame | null;
}

interface ValuesForCalculation {
  calls: number[];
  duration: number[];
}

/**
 * Redis Latency Panel
 */
export class RedisLatencyPanel extends PureComponent<Props, State> {
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
    return diffDuration / diffCalls;
  }

  static getValuesForCalculation(dataFrame: DataFrame): ValuesForCalculation {
    const numberOfCallsField = dataFrame.fields.find((field) => field.name === FieldName.Calls);
    const totalDurationField = dataFrame.fields.find((field) => field.name === FieldName.Duration);
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

  static getLatencyValues(
    prevValues: ValuesForCalculation,
    currentValues: ValuesForCalculation,
    rowsCount: number
  ): number[] {
    const latencyValues: number[] = [];

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
    const latencyValues: number[] = RedisLatencyPanel.getLatencyValues(
      previousValuesMap,
      currentValuesMap,
      current.length
    );

    const fields = [
      ...current.fields.map((field) => ({
        ...field,
        config: {
          ...(field?.config || {}),
          displayName: DISPLAY_NAME_BY_FIELD_NAME[field.name as FieldName],
        },
      })),
      {
        name: FieldName.Latency,
        type: FieldType.number,
        values: latencyValues,
        config: {
          ...(current.fields.find((field) => field.name === FieldName.Duration)?.config || {}),
          displayName: DISPLAY_NAME_BY_FIELD_NAME[FieldName.Latency],
        },
      },
    ];
    const tableDataFrame = toDataFrame({
      name: 'TableDataFrame',
      fields,
    });
    tableDataFrame.fields = tableDataFrame.fields.map((field) => ({
      ...field,
      display: getDisplayProcessor({ field }),
    }));
    return tableDataFrame;
  }

  state = {
    currentDataFrame: this.props.data.series[0],
    tableDataFrame: RedisLatencyPanel.getTableDataFrame(this.props.data.series[0], this.props.data.series[0]),
  };

  requestDataTimer?: NodeJS.Timeout | undefined;

  componentDidMount(): void {
    if (this.props.options.interval !== undefined) {
      this.setRequestDataInterval();
    }
  }

  componentDidUpdate(prevProps: Readonly<Props>): void {
    if (prevProps.options.interval !== this.props.options.interval) {
      this.setRequestDataInterval();
    }
  }

  componentWillUnmount(): void {
    this.clearRequestDataInterval();
  }

  async setRequestDataInterval() {
    if (this.requestDataTimer !== undefined) {
      this.clearRequestDataInterval();
    }
    const targets = this.props.data.request?.targets;
    let datasource = '';
    if (targets && targets.length && targets[0].datasource) {
      datasource = targets[0].datasource;
    }
    const ds = await getDataSourceSrv().get(datasource);
    this.requestDataTimer = setInterval(async () => {
      const newDataFrame: DataFrame = await ((ds.query(
        this.props.data.request as DataQueryRequest<RedisQuery>
      ) as unknown) as Observable<DataQueryResponse>)
        .pipe(switchMap$((response) => response.data))
        .toPromise();
      const newTableDataFrame = RedisLatencyPanel.getTableDataFrame(this.state.currentDataFrame, newDataFrame);
      this.setState({
        currentDataFrame: newDataFrame,
        tableDataFrame: newTableDataFrame,
      });
    }, this.props.options.interval || DEFAULT_INTERVAL);
  }

  clearRequestDataInterval() {
    if (this.requestDataTimer !== undefined) {
      clearTimeout(this.requestDataTimer);
      delete this.requestDataTimer;
    }
  }

  render() {
    const { width, height } = this.props;
    const { tableDataFrame } = this.state;

    if (!tableDataFrame) {
      return null;
    }

    return <Table data={tableDataFrame} width={width} height={height} />;
  }
}
