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
var __classPrivateFieldSet =
  (this && this.__classPrivateFieldSet) ||
  function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f)
      throw new TypeError("Private accessor was defined without a setter");
    if (
      typeof state === "function"
        ? receiver !== state || !f
        : !state.has(receiver)
    )
      throw new TypeError(
        "Cannot write private member to an object whose class did not declare it"
      );
    return (
      kind === "a"
        ? f.call(receiver, value)
        : f
        ? (f.value = value)
        : state.set(receiver, value),
      value
    );
  };
var __classPrivateFieldGet =
  (this && this.__classPrivateFieldGet) ||
  function (receiver, state, kind, f) {
    if (kind === "a" && !f)
      throw new TypeError("Private accessor was defined without a getter");
    if (
      typeof state === "function"
        ? receiver !== state || !f
        : !state.has(receiver)
    )
      throw new TypeError(
        "Cannot read private member from an object whose class did not declare it"
      );
    return kind === "m"
      ? f
      : kind === "a"
      ? f.call(receiver)
      : f
      ? f.value
      : state.get(receiver);
  };
var _Passage_apiKey;
import User from "./User";
import { decodeProtectedHeader, importJWK, jwtVerify } from "jose";
import { axios } from "../utils/fetch";
import { PassageError } from "./PassageError";
const AUTH_CACHE = {};
const AUTH_HOST = `https://auth.passage.id`;
const AUTH_VERSION = `v1`;
const AUTH_PATHS = [AUTH_HOST, AUTH_VERSION, `apps`];
const baseAuthURL = AUTH_PATHS.join("/");
const API_HOST = `https://api.passage.id`;
const API_VERSION = `v1`;
const API_PATHS = [API_HOST, API_VERSION, `apps`];
const baseAPIURL = API_PATHS.join("/");
/**
 * Passage Class
 */
