import { PanelPlugin } from '@grafana/data';
import { plugin } from './module';

/*
 Gears Panel
 */
describe('RedisGearsPanel', () => {
  it('Should be instance of PanelPlugin', () => {
    expect(plugin).toBeInstanceOf(PanelPlugin);
  });
});
