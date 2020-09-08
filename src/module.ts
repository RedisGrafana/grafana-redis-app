import { PanelOptions } from 'types';
import { PanelPlugin } from '@grafana/data';
import { RedisCLIPanel } from './RedisCLIPanel';

/**
 * Panel Plugin
 */
export const plugin = new PanelPlugin<PanelOptions>(RedisCLIPanel).setPanelOptions(builder => {
  return builder.addNumberInput({
    path: 'height',
    name: 'TextArea height',
    defaultValue: 12,
  });
});
