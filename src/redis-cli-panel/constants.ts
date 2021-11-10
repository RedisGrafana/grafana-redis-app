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

/**
 * Response Modes
 */
export enum ResponseMode {
  CLI = 'CLI',
  RAW = 'Raw',
}

/**
 * Response Mode options
 */
export const ResponseModeOptions = [
  {
    label: ResponseMode.CLI,
    value: ResponseMode.CLI,
  },
  {
    label: ResponseMode.RAW,
    value: ResponseMode.RAW,
  },
];
