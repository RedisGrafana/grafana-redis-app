import { DataQuery, DateTime } from '@grafana/data';

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

  /**
   * View Mode
   *
   * @type {ViewMode}
   */
  viewMode: ViewMode;

  /**
   * Max Items
   *
   * @type {number}
   */
  maxItemsPerSeries: number;

  /**
   * Hide Zero series
   *
   * @type {boolean}
   */
  hideZero: boolean;
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
}

/**
 * Object which keeps SeriesValue[] by command name
 */
export interface SeriesMap {
  [key: string]: SeriesValue[];
}

/**
 * Series Value
 */
export interface SeriesValue {
  time: DateTime;
  value: number;
}

/**
 * Calculation
 */
export interface ValuesForCalculation {
  /**
   * Calls
   */
  calls: number[];

  /**
   * Duration
   */
  duration: number[];
}

/**
 * Fields
 */
export enum FieldName {
  Command = 'Command',
  Calls = 'Calls',
  Duration = 'Usec',
  DurationPerCall = 'Usec_per_call',
  Latency = 'Latency',
}

/**
 * Table Field names
 */
export const DisplayNameByFieldName = {
  [FieldName.Command]: 'Command',
  [FieldName.Calls]: 'Number of calls',
  [FieldName.Duration]: 'Total Duration',
  [FieldName.DurationPerCall]: 'Duration per call',
  [FieldName.Latency]: 'Latency',
};

/**
 * Default refresh interval
 */
export const DefaultInterval = 1000;

/**
 * View Modes
 */
export enum ViewMode {
  Table = 'Table',
  Graph = 'Graph',
}

/**
 * Max items per series
 */
export const MaxItemsPerSeries = 1000;
