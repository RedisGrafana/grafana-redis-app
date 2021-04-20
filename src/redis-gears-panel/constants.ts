/**
 * Default script
 */
export const DefaultScript = 'gb = GearsBuilder()';

/**
 * Execution Mode
 */
export enum ExecutionMode {
  Blocking = 0,
  Unblocking = 1,
}

/**
 * Unblocking options
 */
export const ExecutionOptions = [
  {
    label: 'Blocking',
    value: ExecutionMode.Blocking,
  },
  {
    label: 'Unblocking',
    value: ExecutionMode.Unblocking,
  },
];
