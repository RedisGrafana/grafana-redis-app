import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import React, { createRef } from 'react';
import { Observable } from 'rxjs';
import { dateTime, FieldType, toDataFrame } from '@grafana/data';
import { DefaultInterval, FieldName, ViewMode } from '../../constants';
import { RedisLatencyPanel } from './RedisLatencyPanel';

jest.mock('../RedisLatencyGraph', () => ({
  RedisLatencyGraph: function RedisLatencyGraph() { return <div data-testid="redis-latency-graph" />; },
}));
jest.mock('../RedisLatencyTable', () => ({
  RedisLatencyTable: function RedisLatencyTable() { return <div data-testid="redis-latency-table" />; },
}));

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
  const redisLatencyPanelElement = ({
    options = { interval: 1000, viewMode: ViewMode.Table },
    ref,
    width = 400,
    height = 300,
    ...restProps
  }: any = {}) => {
    const data = {
      request: {
        targets: [
          {
            datasource: 'Redis',
          },
        ],
      },
    };
    return <RedisLatencyPanel ref={ref} data={data} width={width} height={height} {...restProps} options={options} />;
  };

  const renderComponent = (props: any = {}) => render(redisLatencyPanelElement(props));

  beforeEach(() => {
    dataSourceSrvGetMock.mockClear();
    dataSourceMock.query.mockClear();
  });

  /**
   * makeQuery
   */
  describe('makeQuery', () => {
    it('If no targets nothing should be loaded and shown', async () => {
      const ref = createRef<RedisLatencyPanel>();
      renderComponent({ data: { request: { targets: [] } }, ref });
      const data = await ref.current!.makeQuery();
      expect(data).toBeNull();
    });

    it('Should use default command if command empty in targets', async () => {
      const ref = createRef<RedisLatencyPanel>();
      renderComponent({
        ref,
        data: {
          request: {
            targets: [{ datasource: 'Redis111' }],
          },
        },
      });

      /**
       * Query
       */
      await ref.current!.makeQuery();
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
    });

    it('Should use query params from props if there are', async () => {
      const ref = createRef<RedisLatencyPanel>();
      renderComponent({
        ref,
        data: {
          request: {
            targets: [{ datasource: 'Redis111', command: 'command', section: 'section', type: 'type' }],
          },
        },
      });

      /**
       * Query
       */
      await ref.current!.makeQuery();
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
      expect(RedisLatencyPanel.getValuesForCalculation(dataFrame)).toEqual({
        calls: [],
        duration: [],
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

      /**
       * Data frame
       */
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

      /**
       * Result
       */
      const result = RedisLatencyPanel.getSeriesMap(seriesMap, dataFrame, values, time);
      const expectedResult = {
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

      /**
       * Data frame
       */
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

      /**
       * Result
       */
      const result = RedisLatencyPanel.getSeriesMap(seriesMap, dataFrame, values, time, 2);
      const expectedResult = {
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
        const testedMethod = jest
          .spyOn(RedisLatencyPanel.prototype, 'setRequestDataInterval')
          .mockImplementation(() => undefined);
        renderComponent({ data });
        expect(testedMethod).toHaveBeenCalled();
        testedMethod.mockRestore();
      });

      it('If options.interval is empty should not set interval', () => {
        const options = {};
        const testedMethod = jest
          .spyOn(RedisLatencyPanel.prototype, 'setRequestDataInterval')
          .mockImplementation(() => undefined);
        renderComponent({ data, options });
        expect(testedMethod).not.toHaveBeenCalled();
        testedMethod.mockRestore();
      });

      it('Should calc formHeight', () => {
        const getBoundingClientRect = jest.spyOn(HTMLElement.prototype, 'getBoundingClientRect');
        getBoundingClientRect.mockReturnValue({
          height: 105,
          width: 0,
          x: 0,
          y: 0,
          bottom: 0,
          left: 0,
          right: 0,
          top: 0,
          toJSON: () => ({}),
        } as DOMRect);

        const ref = createRef<RedisLatencyPanel>();
        renderComponent({ data, ref });
        expect(ref.current!.state.formHeight).toEqual(105);
        getBoundingClientRect.mockRestore();
      });
    });

    /**
     * Update
     */
    describe('Update', () => {
      it('If options.interval was changed should set interval', () => {
        const testedMethod = jest
          .spyOn(RedisLatencyPanel.prototype, 'setRequestDataInterval')
          .mockImplementation(() => undefined);
        const { rerender } = renderComponent({ data });
        expect(testedMethod).toHaveBeenCalled();

        testedMethod.mockClear();
        rerender(
          redisLatencyPanelElement({
            data,
            options: { interval: 2000, viewMode: ViewMode.Table, maxItemsPerSeries: 1000, hideZero: false },
          })
        );
        expect(testedMethod).toHaveBeenCalled();

        testedMethod.mockClear();
        rerender(
          redisLatencyPanelElement({
            data,
            options: { interval: 2000, viewMode: ViewMode.Table, maxItemsPerSeries: 1000, hideZero: false },
          })
        );
        expect(testedMethod).not.toHaveBeenCalled();
        testedMethod.mockRestore();
      });

      it('If panel width was changed should recalc formHeight', () => {
        const ref = createRef<RedisLatencyPanel>();
        const gbMock = jest.spyOn(HTMLElement.prototype, 'getBoundingClientRect');
        const origDidUpdate = RedisLatencyPanel.prototype.componentDidUpdate;
        const stableOptions = { interval: 1000, viewMode: ViewMode.Table };

        gbMock.mockReturnValue({
          height: 0,
          width: 0,
          x: 0,
          y: 0,
          bottom: 0,
          left: 0,
          right: 0,
          top: 0,
          toJSON: () => ({}),
        } as DOMRect);

        const { rerender } = renderComponent({ data, ref, options: stableOptions });
        expect(ref.current!.state.formHeight).toEqual(0);

        gbMock.mockReturnValue({
          height: 105,
          width: 0,
          x: 0,
          y: 0,
          bottom: 0,
          left: 0,
          right: 0,
          top: 0,
          toJSON: () => ({}),
        } as DOMRect);

        ref.current!.formRef = {
          current: {
            getBoundingClientRect: gbMock,
          },
        } as any;
        rerender(redisLatencyPanelElement({ data, ref, height: 500, options: stableOptions }));
        expect(ref.current!.state.formHeight).toEqual(0);

        gbMock.mockReturnValueOnce({
          height: 200,
          width: 0,
          x: 0,
          y: 0,
          bottom: 0,
          left: 0,
          right: 0,
          top: 0,
          toJSON: () => ({}),
        } as DOMRect);

        rerender(redisLatencyPanelElement({ data, ref, width: 300, options: stableOptions }));
        expect(ref.current!.state.formHeight).toEqual(200);

        const didUpdateSpy = jest
          .spyOn(RedisLatencyPanel.prototype, 'componentDidUpdate')
          .mockImplementation(function (this: RedisLatencyPanel, prevProps, prevState) {
            if (this.props.width === 400 && prevProps.width === 300) {
              this.formRef = { current: null } as React.RefObject<HTMLDivElement>;
            }
            return origDidUpdate.call(this, prevProps, prevState);
          });

        rerender(redisLatencyPanelElement({ data, ref, width: 400, options: stableOptions }));

        expect(ref.current!.state.formHeight).toEqual(200);

        didUpdateSpy.mockRestore();
        gbMock.mockRestore();
      });
    });

    /**
     * Unmount
     */
    describe('Unmount', () => {
      it('Should clear interval', () => {
        const testedMethod = jest.spyOn(RedisLatencyPanel.prototype, 'clearRequestDataInterval').mockImplementation();
        const { unmount } = renderComponent({ data });
        unmount();
        expect(testedMethod).toHaveBeenCalled();
        testedMethod.mockRestore();
      });
    });

    /**
     * Update seriesMap
     */
    describe('Update seriesMap', () => {
      it('Should set timer and request data with interval', async () => {
        jest.useFakeTimers();
        const options = {
          interval: 1000,
          viewMode: ViewMode.Table,
          maxItemsPerSeries: 1000,
        };
        const updateDataSpy = jest.spyOn(RedisLatencyPanel.prototype, 'updateData');
        renderComponent({ data, options });

        await waitFor(() => expect(updateDataSpy).toHaveBeenCalled());
        updateDataSpy.mockClear();
        jest.advanceTimersByTime(options.interval);
        await waitFor(() => expect(updateDataSpy).toHaveBeenCalled());
        updateDataSpy.mockRestore();
        jest.useRealTimers();
      });

      it('Should set timer with default interval if no interval option and request data with interval', async () => {
        jest.useFakeTimers();
        const options = {
          interval: null,
        };
        const updateDataSpy = jest.spyOn(RedisLatencyPanel.prototype, 'updateData');
        renderComponent({ data, options });

        await waitFor(() => expect(updateDataSpy).toHaveBeenCalled());
        updateDataSpy.mockClear();
        jest.advanceTimersByTime(DefaultInterval);
        await waitFor(() => expect(updateDataSpy).toHaveBeenCalled());
        updateDataSpy.mockRestore();
        jest.useRealTimers();
      });

      it('Should clear interval before setting new one', async () => {
        const options = {
          interval: 1000,
          viewMode: ViewMode.Table,
          maxItemsPerSeries: 1000,
        };

        const ref = createRef<RedisLatencyPanel>();
        renderComponent({ data, options, ref });

        await waitFor(() => expect(ref.current).toBeTruthy());
        const testedMethod = jest.spyOn(ref.current!, 'clearRequestDataInterval');
        ref.current!.setRequestDataInterval();
        expect(testedMethod).toHaveBeenCalled();
        testedMethod.mockRestore();
      });

      it('Should use passed datasource', async () => {
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
        renderComponent({ data: overrideData, options });
        await waitFor(() => expect(dataSourceSrvGetMock).toHaveBeenCalledWith('redis'));
      });

      it('Should not update values if no dataFrame', async () => {
        const options = {
          interval: 1000,
        };

        jest.spyOn(RedisLatencyPanel.prototype, 'componentDidMount').mockImplementation(() => {});

        const ref = createRef<RedisLatencyPanel>();
        renderComponent({ data, options, ref });

        jest.spyOn(ref.current!, 'makeQuery').mockImplementation(() =>
          Promise.resolve({
            data: [],
          })
        );

        const setStateMock = jest.spyOn(ref.current!, 'setState');
        await ref.current!.updateData();
        expect(setStateMock).not.toHaveBeenCalled();
        setStateMock.mockRestore();
        (RedisLatencyPanel.prototype.componentDidMount as jest.Mock).mockRestore();
      });
    });

    /**
     * clearRequestDataInterval
     */
    describe('clearRequestDataInterval', () => {
      it('Should clear interval', async () => {
        const options = {
          interval: 1000,
          viewMode: ViewMode.Table,
          maxItemsPerSeries: 1000,
        };

        const ref = createRef<RedisLatencyPanel>();
        renderComponent({ data, options, ref });

        await waitFor(() => expect(ref.current!.requestDataTimer).toBeDefined());
        ref.current!.clearRequestDataInterval();
        expect(ref.current!.requestDataTimer).not.toBeDefined();
        ref.current!.clearRequestDataInterval();
        expect(ref.current!.requestDataTimer).not.toBeDefined();
      });
    });
  });

  /**
   * Rendering
   */
  describe('Rendering', () => {
    it('If no dataFrame nothing should be rendered', async () => {
      renderComponent({ data: { request: {} } });
      await waitFor(() => {
        expect(screen.queryByTestId('redis-latency-table')).not.toBeInTheDocument();
        expect(screen.queryByTestId('redis-latency-graph')).not.toBeInTheDocument();
      });
    });

    it('Should render table if viewMode=table', async () => {
      renderComponent({ options: { interval: 1000, viewMode: ViewMode.Table, maxItemsPerSeries: 1000 } });

      await waitFor(() => {
        const latencyTable = screen.getByTestId('redis-latency-table');
        expect(latencyTable).toBeInTheDocument();
      });
    });

    it('Should render graph if viewMode=graph', async () => {
      renderComponent({ options: { interval: 1000, viewMode: ViewMode.Graph, maxItemsPerSeries: 1000 } });

      await waitFor(() => {
        const latencyGraph = screen.getByTestId('redis-latency-graph');
        expect(latencyGraph).toBeInTheDocument();
      });
    });
  });

  /**
   * Options
   */
  describe('Options', () => {
    /**
     * ViewMode
     */
    describe('ViewMode', () => {
      it('Should apply options value and change', () => {
        const onOptionsChange = jest.fn();
        const options = { interval: 1000, viewMode: ViewMode.Graph, maxItemsPerSeries: 1000 };
        const ref = createRef<RedisLatencyPanel>();
        renderComponent({ options, onOptionsChange, ref });
        const graphRadio = screen.getByRole('radio', { name: 'Graph' });
        expect(graphRadio).toBeChecked();

        ref.current!.onChangeViewMode(undefined);
        expect(onOptionsChange).not.toHaveBeenCalled();

        ref.current!.onChangeViewMode(ViewMode.Table);
        expect(onOptionsChange).toHaveBeenCalledWith({
          ...options,
          viewMode: ViewMode.Table,
        });
      });
    });

    /**
     * HideZero
     */
    describe('HideZero', () => {
      it('Should be shown when viewMode=Graph', () => {
        const options = { interval: 1000, viewMode: ViewMode.Table, maxItemsPerSeries: 1000 };
        const { rerender } = renderComponent({ options });
        expect(screen.queryByText('Hide commands which have only zero values')).not.toBeInTheDocument();

        rerender(
          redisLatencyPanelElement({
            options: {
              ...options,
              viewMode: ViewMode.Graph,
            },
          })
        );
        const hideZeroLabel = screen.getByText('Hide commands which have only zero values');
        expect(hideZeroLabel).toBeInTheDocument();
      });

      it('Should apply options value and change', () => {
        const onOptionsChange = jest.fn();
        const options = { interval: 1000, viewMode: ViewMode.Graph, maxItemsPerSeries: 1000, hideZero: false };

        const ref = createRef<RedisLatencyPanel>();
        renderComponent({ options, onOptionsChange, ref });
        const testedComponent = screen.getByRole('checkbox');
        expect(testedComponent).toBeInTheDocument();
        expect((testedComponent as HTMLInputElement).checked).toEqual(false);

        ref.current!.onChangeHideZero({ target: { checked: true } } as React.ChangeEvent<HTMLInputElement>);
        expect(onOptionsChange).toHaveBeenCalledWith({
          ...options,
          hideZero: true,
        });
      });
    });
  });

  afterAll(() => {
    jest.resetAllMocks();
  });
});
