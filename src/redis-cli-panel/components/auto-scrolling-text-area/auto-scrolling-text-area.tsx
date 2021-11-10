import React from 'react';
import { TextArea } from '@grafana/ui';

/**
 * Properties
 */
type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

/**
 * Auto scrolling text area
 */
export class AutoScrollingTextArea extends React.Component<TextareaProps & { autoScroll?: boolean }, {}> {
  element: HTMLTextAreaElement | null | undefined;

  /**
   * Mount
   */
  componentDidMount() {
    if (this.element && this.props.autoScroll !== false) {
      this.element.scrollTop = this.element.scrollHeight;
    }
  }

  /**
   * Update
   *
   * @param prevProps {TextareaProps}
   * @param prevState
   */
  componentDidUpdate(prevProps: TextareaProps, prevState: {}) {
    if (prevProps.value !== this.props.value && this.element && this.props.autoScroll !== false) {
      this.element.scrollTop = this.element.scrollHeight;
    }
  }

  /**
   * Render
   */
  render() {
    return <TextArea {...this.props} ref={(element) => (this.element = element)} />;
  }
}

export const CLITextArea = AutoScrollingTextArea;
