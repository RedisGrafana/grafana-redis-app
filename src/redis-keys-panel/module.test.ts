import { PanelPlugin } from '@grafana/data';
import { plugin } from './module';

/**
 * Keys Panel
 */
describe('RedisKeysPanel', () => {
  it('Should be instance of PanelPlugin', () => {
    expect(plugin).toBeInstanceOf(PanelPlugin);
  });

  it('Should add interval input', () => {
    const builder: any = {
      addNumberInput: jest.fn().mockImplementation(() => builder),
    };

    plugin['registerOptionEditors'](builder);

    /**
     * Interval
     */
    expect(builder.addNumberInput).toHaveBeenCalledWith({
      path: 'interval',
      name: 'Interval to run SCAN command, ms',
      defaultValue: 1000,
    });
  });
});
