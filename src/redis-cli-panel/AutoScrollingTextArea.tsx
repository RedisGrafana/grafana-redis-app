import React from 'react';
import { TextArea } from '@grafana/ui';

/**
 * Properties
 */
type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

/**
 * Auto scrolling Textarea
 */
export default class AutoScrollingTextArea extends React.Component<TextareaProps & { autoScroll?: boolean }, {}> {
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
    return <TextArea {...this.props} css="" ref={(element) => (this.element = element)} />;
  }
}
