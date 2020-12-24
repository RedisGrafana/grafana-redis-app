import React from 'react';
import { shallow, mount } from 'enzyme';
import { TextArea } from '@grafana/ui';
import AutoScrollingTextArea from './auto-scrolling-text-area';

/*
 AutoScrollingTextArea
 */
describe('AutoScrollingTextArea', () => {
  it('Should set scrollTop if autoScroll=true', () => {
    const wrapper = shallow<AutoScrollingTextArea>(<AutoScrollingTextArea value="123" autoScroll />);
    jest.spyOn(wrapper.instance(), 'render');
    const element = {
      scrollHeight: 20,
      scrollTop: 0,
    };
    wrapper.instance().element = element as any;
    wrapper.instance().componentDidMount();
    expect(element.scrollTop).toEqual(element.scrollHeight);
    element.scrollHeight = 100;
    expect(element.scrollTop).not.toEqual(element.scrollHeight);
    wrapper.setProps({ value: '1234' });
    expect(element.scrollTop).toEqual(element.scrollHeight);
    element.scrollHeight = 200;
    wrapper.setProps({ rows: 1 });
    expect(element.scrollTop).not.toEqual(element.scrollHeight);
  });

  it('Should pass props to Textarea', () => {
    const onChangeMock = jest.fn();
    const value = '1234';
    const wrapper = shallow(<AutoScrollingTextArea value={value} onChange={onChangeMock} />);
    const testedComponent = wrapper.find(TextArea);
    expect(testedComponent.exists()).toBeTruthy();
    expect(testedComponent.prop('value')).toEqual(value);
    expect(testedComponent.prop('onChange')).toEqual(onChangeMock);
  });

  it('Should set ref', () => {
    const wrapper = mount<AutoScrollingTextArea>(<AutoScrollingTextArea />);
    expect(wrapper.instance().element).toBeTruthy();
  });
});
