import { shallow } from 'enzyme';
import React from 'react';
import { Observable } from 'rxjs';
import { FieldType, LoadingState, toDataFrame } from '@grafana/data';
import { Alert, Button, Input, RadioButtonGroup, Table } from '@grafana/ui';
import { ExecutionMode } from '../../constants';
import { CodeEditor } from '../CodeEditor';
import { RedisGearsPanel } from './RedisGearsPanel';

/**
 * Get Component
 *
 * @param props
 */
const getComponent = ({ ...props } = {}) => <RedisGearsPanel {...(props as any)} />;

/**
 * Data Source
 */
const dataSourceMock = {
  query: jest.fn().mockImplementation(
    () =>
      new Observable((subscriber) => {
        subscriber.next({
          data: 123,
        });
        subscriber.complete();
      })
  ),
  name: 'datasource',
};

const dataSourceSrvGetMock = jest.fn().mockImplementation(() => Promise.resolve(dataSourceMock));

/**
 * Mock @grafana/runtime
 */
jest.mock('@grafana/runtime', () => ({
  getDataSourceSrv: () => ({
    get: dataSourceSrvGetMock,
  }),
  toDataQueryError: jest.fn().mockImplementation(({ message }: any) => ({ message })),
  config: { theme2: {} },
}));

/**
 * RedisGears Panel
 */
