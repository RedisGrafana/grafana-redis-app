/**
 * Panel Options
 */
export interface PanelOptions {
  /**
   * Query command
   *
   * @type {string}
   */
  query: string;

  /**
   * Raw or CLI mode
   *
   * @type {boolean}
   */
  raw?: boolean;

  /**
   * Command's output
   *
   * @type {string}
   */
  output: string;

  /**
   * Query help
   *
   * @type {HelpCommand}
   */
  help: HelpCommand;
}

/**
 * Redis Commands help
 */
export interface HelpCommand {
  /**
   * Syntax
   *
   * @type {string}
   */
  syntax?: string;

  /**
   * Summary
   *
   * @type {string}
   */
  summary?: string;

  /**
   * Complexity
   *
   * @type {string}
   */
  complexity?: string;

  /**
   * Dangerous commands
   *
   * @type {string}
   */
  danger?: string;

  /**
   * Not recommended for Production
   *
   * @type {string}
   */
  warning?: string;

  /**
   * Since
   *
   * @type {string}
   */
  since?: string;

  /**
   * URL
   *
   * @type {string}
   */
  url?: string;
}
