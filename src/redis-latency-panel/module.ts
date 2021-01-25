import { PanelPlugin } from '@grafana/data';
import { RedisLatencyPanel } from './components';
import { DefaultInterval, MaxItemsPerSeries, PanelOptions, ViewMode, ViewModeOptions } from './types';

/**
 * Panel Plugin
 */
export const plugin = new PanelPlugin<PanelOptions>(RedisLatencyPanel).setPanelOptions((builder) => {
  return builder
    .addNumberInput({
      path: 'interval',
      name: 'How often to update data in ms',
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
      name: 'How many items could be kept per command',
      defaultValue: MaxItemsPerSeries,
    })
    .addBooleanSwitch({
      path: 'hideZero',
      name: 'Hide commands which have only zero values',
      defaultValue: true,
      showIf: (options: PanelOptions) => options.viewMode === ViewMode.Graph,
    });
});
