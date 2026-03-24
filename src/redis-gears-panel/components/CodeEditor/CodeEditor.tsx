import React, { PureComponent } from 'react';
import { Themeable2, withTheme2, CodeEditor as GrafanaCodeEditor } from '@grafana/ui';

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
 * @see https://grafana.com/developers/plugin-tools
 */
export class UnthemedCodeEditor extends PureComponent<Props & Themeable2, {}> {
  render() {
    const { width, height, showMiniMap, showLineNumbers, language = 'python', onChange, readOnly } = this.props;

    return (
      <GrafanaCodeEditor
        width={width}
        height={height}
        language={language}
        value={this.props.value ?? ''}
        readOnly={readOnly}
        showMiniMap={showMiniMap}
        showLineNumbers={showLineNumbers}
        onBlur={onChange}
      />
    );
  }
}

export const CodeEditor = withTheme2(UnthemedCodeEditor);
