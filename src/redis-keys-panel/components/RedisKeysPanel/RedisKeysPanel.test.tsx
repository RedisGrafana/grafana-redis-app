import { shallow } from 'enzyme';
import React from 'react';
import { Observable } from 'rxjs';
import { FieldType, toDataFrame } from '@grafana/data';
import { Button, Table } from '@grafana/ui';
import { DefaultInterval, DisplayNameByFieldName, FieldName } from '../../constants';
import { RedisKeysPanel } from './RedisKeysPanel';

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
    toDataFrame({
      name: 'meta',
      fields: [
        {
          type: FieldType.string,
          name: 'cursor',
          values: ['0'],
        },
        {
          type: FieldType.number,
          name: 'count',
          values: [10],
        },
      ],
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
 * Mock @grafana/runtime
 */
jest.mock('@grafana/runtime', () => ({
  getDataSourceSrv: () => ({
    get: dataSourceSrvGetMock,
  }),
  config: { theme2: {} },
}));

/**
 * Redis Keys Panel
 */
describe('RedisKeysPanel', () => {
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
    return <RedisKeysPanel data={data} {...restProps} options={options} />;
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
      const result = RedisKeysPanel.getRedisKeys(dataFrame);
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
      expect(
        RedisKeysPanel.getRedisKeys(
          toDataFrame({
            name: 'data',
            fields: [
              {
                type: FieldType.string,
                name: FieldName.Key,
                values: ['key1', 'key2'],
              },
            ],
          })
        )
      ).toEqual([
        {
          key: 'key1',
        },
        {
          key: 'key2',
        },
      ]);
      expect(
        RedisKeysPanel.getRedisKeys(
          toDataFrame({
            name: 'data',
            fields: [
              {
                type: FieldType.string,
                name: 'key111',
                values: ['key1', 'key2'],
              },
            ],
          })
        )
      ).toEqual([
        {
          key: undefined,
        },
        {
          key: undefined,
        },
      ]);
    });
  });

  /**
   * Sorted Redis Keys
   */
  describe('getSortedRedisKeys', () => {
    it('Should use the sorted value for keys', () => {
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
      const result = RedisKeysPanel.getSortedRedisKeys(currentKeys, newKeys, 10);
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
      const result = RedisKeysPanel.getSortedRedisKeys(currentKeys, newKeys, 2);
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
      const result = RedisKeysPanel.getTableDataFrame(keys);
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
      expect(RedisKeysPanel.getCursorValue()).toEqual('0');
      expect(
        RedisKeysPanel.getCursorValue(
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
        RedisKeysPanel.getCursorValue(
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
   * getCount
   */
  describe('getCount', () => {
    it('Should return count value from dataFrame', () => {
      expect(RedisKeysPanel.getCount()).toEqual(0);
      expect(
        RedisKeysPanel.getCount(
          toDataFrame({
            fields: [
              {
                name: 'count',
                type: FieldType.number,
                values: [100],
              },
            ],
          })
        )
      ).toEqual(100);
      expect(
        RedisKeysPanel.getCount(
          toDataFrame({
            fields: [
              {
                name: 'NotCount',
                type: FieldType.string,
                values: ['123'],
              },
            ],
          })
        )
      ).toEqual(0);
    });
  });

  /**
   * makeQuery
   */
  describe('makeQuery', () => {
    it('If no targets nothing should be loaded and shown', async () => {
      const wrapper = shallow<RedisKeysPanel>(getComponent({ data: { request: { targets: [] } } }));
      const data = await wrapper.instance().makeQuery();
      expect(data).toBeNull();
    });

    it('Should use default command if command empty in targets', async () => {
      const wrapper = shallow<RedisKeysPanel>(
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
            count: 100,
            cursor: '0',
            match: '*',
            size: 10,
          },
        ],
      });
    });

    it('Should use query params from props if there are', async () => {
      const wrapper = shallow<RedisKeysPanel>(
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
              name: FieldName.Key,
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
        const wrapper = shallow<RedisKeysPanel>(getComponent({ data: null }), { disableLifecycleMethods: true });
        expect(wrapper.state().redisKeys.length).toEqual(0);
      });

      it('Should not set interval by default', () => {
        const options = {};
        const wrapper = shallow<RedisKeysPanel>(getComponent({ data, options }));
        const testedMethod = jest
          .spyOn(wrapper.instance(), 'setRequestDataInterval')
          .mockImplementation(() => Promise.resolve());
        expect(testedMethod).not.toHaveBeenCalled();
      });

      it('Should set formHeight', () => {
        const wrapper = shallow<RedisKeysPanel>(getComponent({ data }), { disableLifecycleMethods: true });
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
        const wrapper = shallow<RedisKeysPanel>(getComponent({ data }), { disableLifecycleMethods: true });
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
        const wrapper = shallow<RedisKeysPanel>(getComponent({ data }));
        const testedMethod = jest
          .spyOn(wrapper.instance(), 'clearRequestDataInterval')
          .mockImplementation(() => Promise.resolve());
        testedMethod.mockClear();
        wrapper.setProps({
          options: { interval: 2000 },
        });
        expect(testedMethod).toHaveBeenCalled();
      });

      it('If panel width was changed should set formHeight', () => {
        const wrapper = shallow<RedisKeysPanel>(getComponent({ data }));
        wrapper.instance().formRef = {
          current: {
            getBoundingClientRect: () => ({
              height: 105,
            }),
          },
        } as any;
        wrapper.setProps({ width: 1000 });
        expect(wrapper.state().formHeight).toEqual(105);
        wrapper.instance().formRef = {
          current: null,
        } as any;
        wrapper.setProps({ width: 1001 });
        expect(wrapper.state().formHeight).toEqual(105);
      });

      it('If cursor was changed and equal=0, scanning data should be stopped', () => {
        const wrapper = shallow<RedisKeysPanel>(getComponent({ data }));
        const clearRequestDataIntervalMock = jest.spyOn(wrapper.instance(), 'clearRequestDataInterval');
        wrapper.setState({
          cursor: '1',
        });
        expect(clearRequestDataIntervalMock).not.toHaveBeenCalled();
        wrapper.setState({
          cursor: '0',
        });
        expect(clearRequestDataIntervalMock).toHaveBeenCalled();
      });

      it('If query was changed, scanning should be stopped and queryConfig fields should be updated', () => {
        const wrapper = shallow<RedisKeysPanel>(getComponent({ data }));
        const clearRequestDataIntervalMock = jest.spyOn(wrapper.instance(), 'clearRequestDataInterval');
        wrapper.setProps({
          data: {
            ...data,
            request: {
              targets: [
                {
                  count: 111,
                  size: 11,
                  match: '***',
                },
              ],
            },
          },
        } as any);
        expect(clearRequestDataIntervalMock).toHaveBeenCalled();
        expect(wrapper.state().queryConfig).toEqual({
          count: 111,
          size: 11,
          matchPattern: '***',
        });
        wrapper.setProps({
          data: {
            ...data,
            request: {
              targets: [{}],
            },
          },
        } as any);
        expect(wrapper.state().queryConfig).toEqual({
          count: 111,
          size: 11,
          matchPattern: '***',
        });
        wrapper.setProps({
          data: null,
        } as any);
        expect(wrapper.state().queryConfig).toEqual({
          count: 111,
          size: 11,
          matchPattern: '***',
        });
      });
    });

    /**
     * Unmount
     */
    describe('Unmount', () => {
      it('Should clear interval', () => {
        const wrapper = shallow<RedisKeysPanel>(getComponent({ data }));
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
        const wrapper = shallow<RedisKeysPanel>(getComponent({ data, options }));
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

      it('Should set default interval for timer and request data with interval', (done) => {
        const options = {
          interval: null,
        };
        const wrapper = shallow<RedisKeysPanel>(getComponent({ data, options }));
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
              setTimeout(check, DefaultInterval);
            } else {
              done();
            }
          };
          setTimeout(check, DefaultInterval);
        });
      });

      it('If isUpdating was disabled, should not call next updateData', (done) => {
        const options = {
          interval: null,
        };
        const wrapper = shallow<RedisKeysPanel>(getComponent({ data, options }));
        const testedMethod = jest.spyOn(wrapper.instance(), 'updateData');
        const button = wrapper.find(Button);
        button.simulate('click');

        expect(testedMethod).toHaveBeenCalled();
        wrapper.setState({
          isUpdating: false,
        });
        setImmediate(() => {
          testedMethod.mockClear();
          let checksCount = 2;
          const check = () => {
            expect(testedMethod).not.toHaveBeenCalled();

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
        };
        const wrapper = shallow<RedisKeysPanel>(getComponent({ data, options }));
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
        shallow<RedisKeysPanel>(getComponent({ data: overrideData, options }));
        setImmediate(() => {
          expect(dataSourceSrvGetMock).toHaveBeenCalledWith('redis');
          done();
        });
      });

      it('If no dataFrame, should not update redisKeys', async () => {
        const options = {
          interval: 1000,
        };
        const wrapper = shallow<RedisKeysPanel>(getComponent({ data, options }), {
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

      it('If result correct should update data and progress', async () => {
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
        const wrapper = shallow<RedisKeysPanel>(getComponent({ data: overrideData, options }), {
          disableLifecycleMethods: true,
        });
        wrapper.setState({
          progress: {
            total: 1000,
            processed: 10,
          },
        });
        await wrapper.instance().updateData();
        const state = wrapper.state();
        expect(state.dataFrame?.length).toEqual(2);
        expect(state.progress).toEqual({
          total: 1000,
          processed: 20,
        });
        expect(state.redisKeys.length).toEqual(2);
        expect(state.cursor).toEqual('0');
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
        const wrapper = shallow<RedisKeysPanel>(getComponent({ data, options }));
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

    it('Should render table', async () => {
      const wrapper = shallow<RedisKeysPanel>(getComponent({}));
      await wrapper.instance().updateData();
      expect(wrapper.find(Table).exists()).toBeTruthy();
    });
  });

  /**
   * Sorting
   */
  describe('Sorting', () => {
    it('Should set default sort and update sorting', async () => {
      const wrapper = shallow<RedisKeysPanel>(getComponent({}), { disableLifecycleMethods: true });
      const sortedFields = [{ displayName: DisplayNameByFieldName[FieldName.Memory], desc: true }];
      expect(wrapper.state().sortedFields).toEqual(sortedFields);
      await wrapper.instance().updateData();
      const tableComponent = wrapper.find(Table);
      expect(tableComponent.prop('initialSortBy')).toEqual(sortedFields);
      tableComponent.simulate('sortByChange', [{ displayName: DisplayNameByFieldName[FieldName.Type], desc: true }]);
      expect(wrapper.state().sortedFields).toEqual([
        { displayName: DisplayNameByFieldName[FieldName.Type], desc: true },
      ]);
    });
  });

  /**
   * QueryConfig
   */
  describe('QueryConfig', () => {
    /**
     * Size
     */
    describe('Size', () => {
      it('Should use value from queryConfig.size and update it', () => {
        const wrapper = shallow<RedisKeysPanel>(getComponent({}));
        const testedComponent = wrapper.findWhere((node) => node.prop('onChange') === wrapper.instance().onChangeSize);
        expect(testedComponent.prop('value')).toEqual(wrapper.state().queryConfig.size);
        testedComponent.simulate('change', { target: { value: '111' } });
        expect(wrapper.state().queryConfig.size).toEqual(111);
        testedComponent.simulate('change', { target: { value: '' } });
        expect(wrapper.state().queryConfig.size).toEqual(0);
      });
    });

    /**
     * Count
     */
    describe('Count', () => {
      it('Should use value from queryConfig.count and update it', () => {
        const wrapper = shallow<RedisKeysPanel>(getComponent({}));
        const testedComponent = wrapper.findWhere((node) => node.prop('onChange') === wrapper.instance().onChangeCount);
        expect(testedComponent.prop('value')).toEqual(wrapper.state().queryConfig.count);
        testedComponent.simulate('change', { target: { value: '111' } });
        expect(wrapper.state().queryConfig.count).toEqual(111);
        testedComponent.simulate('change', { target: { value: '' } });
        expect(wrapper.state().queryConfig.count).toEqual(0);
      });
    });

    /**
     * MatchPattern
     */
    describe('MatchPattern', () => {
      it('Should use value from queryConfig.matchPattern and update it', () => {
        const wrapper = shallow<RedisKeysPanel>(getComponent({}));
        const testedComponent = wrapper.findWhere(
          (node) => node.prop('onChange') === wrapper.instance().onChangeMatchPattern
        );
        expect(testedComponent.prop('value')).toEqual(wrapper.state().queryConfig.matchPattern);
        testedComponent.simulate('change', { target: { value: '***' } });
        expect(wrapper.state().queryConfig.matchPattern).toEqual('***');
      });
    });
  });

  afterAll(() => {
    jest.resetAllMocks();
  });
});
