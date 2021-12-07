import { PanelPlugin } from '@grafana/data';
import { RedisCPUPanel } from './components';
import { DefaultInterval, MaxItemsPerSeries } from './constants';
import { PanelOptions } from './types';

/**
 * Panel Plugin
 */
export const plugin = new PanelPlugin<PanelOptions>(RedisCPUPanel).setPanelOptions((builder) => {
  return builder
    .addSliderInput({
      path: 'interval',
      name: 'Interval to run INFO command, ms',
      settings: {
        min: 100,
        max: 30000,
      },
      defaultValue: DefaultInterval,
    })
    .addSliderInput({
      path: 'maxItemsPerSeries',
      name: 'Number of Samples',
      settings: {
        min: 10,
        max: 500,
      },
      defaultValue: MaxItemsPerSeries,
    });
});
