import '@testing-library/jest-dom';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { CodeEditor as GrafanaCodeEditor } from '@grafana/ui';
import { UnthemedCodeEditor } from './CodeEditor';

jest.mock('@grafana/ui', () => {
  const actual = jest.requireActual('@grafana/ui');
  return {
    ...actual,
    CodeEditor: jest.fn((props: any) => <div data-testid="grafana-code-editor" />),
  };
});

const mockedGrafanaCodeEditor = GrafanaCodeEditor as jest.MockedFunction<typeof GrafanaCodeEditor>;

/**
 * Unthemed Code Editor
 */
describe('UnthemedCodeEditor', () => {
  function renderComponent(overrides: Partial<React.ComponentProps<typeof UnthemedCodeEditor>> = {}) {
    return render(
      <UnthemedCodeEditor
        width={100}
        height={200}
        value="hello"
        onChange={jest.fn()}
        theme={{ isDark: true } as any}
        {...overrides}
      />
    );
  }

  beforeEach(() => {
    mockedGrafanaCodeEditor.mockClear();
  });

  it('Should pass correct props', () => {
    const onChange = jest.fn();
    renderComponent({ onChange, theme: { isDark: true } as any });
    const grafanaCodeEditor = screen.getByTestId('grafana-code-editor');
    expect(grafanaCodeEditor).toBeInTheDocument();
    expect(mockedGrafanaCodeEditor.mock.calls[0][0]).toEqual(
      expect.objectContaining({
        width: 100,
        height: 200,
        value: 'hello',
        language: 'python',
        onBlur: onChange,
      })
    );
  });

  it('Should pass correct props when lineNumbers and miniMap are shown', () => {
    const onChange = jest.fn();
    renderComponent({
      onChange,
      theme: { isDark: false } as any,
      language: 'python',
      showMiniMap: true,
      showLineNumbers: true,
    });
    const grafanaCodeEditor = screen.getByTestId('grafana-code-editor');
    expect(grafanaCodeEditor).toBeInTheDocument();
    expect(mockedGrafanaCodeEditor.mock.calls[0][0]).toEqual(
      expect.objectContaining({
        language: 'python',
        showMiniMap: true,
        showLineNumbers: true,
      })
    );
  });

  it('Should use empty string if value is undefined', () => {
    const onChange = jest.fn();
    renderComponent({
      onChange,
      value: undefined,
      theme: { isDark: false } as any,
      language: 'python',
      showMiniMap: true,
      showLineNumbers: true,
    });
    const grafanaCodeEditor = screen.getByTestId('grafana-code-editor');
    expect(grafanaCodeEditor).toBeInTheDocument();
    expect(mockedGrafanaCodeEditor.mock.calls[0][0]).toEqual(expect.objectContaining({ value: '' }));
  });
});
