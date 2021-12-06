import { PanelPlugin } from '@grafana/data';
import { RedisLatencyPanel } from './components';
import { DefaultInterval, MaxItemsPerSeries, ViewMode, ViewModeOptions } from './constants';
import { PanelOptions } from './types';

/**
 * Panel Plugin
 */
export const plugin = new PanelPlugin<PanelOptions>(RedisLatencyPanel).setPanelOptions((builder) => {
  return builder
    .addRadio({
      path: 'viewMode',
      name: 'Redis Latency',
      defaultValue: ViewMode.Table,
      settings: {
        options: ViewModeOptions,
      },
    })
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
      name: 'Number of Samples per command',
      settings: {
        min: 10,
        max: 1000,
      },
      defaultValue: MaxItemsPerSeries,
    })
    .addBooleanSwitch({
      path: 'hideZero',
      name: 'Hide commands which have only zero values',
      defaultValue: true,
      showIf: (options: PanelOptions) => options.viewMode === ViewMode.Graph,
    });
});
