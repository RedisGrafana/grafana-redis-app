/**
 * Default refresh interval
 */
export const DefaultInterval = 1000;

/**
 * Default result's size
 */
export const DefaultSize = 10;

/**
 * Default SCAN count
 */
export const DefaultCount = 100;

/**
 * Default SCAN pattern
 */
export const DefaultPattern = '*';

/**
 * Query Type
 */
export enum QueryType {
  Data = 'Data',
  TotalKeys = 'TotalKeys',
}

/**
 * Fields
 */
export enum FieldName {
  Key = 'key',
  Type = 'type',
  Memory = 'memory',
}

/**
 * Table Field names
 */
export const DisplayNameByFieldName = {
  [FieldName.Key]: 'Key',
  [FieldName.Type]: 'Type',
  [FieldName.Memory]: 'Memory',
};
