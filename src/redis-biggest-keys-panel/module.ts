import { PanelPlugin } from '@grafana/data';
import { RedisBiggestKeysPanel } from './components';
import { DefaultInterval, PanelOptions } from './types';

/**
 * Panel Plugin
 */
export const plugin = new PanelPlugin<PanelOptions>(RedisBiggestKeysPanel).setPanelOptions((builder) => {
  return builder.addNumberInput({
    path: 'interval',
    name: 'How ofter to get a new batch of keys',
    defaultValue: DefaultInterval,
  });
});
