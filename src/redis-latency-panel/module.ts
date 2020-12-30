import { PanelPlugin } from '@grafana/data';
import { RedisLatencyPanel } from './components';
import { PanelOptions } from './types';

/**
 * Panel Plugin
 */
export const plugin = new PanelPlugin<PanelOptions>(RedisLatencyPanel).setPanelOptions((builder) => {
  return builder.addNumberInput({
    path: 'interval',
    name: 'How often to update data in ms',
    defaultValue: 1800000, // 30 minutes,
  });
});
