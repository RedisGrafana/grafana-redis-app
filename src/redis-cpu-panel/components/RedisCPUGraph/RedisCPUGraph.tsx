import React, { PureComponent } from 'react';
import {
  DataFrame,
  DateTime,
  dateTimeParse,
  FieldColorModeId,
  FieldType,
  getDisplayProcessor,
  GraphSeriesValue,
  PanelProps,
  TimeRange,
  TimeZone,
  toDataFrame,
} from '@grafana/data';
import { config } from '@grafana/runtime';
import {
  colors,
  GraphGradientMode,
  LegendDisplayMode,
  StackingMode,
  TimeSeries,
  TooltipDisplayMode,
  TooltipPlugin,
} from '@grafana/ui';
import { DisplayFieldName, DisplayNameByFieldName } from '../../constants';
import { PanelOptions, SeriesMap, SeriesValue } from '../../types';

/**
 * Graph Properties
 */
interface Props extends PanelProps<PanelOptions> {
  /**
   * Series
   *
   * @type {SeriesMap}
   */
  seriesMap: SeriesMap;
}

/**
 * State
 */
interface State {
  /**
   * Time Range
   *
   * @type {TimeRange}
   */
  timeRange: TimeRange;
}

/**
 * Graph View
 */
export class RedisCPUGraph extends PureComponent<Props, State> {
  /**
   * Convert seriesMap to Data Frames
   * @param seriesMap
   */
  static getGraphDataFrame(seriesMap: SeriesMap): DataFrame[] {
    return Object.entries(seriesMap).reduce(
      (acc: DataFrame[], [name, seriesValues]: [string, SeriesValue[]], index) => {
        const { times, values } = seriesValues.reduce(
          (acc: { times: DateTime[]; values: number[] }, { time, value }) => {
            return {
              times: acc.times.concat([time]),
              values: acc.values.concat([value]),
            };
          },
          { times: [], values: [] }
        );

        /**
         * Color
         */
        const color = colors[index % colors.length];

        /**
         * Data Frame
         */
        const seriesDataFrame = toDataFrame({
          name,
          fields: [
            {
              type: FieldType.time,
              name: 'time',
              values: times,
            },
            {
              type: FieldType.number,
              name: ' ',
              values,
              config: {
                unit: 'percent',
                color: {
                  fixedColor: color,
                  mode: FieldColorModeId.Fixed,
                },
                displayName: DisplayNameByFieldName[name as DisplayFieldName],
                custom: {
                  gradientMode: GraphGradientMode?.Hue,
                  fillOpacity: 50,
                  stacking: {
                    mode: StackingMode?.Normal,
                    group: 'stackA',
                  },
                },
              },
            },
          ],
        });

        /**
         * Fields
         */
        seriesDataFrame.fields = seriesDataFrame.fields.map((field) => ({
          ...field,
          display: getDisplayProcessor({ field, theme: config.theme2 }),
        }));

        /**
         * Push values
         */
        const data: GraphSeriesValue[][] = [];
        for (let i = 0; i < times.length; i++) {
          data.push([times[i].valueOf(), values[i]]);
        }

        return acc.concat(seriesDataFrame);
      },
      []
    );
  }

  /**
   * Get timeRange from timeRange.raw
   *
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
    timeRange: RedisCPUGraph.getTimeRange(this.props.timeRange, this.props.timeZone),
  };

  /**
   * getDerivedStateFromProps
   *
   * @param props
   */
  static getDerivedStateFromProps(props: Readonly<Props>) {
    return {
      timeRange: RedisCPUGraph.getTimeRange(props.timeRange, props.timeZone),
    };
  }

  /**
   * Render
   */
  render() {
    const { width, height, seriesMap } = this.props;
    const { timeRange } = this.state;

    /**
     * Convert to Data Frames
     */
    const dataFrames = RedisCPUGraph.getGraphDataFrame(seriesMap);
    if (!dataFrames.length) {
      return <div>Gathering usage data...</div>;
    }

    /**
     * Return Time Series
     */
    return (
      <TimeSeries
        frames={dataFrames}
        width={width}
        height={height}
        timeRange={timeRange}
        legend={{ displayMode: LegendDisplayMode?.List, placement: 'bottom', calcs: [] }}
        timeZone={this.props.timeZone}
      >
        {(config, alignedDataFrame) => {
          return (
            <TooltipPlugin
              config={config}
              data={alignedDataFrame}
              mode={TooltipDisplayMode.Multi}
              timeZone={this.props.timeZone}
            />
          );
        }}
      </TimeSeries>
    );
  }
}
