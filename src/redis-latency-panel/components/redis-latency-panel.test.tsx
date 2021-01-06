import React from 'react';
import { shallow } from 'enzyme';
import { Observable } from 'rxjs';
import { toDataFrame, FieldType, dateTime } from '@grafana/data';
import { RedisLatencyPanel } from './redis-latency-panel';
import { RedisLatencyPanelTable } from './components/redis-latency-panel-table';
import { RedisLatencyPanelGraph } from './components/redis-latency-panel-graph';
import { FieldName, ViewMode, SeriesMap } from '../types';

/**
 * Query Result
 */
const getDataSourceQueryResult = (fields: Array<{ name: FieldName; type: FieldType; values: number[] }>) => ({
  data: [
    toDataFrame({
      name: 'data',
      fields,
    }),
  ],
});

/*
 DataSource
 */
const dataSourceMock = {
  query: jest.fn().mockImplementation(
    () =>
      new Observable((subscriber) => {
        subscriber.next(
          getDataSourceQueryResult([
            {
              type: FieldType.number,
              name: FieldName.Duration,
              values: [2000, 3000],
            },
            {
              type: FieldType.number,
              name: FieldName.Calls,
              values: [10, 20],
            },
          ])
        );
        subscriber.complete();
      })
  ),
  name: 'datasource',
};

const dataSourceSrvGetMock = jest.fn().mockImplementation(() => Promise.resolve(dataSourceMock));

/**
 * Mock getDataSourceSrv function
 */
jest.mock('@grafana/runtime', () => ({
  getDataSourceSrv: () => ({
    get: dataSourceSrvGetMock,
  }),
}));

/**
 * RedisLatencyPanel
 */
