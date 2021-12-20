import { shallow } from 'enzyme';
import React from 'react';
import { DataFrame, dateTime, dateTimeParse } from '@grafana/data';
import { RedisLatencyGraph } from './RedisLatencyGraph';

/**
 * Latency Graph
 */
describe('RedisLatencyGraph', () => {
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
    const getComponent = (props: any = {}) => <RedisLatencyGraph {...props} />;

    it('Should update timeRange when gets a new seriesMap or timeRange', () => {
      const wrapper = shallow<RedisLatencyGraph>(
        getComponent({
          seriesMap: { get: [{ time: dateTime(), value: 1 }] },
          timeRange: { raw: { from: dateTime() } },
          options: { hideZero: true },
        })
      );
      const currentTimeRange = wrapper.state().timeRange;
      wrapper.setProps({
        seriesMap: { get: [{ time: dateTime(), value: 2 }] },
      });
      expect(currentTimeRange !== wrapper.state().timeRange).toBeTruthy();
    });

    it('Should return gathering results div if data frame is empty', () => {
      const wrapper = shallow<RedisLatencyGraph>(
        getComponent({
          seriesMap: {},
          timeRange: { raw: { from: dateTime() } },
          options: { hideZero: true },
        })
      );

      const div = wrapper.findWhere((node) => node.name() === 'div');
      expect(div.exists()).toBeTruthy();
    });

    it('Should return Time Series if data frame has data', () => {
      const wrapper = shallow<RedisLatencyGraph>(
        getComponent({
          seriesMap: { get: [{ time: dateTime(), value: 1 }] },
          timeRange: { raw: { from: dateTime() } },
          options: { hideZero: true },
        })
      );

      const timeSeries = wrapper.findWhere((node) => node.name() === 'TimeSeries');
      expect(timeSeries.exists()).toBeTruthy();
    });
  });
});
