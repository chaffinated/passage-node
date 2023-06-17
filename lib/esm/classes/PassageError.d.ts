/**
 * Passage Class
 */
export declare class PassageError extends Error {
  readonly statusCode: number | undefined;
  readonly statusText: string | undefined;
  readonly error: string | undefined;
  readonly message: string;
  /**
   * Initialize a new PassageError instance.
   * @param {string} message friendly message,
   * @param {Error} err error from axios request
   */
  constructor(message: string, err?: Error);
}
