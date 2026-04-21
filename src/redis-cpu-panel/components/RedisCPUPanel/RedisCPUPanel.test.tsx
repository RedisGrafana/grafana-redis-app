import '@testing-library/jest-dom';
import { act, render, screen, waitFor } from '@testing-library/react';
import React, { createRef } from 'react';
import { dateTime, FieldType, toDataFrame } from '@grafana/data';
import { DefaultInterval, FieldName } from '../../constants';

jest.mock('@grafana/ui', () => {
  const React = require('react');
  const actual = jest.requireActual('@grafana/ui');
  return {
    ...actual,
    TooltipDisplayMode: actual.TooltipDisplayMode ?? { Multi: 0 },
    TimeSeries: function TimeSeries({ children }: { children?: (config: unknown, alignedDataFrame: unknown) => React.ReactNode }) {
      return <div data-testid="redis-cpu-timeseries">{typeof children === 'function' ? children({}, {}) : children}</div>;
    },
    TooltipPlugin: function TooltipPlugin() { return <div data-testid="tooltip-plugin" />; },
  };
});

/**
 * Mock getDataSourceSrv function (fully inside factory so Jest hoisting always wires `get` to a real jest.fn).
 */
jest.mock('@grafana/runtime', () => {
  const { Observable } = require('rxjs');
  const { FieldType, toDataFrame } = require('@grafana/data');
  const { FieldName } = require('../../constants');

  const getDataSourceQueryResult = (fields: Array<{ name: FieldName; type: FieldType; values: number[] }>) => ({
    data: [
      toDataFrame({
        name: 'data',
        fields,
      }),
    ],
  });

  const dataSourceMock = {
    query: jest.fn().mockImplementation(
      () =>
        new Observable((subscriber: { next: (v: unknown) => void; complete: () => void }) => {
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

  const actual = jest.requireActual('@grafana/runtime');

  return {
    ...actual,
    getDataSourceSrv: () => ({
      get: dataSourceSrvGetMock,
    }),
  };
});

import { getDataSourceSrv } from '@grafana/runtime';
import { RedisCPUPanel } from './RedisCPUPanel';

const dataSourceSrvGetMock = getDataSourceSrv().get as jest.Mock;
let dataSourceMock: { query: jest.Mock; name: string };

/**
 * CPU Panel
 */
describe('RedisCPUPanel', () => {
  beforeAll(async () => {
    dataSourceMock = await dataSourceSrvGetMock('redis');
  });
  function redisCpuPanelUi({ options = { interval: 1000 }, ref, ...restProps }: any = {}) {
    const data = {
      request: {
        targets: [
          {
            datasource: 'Redis',
          },
        ],
      },
    };
    const timeRange = {
      from: dateTime(),
      to: dateTime(),
      raw: { from: 'now-6h', to: 'now' },
    };
    return (
      <RedisCPUPanel
        ref={ref}
        data={data}
        height={400}
        width={600}
        timeRange={timeRange}
        timeZone="browser"
        {...restProps}
        options={options}
      />
    );
  }

  function renderComponent(overrides: Record<string, unknown> = {}) {
    return render(redisCpuPanelUi(overrides));
  }

  beforeEach(() => {
    dataSourceSrvGetMock.mockClear();
    dataSourceMock.query.mockClear();
  });

  /**
   * makeQuery
   */
  describe('makeQuery', () => {
    it('If no targets nothing should be loaded and shown', async () => {
      const ref = createRef<RedisCPUPanel>();
      renderComponent({ ref, data: { request: { targets: [] } } });

      await act(async () => {
        const data = await ref.current!.makeQuery();
        expect(data).toBeNull();
      });
    });

    it('Should use default command if command empty in targets', async () => {
      const ref = createRef<RedisCPUPanel>();
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
      await act(async () => {
        await ref.current!.makeQuery();
      });
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
      const ref = createRef<RedisCPUPanel>();
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
      await act(async () => {
        await ref.current!.makeQuery();
      });
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
        const spy = jest.spyOn(RedisCPUPanel.prototype, 'setRequestDataInterval').mockImplementation(() => {
          return undefined as any;
        });
        renderComponent({ data });
        expect(spy).toHaveBeenCalled();
        spy.mockRestore();
      });

      it('If options.interval is empty should not set interval', () => {
        const options = {};
        const spy = jest.spyOn(RedisCPUPanel.prototype, 'setRequestDataInterval').mockImplementation(() => {
          return undefined as any;
        });
        renderComponent({ data, options });
        expect(spy).not.toHaveBeenCalled();
        spy.mockRestore();
      });
    });

    /**
     * Update
     */
    describe('Update', () => {
      it('If options.interval was changed should set interval', () => {
        const ref = createRef<RedisCPUPanel>();
        const spy = jest.spyOn(RedisCPUPanel.prototype, 'setRequestDataInterval').mockImplementation(() => {
          return undefined as any;
        });
        const { rerender } = renderComponent({ ref, data });
        expect(spy).toHaveBeenCalled();

        spy.mockClear();
        act(() => {
          rerender(redisCpuPanelUi({ ref, data, options: { interval: 2000, maxItemsPerSeries: 1000 } }));
        });
        expect(spy).toHaveBeenCalled();

        spy.mockClear();
        act(() => {
          rerender(redisCpuPanelUi({ ref, data, options: { interval: 2000, maxItemsPerSeries: 1000 } }));
        });
        expect(spy).not.toHaveBeenCalled();
        spy.mockRestore();
      });
    });

    /**
     * Unmount
     */
    describe('Unmount', () => {
      it('Should clear interval', () => {
        const spy = jest.spyOn(RedisCPUPanel.prototype, 'clearRequestDataInterval').mockImplementation(() => {});
        const { unmount } = renderComponent({ data });
        unmount();
        expect(spy).toHaveBeenCalled();
        spy.mockRestore();
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
          maxItemsPerSeries: 1,
        };
        const ref = createRef<RedisCPUPanel>();
        const testedMethod = jest.spyOn(RedisCPUPanel.prototype, 'updateData');

        renderComponent({ ref, data, options });

        await act(async () => {
          await Promise.resolve();
        });

        testedMethod.mockClear();
        let checksCount = 2;

        const check = async () => {
          expect(testedMethod).toHaveBeenCalled();

          checksCount--;
          if (checksCount > 0) {
            testedMethod.mockClear();
            await act(async () => {
              jest.advanceTimersByTime(options.interval);
              await Promise.resolve();
            });
            await check();
          }
        };

        await act(async () => {
          jest.advanceTimersByTime(options.interval);
          await Promise.resolve();
        });
        await check();

        testedMethod.mockRestore();
        jest.useRealTimers();
      });

      it('Should set timer with default interval if no interval option and request data with interval', async () => {
        jest.useFakeTimers();
        const options = {
          interval: null,
        };
        const ref = createRef<RedisCPUPanel>();
        const testedMethod = jest.spyOn(RedisCPUPanel.prototype, 'updateData');

        renderComponent({ ref, data, options });

        await act(async () => {
          await Promise.resolve();
        });

        testedMethod.mockClear();
        let checksCount = 2;

        const check = async () => {
          expect(testedMethod).toHaveBeenCalled();

          checksCount--;
          if (checksCount > 0) {
            testedMethod.mockClear();
            await act(async () => {
              jest.advanceTimersByTime(DefaultInterval);
              await Promise.resolve();
            });
            await check();
          }
        };

        await act(async () => {
          jest.advanceTimersByTime(DefaultInterval);
          await Promise.resolve();
        });
        await check();

        testedMethod.mockRestore();
        jest.useRealTimers();
      });

      it('Should clear interval before setting new one', (done) => {
        const options = {
          interval: 1000,
          maxItemsPerSeries: 1000,
        };

        const ref = createRef<RedisCPUPanel>();
        const testedMethod = jest.spyOn(RedisCPUPanel.prototype, 'clearRequestDataInterval');

        renderComponent({ ref, data, options });

        setImmediate(() => {
          act(() => {
            ref.current!.setRequestDataInterval();
          });
          expect(testedMethod).toHaveBeenCalled();
          testedMethod.mockRestore();
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
        renderComponent({ data: overrideData, options });
        setImmediate(() => {
          expect(dataSourceSrvGetMock).toHaveBeenCalledWith('redis');
          done();
        });
      });

      it('Should not update values if no dataFrame', async () => {
        const options = {
          interval: 1000,
        };

        const mountSpy = jest.spyOn(RedisCPUPanel.prototype, 'componentDidMount').mockImplementation(() => {
          /* skip mount to mirror shallow({ disableLifecycleMethods: true }) */
        });
        jest.spyOn(RedisCPUPanel.prototype, 'makeQuery').mockResolvedValue({ data: [] } as any);
        const setStateMock = jest.spyOn(RedisCPUPanel.prototype, 'setState');

        const ref = createRef<RedisCPUPanel>();
        renderComponent({ ref, data, options });

        await act(async () => {
          await ref.current!.updateData();
        });
        expect(setStateMock).not.toHaveBeenCalled();

        mountSpy.mockRestore();
        setStateMock.mockRestore();
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

        const ref = createRef<RedisCPUPanel>();
        renderComponent({ ref, data, options });
        setImmediate(() => {
          expect(ref.current!.requestDataTimer).toBeDefined();
          act(() => {
            ref.current!.clearRequestDataInterval();
          });
          expect(ref.current!.requestDataTimer).not.toBeDefined();
          act(() => {
            ref.current!.clearRequestDataInterval();
          });
          expect(ref.current!.requestDataTimer).not.toBeDefined();
          done();
        });
      });
    });
  });

  /**
   * Rendering
   */
  describe('Rendering', () => {
    it('Should render graph', async () => {
      renderComponent({ options: { interval: 1000, maxItemsPerSeries: 1000 } });

      await waitFor(() => {
        const gathering = screen.queryByText('Gathering usage data...');
        const canvas = document.querySelector('canvas');
        expect(gathering || canvas).toBeTruthy();
      });
    });
  });

  afterAll(() => {
    jest.resetAllMocks();
  });
});
