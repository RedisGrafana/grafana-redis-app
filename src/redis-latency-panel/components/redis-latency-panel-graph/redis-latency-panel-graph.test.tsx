import React from 'react';
import { dateTime, GraphSeriesXY, dateTimeParse } from '@grafana/data';
import { shallow } from 'enzyme';
import { RedisLatencyPanelGraph } from './redis-latency-panel-graph';

/**
 * Latency Panel Table
 */
describe('RedisLatencyPanelGraph', () => {
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
      const result: GraphSeriesXY[] = RedisLatencyPanelGraph.getGraphSeries(seriesMap, false);
      expect(result.length).toEqual(2);
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
      const result: GraphSeriesXY[] = RedisLatencyPanelGraph.getGraphSeries(seriesMap, true);
      expect(result.length).toEqual(1);
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
      const result = RedisLatencyPanelGraph.getTimeRange(timeRange, 'browser');
      expect(result.from.valueOf()).toEqual(dateTimeParse('6h').valueOf());
      expect(result.to.startOf('hour').valueOf()).toEqual(
        dateTime()
          .startOf('hour')
          .valueOf()
      );
    });
  });

  /**
   * Getting new props
   */
  describe('Getting new props', () => {
    const getComponent = (props: any = {}) => <RedisLatencyPanelGraph {...props} />;

    it('Should update timeRange when gets a new seriesMap or timeRange', () => {
      const wrapper = shallow<RedisLatencyPanelGraph>(
        getComponent({ seriesMap: { get: [{ time: dateTime(), value: 1 }] }, timeRange: { raw: { from: dateTime() } } })
      );
      const currentTimeRange = wrapper.state().timeRange;
      wrapper.setProps({
        seriesMap: { get: [{ time: dateTime(), value: 2 }] },
      });
      expect(currentTimeRange !== wrapper.state().timeRange).toBeTruthy();
    });
  });
});
