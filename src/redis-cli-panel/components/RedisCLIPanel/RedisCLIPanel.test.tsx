import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import React from 'react';
import { Simulate } from 'react-dom/test-utils';
import { Observable } from 'rxjs';
import { LoadingState, PanelData } from '@grafana/data';
import { Help, ResponseMode } from '../../constants';
import { PanelOptions } from '../../types';
import { RedisCLIPanel } from './RedisCLIPanel';

/**
 * Use React TestUtils Simulate so `onKeyPress` receives a proper synthetic event with `key` (React 17 + jsdom).
 */
function fireKeyPressEnter(element: HTMLElement) {
  Simulate.keyPress(element, { key: 'Enter', charCode: 13 });
}

/**
 * Override
 */
interface OverrideOptions {
  height?: number;
  query?: string;
  output?: string;
  help?: any;
}

/*
 Options
 */
const getOptions = ({ help = {}, ...overrideOptions }: OverrideOptions = {}): PanelOptions => ({
  height: 0,
  query: '',
  output: 'hello',
  ...overrideOptions,
  help: {
    ...help,
  },
});

/**
 * Query result
 *
 * @param values
 */
const getDataSourceQueryResult = (values: string[]) => ({
  data: [
    {
      fields: [
        {
          values: {
            toArray() {
              return values;
            },
          },
        },
      ],
      length: 1,
    },
  ],
});

/**
 * DataSource
 */
const dataSourceMock = {
  query: jest.fn().mockImplementation(
    () =>
      new Observable((subscriber) => {
        subscriber.next(getDataSourceQueryResult(['info']));
        subscriber.complete();
      })
  ),
  name: 'datasource',
};
const dataSourceInstanceSettingsMock = {
  jsonData: { cliDisabled: false },
};

const dataSourceSrvGetMock = jest.fn().mockImplementation(() => Promise.resolve(dataSourceMock));
const dataSourceSrvGetInstanceSettingsMock = jest.fn().mockImplementation(() => dataSourceInstanceSettingsMock);

jest.mock('@grafana/runtime', () => ({
  getDataSourceSrv: () => ({
    get: dataSourceSrvGetMock,
    getInstanceSettings: dataSourceSrvGetInstanceSettingsMock,
  }),
}));

interface RedisCLIPanelRenderOverrides {
  width?: number;
  height?: number;
  data?: PanelData;
  options?: PanelOptions;
  onOptionsChange?: jest.Mock;
  replaceVariables?: jest.Mock;
}

/**
 * Redis CLI Panel
 */
