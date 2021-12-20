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
   * Redis Section
   *
   * @type {string}
   */
  section?: string;

  /**
   * How many fields are showed in table
   */
  size?: number;

  /**
   * Hom many keys are used for finding the keys
   */
  count?: number;

  /**
   * Pattern for filtering keys
   */
  match?: string;
}

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
   * How many keys are used for finding max memory keys
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
