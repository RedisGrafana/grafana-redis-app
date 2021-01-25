import { PanelPlugin } from '@grafana/data';
import { ViewMode } from './constants';
import { plugin } from './module';

/**
 * Latency Panel
 */
describe('RedisLatencyPanel', () => {
  it('Should be instance of PanelPlugin', () => {
    expect(plugin).toBeInstanceOf(PanelPlugin);
  });

  it('Should add interval input', () => {
    /**
     * Builder
     */
    const builder: any = {
      addNumberInput: jest.fn().mockImplementation(() => builder),
      addRadio: jest.fn().mockImplementation(() => builder),
      addBooleanSwitch: jest.fn().mockImplementation((config) => ({
        ...builder,
        switchField: config,
      })),
    };

    const result = plugin['registerOptionEditors'](builder);

    /**
     * Interval
     */
    expect(builder.addNumberInput).toHaveBeenCalledWith({
      path: 'interval',
      name: 'Interval to run INFO command, ms',
      defaultValue: 1000,
    });
    expect(result.switchField.showIf({ viewMode: ViewMode.Graph })).toBeTruthy();
    expect(result.switchField.showIf({ viewMode: ViewMode.Table })).not.toBeTruthy();
  });
});
