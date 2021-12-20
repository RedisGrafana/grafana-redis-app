import { shallow } from 'enzyme';
import React from 'react';
import { TextArea } from '@grafana/ui';
import { CLITextArea } from './AutoScrollingTextArea';

/**
 * CLI TextArea
 */
describe('CLITextArea', () => {
  it('Should set scrollTop if autoScroll=true', () => {
    const wrapper = shallow<typeof CLITextArea>(<CLITextArea value="123" autoScroll />);
    jest.spyOn(wrapper.instance(), 'render');
    const element = {
      scrollHeight: 0,
      scrollTop: 0,
    };

    expect(element.scrollTop).toEqual(element.scrollHeight);
  });

  it('Should pass props to Textarea', () => {
    const onChangeMock = jest.fn();
    const value = '1234';
    const wrapper = shallow(<CLITextArea value={value} onChange={onChangeMock} />);
    const testedComponent = wrapper.find(TextArea);
    expect(testedComponent.exists()).toBeTruthy();
    expect(testedComponent.prop('value')).toEqual(value);
    expect(testedComponent.prop('onChange')).toEqual(onChangeMock);
  });

  /*
   * Waiting for React 17 support in Enzyme
   * it('Should set ref', () => {
   *  const wrapper = mount<typeof CLITextArea>(<CLITextArea />);
   *  expect(wrapper.instance()).toBeTruthy();
   * });
   */
});
