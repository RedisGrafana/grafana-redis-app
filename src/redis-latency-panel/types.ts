import { DataFrame, DataQuery, PanelProps } from '@grafana/data';

/**
 * Panel Options
 */
export interface PanelOptions {
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
}

/**
 * Properties
 */
export interface Props extends PanelProps<PanelOptions> {}

/**
 * State
 */
export interface State {
  /**
   * Table Data Frame
   *
   * @type {DataFrame | null}
   */
  tableDataFrame: DataFrame | null;

  /**
   * Current Data Frame
   *
   * @type {DataFrame | null}
   */
  currentDataFrame: DataFrame | null;
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
