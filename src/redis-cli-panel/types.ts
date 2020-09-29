import { DataQuery } from '@grafana/data';

/**
 * Panel Options
 */
export interface PanelOptions {
  /**
   * TextArea Height
   *
   * @type {number}
   */
  height: number;

  /**
   * Query command
   *
   * @type {string}
   */
  query: string;

  /**
   * Command's output
   *
   * @type {string}
   */
  output: string;
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
