import {
  RedisAIHelp,
  RedisBloomHelp,
  RedisGearsHelp,
  RedisGraphHelp,
  RedisHelp,
  RedisJSONHelp,
  RedisSearchHelp,
  RedisTimeSeriesHelp,
} from './help';
import { HelpCommand } from './types';

/**
 * Help for native redis commands and modules
 */
export const Help: { [key: string]: HelpCommand } = {
  ...RedisHelp,
  ...RedisAIHelp,
  ...RedisBloomHelp,
  ...RedisGearsHelp,
  ...RedisGraphHelp,
  ...RedisJSONHelp,
  ...RedisSearchHelp,
  ...RedisTimeSeriesHelp,
};
