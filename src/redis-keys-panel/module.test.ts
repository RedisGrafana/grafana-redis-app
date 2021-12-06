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
      addSliderInput: jest.fn().mockImplementation(() => builder),
    };

    plugin['optionsSupplier'](builder);

    /**
     * Interval
     */
    expect(builder.addSliderInput).toHaveBeenCalled();
  });
});
