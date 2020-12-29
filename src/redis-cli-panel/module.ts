import { PanelPlugin } from '@grafana/data';
import { RedisCLIPanel } from './components';
import { PanelOptions } from './types';

/**
 * Panel Plugin
 */
export const plugin = new PanelPlugin<PanelOptions>(RedisCLIPanel);
