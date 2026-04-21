import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import * as runtime from '@grafana/runtime';
import { setLocationSrv } from '@grafana/runtime';
import { ApplicationRoot } from '../../constants';
import { Config } from './Config';

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

const postMock = jest.fn();

/*
 Config
 */
describe('Config', () => {
  let getBackendSrvSpy: jest.SpyInstance;

  beforeAll(() => {
    jest.spyOn(Config, 'getLocation').mockImplementation((): any => ({
      assign: jest.fn(),
      reload: jest.fn(),
    }));
  });

  beforeEach(() => {
    postMock.mockReset();
    postMock.mockResolvedValue(undefined);
    getBackendSrvSpy = jest.spyOn(runtime, 'getBackendSrv').mockReturnValue({ post: postMock } as any);
  });

  afterEach(() => {
    getBackendSrvSpy.mockRestore();
  });

  /*
   Initialization
   */
  describe('Initialization', () => {
    const renderComponent = (overrides: Partial<React.ComponentProps<typeof Config>> = {}) => {
      const props = {
        plugin: getPlugin({}),
        query: null as any,
        ...overrides,
      };
      return render(<Config {...props} />);
    };

    it('If plugin is not enabled and meta is not set, state should have isEnabled = false', async () => {
      const plugin = getPlugin({});
      renderComponent({ plugin });
      await waitFor(() => {
        const disableButton = screen.getByRole('button', { name: 'Disable' });
        expect(disableButton).toBeInTheDocument();
      });
    });

    it('If plugin is not enabled, state should have isEnabled = false', async () => {
      const plugin = getPlugin({ meta: { enabled: false } });
      renderComponent({ plugin });
      await waitFor(() => {
        const enableButton = screen.getByRole('button', { name: 'Enable' });
        expect(enableButton).toBeInTheDocument();
      });
    });

    it('If plugin is enabled, state should have isEnabled = true', async () => {
      const plugin = getPlugin({ meta: { enabled: true } });
      renderComponent({ plugin });
      await waitFor(() => {
        const disableButton = screen.getByRole('button', { name: 'Disable' });
        expect(disableButton).toBeInTheDocument();
      });
    });
  });

  /*
   Rendering
   */
  describe('rendering', () => {
    const renderComponent = (overrides: Partial<React.ComponentProps<typeof Config>> = {}) => {
      const props = {
        plugin: getPlugin({}),
        query: null as any,
        ...overrides,
      };
      return render(<Config {...props} />);
    };

    it('If plugin is not configured, should show enable button', async () => {
      const plugin = getPlugin({ meta: { enabled: false } });
      renderComponent({ plugin });
      await waitFor(() => {
        const enableButton = screen.getByRole('button', { name: 'Enable' });
        expect(enableButton).toBeInTheDocument();
      });
    });

    it('If plugin is configured, should show disable buttons', async () => {
      const plugin = getPlugin({ meta: { enabled: true } });
      renderComponent({ plugin });
      await waitFor(() => {
        const disableButton = screen.getByRole('button', { name: 'Disable' });
        expect(disableButton).toBeInTheDocument();
      });
    });

    it('Enable button should call onEnable method', async () => {
      const plugin = getPlugin({ meta: { enabled: false } });
      renderComponent({ plugin });
      await waitFor(() => {
        const enableButton = screen.getByRole('button', { name: 'Enable' });
        expect(enableButton).toBeInTheDocument();
      });
      fireEvent.click(screen.getByRole('button', { name: 'Enable' }));
      await waitFor(() => {
        expect(postMock).toHaveBeenCalledWith(`api/plugins/${plugin.meta.id}/settings`, {
          enabled: true,
          jsonData: {},
          pinned: true,
        });
      });
    });

    it('Disable button should call onDisable method', async () => {
      const plugin = getPlugin({ meta: { enabled: true } });
      renderComponent({ plugin });
      await waitFor(() => {
        const disableButton = screen.getByRole('button', { name: 'Disable' });
        expect(disableButton).toBeInTheDocument();
      });
      fireEvent.click(screen.getByRole('button', { name: 'Disable' }));
      await waitFor(() => {
        expect(postMock).toHaveBeenCalledWith(`api/plugins/${plugin.meta.id}/settings`, {
          enabled: false,
          jsonData: {},
          pinned: false,
        });
      });
    });
  });

  /*
   Methods
   */
  describe('Methods', () => {
    it('onDisable should call updatePluginSettings method', () => {
      const plugin = getPlugin({ meta: { enabled: true } });
      const instance = new Config({ plugin, query: null as any } as any);
      const testedMethod = jest
        .spyOn(instance, 'updatePluginSettings')
        .mockImplementation(() => Promise.resolve(null as any));
      instance.onDisable();
      expect(testedMethod).toHaveBeenCalledWith({ enabled: false, jsonData: {}, pinned: false });
    });

    it('onEnable should call updatePluginSettings method', () => {
      const plugin = getPlugin({ meta: { enabled: true } });
      const instance = new Config({ plugin, query: null as any } as any);
      const testedMethod = jest
        .spyOn(instance, 'updatePluginSettings')
        .mockImplementation(() => Promise.resolve(null as any));
      instance.onEnable();
      expect(testedMethod).toHaveBeenCalledWith({ enabled: true, jsonData: {}, pinned: true });
    });

    it('updatePluginSettings should make post request', () => {
      const plugin = getPlugin({ meta: { enabled: true, id: 'app' } });
      const instance = new Config({ plugin, query: null as any } as any);
      const postRequestMock = jest.fn();
      instance['backendSrv'] = {
        post: postRequestMock,
      } as any;
      const settings = { enabled: true, jsonData: {}, pinned: true };
      instance.updatePluginSettings(settings);
      expect(postRequestMock).toHaveBeenCalledWith(`api/plugins/${plugin.meta.id}/settings`, settings);
    });

    it('goHome should redirect on home page', () => {
      const updateLocationMock = jest.fn();
      setLocationSrv({
        update: updateLocationMock,
      });
      const plugin = getPlugin({ meta: { enabled: true } });
      const instance = new Config({ plugin, query: null as any } as any);
      instance.goHome();
      expect(updateLocationMock).toHaveBeenCalledWith({
        path: ApplicationRoot,
        partial: false,
      });
    });
  });

  afterAll(() => {
    jest.resetAllMocks();
  });
});
