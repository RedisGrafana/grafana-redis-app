import { AppPlugin } from '@grafana/data';
import { Config, RootPage } from './components';
import { GlobalSettings } from './types';

/**
 * Application Plug-in
 */
export const plugin = new AppPlugin<GlobalSettings>().setRootPage(RootPage).addConfigPage({
  title: 'Config',
  body: Config,
  id: 'config',
});