describe('RedisLatencyPanel', () => {
  const getComponent = ({ options = { interval: 1000, viewMode: ViewMode.Table }, ...restProps }: any) => {
    const data = {
      request: {
        targets: [
          {
            datasource: 'Redis',
          },
        ],
      },
    };
    return <RedisLatencyPanel data={data} {...restProps} options={options} />;
  };

  beforeEach(() => {
    dataSourceSrvGetMock.mockClear();
    dataSourceMock.query.mockClear();
  });

  /**
   * makeQuery
   */
  describe('makeQuery', () => {
    it('If no targets nothing should be loaded and shown', async (done) => {
      const wrapper = shallow<RedisLatencyPanel>(getComponent({ data: { request: { targets: [] } } }));
      const data = await wrapper.instance().makeQuery();
      expect(data).toBeNull();
      done();
    });

    it('Should use default command if command empty in targets', async (done) => {
      const wrapper = shallow<RedisLatencyPanel>(
        getComponent({
          data: {
            request: {
              targets: [{ datasource: 'Redis111' }],
            },
          },
        })
      );
      await wrapper.instance().makeQuery();
      expect(dataSourceSrvGetMock).toHaveBeenCalledWith('Redis111');
      expect(dataSourceMock.query).toHaveBeenCalledWith({
        targets: [
          {
            datasource: 'Redis111',
            command: 'info',
            section: 'commandstats',
            type: 'command',
          },
        ],
      });
      done();
    });

    it('Should use query params from props if there are', async (done) => {
      const wrapper = shallow<RedisLatencyPanel>(
        getComponent({
          data: {
            request: {
              targets: [{ datasource: 'Redis111', command: 'command', section: 'section', type: 'type' }],
            },
          },
        })
      );
      await wrapper.instance().makeQuery();
      expect(dataSourceSrvGetMock).toHaveBeenCalledWith('Redis111');
      expect(dataSourceMock.query).toHaveBeenCalledWith({
        targets: [
          {
            datasource: 'Redis111',
            command: 'command',
            section: 'section',
            type: 'type',
          },
        ],
      });
      done();
    });
  });

  /**
   * getLatencyValue
   */
  describe('getLatencyValue', () => {
    it('Should calc correctly', () => {
      const duration = 100;
      const prevDuration = 50;
      const calls = 2;
      const prevCalls = 1;
      expect(RedisLatencyPanel.getLatencyValue({ duration, prevDuration, calls, prevCalls })).toEqual(
        (duration - prevDuration) / (calls - prevCalls)
      );
    });

    it('If calls=prevCalls should handle NaN and return 0', () => {
      const duration = 100;
      const prevDuration = 50;
      const calls = 2;
      const prevCalls = 2;
      expect(RedisLatencyPanel.getLatencyValue({ duration, prevDuration, calls, prevCalls })).toEqual(0);
    });

    it('If no prev values should calc correctly', () => {
      const duration = 100;
      const calls = 2;
      expect(RedisLatencyPanel.getLatencyValue({ duration, calls })).toEqual(duration / calls);
    });
  });

  /**
   * getValuesForCalculation
   */
  describe('getValuesForCalculation', () => {
    it('Should return calls and duration field values', () => {
      const dataFrame = toDataFrame({
        name: 'dataFrame',
        fields: [
          {
            name: FieldName.Calls,
            type: FieldType.number,
            values: [1, 2],
          },
          {
            name: FieldName.Command,
            type: FieldType.string,
            values: ['info', 'get'],
          },
          {
            name: FieldName.Duration,
            type: FieldType.number,
            values: [100, 200],
          },
        ],
      });
      expect(RedisLatencyPanel.getValuesForCalculation(dataFrame)).toEqual({
        calls: [1, 2],
        duration: [100, 200],
      });
    });
  });

  /**
   * getLatencyValues
   */
  describe('getLatencyValues', () => {
    it('Should calc values array', () => {
      const prevValues = {
        calls: [1, 2],
        duration: [100, 200],
      };
      const currentValues = {
        calls: [2, 2],
        duration: [300, 200],
      };
      const rowsCount = 2;
      const expectedResult = [];
      for (let row = 0; row < rowsCount; row++) {
        expectedResult.push(
          RedisLatencyPanel.getLatencyValue({
            duration: currentValues.duration[row],
            calls: currentValues.calls[row],
            prevDuration: prevValues.duration[row],
            prevCalls: prevValues.calls[row],
          })
        );
      }
      expect(RedisLatencyPanel.getLatencyValues(prevValues, currentValues, rowsCount)).toEqual(expectedResult);
    });
  });

  /**
   * getSeriesMap
   */
  describe('getSeriesMap', () => {
    it('Should add value to seriesMap', () => {
      const seriesMap = {
        info: [
          {
            time: dateTime(),
            value: 20,
          },
        ],
      };
      const dataFrame = toDataFrame({
        name: 'data',
        fields: [
          {
            type: FieldType.string,
            name: FieldName.Command,
            values: ['get', 'info'],
          },
        ],
      });
      const time = dateTime();
      const values = [10, 20];
      const result = RedisLatencyPanel.getSeriesMap(seriesMap, dataFrame, values, time);
      const expectedResult: SeriesMap = {
        get: [
          {
            time,
            value: values[0],
          },
        ],
        info: [
          ...seriesMap.info,
          {
            time,
            value: values[1],
          },
        ],
      };
      expect(result).toEqual(expectedResult);
    });

    it('If items more than itemsLimit should remove first item', () => {
      const seriesMap = {
        info: [
          {
            time: dateTime(),
            value: 20,
          },
          {
            time: dateTime(),
            value: 30,
          },
        ],
      };
      const dataFrame = toDataFrame({
        name: 'data',
        fields: [
          {
            type: FieldType.string,
            name: FieldName.Command,
            values: ['get', 'info'],
          },
        ],
      });
      const time = dateTime();
      const values = [10, 20];
      const result = RedisLatencyPanel.getSeriesMap(seriesMap, dataFrame, values, time, 2);
      const expectedResult: SeriesMap = {
        get: [
          {
            time,
            value: values[0],
          },
        ],
        info: [
          ...seriesMap.info.slice(1, seriesMap.info.length),
          {
            time,
            value: values[1],
          },
        ],
      };
      expect(result).toEqual(expectedResult);
    });
  });

  /**
   * RequestData
   */
  describe('RequestData', () => {
    const data = {
      series: [
        toDataFrame({
          name: 'data',
          fields: [
            {
              type: FieldType.number,
              name: FieldName.Duration,
              values: [200, 300],
            },
            {
              type: FieldType.number,
              name: FieldName.Calls,
              values: [1, 2],
            },
          ],
        }),
      ],
    };

    /**
     * Mount
     */
    describe('Mount', () => {
      it('If options.interval is filled should set interval', () => {
        const wrapper = shallow<RedisLatencyPanel>(getComponent({ data }));
        const testedMethod = jest
          .spyOn(wrapper.instance(), 'setRequestDataInterval')
          .mockImplementation(() => Promise.resolve());
        wrapper.instance().componentDidMount();
        expect(testedMethod).toHaveBeenCalled();
      });

      it('If options.interval is empty should not set interval', () => {
        const options = {};
        const wrapper = shallow<RedisLatencyPanel>(getComponent({ data, options }));
        const testedMethod = jest
          .spyOn(wrapper.instance(), 'setRequestDataInterval')
          .mockImplementation(() => Promise.resolve());
        wrapper.instance().componentDidMount();
        expect(testedMethod).not.toHaveBeenCalled();
      });
    });

    /**
     * Update
     */
    describe('Update', () => {
      it('If options.interval was changed should set interval', () => {
        const wrapper = shallow<RedisLatencyPanel>(getComponent({ data }));
        const testedMethod = jest
          .spyOn(wrapper.instance(), 'setRequestDataInterval')
          .mockImplementation(() => Promise.resolve());
        wrapper.instance().componentDidMount();
        expect(testedMethod).toHaveBeenCalled();
        testedMethod.mockClear();
        wrapper.setProps({
          options: { interval: 2000, viewMode: ViewMode.Table, maxItemsPerSeries: 1000, hideZero: false },
        });
        expect(testedMethod).toHaveBeenCalled();
        testedMethod.mockClear();
        wrapper.setProps({
          options: { interval: 2000, viewMode: ViewMode.Table, maxItemsPerSeries: 1000, hideZero: false },
        });
        expect(testedMethod).not.toHaveBeenCalled();
      });
    });

    /**
     * Unmount
     */
    describe('Unmount', () => {
      it('Should clear interval', () => {
        const wrapper = shallow<RedisLatencyPanel>(getComponent({ data }));
        const testedMethod = jest.spyOn(wrapper.instance(), 'clearRequestDataInterval').mockImplementation(() => {});
        wrapper.instance().componentWillUnmount();
        expect(testedMethod).toHaveBeenCalled();
      });
    });

    /**
     * Update seriesMap
     */
    describe('Update seriesMap', () => {
      it('Should set timer and request data with interval', (done) => {
        const options = {
          interval: 1000,
          viewMode: ViewMode.Table,
          maxItemsPerSeries: 1000,
        };
        const wrapper = shallow<RedisLatencyPanel>(getComponent({ data, options }));
        const testedMethod = jest.spyOn(wrapper.instance(), 'updateData');

        setImmediate(() => {
          testedMethod.mockClear();
          let checksCount = 2;
          const check = () => {
            expect(testedMethod).toHaveBeenCalled();

            checksCount--;
            if (checksCount > 0) {
              testedMethod.mockClear();
              setTimeout(check, options.interval);
            } else {
              done();
            }
          };
          setTimeout(check, options.interval);
        });
      });

      it('Should clear interval before setting new one', (done) => {
        const options = {
          interval: 1000,
          viewMode: ViewMode.Table,
          maxItemsPerSeries: 1000,
        };
        const wrapper = shallow<RedisLatencyPanel>(getComponent({ data, options }));
        const testedMethod = jest.spyOn(wrapper.instance(), 'clearRequestDataInterval');
        setImmediate(() => {
          wrapper.instance().setRequestDataInterval();
          expect(testedMethod).toHaveBeenCalled();
          done();
        });
      });

      it('Should use passed datasource', (done) => {
        const options = {
          interval: 1000,
          viewMode: ViewMode.Table,
          maxItemsPerSeries: 1000,
        };
        const overrideData = {
          ...data,
          request: {
            targets: [
              {
                datasource: 'redis',
              },
            ],
          },
        };
        shallow<RedisLatencyPanel>(getComponent({ data: overrideData, options }));
        setImmediate(() => {
          expect(dataSourceSrvGetMock).toHaveBeenCalledWith('redis');
          done();
        });
      });
    });

    /**
     * clearRequestDataInterval
     */
    describe('clearRequestDataInterval', () => {
      it('Should clear interval', (done) => {
        const options = {
          interval: 1000,
          viewMode: ViewMode.Table,
          maxItemsPerSeries: 1000,
        };
        const wrapper = shallow<RedisLatencyPanel>(getComponent({ data, options }));
        setImmediate(() => {
          expect(wrapper.instance().requestDataTimer).toBeDefined();
          wrapper.instance().clearRequestDataInterval();
          expect(wrapper.instance().requestDataTimer).not.toBeDefined();
          done();
        });
      });
    });
  });

  /**
   * Rendering
   */
  describe('Rendering', () => {
    it('If no dataFrame nothing should be rendered', (done) => {
      const wrapper = shallow(getComponent({ data: { request: {} } }));
      setImmediate(() => {
        expect(wrapper.get(0)).not.toBeTruthy();
        done();
      });
    });

    it('Should render table if viewMode=table', (done) => {
      const wrapper = shallow(
        getComponent({ options: { interval: 1000, viewMode: ViewMode.Table, maxItemsPerSeries: 1000 } })
      );
      setImmediate(() => {
        expect(wrapper.find(RedisLatencyPanelTable).exists()).toBeTruthy();
        done();
      });
    });

    it('Should render graph if viewMode=graph', (done) => {
      const wrapper = shallow(
        getComponent({ options: { interval: 1000, viewMode: ViewMode.Graph, maxItemsPerSeries: 1000 } })
      );
      setImmediate(() => {
        expect(wrapper.find(RedisLatencyPanelGraph).exists()).toBeTruthy();
        done();
      });
    });
  });

  afterAll(() => {
    jest.resetAllMocks();
  });
});
