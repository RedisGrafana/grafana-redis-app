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
  dateTimeParse,
  TimeZone,
  FieldColorModeId,
} from '@grafana/data';
import { GraphWithLegend, LegendDisplayMode, colors, Chart } from '@grafana/ui';
import { GraphProps, GraphState, SeriesMap, SeriesValue } from '../../types';

/**
 * Redis Latency Panel Graph
 */
export class RedisLatencyPanelGraph extends PureComponent<GraphProps, GraphState> {
  /**
   * Convert seriesMap to GraphSeriesXY
   * @param seriesMap
   * @param hideZero
   */
  static getGraphSeries(seriesMap: SeriesMap, hideZero: boolean): GraphSeriesXY[] {
    return Object.entries(seriesMap).reduce(
      (acc: GraphSeriesXY[], [command, seriesValues]: [string, SeriesValue[]], index) => {
        const { times, values, shouldBeHidden } = seriesValues.reduce(
          (acc: { times: DateTime[]; values: number[]; shouldBeHidden: boolean }, { time, value }) => {
            let shouldBeHidden = acc.shouldBeHidden;
            /**
             * Find no 0 value
             */
            if (shouldBeHidden && hideZero) {
              shouldBeHidden = value === 0;
            }
            return {
              times: acc.times.concat([time]),
              values: acc.values.concat([value]),
              shouldBeHidden,
            };
          },
          { times: [], values: [], shouldBeHidden: hideZero }
        );

        /**
         * Hide series if all values contain only 0
         */
        if (shouldBeHidden) {
          return acc;
        }

        const color = colors[index % colors.length];
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
              name: command,
              values,
              config: {
                unit: 'µs',
                color: {
                  fixedColor: color,
                  mode: FieldColorModeId.Fixed,
                },
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
        return acc.concat([
          {
            seriesIndex: acc.length,
            yAxis: { index: 1 },
            label: command,
            isVisible: true,
            data,
            timeField: seriesDataFrame.fields[0],
            valueField: seriesDataFrame.fields[1],
            timeStep: getSeriesTimeStep(seriesDataFrame.fields[0]),
            color,
          },
        ]);
      },
      []
    );
  }

  /**
   * Get timeRange from timeRange.raw
   * @param timeRange
   */
  static getTimeRange(timeRange: TimeRange, timeZone: TimeZone): TimeRange {
    let fromTime = dateTimeParse(timeRange.raw.from, { timeZone });
    const toTime = dateTimeParse(timeRange.raw.to, { timeZone });

    return {
      from: fromTime,
      to: toTime,
      raw: {
        from: timeRange.raw.from,
        to: toTime,
      },
    };
  }

  /**
   * State
   */
  state = {
    timeRange: RedisLatencyPanelGraph.getTimeRange(this.props.timeRange, this.props.timeZone),
  };

  /**
   * getDerivedStateFromProps
   * @param props
   */
  static getDerivedStateFromProps(props: Readonly<GraphProps>) {
    console.log(props.seriesMap);
    return {
      timeRange: RedisLatencyPanelGraph.getTimeRange(props.timeRange, props.timeZone),
    };
  }

  /**
   * onToggleSort
   */
  onToggleSort() {}

  /**
   * Render
   */
  render() {
    const { width, height, seriesMap, options } = this.props;
    const { timeRange } = this.state;

    /**
     * Return GraphWithLegend
     */
    return (
      <GraphWithLegend
        width={width}
        height={height}
        series={RedisLatencyPanelGraph.getGraphSeries(seriesMap, options?.hideZero)}
        timeRange={timeRange}
        timeZone={this.props.timeZone}
        displayMode={LegendDisplayMode.List}
        placement="under"
        onToggleSort={this.onToggleSort}
        hideZero={options?.hideZero}
        isLegendVisible
        showLines
      >
        <Chart.Tooltip mode="multi"></Chart.Tooltip>
      </GraphWithLegend>
    );
  }
}
