import React from 'react';
import { shallow } from 'enzyme';
import { Observable } from 'rxjs';
import { toDataFrame, FieldType } from '@grafana/data';
import { Table, Button } from '@grafana/ui';
import { RedisBiggestKeysPanel } from './redis-biggest-keys-panel';
import { FieldName, DisplayNameByFieldName } from '../types';

/**
 * Query Result
 */
const getDataSourceQueryResult = (
  fields: Array<{ name: FieldName; type: FieldType; values: Array<number | string> }>
) => ({
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
              type: FieldType.string,
              name: FieldName.Key,
              values: ['key1', 'key2'],
            },
            {
              type: FieldType.number,
              name: FieldName.Memory,
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
 * RedisBiggestKeysPanel
 */
describe('RedisBiggestKeysPanel', () => {
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
    return <RedisBiggestKeysPanel data={data} {...restProps} options={options} />;
  };

  beforeEach(() => {
    dataSourceSrvGetMock.mockClear();
    dataSourceMock.query.mockClear();
  });

  /**
   * getRedisKeys
   */
  describe('getRedisKeys', () => {
    it('Should convert dataFrame to redis keys array', () => {
      const dataFrame = toDataFrame({
        name: 'data',
        fields: [
          {
            type: FieldType.string,
            name: FieldName.Key,
            values: ['key1', 'key2'],
          },
          {
            type: FieldType.string,
            name: FieldName.Type,
            values: ['string', 'string'],
          },
          {
            type: FieldType.number,
            name: FieldName.Memory,
            values: [100, 200],
          },
        ],
      });
      const result = RedisBiggestKeysPanel.getRedisKeys(dataFrame);
      expect(result).toEqual([
        {
          key: 'key1',
          type: 'string',
          memory: 100,
        },
        {
          key: 'key2',
          type: 'string',
          memory: 200,
        },
      ]);
    });

    it('Should return correct result if dataFrame does not have needed fields', () => {
      const dataFrame = toDataFrame({
        name: 'data',
        fields: [
          {
            type: FieldType.string,
            name: FieldName.Key,
            values: ['key1', 'key2'],
          },
        ],
      });
      expect(RedisBiggestKeysPanel.getRedisKeys(dataFrame)).toEqual([
        {
          key: 'key1',
        },
        {
          key: 'key2',
        },
      ]);
    });
  });

  /**
   * getBiggestRedisKeys
   */
  describe('getBiggestRedisKeys', () => {
    it('Should use the biggest value for keys', () => {
      const currentKeys = [
        {
          key: 'key1',
          type: 'string',
          memory: 100,
        },
        {
          key: 'key2',
          type: 'string',
          memory: 200,
        },
      ];
      const newKeys = [{ key: 'key1', type: 'string', memory: 105 }];
      const result = RedisBiggestKeysPanel.getBiggestRedisKeys(currentKeys, newKeys, 10);
      expect(result).toEqual([
        {
          key: 'key2',
          type: 'string',
          memory: 200,
        },
        {
          key: 'key1',
          type: 'string',
          memory: 105,
        },
      ]);
    });

    it('Should sort keys and slice result by passed length', () => {
      const currentKeys = [
        {
          key: 'key1',
          type: 'string',
          memory: 100,
        },
        {
          key: 'key2',
          type: 'string',
          memory: 200,
        },
        {
          key: 'key3',
          type: 'string',
          memory: 20,
        },
      ];
      const newKeys = [{ key: 'key1', type: 'string', memory: 105 }];
      const result = RedisBiggestKeysPanel.getBiggestRedisKeys(currentKeys, newKeys, 2);
      expect(result).toEqual([
        {
          key: 'key2',
          type: 'string',
          memory: 200,
        },
        {
          key: 'key1',
          type: 'string',
          memory: 105,
        },
      ]);
    });
  });

  /**
   * getTableDataFrame
   */
  describe('getTableDataFrame', () => {
    it('Should convert redis keys to data frame', () => {
      const keys = [
        {
          key: 'key2',
          type: 'string',
          memory: 200,
        },
        {
          key: 'key1',
          type: 'string',
          memory: 105,
        },
      ];
      const result = RedisBiggestKeysPanel.getTableDataFrame(keys);
      expect(result.fields[0].name).toEqual(FieldName.Key);
      expect(result.fields[0].values.toArray()).toEqual(['key2', 'key1']);
      expect(result.fields[0].display).toBeDefined();
      expect(result.fields[1].name).toEqual(FieldName.Type);
      expect(result.fields[1].values.toArray()).toEqual(['string', 'string']);
      expect(result.fields[1].display).toBeDefined();
      expect(result.fields[2].name).toEqual(FieldName.Memory);
      expect(result.fields[2].config.unit).toEqual('decbytes');
      expect(result.fields[2].values.toArray()).toEqual([200, 105]);
      expect(result.fields[2].display).toBeDefined();
    });
  });

  /**
   * getCursorValue
   */
  describe('getCursorValue', () => {
    it('Should return cursor value from dataFrame', () => {
      expect(RedisBiggestKeysPanel.getCursorValue()).toEqual('0');
      expect(
        RedisBiggestKeysPanel.getCursorValue(
          toDataFrame({
            fields: [
              {
                name: 'cursor',
                type: FieldType.string,
                values: ['123'],
              },
            ],
          })
        )
      ).toEqual('123');
      expect(
        RedisBiggestKeysPanel.getCursorValue(
          toDataFrame({
            fields: [
              {
                name: 'NotCursor',
                type: FieldType.string,
                values: ['123'],
              },
            ],
          })
        )
      ).toEqual('0');
    });
  });

  /**
   * makeQuery
   */
  describe('makeQuery', () => {
    it('If no targets nothing should be loaded and shown', async (done) => {
      const wrapper = shallow<RedisBiggestKeysPanel>(getComponent({ data: { request: { targets: [] } } }));
      const data = await wrapper.instance().makeQuery();
      expect(data).toBeNull();
      done();
    });

    it('Should use default command if command empty in targets', async (done) => {
      const wrapper = shallow<RedisBiggestKeysPanel>(
        getComponent({
          data: {
            request: {
              targets: [{ datasource: 'Redis111' }],
            },
          },
        }),
        {
          disableLifecycleMethods: true,
        }
      );
      await wrapper.instance().makeQuery();
      expect(dataSourceSrvGetMock).toHaveBeenCalledWith('Redis111');
      expect(dataSourceMock.query).toHaveBeenCalledWith({
        targets: [
          {
            datasource: 'Redis111',
            command: 'tmscan',
            type: 'command',
            count: 10,
            cursor: '0',
            match: '*',
            size: 10,
          },
        ],
      });
      done();
    });

    it('Should use query params from props if there are', async (done) => {
      const wrapper = shallow<RedisBiggestKeysPanel>(
        getComponent({
          data: {
            request: {
              targets: [
                { datasource: 'Redis111', command: 'command', type: 'type', count: 100, size: 11, match: 'abc' },
              ],
            },
          },
        }),
        {
          disableLifecycleMethods: true,
        }
      );
      await wrapper.instance().makeQuery();
      expect(dataSourceSrvGetMock).toHaveBeenCalledWith('Redis111');
      expect(dataSourceMock.query).toHaveBeenCalledWith({
        targets: [
          {
            datasource: 'Redis111',
            command: 'command',
            type: 'type',
            cursor: '0',
            count: 100,
            match: 'abc',
            size: 11,
          },
        ],
      });
      done();
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
              type: FieldType.string,
              name: FieldName.Type,
              values: ['key1', 'key2'],
            },
            {
              type: FieldType.number,
              name: FieldName.Memory,
              values: [100, 200],
            },
          ],
        }),
      ],
    };

    /**
     * Mount
     */
    describe('Mount', () => {
      it('If passed no data as a prop, should work correctly', () => {
        const wrapper = shallow<RedisBiggestKeysPanel>(getComponent({ data: null }), { disableLifecycleMethods: true });
        expect(wrapper.state().redisKeys.length).toEqual(0);
      });

      it('Should not set interval by default', () => {
        const options = {};
        const wrapper = shallow<RedisBiggestKeysPanel>(getComponent({ data, options }));
        const testedMethod = jest
          .spyOn(wrapper.instance(), 'setRequestDataInterval')
          .mockImplementation(() => Promise.resolve());
        expect(testedMethod).not.toHaveBeenCalled();
      });

      it('Should set formHeight', () => {
        const wrapper = shallow<RedisBiggestKeysPanel>(getComponent({ data }), { disableLifecycleMethods: true });
        wrapper.instance().formRef = {
          current: {
            getBoundingClientRect: () => ({
              height: 100,
            }),
          },
        } as any;
        expect(wrapper.state().formHeight).toEqual(0);
        wrapper.instance().componentDidMount();
        expect(wrapper.state().formHeight).toEqual(100);
      });

      it('Should request all keys', () => {
        const wrapper = shallow<RedisBiggestKeysPanel>(getComponent({ data }), { disableLifecycleMethods: true });
        const updateTotalKeysMock = jest.spyOn(wrapper.instance(), 'updateTotalKeys');
        wrapper.instance().componentDidMount();
        expect(updateTotalKeysMock).toHaveBeenCalled();
      });
    });

    /**
     * Update
     */
    describe('Update', () => {
      it('If options.interval was changed should clear interval', () => {
        const wrapper = shallow<RedisBiggestKeysPanel>(getComponent({ data }));
        const testedMethod = jest
          .spyOn(wrapper.instance(), 'clearRequestDataInterval')
          .mockImplementation(() => Promise.resolve());
        testedMethod.mockClear();
        wrapper.setProps({
          options: { interval: 2000 },
        });
        expect(testedMethod).toHaveBeenCalled();
      });
    });

    /**
     * Unmount
     */
    describe('Unmount', () => {
      it('Should clear interval', () => {
        const wrapper = shallow<RedisBiggestKeysPanel>(getComponent({ data }));
        const testedMethod = jest.spyOn(wrapper.instance(), 'clearRequestDataInterval').mockImplementation(() => {});
        wrapper.instance().componentWillUnmount();
        expect(testedMethod).toHaveBeenCalled();
      });
    });

    /**
     * Update data
     */
    describe('Update data', () => {
      it('Should set timer and request data with interval', (done) => {
        const options = {
          interval: 1000,
        };
        const wrapper = shallow<RedisBiggestKeysPanel>(getComponent({ data, options }));
        const testedMethod = jest.spyOn(wrapper.instance(), 'updateData');
        const button = wrapper.find(Button);
        button.simulate('click');

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
        };
        const wrapper = shallow<RedisBiggestKeysPanel>(getComponent({ data, options }));
        const testedMethod = jest.spyOn(wrapper.instance(), 'clearRequestDataInterval');
        wrapper.instance().setRequestDataInterval();
        setImmediate(() => {
          wrapper.instance().setRequestDataInterval();
          expect(testedMethod).toHaveBeenCalled();
          done();
        });
      });

      it('Should use passed datasource', (done) => {
        const options = {
          interval: 1000,
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
        shallow<RedisBiggestKeysPanel>(getComponent({ data: overrideData, options }));
        setImmediate(() => {
          expect(dataSourceSrvGetMock).toHaveBeenCalledWith('redis');
          done();
        });
      });

      it('If no dataFrame, should not update redisKeys', async () => {
        const options = {
          interval: 1000,
        };
        const wrapper = shallow<RedisBiggestKeysPanel>(getComponent({ data, options }), {
          disableLifecycleMethods: true,
        });
        const setStateMock = jest.spyOn(wrapper.instance(), 'setState');
        jest.spyOn(wrapper.instance(), 'makeQuery').mockImplementation(() =>
          Promise.resolve({
            data: [],
          })
        );
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
        };
        const wrapper = shallow<RedisBiggestKeysPanel>(getComponent({ data, options }));
        wrapper.instance().setRequestDataInterval();
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
    it('If no dataFrame table should be rendered', (done) => {
      const wrapper = shallow(getComponent({ data: { request: {} } }));
      setImmediate(() => {
        expect(wrapper.find(Table).exists()).not.toBeTruthy();
        done();
      });
    });

    it('Should render table', (done) => {
      const wrapper = shallow(
        getComponent({
          data: {
            series: [
              toDataFrame({
                fields: [
                  {
                    name: FieldName.Key,
                    type: FieldType.string,
                    values: ['key1', 'key2'],
                  },
                  {
                    name: FieldName.Memory,
                    type: FieldType.number,
                    values: [100, 200],
                  },
                ],
              }),
            ],
          },
        })
      );
      setImmediate(() => {
        expect(wrapper.find(Table).exists()).toBeTruthy();
        done();
      });
    });
  });

  /**
   * Sorting
   */
  describe('Sorting', () => {
    it('Should set default sort and update sorting', (done) => {
      const wrapper = shallow<RedisBiggestKeysPanel>(
        getComponent({
          data: {
            series: [
              toDataFrame({
                fields: [
                  {
                    name: FieldName.Key,
                    type: FieldType.string,
                    values: ['key1', 'key2'],
                  },
                  {
                    name: FieldName.Memory,
                    type: FieldType.number,
                    values: [100, 200],
                  },
                ],
              }),
            ],
          },
        }),
        { disableLifecycleMethods: true }
      );
      setImmediate(() => {
        const sortedFields = [{ displayName: DisplayNameByFieldName[FieldName.Memory], desc: true }];
        expect(wrapper.state().sortedFields).toEqual(sortedFields);
        const tableComponent = wrapper.find(Table);
        expect(tableComponent.prop('initialSortBy')).toEqual(sortedFields);
        tableComponent.simulate('sortByChange', [{ displayName: DisplayNameByFieldName[FieldName.Type], desc: true }]);
        expect(wrapper.state().sortedFields).toEqual([
          { displayName: DisplayNameByFieldName[FieldName.Type], desc: true },
        ]);
        done();
      });
    });
  });

  afterAll(() => {
    jest.resetAllMocks();
  });
});
