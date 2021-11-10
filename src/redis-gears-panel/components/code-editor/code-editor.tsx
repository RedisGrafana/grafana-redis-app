import React, { PureComponent } from 'react';
import { Themeable2, withTheme2 } from '@grafana/ui';
import Editor from '@monaco-editor/react';

/**
 * Properties
 */
interface Props {
  /**
   * Width
   *
   * @type {number}
   */
  width: number;

  /**
   * Height
   *
   * @type {number}
   */
  height: number;

  /**
   * Value
   *
   * @type {string}
   */
  value?: string;

  /**
   * Show Mini map
   *
   * @type {boolean}
   */
  showMiniMap?: boolean;

  /**
   * Show Line numbers
   *
   * @type {boolean}
   */
  showLineNumbers?: boolean;

  /**
   * Language
   *
   * @type {string}
   */
  language?: string;

  /**
   * Read-only
   *
   * @type {boolean}
   */
  readOnly?: boolean;

  /**
   * On Change
   */
  onChange: (value?: string) => void;
}

/**
 * Unthemed Code Editor
 *
 * @see https://github.com/suren-atoyan/monaco-react
 */
export class UnthemedCodeEditor extends PureComponent<Props & Themeable2, {}> {
  render() {
    const { width, height, theme, showMiniMap, showLineNumbers, language = 'python', onChange, readOnly } = this.props;

    /**
     * Options similar to Grafana
     */
    const options: any = {
      wordWrap: 'off',
      codeLens: false, // not included in the bundle
      minimap: {
        enabled: showMiniMap,
        renderCharacters: false,
      },
      readOnly: !!readOnly,
      lineNumbersMinChars: 4,
      lineDecorationsWidth: 0,
      overviewRulerBorder: false,
      automaticLayout: true,
    };

    /**
     * Line numbers similar to Grafana
     */
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
        value={this.props.value ?? ''}
      />
    );
  }
}

export const CodeEditor = withTheme2(UnthemedCodeEditor);
