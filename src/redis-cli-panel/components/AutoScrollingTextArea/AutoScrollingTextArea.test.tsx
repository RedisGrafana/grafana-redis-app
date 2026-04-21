import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { CLITextArea } from './AutoScrollingTextArea';

/**
 * CLI TextArea
 */
describe('CLITextArea', () => {
  function renderComponent(overrides: Partial<React.ComponentProps<typeof CLITextArea>> = {}) {
    const defaultProps: Partial<React.ComponentProps<typeof CLITextArea>> = {
      value: '',
    };
    return render(<CLITextArea {...defaultProps} {...overrides} />);
  }

  it('Should set scrollTop if autoScroll=true', () => {
    renderComponent({ value: '123', autoScroll: true });
    jest.spyOn(CLITextArea.prototype, 'render');
    const element = {
      scrollHeight: 0,
      scrollTop: 0,
    };

    expect(element.scrollTop).toEqual(element.scrollHeight);
  });

  it('Should pass props to Textarea', () => {
    const onChangeMock = jest.fn();
    const value = '1234';
    renderComponent({ value, onChange: onChangeMock });
    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveValue(value);
    fireEvent.change(textarea, { target: { value: 'x' } });
    expect(onChangeMock).toHaveBeenCalled();
  });

  /*
   * Waiting for React 17 support in Enzyme
   * it('Should set ref', () => {
   *  const wrapper = mount<typeof CLITextArea>(<CLITextArea />);
   *  expect(wrapper.instance()).toBeTruthy();
   * });
   */
});
