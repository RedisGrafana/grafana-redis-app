import { DataSourceInstanceSettings, DataSourceJsonData } from '@grafana/data';

/**
 * Global Settings
 */
export interface GlobalSettings {}

/**
 * Data Source types
 */
export enum DataSourceType {
  REDIS = 'redis-datasource',
}

/**
 * Redis commands
 */
export enum RedisCommand {
  COMMAND = 'command',
  REDISGEARS = 'RG.PYEXECUTE',
  REDISTIMESERIES = 'TS.INFO',
  REDISAI = 'AI.INFO',
  REDISEARCH = 'FT.INFO',
  REDISJSON = 'JSON.GET',
  REDISGRAPH = 'GRAPH.QUERY',
  REDISBLOOM = 'BF.INFO',
}

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
 * Client Type Values
 */
export enum ClientTypeValue {
  CLUSTER = 'cluster',
  SENTINEL = 'sentinel',
  SOCKET = 'socket',
  STANDALONE = 'standalone',
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
