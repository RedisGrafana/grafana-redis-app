import { DataQuery } from '@grafana/data';

/**
 * Panel Options
 */
export interface PanelOptions {
  interval: number;
}

/**
 * Redis Query
 */
export interface RedisQuery extends DataQuery {
  /**
   * Query command
   *
   * @type {string}
   */
  query?: string;
}

export enum FieldName {
  Command = 'Command',
  Calls = 'Calls',
  Duration = 'Usec',
  DurationPerCall = 'Usec_per_call',
  Latency = 'Latency',
}
