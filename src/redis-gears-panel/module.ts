import { PanelPlugin } from '@grafana/data';
import { RedisGearsPanel } from './components';
import { PanelOptions } from './types';

/**
 * Panel Plugin
 */
export const plugin = new PanelPlugin<PanelOptions>(RedisGearsPanel);
