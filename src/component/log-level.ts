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
   * General information, only used for debugging.
   */
  DEBUG,
}
