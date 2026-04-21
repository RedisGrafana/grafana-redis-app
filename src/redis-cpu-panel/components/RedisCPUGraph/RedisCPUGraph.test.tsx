import '@testing-library/jest-dom';
import { act, render, screen } from '@testing-library/react';
import React, { createRef } from 'react';
import { DataFrame, dateTime, dateTimeParse } from '@grafana/data';

/**
 * Full TimeSeries mount pulls in Grafana chart internals; shallow Enzyme did not run the render prop.
 */
jest.mock('@grafana/ui', () => {
  const React = require('react');
  const actual = jest.requireActual('@grafana/ui');
  return {
    ...actual,
    TooltipDisplayMode: actual.TooltipDisplayMode ?? { Multi: 0 },
    TimeSeries: function TimeSeries({
      children,
    }: {
      children?: (config: unknown, alignedDataFrame: unknown) => React.ReactNode;
    }) {
      return (
        <div data-testid="redis-cpu-timeseries">{typeof children === 'function' ? children({}, {}) : children}</div>
      );
    },
    TooltipPlugin: function TooltipPlugin() {
      return <div data-testid="tooltip-plugin" />;
    },
  };
});

import { RedisCPUGraph } from './RedisCPUGraph';

/**
 * Table View
 */
describe('RedisCPUGraph', () => {
  /**
   * getGraphSeries
   */
  describe('getGraphSeries', () => {
    it('Should return series for each command', () => {
      const seriesMap = {
        get: [
          {
            time: dateTime(),
            value: 0,
          },
          {
            time: dateTime(),
            value: 0,
          },
        ],
        info: [
          {
            time: dateTime(),
            value: 10,
          },
          {
            time: dateTime().add(10, 'seconds'),
            value: 20,
          },
        ],
      };
      const result: DataFrame[] = RedisCPUGraph.getGraphDataFrame(seriesMap);
      expect(result[0].length).toEqual(2);
      expect(result[0].fields[0].values.length).toEqual(2);
      expect(result[1].length).toEqual(2);
    });
  });

  /**
   * Get Time Range
   */
  describe('getTimeRange', () => {
    it('Should apply timeRange.raw.from and find series with the biggest items and take time', () => {
      const timeRange = {
        from: dateTime(),
        to: dateTime(),
        raw: {
          from: '6h',
          to: 'now',
        },
      };
      const result = RedisCPUGraph.getTimeRange(timeRange, 'browser');
      expect(result.from.valueOf()).toEqual(dateTimeParse('6h').valueOf());
      expect(result.to.startOf('hour').valueOf()).toEqual(dateTime().startOf('hour').valueOf());
    });
  });

  /**
   * Getting new props
   */
  describe('Getting new props', () => {
    function renderComponent(overrides: Record<string, unknown> = {}) {
      const { ref, ...rest } = overrides as { ref?: React.Ref<RedisCPUGraph> } & Record<string, unknown>;
      return render(<RedisCPUGraph ref={ref} width={400} height={300} timeZone="browser" {...rest} />);
    }

    it('Should update timeRange when gets a new seriesMap or timeRange', () => {
      const ref = createRef<RedisCPUGraph>();
      const { rerender } = renderComponent({
        ref,
        seriesMap: { get: [{ time: dateTime(), value: 1 }] },
        timeRange: { raw: { from: dateTime() } },
      });
      const currentTimeRange = ref.current!.state.timeRange;
      act(() => {
        rerender(
          <RedisCPUGraph
            ref={ref}
            width={400}
            height={300}
            timeZone="browser"
            seriesMap={{ get: [{ time: dateTime(), value: 2 }] }}
            timeRange={{ raw: { from: dateTime() } }}
          />
        );
      });
      expect(currentTimeRange !== ref.current!.state.timeRange).toBeTruthy();
    });

    it('Should return gathering results div if data frame is empty', () => {
      renderComponent({
        seriesMap: {},
        timeRange: { raw: { from: dateTime() } },
      });

      const gatheringMessage = screen.getByText('Gathering usage data...');
      expect(gatheringMessage).toBeInTheDocument();
    });

    it('Should return Time Series if data frame has data', () => {
      renderComponent({
        seriesMap: { get: [{ time: dateTime(), value: 1 }] },
        timeRange: { raw: { from: dateTime() } },
      });

      expect(screen.queryByText('Gathering usage data...')).not.toBeInTheDocument();
    });
  });
});
