import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { Observable } from 'rxjs';
import { PanelData, LoadingState } from '@grafana/data';
import { Button } from '@grafana/ui';
import { PanelOptions, Help } from '../types';
import { RedisCLIPanel } from './redis-cli-panel';
import AutoScrollingTextarea from './auto-scrolling-text-area';

interface OverrideOptions {
  height?: number;
  query?: string;
  output?: string;
  help?: any;
}

/*
 Options
 */
const getOptions = ({ help = {}, ...overrideOptions }: OverrideOptions = {}): PanelOptions => ({
  height: 0,
  query: '',
  output: 'hello',
  ...overrideOptions,
  help: {
    ...help,
  },
});

type ShallowComponent = ShallowWrapper<typeof RedisCLIPanel>;

const getDataSourceQueryResult = (values: string[]) => ({
  data: [
    {
      fields: [
        {
          values: {
            toArray() {
              return values;
            },
          },
        },
      ],
      length: 1,
    },
  ],
});

/*
 DataSource
 */
const dataSourceMock = {
  query: jest.fn().mockImplementation(
    () =>
      new Observable((subscriber) => {
        subscriber.next(getDataSourceQueryResult(['info']));
        subscriber.complete();
      })
  ),
  name: 'datasource',
};

const dataSourceSrvGetMock = jest.fn().mockImplementation(() => Promise.resolve(dataSourceMock));

jest.mock('@grafana/runtime', () => ({
  getDataSourceSrv: () => ({
    get: dataSourceSrvGetMock,
  }),
}));

/*
 RedisCLIPanel
 */
