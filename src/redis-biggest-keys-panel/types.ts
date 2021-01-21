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
  /**
   * How many fields are showed in table
   */
  size?: number;
  /**
   * Hom many keys are used for finding the biggest keys
   */
  count?: number;
  /**
   * Pattern for filtering keys
   */
  match?: string;
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
