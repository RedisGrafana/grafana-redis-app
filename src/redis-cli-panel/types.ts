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

  /**
   * Query help
   *
   * @type {HelpCommand}
   */
  help: HelpCommand;
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

/**
 * Redis Commands help
 */
export interface HelpCommand {
  /**
   * Syntax
   *
   * @type {string}
   */
  syntax?: string;

  /**
   * Summary
   *
   * @type {string}
   */
  summary?: string;

  /**
   * Complexity
   *
   * @type {string}
   */
  complexity?: string;

  /**
   * Dangerous commands
   *
   * @type {string}
   */
  danger?: string;

  /**
   * Not recommended for Production
   *
   * @type {string}
   */
  warning?: string;

  /**
   * Since
   *
   * @type {string}
   */
  since?: string;

  /**
   * URL
   *
   * @type {string}
   */
  url?: string;
}
