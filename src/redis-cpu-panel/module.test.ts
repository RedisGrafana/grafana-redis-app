import { PanelPlugin } from '@grafana/data';
import { plugin } from './module';

/**
 * CPU Panel
 */
describe('RedisCPUPanel', () => {
  it('Should be instance of PanelPlugin', () => {
    expect(plugin).toBeInstanceOf(PanelPlugin);
  });

  it('Should add interval input', () => {
    /**
     * Builder
     */
    const builder: any = {
      addSliderInput: jest.fn().mockImplementation(() => builder),
      addRadio: jest.fn().mockImplementation(() => builder),
    };

    plugin['optionsSupplier'](builder);

    /**
     * Interval
     */
    expect(builder.addSliderInput).toHaveBeenCalled();
  });
});
