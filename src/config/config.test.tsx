import React from 'react';
import { config, setLocationSrv } from '@grafana/runtime';
import { shallow } from 'enzyme';
import { Config } from './config';

/*
 Plugin
 */
const getPlugin = (overridePlugin: any = { meta: {} }) => ({
  ...overridePlugin,
  meta: {
    enabled: true,
    ...overridePlugin.meta,
  },
});

/*
 Config
 */
describe('Config', () => {
  let initialDataSources = config.datasources;

  beforeAll(() => {
    jest.spyOn(Config, 'getLocation').mockImplementation((): any => ({
      assign: jest.fn(),
      reload: jest.fn(),
    }));
  });

  /*
   Initialization
   */
  describe('Initialization', () => {
    it('If plugin is not enabled, state should have isEnabled = false and isConfigured = false', () => {
      const plugin = getPlugin({ meta: { enabled: false } });
      config.datasources = {
        redis: {
          type: 'redis-datasource',
        } as any,
      };
      const wrapper = shallow<Config>(<Config plugin={plugin} query={null as any} />);
      expect(wrapper.state().isEnabled).toBeFalsy();
      expect(wrapper.state().isConfigured).toBeFalsy();
    });

    it('If plugin is enabled but config does not have needed datasources, state should have isEnabled = true and isConfigured = false', () => {
      const plugin = getPlugin({ meta: { enabled: true } });
      config.datasources = {};
      const wrapper = shallow<Config>(<Config plugin={plugin} query={null as any} />);
      expect(wrapper.state().isEnabled).toBeTruthy();
      expect(wrapper.state().isConfigured).toBeFalsy();
    });

    it('If plugin is enabled and config has needed datasources, state should have isEnabled = true and isConfigured = true', () => {
      const plugin = getPlugin({ meta: { enabled: true } });
      config.datasources = {
        redis: {
          type: 'redis-datasource',
        } as any,
      };
      const wrapper = shallow<Config>(<Config plugin={plugin} query={null as any} />);
      expect(wrapper.state().isEnabled).toBeTruthy();
      expect(wrapper.state().isConfigured).toBeTruthy();
    });
  });

  /*
   Rendering
   */
  describe('rendering', () => {
    beforeAll(() => {
      config.datasources = {
        redis: {
          type: 'redis-datasource',
        } as any,
      };
    });

    it('If plugin is not configured, should show only enable button', () => {
      const plugin = getPlugin({ meta: { enabled: false } });
      const wrapper = shallow<Config>(<Config plugin={plugin} query={null as any} />);
      const enableButton = wrapper.findWhere((node) => node.name() === 'Button' && node.text() === 'Enable');
      const updateButton = wrapper.findWhere((node) => node.name() === 'Button' && node.text() === 'Update');
      expect(enableButton.exists()).toBeTruthy();
      expect(updateButton.exists()).not.toBeTruthy();
    });

    it('If plugin is configured, should show update and disable buttons', () => {
      const plugin = getPlugin({ meta: { enabled: true } });
      const wrapper = shallow<Config>(<Config plugin={plugin} query={null as any} />);
      const disableButton = wrapper.findWhere((node) => node.name() === 'Button' && node.text() === 'Disable');
      const updateButton = wrapper.findWhere((node) => node.name() === 'Button' && node.text() === 'Update');
      expect(disableButton.exists()).toBeTruthy();
      expect(updateButton.exists()).toBeTruthy();
    });

    it('Enable button should call onEnable method', () => {
      const plugin = getPlugin({ meta: { enabled: false } });
      const wrapper = shallow<Config>(<Config plugin={plugin} query={null as any} />);
      const testedMethod = jest.spyOn(wrapper.instance(), 'onEnable').mockImplementation(() => null);
      wrapper.instance().forceUpdate();
      const enableButton = wrapper.findWhere((node) => node.name() === 'Button' && node.text() === 'Enable');
      enableButton.simulate('click');
      expect(testedMethod).toHaveBeenCalled();
    });

    it('Disable button should call onDisable method', () => {
      const plugin = getPlugin({ meta: { enabled: true } });
      const wrapper = shallow<Config>(<Config plugin={plugin} query={null as any} />);
      const testedMethod = jest.spyOn(wrapper.instance(), 'onDisable').mockImplementation(() => null);
      wrapper.instance().forceUpdate();
      const disableButton = wrapper.findWhere((node) => node.name() === 'Button' && node.text() === 'Disable');
      disableButton.simulate('click');
      expect(testedMethod).toHaveBeenCalled();
    });

    it('Update button should call onUpdate method', () => {
      const plugin = getPlugin({ meta: { enabled: true } });
      const wrapper = shallow<Config>(<Config plugin={plugin} query={null as any} />);
      const testedMethod = jest.spyOn(wrapper.instance(), 'onUpdate').mockImplementation(() => null);
      wrapper.instance().forceUpdate();
      const updateButton = wrapper.findWhere((node) => node.name() === 'Button' && node.text() === 'Update');
      updateButton.simulate('click');
      expect(testedMethod).toHaveBeenCalled();
    });
  });

  /*
   Methods
   */
  describe('Methods', () => {
    it('onUpdate should call goHome method', () => {
      const plugin = getPlugin({ meta: { enabled: true } });
      const wrapper = shallow<Config>(<Config plugin={plugin} query={null as any} />);
      const testedMethod = jest.spyOn(wrapper.instance(), 'goHome').mockImplementation();
      wrapper.instance().onUpdate();
      expect(testedMethod).toHaveBeenCalled();
    });

    it('onUpdate should not call goHome method if enabled=false', () => {
      const plugin = getPlugin({ meta: { enabled: false } });
      const wrapper = shallow<Config>(<Config plugin={plugin} query={null as any} />);
      const testedMethod = jest.spyOn(wrapper.instance(), 'goHome').mockImplementation();
      wrapper.instance().onUpdate();
      expect(testedMethod).not.toHaveBeenCalled();
    });

    it('onDisable should call updatePluginSettings method', () => {
      const plugin = getPlugin({ meta: { enabled: true } });
      const wrapper = shallow<Config>(<Config plugin={plugin} query={null as any} />);
      const testedMethod = jest
        .spyOn(wrapper.instance(), 'updatePluginSettings')
        .mockImplementation(() => Promise.resolve(null as any));
      wrapper.instance().onDisable();
      expect(testedMethod).toHaveBeenCalledWith({ enabled: false, jsonData: {}, pinned: false });
    });

    it('onEnable should call updatePluginSettings method', () => {
      const plugin = getPlugin({ meta: { enabled: true } });
      const wrapper = shallow<Config>(<Config plugin={plugin} query={null as any} />);
      const testedMethod = jest
        .spyOn(wrapper.instance(), 'updatePluginSettings')
        .mockImplementation(() => Promise.resolve(null as any));
      wrapper.instance().onEnable();
      expect(testedMethod).toHaveBeenCalledWith({ enabled: true, jsonData: {}, pinned: true });
    });

    it('updatePluginSettings should make post request', () => {
      const plugin = getPlugin({ meta: { enabled: true, id: 'app' } });
      const wrapper = shallow<Config>(<Config plugin={plugin} query={null as any} />);
      const postRequestMock = jest.fn();
      wrapper.instance()['backendSrv'] = {
        post: postRequestMock,
      } as any;
      const settings = { enabled: true, jsonData: {}, pinned: true };
      wrapper.instance().updatePluginSettings(settings);
      expect(postRequestMock).toHaveBeenCalledWith(`api/plugins/${plugin.meta.id}/settings`, settings);
    });

    it('goHome should redirect on home page', () => {
      const updateLocationMock = jest.fn();
      setLocationSrv({
        update: updateLocationMock,
      });
      const plugin = getPlugin({ meta: { enabled: true } });
      const wrapper = shallow<Config>(<Config plugin={plugin} query={null as any} />);
      wrapper.instance().goHome();
      expect(updateLocationMock).toHaveBeenCalledWith({
        path: 'a/redis-app/',
        partial: false,
      });
    });
  });

  afterAll(() => {
    config.datasources = initialDataSources;
    jest.resetAllMocks();
  });
});