describe('RedisCLIPanel', () => {
  const width = 300;
  const height = 300;
  const data: PanelData = {
    state: LoadingState.Done,
    series: [],
    timeRange: {} as any,
  };
  const onOptionsChangeMock = jest.fn();
  const replaceVariablesMock = jest.fn().mockImplementation((value) => value);
  const options: PanelOptions = getOptions();
  const additionalProps = {} as any;

  const getCommandInput = () => screen.getByPlaceholderText('PING') as HTMLInputElement;

  beforeEach(() => {
    onOptionsChangeMock.mockClear();
    replaceVariablesMock.mockClear();
    dataSourceSrvGetMock.mockClear();
    dataSourceInstanceSettingsMock.jsonData = { cliDisabled: false };
  });

  function buildRedisCLIPanelProps(overrides: RedisCLIPanelRenderOverrides = {}) {
    return {
      ...additionalProps,
      width: overrides.width ?? width,
      height: overrides.height ?? height,
      data: overrides.data ?? data,
      onOptionsChange: overrides.onOptionsChange ?? onOptionsChangeMock,
      replaceVariables: overrides.replaceVariables ?? replaceVariablesMock,
      options: overrides.options ?? options,
    };
  }

  function renderComponent(overrides: RedisCLIPanelRenderOverrides = {}) {
    return render(<RedisCLIPanel {...buildRedisCLIPanelProps(overrides)} />);
  }

  /**
   * Rendering elements
   */
  describe('Rendering elements', () => {
    function renderComponent(overrides: RedisCLIPanelRenderOverrides = {}) {
      return render(<RedisCLIPanel {...buildRedisCLIPanelProps(overrides)} />);
    }

    it('Should show AutoScrollingTextarea', () => {
      renderComponent();
      const textarea = document.querySelector('textarea');
      expect(textarea).toBeInTheDocument();
      expect(textarea).toHaveValue(options.output);
    });

    /**
     * Help
     */
    describe('Help', () => {
      function renderComponent(overrides: RedisCLIPanelRenderOverrides = {}) {
        return render(<RedisCLIPanel {...buildRedisCLIPanelProps(overrides)} />);
      }

      const getHelpSection = () => document.querySelector('#help');

      it('Should be shown if query and help are filled', () => {
        const options = getOptions({ query: '123', help: {} });
        renderComponent({ options });
        const helpSection = getHelpSection();
        expect(helpSection).toBeInTheDocument();
      });

      it('Should not be shown if query or help are empty', () => {
        const options = getOptions({ query: '', help: null });
        renderComponent({ options });
        const helpSection = getHelpSection();
        expect(helpSection).not.toBeInTheDocument();
      });

      it('Danger: Should be shown if the field is filled', () => {
        const value = 'hello';
        const options = getOptions({
          query: '123',
          help: {
            danger: value,
          },
        });
        renderComponent({ options });
        const helpSection = getHelpSection() as HTMLElement;
        expect(helpSection).toBeInTheDocument();
        const danger = helpSection.querySelector('#help-danger');
        expect(danger).toBeInTheDocument();
        expect(danger).toHaveTextContent(value);
      });

      it('Warning: Should be shown if the field is filled', () => {
        const value = 'hello';
        const options = getOptions({
          query: '123',
          help: {
            warning: value,
          },
        });
        renderComponent({ options });
        const helpSection = getHelpSection() as HTMLElement;
        expect(helpSection).toBeInTheDocument();
        const warning = helpSection.querySelector('#help-warning');
        expect(warning).toBeInTheDocument();
        expect(warning).toHaveTextContent(value);
      });

      it('Complexity: should be shown if the field is filled', () => {
        const value = 'hello';
        const options = getOptions({
          query: '123',
          help: {
            complexity: value,
          },
        });
        renderComponent({ options });
        const helpSection = getHelpSection() as HTMLElement;
        expect(helpSection).toBeInTheDocument();
        const complexity = helpSection.querySelector('#help-complexity');
        expect(complexity).toBeInTheDocument();
        expect((complexity?.textContent?.indexOf(value) ?? -1) >= 0).toBeTruthy();
      });

      it('Since: should be shown if the field is filled', () => {
        const value = 'hello';
        const options = getOptions({
          query: '123',
          help: {
            since: value,
          },
        });
        renderComponent({ options });
        const helpSection = getHelpSection() as HTMLElement;
        expect(helpSection).toBeInTheDocument();
        const since = helpSection.querySelector('#help-since');
        expect(since).toBeInTheDocument();
        expect((since?.textContent?.indexOf(value) ?? -1) >= 0).toBeTruthy();
      });

      it('Url: should be shown if the field is filled', () => {
        const value = 'hello';
        const options = getOptions({
          query: '123',
          help: {
            url: value,
          },
        });
        renderComponent({ options });
        const helpSection = getHelpSection() as HTMLElement;
        expect(helpSection).toBeInTheDocument();
        const urlBlock = helpSection.querySelector('#help-url');
        expect(urlBlock).toBeInTheDocument();
        expect((urlBlock?.textContent?.indexOf(value) ?? -1) >= 0).toBeTruthy();
      });
    });
  });

  /**
   * Query
   */
  describe('Query', () => {
    function renderComponent(overrides: RedisCLIPanelRenderOverrides = {}) {
      return render(<RedisCLIPanel {...buildRedisCLIPanelProps(overrides)} />);
    }

    it('Should set value from options', () => {
      const options = getOptions({
        query: '123',
      });
      renderComponent({ options });
      expect(getCommandInput()).toHaveValue(options.query);
    });

    it('Should update query and help when value was changed', () => {
      const options = getOptions({
        query: '123',
      });
      renderComponent({ options });
      const input = getCommandInput();
      const newValue = 'acl.load';
      fireEvent.change(input, { target: { value: newValue } });
      expect(onOptionsChangeMock).toHaveBeenCalledWith({
        ...options,
        query: newValue,
        help: Help['ACL LOAD'],
      });
      onOptionsChangeMock.mockClear();
      const newValue2 = 'acl';
      fireEvent.change(input, { target: { value: newValue2 } });
      expect(onOptionsChangeMock).toHaveBeenCalledWith({
        ...options,
        query: newValue2,
        help: Help['ACL'],
      });
    });

    it('Should not run query if any key was entered except enter', () => {
      const options = getOptions({
        query: 'ACL.LOAD',
      });
      renderComponent({ options });
      const input = getCommandInput();
      fireEvent.keyPress(input, { key: 'Esc' });
      expect(onOptionsChangeMock).not.toHaveBeenCalled();
    });

    it('Should run query when Enter key was entered', () => {
      const options = getOptions({
        query: 'ACL.LOAD',
      });
      renderComponent({ options });
      const input = getCommandInput();
      fireKeyPressEnter(input);
      expect(onOptionsChangeMock).toHaveBeenCalledWith({
        ...options,
        output: 'Unknown Data Source',
      });
    });

    it('Should run query and process it when Enter key was entered', async () => {
      const options = getOptions({
        query: 'ACL.LOAD',
        output: 'custom-output',
      });
      const overrideData = {
        ...data,
        request: { targets: [{ datasource: 'datasource/id' }] },
      };
      renderComponent({ data: overrideData, options });
      const input = getCommandInput();
      fireKeyPressEnter(input);
      await waitFor(() => {
        expect(onOptionsChangeMock).toHaveBeenCalledWith({
          ...options,
          output: `${options.output}\n${dataSourceMock.name}> ${options.query}\ninfo`,
          query: '',
        });
      });
    });

    it('Run query when output is empty', async () => {
      const options = getOptions({
        query: 'ACL.LOAD',
        output: '',
      });
      const overrideData = {
        ...data,
        request: { targets: [{ datasource: 'datasource/id' }] },
      };
      renderComponent({ data: overrideData, options });
      const input = getCommandInput();
      fireKeyPressEnter(input);
      await waitFor(() => {
        expect(onOptionsChangeMock).toHaveBeenCalledWith({
          ...options,
          output: `${dataSourceMock.name}> ${options.query}\ninfo`,
          query: '',
        });
      });
    });

    it('Run query when datasource is empty', async () => {
      dataSourceMock.query.mockImplementationOnce(
        () =>
          new Observable((subscriber) => {
            subscriber.next(getDataSourceQueryResult([]));
            subscriber.complete();
          })
      );
      const options = getOptions({
        query: 'ACL.LOAD',
        output: '',
      });
      const overrideData = {
        ...data,
        request: { targets: [{ datasource: 'datasource/id' }] },
      };
      renderComponent({ data: overrideData, options });
      const input = getCommandInput();
      fireKeyPressEnter(input);
      await waitFor(() => {
        expect(onOptionsChangeMock).toHaveBeenCalledWith({
          ...options,
          output: `${dataSourceMock.name}> ${options.query}\nERROR`,
          query: '',
        });
      });
    });

    it('Run query with error received', async () => {
      const getDataSourceQueryError = () => ({
        error: {
          message: 'Error',
        },
        data: [],
      });

      dataSourceMock.query.mockImplementationOnce(
        () =>
          new Observable((subscriber) => {
            subscriber.next(getDataSourceQueryError());
            subscriber.complete();
          })
      );

      const options = getOptions({
        query: 'WRONG COMMAND',
        output: '',
      });
      const overrideData = {
        ...data,
        request: { targets: [{ datasource: 'datasource/id' }] },
      };

      renderComponent({ data: overrideData, options });

      const input = getCommandInput();
      fireKeyPressEnter(input);
      await waitFor(() => {
        expect(onOptionsChangeMock).toHaveBeenCalled();
      });
    });
  });

  it('Clear button should clean output', () => {
    const options = getOptions({
      output: 'custom-output',
    });
    renderComponent({ options });
    const clearButton = screen.getByRole('button', { name: 'Clear' });
    fireEvent.click(clearButton);
    expect(onOptionsChangeMock).toHaveBeenCalledWith({
      ...options,
      output: '',
    });
  });

  describe('Options', () => {
    function renderComponent(overrides: RedisCLIPanelRenderOverrides = {}) {
      return render(<RedisCLIPanel {...buildRedisCLIPanelProps(overrides)} />);
    }

    /**
     * Response Mode
     */
    describe('ResponseMode', () => {
      function renderComponent(overrides: RedisCLIPanelRenderOverrides = {}) {
        return render(<RedisCLIPanel {...buildRedisCLIPanelProps(overrides)} />);
      }

      it('Should apply options value and change', () => {
        let options = {} as PanelOptions;
        const { rerender } = renderComponent({ options });
        const cliRadio = screen.getByRole('radio', { name: 'CLI' });
        expect(cliRadio).toBeChecked();

        const radioGroup = cliRadio.parentElement as HTMLDivElement;
        expect(radioGroup).toBeTruthy();
        fireEvent.change(radioGroup);
        expect(onOptionsChangeMock).not.toHaveBeenCalled();

        const inGroup = within(radioGroup);
        fireEvent.click(inGroup.getByText('Raw', { selector: 'label' }));
        expect(onOptionsChangeMock).toHaveBeenCalledWith({
          ...options,
          raw: true,
        });

        options = { ...options, raw: true };
        rerender(<RedisCLIPanel {...buildRedisCLIPanelProps({ options })} />);

        onOptionsChangeMock.mockClear();
        const rawRadio = screen.getByRole('radio', { name: 'Raw' });
        const inGroupAfter = within(rawRadio.parentElement as HTMLElement);
        fireEvent.click(inGroupAfter.getByText('CLI', { selector: 'label' }));
        expect(onOptionsChangeMock).toHaveBeenCalledWith({
          ...options,
          raw: false,
        });
      });
    });
  });

  it('If CLI disabled should not display buttons', () => {
    const options = getOptions({
      output: 'custom-output',
    });
    const overrideData = {
      ...data,
      request: { targets: [{ datasource: 'datasource/id' }] },
    };

    dataSourceInstanceSettingsMock.jsonData.cliDisabled = true;
    renderComponent({ data: overrideData, options });
    expect(screen.queryByRole('button', { name: 'Clear' })).not.toBeInTheDocument();
  });

  afterAll(() => {
    jest.resetAllMocks();
  });
});
