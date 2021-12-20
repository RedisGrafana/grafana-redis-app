import { DateTime } from '@grafana/data';
import { ViewMode } from './constants';

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
