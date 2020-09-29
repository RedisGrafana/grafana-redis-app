import { RootPage } from 'RootPage';
import { AppPlugin } from '@grafana/data';
import { ConfigCtrl } from './legacy/config';
import { GlobalSettings } from './types';

/**
 * Legacy export for Config page
 */
export { ConfigCtrl };

/**
 * Application Plug-in
 */
export const plugin = new AppPlugin<GlobalSettings>().setRootPage(RootPage);
