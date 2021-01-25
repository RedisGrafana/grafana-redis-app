import { PanelPlugin } from '@grafana/data';
import { RedisLatencyPanel } from './components';
import { DefaultInterval, MaxItemsPerSeries, ViewMode, ViewModeOptions } from './constants';
import { PanelOptions } from './types';

/**
 * Panel Plugin
 */
export const plugin = new PanelPlugin<PanelOptions>(RedisLatencyPanel).setPanelOptions((builder) => {
  return builder
    .addNumberInput({
      path: 'interval',
      name: 'Interval to run INFO command, ms',
      defaultValue: DefaultInterval,
    })
    .addRadio({
      path: 'viewMode',
      name: 'View mode',
      defaultValue: ViewMode.Table,
      settings: {
        options: ViewModeOptions,
      },
    })
    .addNumberInput({
      path: 'maxItemsPerSeries',
      name: 'Number of Samples per command',
      defaultValue: MaxItemsPerSeries,
    })
    .addBooleanSwitch({
      path: 'hideZero',
      name: 'Hide commands which have only zero values',
      defaultValue: true,
      showIf: (options: PanelOptions) => options.viewMode === ViewMode.Graph,
    });
});
