import { PanelPlugin } from '@grafana/data';
import { plugin } from './module';

/**
 * Biggest Keys Panel
 */
describe('RedisBiggestKeysPanel', () => {
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
      name: 'How ofter to get a new batch of keys',
      defaultValue: 1000,
    });
  });
});
