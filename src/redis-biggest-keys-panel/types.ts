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
 * Default result's size
 */
export const DefaultSize = 10;

/**
 * Default SCAN count
 */
export const DefaultCount = 100;

/**
 * Query Type
 */
export enum QueryType {
  Data = 'Data',
  TotalKeys = 'TotalKeys',
}

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

/**
 * Redis Keys
 */
export interface RedisKey {
  /**
   * Key
   *
   * @type {string}
   */
  key: string;

  /**
   * Type
   *
   * @type {string}
   */
  type: string;

  /**
   * Memory Usage
   *
   * @type {number}
   */
  memory: number;
}

/**
 * Query Config
 */
export interface QueryConfig {
  /**
   * How many fields are showed in table
   */
  size: number;

  /**
   * How many keys are used for finding the biggest keys
   */
  count: number;

  /**
   * Pattern for filtering keys
   */
  matchPattern: string;
}

/**
 * Scanning Progress
 */
export interface Progress {
  /**
   * Total amount of keys
   */
  total: number;

  /**
   * Amount already processed keys
   */
  processed: number;
}
