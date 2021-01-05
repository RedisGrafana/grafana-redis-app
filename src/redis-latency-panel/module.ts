import { PanelPlugin } from '@grafana/data';
import { RedisLatencyPanel } from './components';
import { DefaultInterval, PanelOptions, ViewMode, MaxItemsPerSeries } from './types';

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
        options: [
          {
            label: 'Table',
            value: ViewMode.Table,
          },
          {
            label: 'Graph',
            value: ViewMode.Graph,
          },
        ],
      },
    })
    .addNumberInput({
      path: 'maxItemsPerSeries',
      name: 'How many items could be kept per command',
      defaultValue: MaxItemsPerSeries,
    });
});
