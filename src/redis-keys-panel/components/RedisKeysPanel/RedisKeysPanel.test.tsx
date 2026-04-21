import '@testing-library/jest-dom';
import React, { ChangeEvent, createRef } from 'react';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { Observable } from 'rxjs';
import { FieldType, toDataFrame } from '@grafana/data';
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
 * Shallow Enzyme tests did not mount Grafana Table internals; a lightweight stub avoids
 * theme/display dependencies when the panel renders a table after scanning.
 */
jest.mock('@grafana/ui', () => {
  const actual = jest.requireActual('@grafana/ui');
  return {
    ...actual,
    Table: function Table() {
      return <table data-testid="redis-keys-table" />;
    },
  };
});

/**
 * Panel `data` prop used by RequestData tests (hoisted so async / done-callback tests always see a stable reference).
 */
const REQUEST_DATA_SERIES = {
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
 * Redis Keys Panel
 */
describe('RedisKeysPanel', () => {
  const getRedisKeysPanelElement = (props: any) => {
    const defaultPanelData = {
      request: {
        targets: [
          {
            datasource: 'Redis',
          },
        ],
      },
    };
    const { options = { interval: 1000 }, ref, width = 800, height = 600, data: inputData, ...restProps } = props;
    const panelData = inputData !== undefined ? inputData : defaultPanelData;
    return <RedisKeysPanel ref={ref} data={panelData} width={width} height={height} {...restProps} options={options} />;
  };

  const renderComponent = (props: any) => render(getRedisKeysPanelElement(props));

  beforeEach(() => {
    dataSourceSrvGetMock.mockClear();
    dataSourceMock.query.mockClear();
  });

  afterEach(() => {
    cleanup();
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
    let updateTotalKeysSpy: jest.SpyInstance;

    beforeEach(() => {
      updateTotalKeysSpy = jest.spyOn(RedisKeysPanel.prototype, 'updateTotalKeys').mockResolvedValue(undefined);
    });

    afterEach(() => {
      updateTotalKeysSpy.mockRestore();
    });

    it('If no targets nothing should be loaded and shown', async () => {
      const ref = createRef<RedisKeysPanel>();
      renderComponent({ data: { request: { targets: [] } }, ref });
      await act(async () => {
        const queryResult = await ref.current!.makeQuery();
        expect(queryResult).toBeNull();
      });
    });

    it('Should use default command if command empty in targets', async () => {
      const ref = createRef<RedisKeysPanel>();
      renderComponent({
        data: {
          request: {
            targets: [{ datasource: 'Redis111' }],
          },
        },
        ref,
      });
      await act(async () => {
        await ref.current!.makeQuery();
      });
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
      const ref = createRef<RedisKeysPanel>();
      renderComponent({
        data: {
          request: {
            targets: [{ datasource: 'Redis111', command: 'command', type: 'type', count: 100, size: 11, match: 'abc' }],
          },
        },
        ref,
      });
      await act(async () => {
        await ref.current!.makeQuery();
      });
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
    /**
     * Update data
     */
    describe('Update data', () => {
      it('Should set timer and request data with interval', (done) => {
        const options = {
          interval: 1000,
        };
        const ref = createRef<RedisKeysPanel>();
        render(
          <RedisKeysPanel
            ref={ref}
            data={REQUEST_DATA_SERIES as any}
            options={options as any}
            width={800}
            height={600}
          />
        );
        const testedMethod = jest.spyOn(ref.current!, 'updateData');
        act(() => {
          fireEvent.click(screen.getByRole('button', { name: /Start scanning/i }));
        });
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
              ref.current!.clearRequestDataInterval();
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
        const ref = createRef<RedisKeysPanel>();
        render(
          <RedisKeysPanel
            ref={ref}
            data={REQUEST_DATA_SERIES as any}
            options={options as any}
            width={800}
            height={600}
          />
        );
        const testedMethod = jest.spyOn(ref.current!, 'updateData');
        act(() => {
          fireEvent.click(screen.getByRole('button', { name: /Start scanning/i }));
        });
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
              ref.current!.clearRequestDataInterval();
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
        const ref = createRef<RedisKeysPanel>();
        render(
          <RedisKeysPanel
            ref={ref}
            data={REQUEST_DATA_SERIES as any}
            options={options as any}
            width={800}
            height={600}
          />
        );
        const testedMethod = jest.spyOn(ref.current!, 'updateData');
        act(() => {
          fireEvent.click(screen.getByRole('button', { name: /Start scanning/i }));
        });
        expect(testedMethod).toHaveBeenCalled();
        act(() => {
          ref.current!.setState({
            isUpdating: false,
          });
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
              ref.current!.clearRequestDataInterval();
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
        const ref = createRef<RedisKeysPanel>();
        renderComponent({ data: REQUEST_DATA_SERIES, options, ref });
        const testedMethod = jest.spyOn(ref.current!, 'clearRequestDataInterval');
        ref.current!.setRequestDataInterval();
        setImmediate(() => {
          ref.current!.setRequestDataInterval();
          expect(testedMethod).toHaveBeenCalled();
          ref.current!.clearRequestDataInterval();
          done();
        });
      });

      it('Should use passed datasource', (done) => {
        const options = {
          interval: 1000,
        };
        const overrideData = {
          ...REQUEST_DATA_SERIES,
          request: {
            targets: [
              {
                datasource: 'redis',
              },
            ],
          },
        };
        renderComponent({ data: overrideData, options });
        setImmediate(() => {
          expect(dataSourceSrvGetMock).toHaveBeenCalledWith('redis');
          done();
        });
      });

      it('If no dataFrame, should not update redisKeys', async () => {
        const options = {
          interval: 1000,
        };
        const ref = createRef<RedisKeysPanel>();
        jest.spyOn(RedisKeysPanel.prototype, 'componentDidMount').mockImplementation(() => {});
        renderComponent({ data: REQUEST_DATA_SERIES, options, ref });
        (jest.spyOn(RedisKeysPanel.prototype, 'componentDidMount') as jest.Mock).mockRestore();

        const setStateMock = jest.spyOn(ref.current!, 'setState');
        jest.spyOn(ref.current!, 'makeQuery').mockImplementation(() =>
          Promise.resolve({
            data: [],
          } as any)
        );
        await act(async () => {
          await ref.current!.updateData();
        });
        expect(setStateMock).not.toHaveBeenCalled();
      });

      it('If result correct should update data and progress', async () => {
        const options = {
          interval: 1000,
        };
        const overrideData = {
          ...REQUEST_DATA_SERIES,
          request: {
            targets: [
              {
                datasource: 'redis',
              },
            ],
          },
        };
        const ref = createRef<RedisKeysPanel>();
        jest.spyOn(RedisKeysPanel.prototype, 'componentDidMount').mockImplementation(() => {});
        renderComponent({ data: overrideData, options, ref });
        (jest.spyOn(RedisKeysPanel.prototype, 'componentDidMount') as jest.Mock).mockRestore();

        act(() => {
          ref.current!.setState({
            progress: {
              total: 1000,
              processed: 10,
            },
          });
        });
        await act(async () => {
          await ref.current!.updateData();
        });
        const state = ref.current!.state;
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
        const ref = createRef<RedisKeysPanel>();
        render(
          <RedisKeysPanel
            ref={ref}
            data={REQUEST_DATA_SERIES as any}
            options={options as any}
            width={800}
            height={600}
          />
        );
        ref.current!.setRequestDataInterval();
        setImmediate(() => {
          expect(ref.current!.requestDataTimer).toBeDefined();
          ref.current!.clearRequestDataInterval();
          expect(ref.current!.requestDataTimer).not.toBeDefined();
          done();
        });
      });
    });

    /**
     * Mount
     */
    describe('Mount', () => {
      it('If passed no data as a prop, should work correctly', () => {
        renderComponent({ data: null });
        const emptyKeysMessage = screen.getByText('No keys found. Please start scanning.');
        expect(emptyKeysMessage).toBeInTheDocument();
      });

      it('Should not set interval by default', () => {
        const ref = createRef<RedisKeysPanel>();
        renderComponent({ data: REQUEST_DATA_SERIES, options: {}, ref });
        const testedMethod = jest.spyOn(ref.current!, 'setRequestDataInterval').mockImplementation(() => undefined);
        expect(testedMethod).not.toHaveBeenCalled();
      });

      it('Should set formHeight', () => {
        jest.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
          height: 100,
          width: 0,
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          x: 0,
          y: 0,
          toJSON: () => '',
        } as DOMRect);
        const ref = createRef<RedisKeysPanel>();
        renderComponent({ data: REQUEST_DATA_SERIES, ref });
        expect(ref.current!.state.formHeight).toEqual(100);
        (jest.spyOn(HTMLElement.prototype, 'getBoundingClientRect') as jest.Mock).mockRestore();
      });

      it('Should request all keys', () => {
        const updateTotalKeysMock = jest.spyOn(RedisKeysPanel.prototype, 'updateTotalKeys');
        const ref = createRef<RedisKeysPanel>();
        renderComponent({ data: REQUEST_DATA_SERIES, ref });
        expect(updateTotalKeysMock).toHaveBeenCalled();
        updateTotalKeysMock.mockRestore();
      });
    });

    /**
     * Update
     */
    describe('Update', () => {
      it('If options.interval was changed should clear interval', () => {
        const ref = createRef<RedisKeysPanel>();
        const { rerender } = renderComponent({ data: REQUEST_DATA_SERIES, ref });
        const testedMethod = jest.spyOn(ref.current!, 'clearRequestDataInterval').mockResolvedValue(undefined as never);
        testedMethod.mockClear();
        rerender(getRedisKeysPanelElement({ data: REQUEST_DATA_SERIES, options: { interval: 2000 }, ref }));
        expect(testedMethod).toHaveBeenCalled();
      });

      it('If panel width was changed should set formHeight', () => {
        const rectSpy = jest.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
          height: 105,
          width: 0,
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          x: 0,
          y: 0,
          toJSON: () => '',
        } as DOMRect);
        const ref = createRef<RedisKeysPanel>();
        const { rerender } = renderComponent({ data: REQUEST_DATA_SERIES, ref });
        expect(ref.current!.state.formHeight).toEqual(105);
        act(() => {
          rerender(getRedisKeysPanelElement({ data: REQUEST_DATA_SERIES, width: 1000, ref }));
        });
        expect(ref.current!.state.formHeight).toEqual(105);

        const inst = ref.current!;
        act(() => {
          rerender(getRedisKeysPanelElement({ data: REQUEST_DATA_SERIES, width: 1001, ref }));
        });
        inst.formRef = { current: null } as any;
        act(() => {
          inst.componentDidUpdate({ ...inst.props, width: 1000 } as any, inst.state);
        });
        expect(inst.state.formHeight).toEqual(105);
        rectSpy.mockRestore();
      });

      it('If cursor was changed and equal=0, scanning data should be stopped', () => {
        const ref = createRef<RedisKeysPanel>();
        renderComponent({ data: REQUEST_DATA_SERIES, ref });
        const clearRequestDataIntervalMock = jest.spyOn(ref.current!, 'clearRequestDataInterval');
        act(() => {
          ref.current!.setState({
            cursor: '1',
          });
        });
        expect(clearRequestDataIntervalMock).not.toHaveBeenCalled();
        act(() => {
          ref.current!.setState({
            cursor: '0',
          });
        });
        expect(clearRequestDataIntervalMock).toHaveBeenCalled();
      });

      it('If query was changed, scanning should be stopped and queryConfig fields should be updated', () => {
        const ref = createRef<RedisKeysPanel>();
        const { rerender } = renderComponent({ data: REQUEST_DATA_SERIES, ref });
        const clearRequestDataIntervalMock = jest.spyOn(ref.current!, 'clearRequestDataInterval');
        rerender(
          getRedisKeysPanelElement({
            data: {
              ...REQUEST_DATA_SERIES,
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
            ref,
          } as any)
        );
        expect(clearRequestDataIntervalMock).toHaveBeenCalled();
        expect(ref.current!.state.queryConfig).toEqual({
          count: 111,
          size: 11,
          matchPattern: '***',
        });
        rerender(
          getRedisKeysPanelElement({
            data: {
              ...REQUEST_DATA_SERIES,
              request: {
                targets: [{}],
              },
            },
            ref,
          } as any)
        );
        expect(ref.current!.state.queryConfig).toEqual({
          count: 111,
          size: 11,
          matchPattern: '***',
        });
        rerender(getRedisKeysPanelElement({ data: null, ref } as any));
        expect(ref.current!.state.queryConfig).toEqual({
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
        const ref = createRef<RedisKeysPanel>();
        const { unmount } = renderComponent({ data: REQUEST_DATA_SERIES, ref });
        const testedMethod = jest.spyOn(ref.current!, 'clearRequestDataInterval').mockImplementation(() => {});
        unmount();
        expect(testedMethod).toHaveBeenCalled();
      });
    });
  });

  /**
   * Rendering
   */
  describe('Rendering', () => {
    it('If no dataFrame table should be rendered', () => {
      jest.spyOn(RedisKeysPanel.prototype, 'componentDidMount').mockImplementation(() => {});
      render(
        <RedisKeysPanel data={{ request: {} } as any} options={{ interval: 1000 } as any} width={800} height={600} />
      );
      (jest.spyOn(RedisKeysPanel.prototype, 'componentDidMount') as jest.Mock).mockRestore();
      expect(screen.queryByTestId('redis-keys-table')).not.toBeInTheDocument();
    });

    it('Should render table', async () => {
      const ref = createRef<RedisKeysPanel>();
      jest.spyOn(RedisKeysPanel.prototype, 'componentDidMount').mockImplementation(() => {});
      render(
        <RedisKeysPanel
          ref={ref}
          data={
            {
              request: {
                targets: [{ datasource: 'Redis' }],
              },
            } as any
          }
          options={{ interval: 1000 } as any}
          width={800}
          height={600}
        />
      );
      (jest.spyOn(RedisKeysPanel.prototype, 'componentDidMount') as jest.Mock).mockRestore();

      await act(async () => {
        await ref.current!.updateData();
      });
      expect(screen.getByTestId('redis-keys-table')).toBeInTheDocument();
    });
  });

  /**
   * Sorting
   */
  describe('Sorting', () => {
    it('Should set default sort and update sorting', async () => {
      const ref = createRef<RedisKeysPanel>();
      jest.spyOn(RedisKeysPanel.prototype, 'componentDidMount').mockImplementation(() => {});
      renderComponent({ ref });
      (jest.spyOn(RedisKeysPanel.prototype, 'componentDidMount') as jest.Mock).mockRestore();

      const sortedFields = [{ displayName: DisplayNameByFieldName[FieldName.Memory], desc: true }];
      expect(ref.current!.state.sortedFields).toEqual(sortedFields);
      await act(async () => {
        await ref.current!.updateData();
      });
      const sortedKeysTable = screen.getByTestId('redis-keys-table');
      expect(sortedKeysTable).toBeInTheDocument();
      act(() => {
        ref.current!.onChangeSort([{ displayName: DisplayNameByFieldName[FieldName.Type], desc: true }]);
      });
      expect(ref.current!.state.sortedFields).toEqual([
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
        const ref = createRef<RedisKeysPanel>();
        renderComponent({ ref });
        const sizeInputDefault = screen.getByDisplayValue('10');
        expect(sizeInputDefault).toBeInTheDocument();
        act(() => {
          ref.current!.onChangeSize({ target: { value: '111' } } as ChangeEvent<HTMLInputElement>);
        });
        const sizeInputUpdated = screen.getByDisplayValue('111');
        expect(sizeInputUpdated).toBeInTheDocument();
        act(() => {
          ref.current!.onChangeSize({ target: { value: '' } } as ChangeEvent<HTMLInputElement>);
        });
        const sizeInputEmpty = screen.getByDisplayValue('0');
        expect(sizeInputEmpty).toBeInTheDocument();
      });
    });

    /**
     * Count
     */
    describe('Count', () => {
      it('Should use value from queryConfig.count and update it', () => {
        const ref = createRef<RedisKeysPanel>();
        renderComponent({ ref });
        const countInputDefault = screen.getByDisplayValue('100');
        expect(countInputDefault).toBeInTheDocument();
        act(() => {
          ref.current!.onChangeCount({ target: { value: '111' } } as ChangeEvent<HTMLInputElement>);
        });
        const countInputUpdated = screen.getByDisplayValue('111');
        expect(countInputUpdated).toBeInTheDocument();
        act(() => {
          ref.current!.onChangeCount({ target: { value: '' } } as ChangeEvent<HTMLInputElement>);
        });
        const countInputEmpty = screen.getByDisplayValue('0');
        expect(countInputEmpty).toBeInTheDocument();
      });
    });

    /**
     * MatchPattern
     */
    describe('MatchPattern', () => {
      it('Should use value from queryConfig.matchPattern and update it', () => {
        const ref = createRef<RedisKeysPanel>();
        renderComponent({ ref });
        const matchPatternInputDefault = screen.getByDisplayValue('*');
        expect(matchPatternInputDefault).toBeInTheDocument();
        act(() => {
          ref.current!.onChangeMatchPattern({ target: { value: '***' } } as ChangeEvent<HTMLInputElement>);
        });
        const matchPatternInputUpdated = screen.getByDisplayValue('***');
        expect(matchPatternInputUpdated).toBeInTheDocument();
      });
    });
  });

  afterAll(() => {
    jest.resetAllMocks();
  });
});
