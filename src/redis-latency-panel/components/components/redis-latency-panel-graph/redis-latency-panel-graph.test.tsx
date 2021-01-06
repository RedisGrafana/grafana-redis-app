import React from 'react';
import { dateTime, GraphSeriesXY } from '@grafana/data';
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
            value: 100,
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
      expect(result.length).toEqual(Object.keys(seriesMap).length);
    });
  });

  /**
   * Get Time Range
   */
  describe('getTimeRange', () => {
    it('Should find series with the biggest items and take time', () => {
      const startTime = dateTime();
      const endTime = dateTime().add(1, 'hour');
      const seriesMap = {
        get: [
          {
            time: dateTime(),
            value: 0,
          },
        ],
        info: [
          {
            time: startTime,
            value: 1,
          },
          {
            time: endTime,
            value: 2,
          },
        ],
      };
      expect(RedisLatencyPanelGraph.getTimeRange(seriesMap)).toEqual({
        from: startTime,
        to: endTime,
        raw: {
          from: startTime,
          to: endTime,
        },
      });
    });
  });

  /**
   * Getting new props
   */
  describe('Getting new props', () => {
    const getComponent = (props: any = {}) => <RedisLatencyPanelGraph {...props} />;

    it('Should update timeRange when gets a new seriesMap', () => {
      const wrapper = shallow<RedisLatencyPanelGraph>(
        getComponent({ seriesMap: { get: [{ time: dateTime(), value: 1 }] } })
      );
      const currentTimeRange = wrapper.state().timeRange;
      wrapper.setProps({
        seriesMap: { get: [{ time: dateTime(), value: 2 }] },
      });
      expect(currentTimeRange !== wrapper.state().timeRange).toBeTruthy();
    });
  });
});