describe('RedisCLIPanel', () => {
  const width = 300;
  const height = 300;
  const data: PanelData = {
    state: LoadingState.Done,
    series: [],
    timeRange: {} as any,
  };
  const onOptionsChangeMock = jest.fn();
  const replaceVariablesMock = jest.fn().mockImplementation((value) => value);
  const options: PanelOptions = getOptions();
  const additionalProps = {} as any;

  beforeEach(() => {
    onOptionsChangeMock.mockClear();
    replaceVariablesMock.mockClear();
    dataSourceSrvGetMock.mockClear();
  });

  /*
   Rendering elements
   */
  describe('Rendering elements', () => {
    it('Should show AutoScrollingTextarea', () => {
      const wrapper = shallow(
        <RedisCLIPanel
          {...additionalProps}
          width={width}
          height={height}
          data={data}
          onOptionsChange={onOptionsChangeMock}
          replaceVariables={replaceVariablesMock}
          options={options}
        />
      );
      const testedComponent = wrapper.find(AutoScrollingTextarea);
      expect(testedComponent.exists()).toBeTruthy();
      expect(testedComponent.prop('value')).toEqual(options.output);
      expect(testedComponent.prop('rows')).toEqual(options.height);
    });

    /*
     Help
     */
    describe('Help', () => {
      const getHelpComponent = (wrapper: ShallowComponent) => {
        return wrapper.find('#help');
      };

      it('Should be shown if query and help are filled', () => {
        const options = getOptions({ query: '123', help: {} });
        const wrapper = shallow(
          <RedisCLIPanel
            {...additionalProps}
            width={width}
            height={height}
            data={data}
            onOptionsChange={onOptionsChangeMock}
            replaceVariables={replaceVariablesMock}
            options={options}
          />
        );
        const testedComponent = getHelpComponent(wrapper);
        expect(testedComponent.exists()).toBeTruthy();
      });

      it('Should not be shown if query or help are empty', () => {
        const options = getOptions({ query: '', help: null });
        const wrapper = shallow(
          <RedisCLIPanel
            {...additionalProps}
            width={width}
            height={height}
            data={data}
            onOptionsChange={onOptionsChangeMock}
            replaceVariables={replaceVariablesMock}
            options={options}
          />
        );
        const testedComponent = getHelpComponent(wrapper);
        expect(testedComponent.exists()).not.toBeTruthy();
      });

      it('Danger: Should be shown if the field is filled', () => {
        const value = 'hello';
        const options = getOptions({
          query: '123',
          help: {
            danger: value,
          },
        });
        const wrapper = shallow(
          <RedisCLIPanel
            {...additionalProps}
            width={width}
            height={height}
            data={data}
            onOptionsChange={onOptionsChangeMock}
            replaceVariables={replaceVariablesMock}
            options={options}
          />
        );
        const testedComponent = getHelpComponent(wrapper).find('#help-danger');
        expect(testedComponent.exists());
        expect(testedComponent.text()).toEqual(value);
      });

      it('Warning: Should be shown if the field is filled', () => {
        const value = 'hello';
        const options = getOptions({
          query: '123',
          help: {
            warning: value,
          },
        });
        const wrapper = shallow(
          <RedisCLIPanel
            {...additionalProps}
            width={width}
            height={height}
            data={data}
            onOptionsChange={onOptionsChangeMock}
            replaceVariables={replaceVariablesMock}
            options={options}
          />
        );
        const testedComponent = getHelpComponent(wrapper).find('#help-warning');
        expect(testedComponent.exists());
        expect(testedComponent.text()).toEqual(value);
      });

      it('Complexity: should be shown if the field is filled', () => {
        const value = 'hello';
        const options = getOptions({
          query: '123',
          help: {
            complexity: value,
          },
        });
        const wrapper = shallow(
          <RedisCLIPanel
            {...additionalProps}
            width={width}
            height={height}
            data={data}
            onOptionsChange={onOptionsChangeMock}
            replaceVariables={replaceVariablesMock}
            options={options}
          />
        );
        const testedComponent = getHelpComponent(wrapper).find('#help-complexity');
        expect(testedComponent.exists());
        expect(testedComponent.text().indexOf(value) >= 0).toBeTruthy();
      });

      it('Since: should be shown if the field is filled', () => {
        const value = 'hello';
        const options = getOptions({
          query: '123',
          help: {
            since: value,
          },
        });
        const wrapper = shallow(
          <RedisCLIPanel
            {...additionalProps}
            width={width}
            height={height}
            data={data}
            onOptionsChange={onOptionsChangeMock}
            replaceVariables={replaceVariablesMock}
            options={options}
          />
        );
        const testedComponent = getHelpComponent(wrapper).find('#help-since');
        expect(testedComponent.exists());
        expect(testedComponent.text().indexOf(value) >= 0).toBeTruthy();
      });

      it('Url: should be shown if the field is filled', () => {
        const value = 'hello';
        const options = getOptions({
          query: '123',
          help: {
            url: value,
          },
        });
        const wrapper = shallow(
          <RedisCLIPanel
            {...additionalProps}
            width={width}
            height={height}
            data={data}
            onOptionsChange={onOptionsChangeMock}
            replaceVariables={replaceVariablesMock}
            options={options}
          />
        );
        const testedComponent = getHelpComponent(wrapper).find('#help-url');
        expect(testedComponent.exists());
        expect(testedComponent.text().indexOf(value) >= 0).toBeTruthy();
      });
    });
  });

  /*
   Query
   */
  describe('Query', () => {
    const getTestedComponent = (wrapper: ShallowComponent) => {
      return wrapper.findWhere((node) => node.name() === 'input' && node.prop('name') === 'query');
    };

    it('Should set value from options', () => {
      const options = getOptions({
        query: '123',
      });
      const wrapper = shallow(
        <RedisCLIPanel
          {...additionalProps}
          width={width}
          height={height}
          data={data}
          onOptionsChange={onOptionsChangeMock}
          replaceVariables={replaceVariablesMock}
          options={options}
        />
      );
      const testedComponent = getTestedComponent(wrapper);
      expect(testedComponent.prop('value')).toEqual(options.query);
    });

    it('Should update query and help when value was changed', () => {
      const options = getOptions({
        query: '123',
      });
      const wrapper = shallow(
        <RedisCLIPanel
          {...additionalProps}
          width={width}
          height={height}
          data={data}
          onOptionsChange={onOptionsChangeMock}
          replaceVariables={replaceVariablesMock}
          options={options}
        />
      );
      const testedComponent = getTestedComponent(wrapper);
      const newValue = 'acl.load';
      testedComponent.simulate('change', { target: { value: newValue } });
      expect(onOptionsChangeMock).toHaveBeenCalledWith({
        ...options,
        query: newValue,
        help: Help['ACL LOAD'],
      });
      const newValue2 = 'acl';
      testedComponent.simulate('change', { target: { value: newValue2 } });
      expect(onOptionsChangeMock).toHaveBeenCalledWith({
        ...options,
        query: newValue2,
        help: Help['ACL'],
      });
    });

    it('Should not run query if any key was entered except enter', () => {
      const options = getOptions({
        query: 'ACL.LOAD',
      });
      const wrapper = shallow(
        <RedisCLIPanel
          {...additionalProps}
          width={width}
          height={height}
          data={data}
          onOptionsChange={onOptionsChangeMock}
          replaceVariables={replaceVariablesMock}
          options={options}
        />
      );
      const testedComponent = getTestedComponent(wrapper);
      testedComponent.simulate('keypress', { key: 'Esc' });
      expect(onOptionsChangeMock).not.toHaveBeenCalled();
    });

    it('Should run query when Enter key was entered', () => {
      const options = getOptions({
        query: 'ACL.LOAD',
      });
      const wrapper = shallow(
        <RedisCLIPanel
          {...additionalProps}
          width={width}
          height={height}
          data={data}
          onOptionsChange={onOptionsChangeMock}
          replaceVariables={replaceVariablesMock}
          options={options}
        />
      );
      const testedComponent = getTestedComponent(wrapper);
      testedComponent.simulate('keypress', { key: 'Enter' });
      expect(onOptionsChangeMock).toHaveBeenCalledWith({
        ...options,
        output: 'Unknown Data Source',
      });
    });

    it('Should run query and process it when Enter key was entered', (done) => {
      const options = getOptions({
        query: 'ACL.LOAD',
        output: 'custom-output',
      });
      const overrideData = {
        ...data,
        request: { targets: [{ datasource: 'datasource/id' }] },
      };
      const wrapper = shallow(
        <RedisCLIPanel
          {...additionalProps}
          width={width}
          height={height}
          data={overrideData}
          onOptionsChange={onOptionsChangeMock}
          replaceVariables={replaceVariablesMock}
          options={options}
        />
      );
      const testedComponent = getTestedComponent(wrapper);
      testedComponent.simulate('keypress', { key: 'Enter' });
      setImmediate(() => {
        expect(onOptionsChangeMock).toHaveBeenCalledWith({
          ...options,
          output: `${options.output}\n${dataSourceMock.name}> ${options.query}\ninfo`,
          query: '',
        });
        done();
      });
    });

    it('Run query when output is empty', (done) => {
      const options = getOptions({
        query: 'ACL.LOAD',
        output: '',
      });
      const overrideData = {
        ...data,
        request: { targets: [{ datasource: 'datasource/id' }] },
      };
      const wrapper = shallow(
        <RedisCLIPanel
          {...additionalProps}
          width={width}
          height={height}
          data={overrideData}
          onOptionsChange={onOptionsChangeMock}
          replaceVariables={replaceVariablesMock}
          options={options}
        />
      );
      const testedComponent = getTestedComponent(wrapper);
      testedComponent.simulate('keypress', { key: 'Enter' });
      setImmediate(() => {
        expect(onOptionsChangeMock).toHaveBeenCalledWith({
          ...options,
          output: `${dataSourceMock.name}> ${options.query}\ninfo`,
          query: '',
        });
        done();
      });
    });

    it('Run query when datasource is empty', (done) => {
      dataSourceMock.query.mockImplementationOnce(
        () =>
          new Observable((subscriber) => {
            subscriber.next(getDataSourceQueryResult([]));
            subscriber.complete();
          })
      );
      const options = getOptions({
        query: 'ACL.LOAD',
        output: '',
      });
      const overrideData = {
        ...data,
        request: { targets: [{ datasource: 'datasource/id' }] },
      };
      const wrapper = shallow(
        <RedisCLIPanel
          {...additionalProps}
          width={width}
          height={height}
          data={overrideData}
          onOptionsChange={onOptionsChangeMock}
          replaceVariables={replaceVariablesMock}
          options={options}
        />
      );
      const testedComponent = getTestedComponent(wrapper);
      testedComponent.simulate('keypress', { key: 'Enter' });
      setImmediate(() => {
        expect(onOptionsChangeMock).toHaveBeenCalledWith({
          ...options,
          output: `${dataSourceMock.name}> ${options.query}\nERROR`,
          query: '',
        });
        done();
      });
    });
  });

  it('Clear button should clean output', () => {
    const options = getOptions({
      output: 'custom-output',
    });
    const wrapper = shallow(
      <RedisCLIPanel
        {...additionalProps}
        width={width}
        height={height}
        data={data}
        onOptionsChange={onOptionsChangeMock}
        replaceVariables={replaceVariablesMock}
        options={options}
      />
    );
    const testedComponent = wrapper.find(Button);
    testedComponent.simulate('click');
    expect(onOptionsChangeMock).toHaveBeenCalledWith({
      ...options,
      output: '',
    });
  });

  afterAll(() => {
    jest.resetAllMocks();
  });
});
