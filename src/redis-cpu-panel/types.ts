import { DateTime } from '@grafana/data';

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
   * Max Items
   *
   * @type {number}
   */
  maxItemsPerSeries: number;
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
   * Time
   */
  time: DateTime;

  /**
   * User
   */
  user: number;

  /**
   * System
   */
  system: number;
}
