import { shallow } from 'enzyme';
import React from 'react';
import { Observable } from 'rxjs';
import { FieldType, toDataFrame } from '@grafana/data';
import { DefaultInterval, FieldName } from '../../constants';
import { RedisCPUGraph } from '../RedisCPUGraph';
import { RedisCPUPanel } from './RedisCPUPanel';

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
              name: FieldName.User,
              values: [2000, 3000],
            },
            {
              type: FieldType.number,
              name: FieldName.System,
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
 * CPU Panel
 */
describe('RedisCPUPanel', () => {
  const getComponent = ({ options = { interval: 1000 }, ...restProps }: any) => {
    const data = {
      request: {
        targets: [
          {
            datasource: 'Redis',
          },
        ],
      },
    };
    return <RedisCPUPanel data={data} {...restProps} options={options} />;
  };

  beforeEach(() => {
    dataSourceSrvGetMock.mockClear();
    dataSourceMock.query.mockClear();
  });

  /**
   * makeQuery
   */
  describe('makeQuery', () => {
    it('If no targets nothing should be loaded and shown', async () => {
      const wrapper = shallow<RedisCPUPanel>(getComponent({ data: { request: { targets: [] } } }));
      const data = await wrapper.instance().makeQuery();
      expect(data).toBeNull();
    });

    it('Should use default command if command empty in targets', async () => {
      const wrapper = shallow<RedisCPUPanel>(
        getComponent({
          data: {
            request: {
              targets: [{ datasource: 'Redis111' }],
            },
          },
        })
      );

      /**
       * Query
       */
      await wrapper.instance().makeQuery();
      expect(dataSourceSrvGetMock).toHaveBeenCalledWith('Redis111');
      expect(dataSourceMock.query).toHaveBeenCalledWith({
        targets: [
          {
            datasource: 'Redis111',
            command: 'info',
            section: 'cpu',
          },
        ],
      });
    });

    it('Should use query params from props if there are', async () => {
      const wrapper = shallow<RedisCPUPanel>(
        getComponent({
          data: {
            request: {
              targets: [{ datasource: 'Redis111', command: 'command', section: 'section', type: 'type' }],
            },
          },
        })
      );

      /**
       * Query
       */
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
            name: FieldName.User,
            type: FieldType.number,
            values: [1, 2],
          },
          {
            name: FieldName.System,
            type: FieldType.number,
            values: [100, 200],
          },
        ],
      });
      expect(RedisCPUPanel.getValuesForCalculation(dataFrame).system).toEqual(100);
      expect(RedisCPUPanel.getValuesForCalculation(dataFrame).user).toEqual(1);
    });

    it('Should work if no needed fields', () => {
      const dataFrame = toDataFrame({
        name: 'dataFrame',
        fields: [
          {
            name: 'abc',
            type: FieldType.number,
            values: [1, 2],
          },
        ],
      });
      expect(RedisCPUPanel.getValuesForCalculation(dataFrame).system).toBeUndefined();
      expect(RedisCPUPanel.getValuesForCalculation(dataFrame).user).toBeUndefined();
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
              name: FieldName.User,
              values: [200, 300],
            },
            {
              type: FieldType.number,
              name: FieldName.System,
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
        const wrapper = shallow<RedisCPUPanel>(getComponent({ data }));
        const testedMethod = jest
          .spyOn(wrapper.instance(), 'setRequestDataInterval')
          .mockImplementation(() => Promise.resolve());
        wrapper.instance().componentDidMount();
        expect(testedMethod).toHaveBeenCalled();
      });

      it('If options.interval is empty should not set interval', () => {
        const options = {};
        const wrapper = shallow<RedisCPUPanel>(getComponent({ data, options }));
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
        const wrapper = shallow<RedisCPUPanel>(getComponent({ data }));
        const testedMethod = jest
          .spyOn(wrapper.instance(), 'setRequestDataInterval')
          .mockImplementation(() => Promise.resolve());
        wrapper.instance().componentDidMount();
        expect(testedMethod).toHaveBeenCalled();

        testedMethod.mockClear();
        wrapper.setProps({
          options: { interval: 2000, maxItemsPerSeries: 1000 },
        });
        expect(testedMethod).toHaveBeenCalled();

        testedMethod.mockClear();
        wrapper.setProps({
          options: { interval: 2000, maxItemsPerSeries: 1000 },
        });
        expect(testedMethod).not.toHaveBeenCalled();
      });
    });

    /**
     * Unmount
     */
    describe('Unmount', () => {
      it('Should clear interval', () => {
        const wrapper = shallow<RedisCPUPanel>(getComponent({ data }));
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
          maxItemsPerSeries: 1,
        };
        const wrapper = shallow<RedisCPUPanel>(getComponent({ data, options }));
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

      it('Should set timer with default interval if no interval option and request data with interval', (done) => {
        const options = {
          interval: null,
        };
        const wrapper = shallow<RedisCPUPanel>(getComponent({ data, options }));
        const testedMethod = jest.spyOn(wrapper.instance(), 'updateData');

        setImmediate(() => {
          testedMethod.mockClear();
          let checksCount = 2;
          const check = () => {
            expect(testedMethod).toHaveBeenCalled();

            checksCount--;
            if (checksCount > 0) {
              testedMethod.mockClear();
              setTimeout(check, DefaultInterval);
            } else {
              done();
            }
          };
          setTimeout(check, DefaultInterval);
        });
      });

      it('Should clear interval before setting new one', (done) => {
        const options = {
          interval: 1000,
          maxItemsPerSeries: 1000,
        };

        const wrapper = shallow<RedisCPUPanel>(getComponent({ data, options }));
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
        shallow<RedisCPUPanel>(getComponent({ data: overrideData, options }));
        setImmediate(() => {
          expect(dataSourceSrvGetMock).toHaveBeenCalledWith('redis');
          done();
        });
      });

      it('Should not update values if no dataFrame', async () => {
        const options = {
          interval: 1000,
        };

        const wrapper = shallow<RedisCPUPanel>(getComponent({ data, options }), { disableLifecycleMethods: true });
        jest.spyOn(wrapper.instance(), 'makeQuery').mockImplementation(() =>
          Promise.resolve({
            data: [],
          })
        );

        const setStateMock = jest.spyOn(wrapper.instance(), 'setState');
        await wrapper.instance().updateData();
        expect(setStateMock).not.toHaveBeenCalled();
      });
    });

    /**
     * clearRequestDataInterval
     */
    describe('clearRequestDataInterval', () => {
      it('Should clear interval', (done) => {
        const options = {
          interval: 1000,
          maxItemsPerSeries: 1000,
        };

        const wrapper = shallow<RedisCPUPanel>(getComponent({ data, options }));
        setImmediate(() => {
          expect(wrapper.instance().requestDataTimer).toBeDefined();
          wrapper.instance().clearRequestDataInterval();
          expect(wrapper.instance().requestDataTimer).not.toBeDefined();
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
    it('Should render graph', (done) => {
      const wrapper = shallow(getComponent({ options: { interval: 1000, maxItemsPerSeries: 1000 } }));

      setImmediate(() => {
        expect(wrapper.find(RedisCPUGraph).exists()).toBeTruthy();
        done();
      });
    });
  });

  afterAll(() => {
    jest.resetAllMocks();
  });
});
