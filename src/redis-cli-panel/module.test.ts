import { PanelPlugin } from '@grafana/data';
import { plugin } from './module';

/*
 Plugin
 */
describe('plugin', () => {
  it('should be instance of PanelPlugin', () => {
    expect(plugin).toBeInstanceOf(PanelPlugin);
  });

  it('Should add textarea height input', () => {
    const builder = {
      addNumberInput: jest.fn(),
    };
    plugin['registerOptionEditors'](builder);
    expect(builder.addNumberInput).toHaveBeenCalledWith({ path: 'height', name: 'Textarea height', defaultValue: 12 });
  });
});
