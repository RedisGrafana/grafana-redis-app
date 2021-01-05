import React, { PureComponent } from 'react';
import {
  DateTime,
  FieldType,
  getDisplayProcessor,
  getSeriesTimeStep,
  GraphSeriesValue,
  GraphSeriesXY,
  TimeRange,
  toDataFrame,
} from '@grafana/data';
import { GraphWithLegend, LegendDisplayMode } from '@grafana/ui';
import { GraphProps, GraphState, SeriesMap, SeriesValue } from '../../../types';

/**
 * Redis Latency Panel Graph
 */
export class RedisLatencyPanelGraph extends PureComponent<GraphProps, GraphState> {
  /**
   * Convert seriesMap to GraphSeriesXY
   * @param seriesMap
   */
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
   * Find start time and finish time for graph
   * @param seriesMap
   */
  static getTimeRange(seriesMap: SeriesMap): TimeRange {
    let longestSeries = Object.values(seriesMap)[0];
    Object.values(seriesMap).forEach((values) => {
      if (values.length > longestSeries.length) {
        longestSeries = values;
      }
    });
    const fromTime = longestSeries[0].time;
    const toTime = longestSeries[longestSeries.length - 1].time;

    return {
      from: fromTime,
      to: toTime,
      raw: {
        from: fromTime,
        to: toTime,
      },
    };
  }

  /**
   * State
   */
  state = {
    timeRange: RedisLatencyPanelGraph.getTimeRange(this.props.seriesMap),
  };

  /**
   * ComponentDidUpdate
   * @param prevProps
   */
  componentDidUpdate(prevProps: Readonly<GraphProps>): void {
    if (this.props.seriesMap !== prevProps.seriesMap) {
      this.setState({
        timeRange: RedisLatencyPanelGraph.getTimeRange(this.props.seriesMap),
      });
    }
  }

  /**
   * onToggleSort
   */
  onToggleSort() {}

  /**
   * Render
   */
  render() {
    const { width, height, seriesMap } = this.props;
    const { timeRange } = this.state;

    /**
     * Return GraphWithLegend
     */
    return (
      <GraphWithLegend
        width={width}
        height={height}
        series={RedisLatencyPanelGraph.getGraphSeries(seriesMap)}
        timeRange={timeRange}
        displayMode={LegendDisplayMode.List}
        placement="under"
        onToggleSort={this.onToggleSort}
        isLegendVisible
        showLines
      />
    );
  }
}
