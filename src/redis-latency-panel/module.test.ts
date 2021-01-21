import { PanelPlugin } from '@grafana/data';
import { plugin } from './module';
import { ViewMode } from './types';

/**
 * Latency Panel
 */
describe('RedisLatencyPanel', () => {
  it('Should be instance of PanelPlugin', () => {
    expect(plugin).toBeInstanceOf(PanelPlugin);
  });

  it('Should add interval input', () => {
    const builder: any = {
      addNumberInput: jest.fn().mockImplementation(() => builder),
      addRadio: jest.fn().mockImplementation(() => builder),
      addBooleanSwitch: jest.fn().mockImplementation((config) => ({
        ...builder,
        switchField: config,
      })),
    };
    const result = plugin['registerOptionEditors'](builder);
    expect(builder.addNumberInput).toHaveBeenCalledWith({
      path: 'interval',
      name: 'How often to update data in ms',
      defaultValue: 1000,
    });
    expect(result.switchField.showIf({ viewMode: ViewMode.Graph })).toBeTruthy();
    expect(result.switchField.showIf({ viewMode: ViewMode.Table })).not.toBeTruthy();
  });
});
