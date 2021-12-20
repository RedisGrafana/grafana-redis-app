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
 * Display Fields
 */
export enum DisplayFieldName {
  User = 'user',
  System = 'system',
}

/**
 * Table Field names
 */
export const DisplayNameByFieldName = {
  [DisplayFieldName.System]: 'System',
  [DisplayFieldName.User]: 'User',
};