describe('RedisGearsPanel', () => {
  beforeEach(() => {
    dataSourceSrvGetMock.mockClear();
    dataSourceMock.query.mockClear();
  });

  it('Should update script', () => {
    const wrapper = shallow<RedisGearsPanel>(getComponent());
    const component = wrapper.find(CodeEditor);
    component.simulate('change', 'myscript');
    expect(wrapper.state().script).toEqual('myscript');
  });

  it('Should update requirements', () => {
    const wrapper = shallow<RedisGearsPanel>(getComponent());
    const component = wrapper.find(Input);
    component.simulate('change', { target: { value: 'some' } });
    expect(wrapper.state().requirements).toEqual('some');
  });

  it('Should update unblocking', () => {
    const wrapper = shallow<RedisGearsPanel>(getComponent());
    const component = wrapper.find(RadioButtonGroup);
    component.simulate('change', ExecutionMode.Unblocking);
    expect(wrapper.state().unblocking).toEqual(true);
  });

  it('Should not update unblocking', () => {
    const wrapper = shallow<RedisGearsPanel>(getComponent());
    const component = wrapper.find(RadioButtonGroup);
    component.simulate('change', ExecutionMode.Blocking);
    expect(wrapper.state().unblocking).toEqual(false);
  });

  /**
   * Run script button
   */
  describe('Run script button', () => {
    it('Should run script', () => {
      const wrapper = shallow<RedisGearsPanel>(getComponent());
      const testedMethod = jest.spyOn(wrapper.instance(), 'onRunScript').mockImplementation(() => Promise.resolve());
      wrapper.instance().forceUpdate();
      const component = wrapper.find(Button);
      component.simulate('click');
      expect(testedMethod).toHaveBeenCalled();
    });

    it('Should have alt view if isRunning=true', () => {
      const wrapper = shallow<RedisGearsPanel>(getComponent());
      expect(wrapper.find(Button).text()).toEqual('Run script');
      wrapper.setState({
        isRunning: true,
      });
      expect(wrapper.find(Button).text()).toEqual('Running...');
      expect(wrapper.find(Button).prop('disabled')).toBeTruthy();
    });
  });

  /**
   * Result
   */
  describe('Result', () => {
    it('if result is empty should not be rendered', () => {
      const wrapper = shallow<RedisGearsPanel>(getComponent());
      expect(wrapper.state().result).not.toBeDefined();
      expect(wrapper.find(Table).exists()).not.toBeTruthy();
    });

    it('if result is filled should be rendered', () => {
      const wrapper = shallow<RedisGearsPanel>(getComponent());
      wrapper.setState({
        result: toDataFrame({
          fields: [],
        }),
      });
      expect(wrapper.state().result).toBeDefined();
      expect(wrapper.find(Table).exists()).toBeTruthy();
    });
  });

  /**
   * Error
   */
  describe('Error', () => {
    it('Should show error if state.error is defined', () => {
      const wrapper = shallow<RedisGearsPanel>(getComponent());
      expect(wrapper.find(Alert).exists()).not.toBeTruthy();
      wrapper.setState({
        error: {
          message: 'my message',
        },
      });
      expect(wrapper.find(Alert).exists()).toBeTruthy();
      expect(wrapper.find(Alert).prop('title')).toEqual('my message');
    });

    it('Should clear error', () => {
      const wrapper = shallow<RedisGearsPanel>(getComponent());
      wrapper.setState({
        error: {
          message: 'my message',
        },
      });
      wrapper.find(Alert).simulate('remove');
      expect(wrapper.state().error).toEqual(null);
      expect(wrapper.find(Alert).exists()).not.toBeTruthy();
    });
  });

  /**
   * Calc footer height
   */
  describe('Calc footer height', () => {
    it('Should be calculated on mount', () => {
      const wrapper = shallow<RedisGearsPanel>(getComponent(), { disableLifecycleMethods: true });
      wrapper.instance().footerRef = {
        current: {
          getBoundingClientRect: () => ({
            height: 100,
          }),
        },
      } as any;
      wrapper.instance().componentDidMount();
      expect(wrapper.state().footerHeight).toEqual(100);
    });

    it('Should be calculated when width was changed', () => {
      const wrapper = shallow<RedisGearsPanel>(getComponent());
      wrapper.instance().footerRef = {
        current: {
          getBoundingClientRect: () => ({
            height: 200,
          }),
        },
      } as any;
      wrapper.setProps({
        width: 1000,
      });
      expect(wrapper.state().footerHeight).toEqual(200);
      wrapper.instance().footerRef = {
        current: null,
      } as any;
      wrapper.setState({
        footerHeight: 0,
      });
      wrapper.setProps({
        width: 2000,
      });
      expect(wrapper.state().footerHeight).toEqual(0);
    });
  });

  /**
   * makeQuery
   */
  describe('makeQuery', () => {
    it('Should make correct query', async () => {
      const data = {
        request: {
          targets: [
            {
              datasource: 'Redis',
            },
          ],
        },
      };

      const wrapper = shallow<RedisGearsPanel>(getComponent({ data }));
      wrapper.setState({
        script: 'my-script',
        unblocking: true,
        requirements: 'requierements',
      });

      const result = await wrapper.instance().makeQuery();
      expect(dataSourceMock.query).toHaveBeenCalledWith({
        ...data.request,
        targets: [
          {
            ...data.request.targets[0],
            command: 'rg.pyexecute',
            keyName: wrapper.state().script,
            unblocking: wrapper.state().unblocking,
            requirements: wrapper.state().requirements,
          },
        ],
      });
      expect(result).toEqual({
        data: 123,
      });

      wrapper.setProps({
        data: {
          request: null,
        },
      } as any);
      dataSourceMock.query.mockClear();
      const result2 = await wrapper.instance().makeQuery();
      expect(result2).toEqual(null);
      expect(dataSourceMock.query).not.toHaveBeenCalled();
    });
  });

  /**
   * onRunScript
   */
  describe('onRunScript', () => {
    const wrapper = shallow<RedisGearsPanel>(getComponent());
    const makeQueryMock = jest.spyOn(wrapper.instance(), 'makeQuery').mockImplementation(() => Promise.resolve(null));

    it('Should set error if responseData contains error', async () => {
      makeQueryMock.mockImplementationOnce(() => Promise.resolve(null));
      await wrapper.instance().onRunScript();
      expect(makeQueryMock).toHaveBeenCalled();
      expect(wrapper.state().result).not.toBeDefined();
      expect(wrapper.state().isRunning).toBeFalsy();
      expect(wrapper.state().error).toEqual({ message: 'Common error' });

      makeQueryMock.mockImplementationOnce(
        () =>
          ({
            state: LoadingState.Error,
            error: {
              message: 'error from datasource',
            },
          } as any)
      );
      await wrapper.instance().onRunScript();
      expect(makeQueryMock).toHaveBeenCalled();
      expect(wrapper.state().result).not.toBeDefined();
      expect(wrapper.state().isRunning).toBeFalsy();
      expect(wrapper.state().error).toEqual({ message: 'error from datasource' });
    });

    it('Should set error if responseData.data[1].length > 0', async () => {
      makeQueryMock.mockImplementationOnce(() =>
        Promise.resolve({
          data: [
            null,
            toDataFrame({
              fields: [
                {
                  name: 'error',
                  type: FieldType.string,
                  values: ['Data error'],
                },
              ],
            }),
          ],
        })
      );

      await wrapper.instance().onRunScript();
      expect(makeQueryMock).toHaveBeenCalled();
      expect(wrapper.state().result).not.toBeDefined();
      expect(wrapper.state().isRunning).toBeFalsy();
      expect(wrapper.state().error).toEqual({ message: 'Data error' });
    });

    it('Should set result if responseData.data[1].length === 0', async () => {
      const result = toDataFrame({
        fields: [
          {
            name: 'results',
            type: FieldType.string,
            values: ['123'],
          },
        ],
      });

      makeQueryMock.mockImplementationOnce(() =>
        Promise.resolve({
          data: [
            result,
            toDataFrame({
              fields: [
                {
                  name: 'error',
                  type: FieldType.string,
                  values: [],
                },
              ],
            }),
          ],
        })
      );

      await wrapper.instance().onRunScript();
      expect(makeQueryMock).toHaveBeenCalled();
      expect(wrapper.state().result).toBeDefined();
      expect(wrapper.state().isRunning).toBeFalsy();
      expect(wrapper.state().error).toEqual(null);
      makeQueryMock.mockImplementationOnce(() =>
        Promise.resolve({
          data: [result],
        })
      );
      await wrapper.instance().onRunScript();
      expect(makeQueryMock).toHaveBeenCalled();
      expect(wrapper.state().result).toBeDefined();
      expect(wrapper.state().isRunning).toBeFalsy();
      expect(wrapper.state().error).toEqual(null);
    });

    it('Should transform result if result.length=0', async () => {
      const result = toDataFrame({
        fields: [
          {
            name: 'results',
            type: FieldType.string,
            values: [],
          },
        ],
      });
      makeQueryMock.mockImplementationOnce(() =>
        Promise.resolve({
          data: [result],
        })
      );
      await wrapper.instance().onRunScript();
      expect(makeQueryMock).toHaveBeenCalled();
      expect(wrapper.state().result?.length).toEqual(1);
      expect(wrapper.state().result?.fields[0].values.toArray()).toEqual(['OK']);
      expect(wrapper.state().isRunning).toBeFalsy();
      expect(wrapper.state().error).toEqual(null);
    });
  });

  afterAll(() => {
    jest.resetAllMocks();
  });
});
