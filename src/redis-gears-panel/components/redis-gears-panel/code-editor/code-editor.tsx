import React, { PureComponent } from 'react';
import Editor from '@monaco-editor/react';
import { withTheme, Themeable } from '@grafana/ui';

interface Props {
  width: number;
  height: number;
  value?: string;
  onChange: (value?: string) => void;
  showMiniMap?: boolean;
  showLineNumbers?: boolean;
  language?: 'python';
  readOnly?: boolean;
}

export class UnthemedCodeEditor extends PureComponent<Props & Themeable, {}> {
  render() {
    const { width, height, theme, showMiniMap, showLineNumbers, language = 'python', onChange, readOnly } = this.props;

    const value = this.props.value ?? '';
    const longText = value.length > 100;

    const options: any = {
      wordWrap: 'off',
      codeLens: false, // not included in the bundle
      minimap: {
        enabled: longText && showMiniMap,
        renderCharacters: false,
      },
      readOnly: !!readOnly,
      lineNumbersMinChars: 4,
      lineDecorationsWidth: 0,
      overviewRulerBorder: false,
      automaticLayout: true,
    };
    if (!showLineNumbers) {
      options.glyphMargin = false;
      options.folding = false;
      options.lineNumbers = 'off';
      options.lineDecorationsWidth = 5; // left margin when not showing line numbers
      options.lineNumbersMinChars = 0;
    }

    return (
      <Editor
        width={width}
        height={height}
        theme={theme.isDark ? 'vs-dark' : 'vs-light'}
        onChange={onChange}
        language={language}
        options={options}
        value={value}
        loading="Loading..."
      />
    );
  }
}

export const CodeEditor = withTheme(UnthemedCodeEditor);
