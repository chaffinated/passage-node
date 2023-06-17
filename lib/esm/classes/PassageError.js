/**
 * Check if Error looks like AxiosError.
 * @param {Error} e the error
 * @return {boolean} whether it looks like an AxiosError
 */
function isAxiosError(e) {
  return e.isAxiosError === true;
}
/**
 * Passage Class
 */
export class PassageError extends Error {
  /**
   * Initialize a new PassageError instance.
   * @param {string} message friendly message,
   * @param {Error} err error from axios request
   */
  constructor(message, err) {
    var _a, _b, _c;
    super();
    this.message = message;
    if (err && isAxiosError(err)) {
      this.statusCode =
        (_a = err.response) === null || _a === void 0 ? void 0 : _a.status;
      this.statusText =
        (_b = err.response) === null || _b === void 0 ? void 0 : _b.statusText;
      this.error =
        (_c = err.response) === null || _c === void 0 ? void 0 : _c.data.error;
    } else {
      this.error = err === null || err === void 0 ? void 0 : err.message;
    }
  }
}
