import { PanelPlugin } from '@grafana/data';
import { RedisKeysPanel } from './components';
import { DefaultInterval } from './constants';
import { PanelOptions } from './types';

/**
 * Panel Plugin
 */
export const plugin = new PanelPlugin<PanelOptions>(RedisKeysPanel).setPanelOptions((builder) => {
  return builder.addSliderInput({
    path: 'interval',
    name: 'Interval to run SCAN command, ms',
    settings: {
      min: 100,
      max: 30000,
    },
    defaultValue: DefaultInterval,
  });
});
