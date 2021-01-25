import { PanelPlugin } from '@grafana/data';
import { RedisKeysPanel } from './components';
import { DefaultInterval } from './constants';
import { PanelOptions } from './types';

/**
 * Panel Plugin
 */
export const plugin = new PanelPlugin<PanelOptions>(RedisKeysPanel).setPanelOptions((builder) => {
  return builder.addNumberInput({
    path: 'interval',
    name: 'Interval to run SCAN command, ms',
    defaultValue: DefaultInterval,
  });
});
