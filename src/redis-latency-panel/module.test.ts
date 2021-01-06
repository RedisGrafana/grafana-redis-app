import { PanelPlugin } from '@grafana/data';
import { plugin } from './module';

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
      addBooleanSwitch: jest.fn().mockImplementation(() => builder),
    };
    plugin['registerOptionEditors'](builder);
    expect(builder.addNumberInput).toHaveBeenCalledWith({
      path: 'interval',
      name: 'How often to update data in ms',
      defaultValue: 1000,
    });
  });
});
