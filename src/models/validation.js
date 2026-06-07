/**
 * @typedef {object} ErrorDetail
 * @property {unknown} [context]
 * @property {ErrorCode} [code]
 * @property {number} [serverCode]
 */

/**
 * @typedef {ErrorDetail & { header: string, message: string }} ValidationError
 */

export class Validation {
  /** @type {ValidationError[]} */
  errors = [];

  static types = Object.freeze({
    MALFORMED: 1000,
    INVALIDARG: 1001,
    MISSINGARG: 1002,
    NOTFOUND: 1003,
    CONNECTIONERROR: 1004,
    UNAUTHENTICATED: 1005,
    RETRIEVALERROR: 1006,
    NOTSUPPORTED: 1007,
    UNEXPECTED: 1008,
    NOOP: 1009,
  });

  get state() {
    return this.errors.length <= 0;
  }

  get error() {
    return this.errors?.[0];
  }

  /** @param {ValidationError} errorObj */
  add(errorObj) {
    if (!this.errors.includes(errorObj)) {
      this.errors.push(errorObj);
    }
  }

  /**
   * @param {string} header
   * @param {string} message
   * @param {ErrorDetail} [detailsObj]
   * @returns {Validation}
   */
  addError(header, message, detailsObj) {
    /** @type {ValidationError} */
    const retObj = {
      header,
      message,
    };

    if (detailsObj) {
      retObj.context = detailsObj.context;
      retObj.code = detailsObj.code;
      if (detailsObj.serverCode) {
        retObj.serverCode = detailsObj.serverCode;
      }
    }

    this.add(retObj);

    return this;
  }

  /**
   * @param {Validation} validation
   * @returns {Validation}
   */
  merge(validation) {
    if (!(validation instanceof Validation)) {
      throw new Error(
        "Invalid argument: validation must be instance of Validation",
      );
    }
    Array.prototype.push.apply(this.errors, validation.errors);

    return this;
  }
}

/** @typedef {(typeof Validation.types)[keyof typeof Validation.types]} ErrorCode */
