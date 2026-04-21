import '@testing-library/jest-dom';
import React, { createRef } from 'react';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Observable } from 'rxjs';
import { FieldType, LoadingState, toDataFrame } from '@grafana/data';
import { RedisGearsPanel } from './RedisGearsPanel';

/**
 * Data Source
 */
const dataSourceMock = {
  query: jest.fn().mockImplementation(
    () =>
      new Observable((subscriber) => {
        subscriber.next({
          data: 123,
        });
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
  toDataQueryError: jest.fn().mockImplementation(({ message }: any) => ({ message })),
  config: { theme2: {} },
}));

jest.mock('../CodeEditor', () => ({
  CodeEditor: function CodeEditor({ onChange, value, width, height }: any) {
    return (
      <div data-testid="code-editor" data-width={width} data-height={height} data-value={value}>
        <button type="button" onClick={() => onChange('myscript')}>
          apply-script
        </button>
      </div>
    );
  },
}));

jest.mock('@grafana/ui', () => {
  const React = require('react');
  const actual = jest.requireActual('@grafana/ui');
  return {
    ...actual,
    Table: function Table() {
      return React.createElement('div', { role: 'table', 'data-testid': 'result-table' });
    },
  };
});

/**
 * Default panel props so the panel can render in JSDOM (real shallow tests omitted these).
 */
const defaultPanelProps = {
  width: 800,
  height: 600,
  data: { request: { targets: [] } },
} as const;

/**
 * RedisGears Panel
 */
describe('RedisGearsPanel', () => {
  function renderComponent(overrides: { ref?: React.Ref<RedisGearsPanel>; [key: string]: any } = {}) {
    const { ref, ...props } = overrides;
    return render(<RedisGearsPanel ref={ref} {...(defaultPanelProps as any)} {...(props as any)} />);
  }

  beforeEach(() => {
    dataSourceSrvGetMock.mockClear();
    dataSourceMock.query.mockClear();
  });

  it('Should update script', async () => {
    renderComponent();
    fireEvent.click(screen.getByRole('button', { name: 'apply-script' }));
    await waitFor(() => {
      const codeEditor = screen.getByTestId('code-editor');
      expect(codeEditor).toHaveAttribute('data-value', 'myscript');
    });
  });

  it('Should update requirements', () => {
    renderComponent();
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'some' } });
    expect(input).toHaveValue('some');
  });

  it('Should update unblocking', async () => {
    renderComponent();
    fireEvent.click(screen.getByRole('radio', { name: 'Unblocking' }));
    await waitFor(() => {
      const unblockingRadio = screen.getByRole('radio', { name: 'Unblocking' });
      expect(unblockingRadio).toBeChecked();
    });
  });

  it('Should not update unblocking', async () => {
    renderComponent();
    fireEvent.click(screen.getByRole('radio', { name: 'Blocking' }));
    await waitFor(() => {
      const blockingRadio = screen.getByRole('radio', { name: 'Blocking' });
      expect(blockingRadio).toBeChecked();
    });
  });

  /**
   * Run script button
   */
  describe('Run script button', () => {
    function renderComponent(overrides: { ref?: React.Ref<RedisGearsPanel>; [key: string]: any } = {}) {
      const { ref, ...props } = overrides;
      return render(<RedisGearsPanel ref={ref} {...(defaultPanelProps as any)} {...(props as any)} />);
    }

    it('Should run script', () => {
      const ref = createRef<RedisGearsPanel>();
      renderComponent({ ref });
      const testedMethod = jest.spyOn(ref.current!, 'onRunScript').mockImplementation(() => Promise.resolve());
      act(() => {
        ref.current!.forceUpdate();
      });
      fireEvent.click(screen.getByRole('button', { name: 'Run script' }));
      expect(testedMethod).toHaveBeenCalled();
      testedMethod.mockRestore();
    });

    it('Should have alt view if isRunning=true', () => {
      const ref = createRef<RedisGearsPanel>();
      renderComponent({ ref });
      const runScriptButton = screen.getByRole('button', { name: 'Run script' });
      expect(runScriptButton).toBeEnabled();
      act(() => {
        ref.current!.setState({
          isRunning: true,
        });
      });
      const runningButton = screen.getByRole('button', { name: 'Running...' });
      expect(runningButton).toBeDisabled();
    });
  });

  /**
   * Result
   */
  describe('Result', () => {
    function renderComponent(overrides: { ref?: React.Ref<RedisGearsPanel>; [key: string]: any } = {}) {
      const { ref, ...props } = overrides;
      return render(<RedisGearsPanel ref={ref} {...(defaultPanelProps as any)} {...(props as any)} />);
    }

    it('if result is empty should not be rendered', () => {
      renderComponent();
      expect(screen.queryByRole('table')).not.toBeInTheDocument();
    });

    it('if result is filled should be rendered', () => {
      const ref = createRef<RedisGearsPanel>();
      renderComponent({ ref });
      act(() => {
        ref.current!.setState({
          result: toDataFrame({
            fields: [],
          }),
        });
      });
      const resultTable = screen.getByRole('table');
      expect(resultTable).toBeInTheDocument();
    });
  });

  /**
   * Error
   */
  describe('Error', () => {
    function renderComponent(overrides: { ref?: React.Ref<RedisGearsPanel>; [key: string]: any } = {}) {
      const { ref, ...props } = overrides;
      return render(<RedisGearsPanel ref={ref} {...(defaultPanelProps as any)} {...(props as any)} />);
    }

    it('Should show error if state.error is defined', () => {
      const ref = createRef<RedisGearsPanel>();
      renderComponent({ ref });
      expect(screen.queryByText('my message')).not.toBeInTheDocument();
      act(() => {
        ref.current!.setState({
          error: {
            message: 'my message',
          },
        });
      });
      const errorMessage = screen.getByText('my message');
      expect(errorMessage).toBeInTheDocument();
    });

    it('Should clear error', async () => {
      const ref = createRef<RedisGearsPanel>();
      renderComponent({ ref });
      act(() => {
        ref.current!.setState({
          error: {
            message: 'my message',
          },
        });
      });
      fireEvent.click(screen.getByRole('button', { name: 'Close alert' }));
      await waitFor(() => {
        expect(screen.queryByText('my message')).not.toBeInTheDocument();
      });
    });
  });

  /**
   * Calc footer height
   */
  describe('Calc footer height', () => {
    function renderComponent(overrides: { ref?: React.Ref<RedisGearsPanel>; [key: string]: any } = {}) {
      const { ref, ...props } = overrides;
      return render(<RedisGearsPanel ref={ref} {...(defaultPanelProps as any)} {...(props as any)} />);
    }

    it('Should be calculated on mount', async () => {
      const ref = createRef<RedisGearsPanel>();
      renderComponent({ ref });
      ref.current!.footerRef = {
        current: {
          getBoundingClientRect: () => ({
            height: 100,
          }),
        },
      } as any;
      ref.current!.componentDidMount();
      await waitFor(() => {
        expect(ref.current!.state.footerHeight).toEqual(100);
      });
    });

    it('Should be calculated when width was changed', async () => {
      const ref = createRef<RedisGearsPanel>();
      const rectSpy = jest.spyOn(Element.prototype, 'getBoundingClientRect').mockReturnValue({
        height: 200,
        width: 0,
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        x: 0,
        y: 0,
        toJSON: () => {},
      } as DOMRect);
      const { rerender } = renderComponent({ ref });
      rerender(<RedisGearsPanel ref={ref} {...(defaultPanelProps as any)} width={1000} />);
      await waitFor(() => {
        expect(ref.current!.state.footerHeight).toEqual(200);
      });
      rectSpy.mockRestore();
      ref.current!.footerRef = {
        current: null,
      } as any;
      act(() => {
        ref.current!.setState({
          footerHeight: 0,
        });
      });
      rerender(<RedisGearsPanel ref={ref} {...(defaultPanelProps as any)} width={2000} />);
      await waitFor(() => {
        expect(ref.current!.state.footerHeight).toEqual(0);
      });
    });
  });

  /**
   * makeQuery
   */
  describe('makeQuery', () => {
    function renderComponent(overrides: { ref?: React.Ref<RedisGearsPanel>; [key: string]: any } = {}) {
      const { ref, ...props } = overrides;
      return render(<RedisGearsPanel ref={ref} {...(defaultPanelProps as any)} {...(props as any)} />);
    }

    it('Should make correct query', async () => {
      const data = {
        request: {
          targets: [
            {
              datasource: 'Redis',
            },
          ],
        },
      };

      const ref = createRef<RedisGearsPanel>();
      const { rerender } = renderComponent({ ref, data });
      act(() => {
        ref.current!.setState({
          script: 'my-script',
          unblocking: true,
          requirements: 'requierements',
        });
      });

      await waitFor(() => expect(ref.current!.state.script).toEqual('my-script'));

      const result = await ref.current!.makeQuery();
      expect(dataSourceMock.query).toHaveBeenCalledWith({
        ...data.request,
        targets: [
          {
            ...data.request.targets[0],
            command: 'rg.pyexecute',
            keyName: ref.current!.state.script,
            unblocking: ref.current!.state.unblocking,
            requirements: ref.current!.state.requirements,
          },
        ],
      });
      expect(result).toEqual({
        data: 123,
      });

      dataSourceMock.query.mockClear();
      rerender(<RedisGearsPanel ref={ref} {...(defaultPanelProps as any)} data={{ request: null }} />);
      const result2 = await ref.current!.makeQuery();
      expect(result2).toEqual(null);
      expect(dataSourceMock.query).not.toHaveBeenCalled();
    });
  });

  /**
   * onRunScript
   */
  describe('onRunScript', () => {
    function renderComponent(overrides: { ref?: React.Ref<RedisGearsPanel>; [key: string]: any } = {}) {
      const { ref, ...props } = overrides;
      return render(<RedisGearsPanel ref={ref} {...(defaultPanelProps as any)} {...(props as any)} />);
    }

    let panelRef: React.RefObject<RedisGearsPanel>;
    let makeQueryMock: jest.SpyInstance;

    beforeEach(() => {
      panelRef = createRef<RedisGearsPanel>();
      renderComponent({ ref: panelRef });
      makeQueryMock = jest.spyOn(panelRef.current!, 'makeQuery').mockImplementation(() => Promise.resolve(null));
    });

    afterEach(() => {
      makeQueryMock.mockRestore();
    });

    it('Should set error if responseData contains error', async () => {
      makeQueryMock.mockImplementationOnce(() => Promise.resolve(null));
      await panelRef.current!.onRunScript();
      expect(makeQueryMock).toHaveBeenCalled();
      expect(panelRef.current!.state.result).not.toBeDefined();
      expect(panelRef.current!.state.isRunning).toBeFalsy();
      expect(panelRef.current!.state.error).toEqual({ message: 'Common error' });

      makeQueryMock.mockImplementationOnce(
        () =>
          ({
            state: LoadingState.Error,
            error: {
              message: 'error from datasource',
            },
          } as any)
      );
      await panelRef.current!.onRunScript();
      expect(makeQueryMock).toHaveBeenCalled();
      expect(panelRef.current!.state.result).not.toBeDefined();
      expect(panelRef.current!.state.isRunning).toBeFalsy();
      expect(panelRef.current!.state.error).toEqual({ message: 'error from datasource' });
    });

    it('Should set error if responseData.data[1].length > 0', async () => {
      makeQueryMock.mockImplementationOnce(() =>
        Promise.resolve({
          data: [
            null,
            toDataFrame({
              fields: [
                {
                  name: 'error',
                  type: FieldType.string,
                  values: ['Data error'],
                },
              ],
            }),
          ],
        })
      );

      await panelRef.current!.onRunScript();
      expect(makeQueryMock).toHaveBeenCalled();
      expect(panelRef.current!.state.result).not.toBeDefined();
      expect(panelRef.current!.state.isRunning).toBeFalsy();
      expect(panelRef.current!.state.error).toEqual({ message: 'Data error' });
    });

    it('Should set result if responseData.data[1].length === 0', async () => {
      const result = toDataFrame({
        fields: [
          {
            name: 'results',
            type: FieldType.string,
            values: ['123'],
          },
        ],
      });

      makeQueryMock.mockImplementationOnce(() =>
        Promise.resolve({
          data: [
            result,
            toDataFrame({
              fields: [
                {
                  name: 'error',
                  type: FieldType.string,
                  values: [],
                },
              ],
            }),
          ],
        })
      );

      await panelRef.current!.onRunScript();
      expect(makeQueryMock).toHaveBeenCalled();
      expect(panelRef.current!.state.result).toBeDefined();
      expect(panelRef.current!.state.isRunning).toBeFalsy();
      expect(panelRef.current!.state.error).toEqual(null);
      makeQueryMock.mockImplementationOnce(() =>
        Promise.resolve({
          data: [result],
        })
      );
      await panelRef.current!.onRunScript();
      expect(makeQueryMock).toHaveBeenCalled();
      expect(panelRef.current!.state.result).toBeDefined();
      expect(panelRef.current!.state.isRunning).toBeFalsy();
      expect(panelRef.current!.state.error).toEqual(null);
    });

    it('Should transform result if result.length=0', async () => {
      const result = toDataFrame({
        fields: [
          {
            name: 'results',
            type: FieldType.string,
            values: [],
          },
        ],
      });
      makeQueryMock.mockImplementationOnce(() =>
        Promise.resolve({
          data: [result],
        })
      );
      await panelRef.current!.onRunScript();
      expect(makeQueryMock).toHaveBeenCalled();
      expect(panelRef.current!.state.result?.length).toEqual(1);
      expect(panelRef.current!.state.result?.fields[0].values.toArray()).toEqual(['OK']);
      expect(panelRef.current!.state.isRunning).toBeFalsy();
      expect(panelRef.current!.state.error).toEqual(null);
    });
  });

  afterAll(() => {
    jest.resetAllMocks();
  });
});
