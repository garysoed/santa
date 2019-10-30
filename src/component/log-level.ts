/**
 * Importance level of logging.
 */
export enum LogLevel {
  /**
   * There was an error.
   */
  ERROR = 0,
  /**
   * Warns the user of something.
   */
  WARNING,
  /**
   * Information level logging, but marked as a failure.
   */
  FAILURE,
  /**
   * Information level logging, but marked as a success.
   */
  SUCCESS,
  /**
   * Information level logging, but marked as a progress.
   */
  PROGRESS,
  /**
   * Miscellaneous information. Unlike progress, this is usually the result of running a command,
   * or the starting point of a process, that is purely informational.
   */
  INFO,
  /**
   * General information, only used for debugging.
   */
  DEBUG,
}
