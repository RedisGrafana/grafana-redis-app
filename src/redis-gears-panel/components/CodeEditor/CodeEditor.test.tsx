import { shallow } from 'enzyme';
import React from 'react';
import { CodeEditor as GrafanaCodeEditor } from '@grafana/ui';
import { UnthemedCodeEditor } from './CodeEditor';

/**
 * Unthemed Code Editor
 */
describe('UnthemedCodeEditor', () => {
  it('Should pass correct props', () => {
    const onChange = jest.fn();
    const wrapper = shallow(
      <UnthemedCodeEditor width={100} height={200} value="hello" onChange={onChange} theme={{ isDark: true } as any} />
    );
    const component = wrapper.find(GrafanaCodeEditor);
    expect(component.prop('width')).toEqual(100);
    expect(component.prop('height')).toEqual(200);
    expect(component.prop('value')).toEqual('hello');
    expect(component.prop('language')).toEqual('python');
    expect(component.prop('onBlur')).toEqual(onChange);
  });

  it('Should pass correct props when lineNumbers and miniMap are shown', () => {
    const onChange = jest.fn();
    const wrapper = shallow(
      <UnthemedCodeEditor
        width={100}
        height={200}
        value="hello"
        onChange={onChange}
        theme={{ isDark: false } as any}
        language="python"
        showMiniMap
        showLineNumbers
      />
    );
    const component = wrapper.find(GrafanaCodeEditor);
    expect(component.prop('language')).toEqual('python');
    expect(component.prop('showMiniMap')).toEqual(true);
    expect(component.prop('showLineNumbers')).toEqual(true);
  });

  it('Should use empty string if value is undefined', () => {
    const onChange = jest.fn();
    const wrapper = shallow(
      <UnthemedCodeEditor
        width={100}
        height={200}
        value={undefined}
        onChange={onChange}
        theme={{ isDark: false } as any}
        language="python"
        showMiniMap
        showLineNumbers
      />
    );
    const component = wrapper.find(GrafanaCodeEditor);
    expect(component.prop('value')).toEqual('');
  });
});
