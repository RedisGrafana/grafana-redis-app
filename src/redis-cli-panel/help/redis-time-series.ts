import { HelpCommand } from '../types';

/**
 * RedisTimeSeries
 *
 * @see https://oss.redislabs.com/redistimeseries/
 */
export const RedisTimeSeriesHelp: { [key: string]: HelpCommand } = {
  TS: {
    syntax:
      'TS.CREATE, TS.ALTER, TS.ADD, TS.MADD, TS.INCRBY, TS.DECRBY, TS.CREATERULE, TS.DELETERULE, TS.RANGE, TS.REVRANGE, \
    TS.MRANGE, TS.MREVRANGE, TS.GET, TS.MGET, TS.INFO, TS.QUERYINDEX',
    summary: 'RedisTimeSeries is a Redis Module adding a Time Series data structure to Redis.',
    url: 'https://oss.redislabs.com/redistimeseries/',
  },
  'TS CREATE': {
    syntax: 'TS.CREATE key [RETENTION retentionTime] [UNCOMPRESSED] [CHUNK_SIZE size] [LABELS label value..]',
    summary: 'Create a new time-series.',
    complexity: 'O(1)',
    url: 'https://oss.redislabs.com/redistimeseries/commands/#tscreate',
  },
  'TS ALTER': {
    syntax: 'TS.ALTER key [RETENTION retentionTime] [LABELS label value..]',
    summary: 'Update the retention, labels of an existing key. The parameters are the same as TS.CREATE.',
    url: 'https://oss.redislabs.com/redistimeseries/commands/#tsalter',
  },
  'TS ADD': {
    syntax:
      'TS.ADD key timestamp value [RETENTION retentionTime] [UNCOMPRESSED] [CHUNK_SIZE size] [ON_DUPLICATE policy] [LABELS label value..]',
    summary: 'Append (or create and append) a new sample to the series.',
    complexity:
      'If a compaction rule exits on a timeseries, TS.ADD performance might be reduced. The complexity of TS.ADD is \
    always O(M) when M is the amount of compaction rules or O(1) with no compaction.',
    url: 'https://oss.redislabs.com/redistimeseries/commands/#tsadd',
  },
  'TS MADD': {
    syntax: 'TS.MADD key timestamp value [key timestamp value ...]',
    summary: 'Append new samples to a list of series.',
    complexity:
      'If a compaction rule exits on a timeseries, TS.MADD performance might be reduced. The complexity of TS.MADD is \
      always O(N*M) when N is the amount of series updated and M is the amount of compaction rules or O(N) with no compaction.',
    url: 'https://oss.redislabs.com/redistimeseries/commands/#tsmadd',
  },
  'TS INCRBY': {
    syntax:
      'TS.INCRBY key value [TIMESTAMP timestamp] [RETENTION retentionTime] [UNCOMPRESSED] [CHUNK_SIZE size] [LABELS label value..]',
    summary: "Create a new sample that increments the latest sample's value.",
    url: 'https://oss.redislabs.com/redistimeseries/commands/#tsincrbytsdecrby',
  },
  'TS DECRBY': {
    syntax:
      'TS.DECRBY key value [TIMESTAMP timestamp] [RETENTION retentionTime] [UNCOMPRESSED] [CHUNK_SIZE size] [LABELS label value..]',
    summary: "Create a new sample that decrements the latest sample's value.",
    url: 'https://oss.redislabs.com/redistimeseries/commands/#tsincrbytsdecrby',
  },
  'TS CREATERULE': {
    syntax: 'TS.CREATERULE sourceKey destKey AGGREGATION aggregationType timeBucket',
    summary: 'Create a compaction rule.',
    url: 'https://oss.redislabs.com/redistimeseries/commands/#tscreaterule',
  },
  'TS DELETERULE': {
    syntax: 'TS.DELETERULE sourceKey destKey',
    summary: 'Delete a compaction rule.',
    url: 'https://oss.redislabs.com/redistimeseries/commands/#tsdeleterule',
  },
  'TS RANGE': {
    syntax: 'TS.RANGE key fromTimestamp toTimestamp [COUNT count] [AGGREGATION aggregationType timeBucket]',
    summary: 'Query a range in forward direction.',
    url: 'https://oss.redislabs.com/redistimeseries/commands/#tsrangetsrevrange',
  },
  'TS REVRANGE': {
    syntax: 'TS.REVRANGE key fromTimestamp toTimestamp [COUNT count] [AGGREGATION aggregationType timeBucket]',
    summary: 'Query a range in reverse direction.',
    url: 'https://oss.redislabs.com/redistimeseries/commands/#tsrangetsrevrange',
  },
  'TS MRANGE': {
    syntax:
      'TS.MRANGE fromTimestamp toTimestamp [COUNT count] [AGGREGATION aggregationType timeBucket] [WITHLABELS] FILTER filter..',
    summary: 'Query a range across multiple time-series by filters in forward direction.',
    url: 'https://oss.redislabs.com/redistimeseries/commands/#tsmrangetsmrevrange',
  },
  'TS MREVRANGE': {
    syntax:
      'TS.MREVRANGE fromTimestamp toTimestamp [COUNT count] [AGGREGATION aggregationType timeBucket] [WITHLABELS] FILTER filter..',
    summary: 'Query a range across multiple time-series by filters in reverse direction.',
    url: 'https://oss.redislabs.com/redistimeseries/commands/#tsmrangetsmrevrange',
  },
  'TS GET': {
    syntax: 'TS.GET key',
    summary: 'Get the last sample.',
    complexity: 'O(1)',
    url: 'https://oss.redislabs.com/redistimeseries/commands/#tsget',
  },
  'TS MGET': {
    syntax: 'TS.MGET [WITHLABELS] FILTER filter...',
    summary: 'Get the last samples matching the specific filter.',
    complexity: 'O(N), where N is a number of time-series that match the filters.',
    url: 'https://oss.redislabs.com/redistimeseries/commands/#tsmget',
  },
  'TS INFO': {
    syntax: 'TS.INFO key',
    summary: 'Return information and statistics on the time-series.',
    complexity: 'O(1)',
    url: 'https://oss.redislabs.com/redistimeseries/commands/#tsinfo',
  },
  'TS QUERYINDEX': {
    syntax: 'TS.QUERYINDEX filter...',
    summary: 'Get all the keys matching the filter list.',
    url: 'https://oss.redislabs.com/redistimeseries/commands/#tsqueryindex',
  },
};
