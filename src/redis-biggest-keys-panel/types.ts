import { DataQuery } from '@grafana/data';

/**
 * Panel Options
 */
export interface PanelOptions {
  /**
   * Interval
   *
   * @type {number}
   */
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

  /**
   * Redis Command type
   *
   * @type {string}
   */
  type?: string;

  /**
   * Redis Command
   *
   * @type {string}
   */
  command?: string;
}

/**
 * Default refresh interval
 */
export const DefaultInterval = 1000;

/**
 * Fields
 */
export enum FieldName {
  Key = 'key',
  Type = 'type',
  Memory = 'memory',
}

/**
 * Table Field names
 */
export const DisplayNameByFieldName = {
  [FieldName.Key]: 'Key',
  [FieldName.Type]: 'Type',
  [FieldName.Memory]: 'Memory',
};
