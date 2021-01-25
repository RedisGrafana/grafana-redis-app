/**
 * Default refresh interval
 */
export const DefaultInterval = 1000;

/**
 * Max items per series
 */
export const MaxItemsPerSeries = 300;

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
 * View Modes
 */
export enum ViewMode {
  Table = 'Table',
  Graph = 'Graph',
}

/**
 * View Mode options
 */
export const ViewModeOptions = [
  {
    label: 'Table',
    value: ViewMode.Table,
  },
  {
    label: 'Graph',
    value: ViewMode.Graph,
  },
];
