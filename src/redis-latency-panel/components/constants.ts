import { FieldName } from '../types';

export const DISPLAY_NAME_BY_FIELD_NAME = {
  [FieldName.Command]: 'Command',
  [FieldName.Calls]: 'Number of calls',
  [FieldName.Duration]: 'Total Duration',
  [FieldName.DurationPerCall]: 'Duration per call',
  [FieldName.Latency]: 'Latency',
};

export const DEFAULT_INTERVAL = 1800000;
