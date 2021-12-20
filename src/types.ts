import { DataQuery, DataSourceInstanceSettings, DataSourceJsonData } from '@grafana/data';
import { ClientTypeValue } from './constants';

/**
 * Global Settings
 */
export interface GlobalSettings {}

/**
 * SVG
 */
export interface SVGProps extends React.HTMLAttributes<SVGElement> {
  /**
   * Size
   *
   * @type {number}
   */
  size: number;

  /**
   * Fill color
   *
   * @type {string}
   */
  fill?: string;

  /**
   * Title
   *
   * @type {string}
   */
  title?: string;

  /**
   * Class Name
   *
   * @type {string}
   */
  className?: string;
}

/**
 * Options configured for each DataSource instance
 */
export interface RedisDataSourceOptions extends DataSourceJsonData {
  /**
   * Pool Size
   *
   * @type {number}
   */
  poolSize: number;

  /**
   * Timeout
   *
   * @type {number}
   */
  timeout: number;

  /**
   * Pool Ping Interval
   *
   * @type {number}
   */
  pingInterval: number;

  /**
   * Pool Pipeline Window
   *
   * @type {number}
   */
  pipelineWindow: number;

  /**
   * TLS Authentication
   *
   * @type {boolean}
   */
  tlsAuth: boolean;

  /**
   * TLS Skip Verify
   *
   * @type {boolean}
   */
  tlsSkipVerify: boolean;

  /**
   * Client Type
   *
   * @type {ClientTypeValue}
   */
  client: ClientTypeValue;

  /**
   * Sentinel Master group name
   *
   * @type {string}
   */
  sentinelName: string;

  /**
   * ACL enabled
   *
   * @type {boolean}
   */
  acl: boolean;

  /**
   * CLI disabled
   *
   * @type {boolean}
   */
  cliDisabled: boolean;

  /**
   * ACL Username
   *
   * @type {string}
   */
  user: string;
}

/**
 * Instance Settings
 */
export interface RedisDataSourceInstanceSettings extends DataSourceInstanceSettings<RedisDataSourceOptions> {
  /**
   * Commands
   *
   * @type {string[]}
   */
  commands: string[];
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
   * CLI or Raw mode
   *
   * @type {boolean}
   */
  cli?: boolean;
}
