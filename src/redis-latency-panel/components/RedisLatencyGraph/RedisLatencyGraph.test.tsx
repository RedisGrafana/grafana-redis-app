import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { DataFrame, dateTime, dateTimeParse } from '@grafana/data';
import { RedisLatencyGraph } from './RedisLatencyGraph';

jest.mock('@grafana/ui', () => {
  const React = require('react');
  const actual = jest.requireActual('@grafana/ui');
  return {
    ...actual,
    TimeSeries: function TimeSeries() {
      return <div data-testid="mock-time-series" />;
    },
  };
});

/**
 * Latency Graph
 */
describe('RedisLatencyGraph', () => {
  const basePanelProps = {
    width: 400,
    height: 300,
    timeZone: 'browser' as const,
  };

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
      const result: DataFrame[] = RedisLatencyGraph.getGraphDataFrame(seriesMap, false);
      expect(result[0].length).toEqual(2);
      expect(result[0].fields[0].values.length).toEqual(2);
      expect(result[1].length).toEqual(2);
    });

    it('Should remove zero series if hideZero=true', () => {
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
      const result: DataFrame[] = RedisLatencyGraph.getGraphDataFrame(seriesMap, true);
      expect(result.length).toEqual(1);

      /**
       * SeriesIndex should be numerated by visible items not by all items
       */
      expect(result[0].length).toEqual(2);
      expect(result[0].fields[0].values.length).toEqual(2);
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
      const result = RedisLatencyGraph.getTimeRange(timeRange, 'browser');
      expect(result.from.valueOf()).toEqual(dateTimeParse('6h').valueOf());
      expect(result.to.startOf('hour').valueOf()).toEqual(dateTime().startOf('hour').valueOf());
    });
  });

  /**
   * Getting new props
   */
  describe('Getting new props', () => {
    const renderComponent = (props: any = {}) => {
      const defaultProps = {
        ...basePanelProps,
        seriesMap: {},
        timeRange: { raw: { from: dateTime() } },
        options: { hideZero: true },
      };
      return render(<RedisLatencyGraph {...defaultProps} {...props} />);
    };

    it('Should update timeRange when gets a new seriesMap or timeRange', () => {
      const sharedProps = {
        seriesMap: { get: [{ time: dateTime(), value: 1 }] },
        timeRange: { raw: { from: dateTime() } },
        options: { hideZero: true },
        timeZone: 'browser' as const,
      };
      const currentTimeRange = RedisLatencyGraph.getDerivedStateFromProps(sharedProps as any).timeRange;
      const nextState = RedisLatencyGraph.getDerivedStateFromProps({
        ...sharedProps,
        seriesMap: { get: [{ time: dateTime(), value: 2 }] },
      } as any);
      expect(currentTimeRange !== nextState.timeRange).toBeTruthy();
    });

    it('Should return gathering results div if data frame is empty', () => {
      renderComponent({
        seriesMap: {},
        timeRange: { raw: { from: dateTime() } },
        options: { hideZero: true },
      });

      const gatheringMessage = screen.getByText('Gathering latency data...');
      expect(gatheringMessage).toBeInTheDocument();
    });

    it('Should return Time Series if data frame has data', () => {
      renderComponent({
        seriesMap: { get: [{ time: dateTime(), value: 1 }] },
        timeRange: { raw: { from: dateTime() } },
        options: { hideZero: true },
      });

      const mockTimeSeries = screen.getByTestId('mock-time-series');
      expect(mockTimeSeries).toBeInTheDocument();
    });
  });
});