class Passage {
  /**
   * Initialize a new Passage instance.
   * @param {PassageConfig} config The default config for Passage initialization
   */
  constructor(config) {
    _Passage_apiKey.set(this, void 0);
    if (!(config === null || config === void 0 ? void 0 : config.appID)) {
      throw new PassageError(
        "A Passage appID is required. Please include {appID: YOUR_APP_ID}."
      );
    }
    this.appID = config.appID;
    __classPrivateFieldSet(
      this,
      _Passage_apiKey,
      config === null || config === void 0 ? void 0 : config.apiKey,
      "f"
    );
    this.user = new User(config);
    this.authStrategy = (
      config === null || config === void 0 ? void 0 : config.authStrategy
    )
      ? config.authStrategy
      : "COOKIE";
  }
  /**
   * Authenticate request with a cookie, or header. If no authentication
   * strategy is given, authenticate the request via cookie (default
   * authentication strategy).
   *
   * @param {Request} req Express request
   * @return {string} UserID of the Passage user
   */
  authenticateRequest(req) {
    return __awaiter(this, void 0, void 0, function* () {
      if (this.authStrategy == "HEADER") {
        return this.authenticateRequestWithHeader(req);
      } else {
        return this.authenticateRequestWithCookie(req);
      }
    });
  }
  /**
   * Set API key for this Passage instance
   * @param {string} _apiKey
   */
  set apiKey(_apiKey) {
    __classPrivateFieldSet(this, _Passage_apiKey, _apiKey, "f");
  }
  /**
   * Get API key for this Passage instance
   * @return {string | undefined} Passage API Key
   */
  get apiKey() {
    return __classPrivateFieldGet(this, _Passage_apiKey, "f");
  }
  /**
   * Fetch the corresponding JWKS for this app.
   *
   * @param {boolean} resetCache Optional value to specify whether or not the cache should be reset
   * @return {JWKS} JWKS for this app.
   */
  fetchJWKS(resetCache) {
    return __awaiter(this, void 0, void 0, function* () {
      // use cached value if found
      if (
        AUTH_CACHE[this.appID] !== undefined &&
        Object.keys(AUTH_CACHE).length > 0 &&
        !resetCache
      ) {
        return AUTH_CACHE[this.appID]["jwks"];
      }
      const jwks = yield axios
        .get(`${baseAuthURL}/${this.appID}/.well-known/jwks.json`)
        .catch((err) => {
          throw new PassageError("Could not fetch appID's JWKs", err);
        })
        .then((res) => {
          const jwks = res.data.keys;
          const formattedJWKS = {};
          // format jwks for cache
          for (const jwk of jwks) {
            formattedJWKS[jwk.kid] = jwk;
          }
          Object.assign(AUTH_CACHE, {
            [this.appID]: { jwks: Object.assign({}, formattedJWKS) },
          });
          return formattedJWKS;
        });
      return jwks;
    });
  }
  /**
   * Authenticate a request via the http header.
   *
   * @param {Request} req Express request
   * @return {string} User ID for Passage User
   */
  authenticateRequestWithHeader(req) {
    return __awaiter(this, void 0, void 0, function* () {
      const { authorization } = req.headers;
      if (!authorization) {
        throw new PassageError(
          "Header authorization not found. You must catch this error."
        );
      } else {
        const authToken = authorization.split(" ")[1];
        const userID = yield this.validAuthToken(authToken);
        if (userID) {
          return userID;
        } else {
          throw new Error("Auth token is invalid");
        }
      }
    });
  }
  /**
   * Authenticate request via cookie.
   *
   * @param {Request} req Express request
   * @return {string} UserID for Passage User
   */
  authenticateRequestWithCookie(req) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
      const cookiesStr =
        (_a = req.headers) === null || _a === void 0 ? void 0 : _a.cookie;
      if (!cookiesStr) {
        throw new PassageError(
          "Could not find valid cookie for authentication. You must catch this error."
        );
      }
      const cookies = cookiesStr.split(";");
      let passageAuthToken;
      for (const cookie of cookies) {
        const sepIdx = cookie.indexOf("=");
        if (sepIdx === -1) {
          continue;
        }
        const key = cookie.slice(0, sepIdx).trim();
        if (key !== "psg_auth_token") {
          continue;
        }
        passageAuthToken = cookie.slice(sepIdx + 1).trim();
        break;
      }
      if (passageAuthToken) {
        const userID = yield this.validAuthToken(passageAuthToken);
        if (userID) return userID;
        else {
          throw new PassageError(
            "Could not validate auth token. You must catch this error."
          );
        }
      } else {
        throw new PassageError(
          "Could not find authentication cookie 'psg_auth_token' token. You must catch this error."
        );
      }
    });
  }
  /**
   *
   * @param {string} kid the KID from the authToken to determine which JWK to use.
   * @return {Promise<JWK | undefined>} the JWK to be used for decoding an authToken with the associated KID.
   */
  _findJWK(kid) {
    return __awaiter(this, void 0, void 0, function* () {
      if (!AUTH_CACHE) return undefined;
      try {
        const jwk = AUTH_CACHE[this.appID]["jwks"][kid];
        if (jwk) {
          return jwk;
        }
      } catch (e) {
        // if there is no JWK, cache might need to be updated; update cache and try again
        yield this.fetchJWKS(true);
        const jwk = AUTH_CACHE[this.appID]["jwks"][kid];
        if (jwk) {
          return jwk;
        }
        return undefined;
      }
    });
  }
  /**
   * Determine if the provided token is valid when compared with its
   * respective public key.
   *
   * @param {string} token Authentication token
   * @return {string} sub claim if the jwt can be verified, or undefined
   */
  validAuthToken(token) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const { kid } = decodeProtectedHeader(token);
        if (!kid) {
          return undefined;
        }
        const jwk = yield this._findJWK(kid);
        if (!jwk) {
          return undefined;
        }
        const key = yield importJWK(jwk);
        const {
          payload: { sub: userID },
        } = yield jwtVerify(token, key, {
          algorithms: [jwk.alg],
        });
        if (userID) return userID.toString();
        else return undefined;
      } catch (e) {
        return undefined;
      }
    });
  }
  /**
   * Create a Magic Link for your app.
   *
   * @param {MagicLinkRequest} magicLinkReq options for creating a MagicLink.
   * @return {Promise<MagicLinkObject>} Passage MagicLink object
   */
  createMagicLink(magicLinkReq) {
    return __awaiter(this, void 0, void 0, function* () {
      const magicLinkData = yield axios
        .post(`${baseAPIURL}/${this.appID}/magic-links/`, magicLinkReq, {
          headers: {
            Authorization: `Bearer ${__classPrivateFieldGet(
              this,
              _Passage_apiKey,
              "f"
            )}`,
          },
        })
        .catch((err) => {
          throw new PassageError(
            "Could not create a magic link for this app.",
            err
          );
        })
        .then((res) => {
          return res.data.magic_link;
        });
      return magicLinkData;
    });
  }
  /**
   * Get App Info about an app
   *
   * @return {Promise<AppObject>} Passage App object
   */
  getApp() {
    return __awaiter(this, void 0, void 0, function* () {
      const appData = yield axios
        .get(`${baseAPIURL}/${this.appID}`)
        .catch((err) => {
          throw new PassageError("Could not fetch app.", err);
        })
        .then((res) => {
          return res.data.app;
        });
      return appData;
    });
  }
}
_Passage_apiKey = new WeakMap();
export default Passage;
