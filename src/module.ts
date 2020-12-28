import { RootPage } from 'components';
import { AppPlugin } from '@grafana/data';
import { Config } from './config/config';
import { GlobalSettings } from './types';

/**
 * Application Plug-in
 */
export const plugin = new AppPlugin<GlobalSettings>().setRootPage(RootPage).addConfigPage({
  title: 'Config',
  body: Config,
  id: 'config',
});
