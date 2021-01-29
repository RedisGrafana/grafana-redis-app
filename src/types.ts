import { DataSourceInstanceSettings } from '@grafana/data';

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
 * Instance Settings
 */
export interface RedisDataSourceInstanceSettings extends DataSourceInstanceSettings {
  /**
   * Commands
   *
   * @type {string[]}
   */
  commands: string[];
}
