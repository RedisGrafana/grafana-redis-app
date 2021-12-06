/**
 * Data Source types
 */
export enum DataSourceType {
  REDIS = 'redis-datasource',
}

/**
 * New Data Source names
 */
export enum DataSourceName {
  REDIS = 'Redis',
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
 * Client Type Values
 */
export enum ClientTypeValue {
  CLUSTER = 'cluster',
  SENTINEL = 'sentinel',
  SOCKET = 'socket',
  STANDALONE = 'standalone',
}

/**
 * Application root page
 */
export const ApplicationRoot = '/a/redis-app';

/**
 * Application
 */
export const ApplicationName = 'Redis Application';
export const ApplicationSubTitle = 'Redis Data Source Manager';
