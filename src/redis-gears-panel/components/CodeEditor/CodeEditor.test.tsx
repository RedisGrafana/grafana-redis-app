import { shallow } from 'enzyme';
import React from 'react';
import Editor from '@monaco-editor/react';
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
    const component = wrapper.find(Editor);
    expect(component.prop('width')).toEqual(100);
    expect(component.prop('height')).toEqual(200);
    expect(component.prop('value')).toEqual('hello');
    expect(component.prop('theme')).toEqual('vs-dark');
    expect(component.prop('onChange')).toEqual(onChange);
    expect(component.prop('options')).toEqual({
      wordWrap: 'off',
      codeLens: false,
      minimap: {
        enabled: undefined,
        renderCharacters: false,
      },
      readOnly: false,
      overviewRulerBorder: false,
      automaticLayout: true,
      glyphMargin: false,
      folding: false,
      lineNumbers: 'off',
      lineDecorationsWidth: 5,
      lineNumbersMinChars: 0,
    });
  });

  it('Should pass correct props when lineNumbers are shown', () => {
    const onChange = jest.fn();
    const value =
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.";
    const wrapper = shallow(
      <UnthemedCodeEditor
        width={100}
        height={200}
        value={value}
        onChange={onChange}
        theme={{ isDark: false } as any}
        language="python"
        showMiniMap
        showLineNumbers
      />
    );
    const component = wrapper.find(Editor);
    expect(component.prop('theme')).toEqual('vs-light');
    expect(component.prop('language')).toEqual('python');
    expect(component.prop('options')).toEqual({
      wordWrap: 'off',
      codeLens: false,
      minimap: {
        enabled: true,
        renderCharacters: false,
      },
      readOnly: false,
      overviewRulerBorder: false,
      automaticLayout: true,
      lineDecorationsWidth: 0,
      lineNumbersMinChars: 4,
    });
  });

  it('Should use correctly if value is undefined', () => {
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
    const component = wrapper.find(Editor);
    expect(component.prop('value')).toEqual('');
  });
});
