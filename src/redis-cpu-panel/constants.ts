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
  User = 'used_cpu_user',
  System = 'used_cpu_sys',
}

/**
 * Table Field names
 */
export const DisplayNameByFieldName = {
  [FieldName.System]: 'System',
  [FieldName.User]: 'User',
};
