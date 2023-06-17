"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.axios = void 0;
const axios_1 = require("axios");
const lodash_1 = require("lodash");
const cross_fetch_1 = __importDefault(require("cross-fetch"));
const config_json_1 = __importDefault(require("./config.json"));
if (typeof globalThis !== "undefined" && globalThis.fetch == null) {
  globalThis.fetch = cross_fetch_1.default;
}
exports.default = globalThis.fetch;
const requestConfig = {
  headers: { "Passage-Version": config_json_1.default.version },
};
/**
 * Combine data and request config into one object for fetch
 * @param {string} method
 * @param {any} data
 * @param {RequestInit[]} configs
 * @return {any}
 */
function mergeConfigWithMethod(method = "GET", data, ...configs) {
  const d = data ? { body: JSON.stringify(data) } : {};
  const m = (0, lodash_1.merge)({}, requestConfig, ...configs, d, { method });
  return m;
}
/**
 * convert Response to Axios-like response
 * @param {any} response
 * @return {Promise<AxiosResponse<any>>}
 */
function makeAxiosResponse(response) {
  var _a;
  return __awaiter(this, void 0, void 0, function* () {
    const res = yield response;
    const r = {
      data: null,
      status: res.status,
      statusText: res.statusText,
      headers: res.headers,
      config: requestConfig,
      request: null,
    };
    try {
      if (
        (_a = res.headers.get("Content-Type")) === null || _a === void 0
          ? void 0
          : _a.startsWith("application/json")
      ) {
        r.data = yield res.json();
      } else {
        r.data = yield res.text();
      }
    } catch (err) {
      const e = new axios_1.AxiosError(
        err.message,
        r.statusText,
        undefined,
        undefined,
        r
      );
      r.error = e;
    }
    return r;
  });
}
exports.axios = {
  get(url, config = {}) {
    const c = mergeConfigWithMethod("GET", undefined, config);
    return makeAxiosResponse(fetch(url, c));
  },
  patch(url, data, config = {}) {
    const c = mergeConfigWithMethod("PATCH", data, config);
    return makeAxiosResponse(fetch(url, c));
  },
  put(url, data, config = {}) {
    const c = mergeConfigWithMethod("PUT", data, config);
    return makeAxiosResponse(fetch(url, c));
  },
  post(url, data, config = {}) {
    const c = mergeConfigWithMethod("POST", data, config);
    return makeAxiosResponse(fetch(url, c));
  },
  delete(url, config = {}) {
    const c = mergeConfigWithMethod("DELETE", undefined, config);
    return makeAxiosResponse(fetch(url, c));
  },
};
