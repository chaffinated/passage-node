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
var _User_appID, _User_apiKey, _User_authorizationHeader;
Object.defineProperty(exports, "__esModule", { value: true });
const fetch_1 = require("../utils/fetch");
const PassageError_1 = require("./PassageError");
var UserStatus;
(function (UserStatus) {
  UserStatus["ACTIVE"] = "active";
  UserStatus["INACTIVE"] = "inactive";
  UserStatus["PENDING"] = "pending";
})(UserStatus || (UserStatus = {}));
/***/
class User {
  /**
   * Initialize a new Passage User instance.
   *
   * @param {PassageConfig} config The default config for Passage and User initialization
   */
  constructor(config) {
    _User_appID.set(this, void 0);
    _User_apiKey.set(this, void 0);
    _User_authorizationHeader.set(this, void 0);
    __classPrivateFieldSet(
      this,
      _User_appID,
      config.appID ? config.appID : "",
      "f"
    );
    __classPrivateFieldSet(
      this,
      _User_apiKey,
      config.apiKey ? config.apiKey : "",
      "f"
    );
    this.id = "";
    if (__classPrivateFieldGet(this, _User_apiKey, "f")) {
      __classPrivateFieldSet(
        this,
        _User_authorizationHeader,
        {
          headers: {
            Authorization: `Bearer ${__classPrivateFieldGet(
              this,
              _User_apiKey,
              "f"
            )}`,
          },
        },
        "f"
      );
    } else {
      __classPrivateFieldSet(this, _User_authorizationHeader, undefined, "f");
    }
  }
  /**
   * Get a user's object using their user ID.
   *
   * @param {string} userID The Passage user ID
   * @return {Promise<UserObject>} Passage User object
   */
  get(userID) {
    return __awaiter(this, void 0, void 0, function* () {
      if (!__classPrivateFieldGet(this, _User_apiKey, "f")) {
        throw new PassageError_1.PassageError("A Passage API key is needed.");
      }
      const userData = yield fetch_1.axios
        .get(
          `https://api.passage.id/v1/apps/${__classPrivateFieldGet(
            this,
            _User_appID,
            "f"
          )}/users/${userID}`,
          __classPrivateFieldGet(this, _User_authorizationHeader, "f")
        )
        .catch((err) => {
          throw new PassageError_1.PassageError("Could not fetch user.", err);
        })
        .then((res) => {
          return res.data.user;
        });
      return userData;
    });
  }
  /**
   * Deactivate a user using their user ID.
   *
   * @param {string} userID The Passage user ID
   * @return {Promise<UserObject>} Passage User object
   */
  deactivate(userID) {
    return __awaiter(this, void 0, void 0, function* () {
      if (!__classPrivateFieldGet(this, _User_apiKey, "f")) {
        throw new PassageError_1.PassageError("A Passage API key is needed.");
      }
      const userData = yield fetch_1.axios
        .patch(
          `https://api.passage.id/v1/apps/${__classPrivateFieldGet(
            this,
            _User_appID,
            "f"
          )}/users/${userID}/deactivate`,
          null, // note that this null is required as axios.patch has different param order than axios.get
          __classPrivateFieldGet(this, _User_authorizationHeader, "f")
        )
        .catch((err) => {
          throw new PassageError_1.PassageError(
            "Could not deactivate user.",
            err
          );
        })
        .then((res) => {
          return res.data.user;
        });
      return userData;
    });
  }
  /**
   * Update a user.
   *
   * @param {string} userID The passage user ID
   * @param {UpdateUserPayload} payload The user attributes to be updated
   * @return {Promise<UserObject>} Pasasge User Object
   */
  update(userID, payload) {
    return __awaiter(this, void 0, void 0, function* () {
      if (!__classPrivateFieldGet(this, _User_apiKey, "f")) {
        throw new PassageError_1.PassageError("A Passage API key is needed.");
      }
      const userData = yield fetch_1.axios
        .patch(
          `https://api.passage.id/v1/apps/${__classPrivateFieldGet(
            this,
            _User_appID,
            "f"
          )}/users/${userID}`,
          payload,
          __classPrivateFieldGet(this, _User_authorizationHeader, "f")
        )
        .catch((err) => {
          throw new PassageError_1.PassageError("Could not update user.", err);
        })
        .then((res) => {
          return res.data.user;
        });
      return userData;
    });
  }
  /**
   * Activate a user using their user ID.
   *
   * @param {string} userID The passage user ID
   * @return {Promise<UserObject>} Passage User object
   */
  activate(userID) {
    return __awaiter(this, void 0, void 0, function* () {
      if (!__classPrivateFieldGet(this, _User_apiKey, "f")) {
        throw new PassageError_1.PassageError("A Passage API key is needed");
      }
      const userData = yield fetch_1.axios
        .patch(
          `https://api.passage.id/v1/apps/${__classPrivateFieldGet(
            this,
            _User_appID,
            "f"
          )}/users/${userID}/activate`,
          null, // note that this null is required as axios.patch has different param order than axios.get
          __classPrivateFieldGet(this, _User_authorizationHeader, "f")
        )
        .catch((err) => {
          throw new PassageError_1.PassageError("Could not activate user", err);
        })
        .then((res) => {
          return res.data.user;
        });
      return userData;
    });
  }
  /**
   * Create a user.
   *
   * @param {CreateUserPayload} payload To create the user.
   * @return {Promise<UserObject>} Passage User object
   */
  create(payload) {
    return __awaiter(this, void 0, void 0, function* () {
      if (!__classPrivateFieldGet(this, _User_apiKey, "f")) {
        throw new PassageError_1.PassageError("A Passage API key is needed");
      }
      const userData = yield fetch_1.axios
        .post(
          `https://api.passage.id/v1/apps/${__classPrivateFieldGet(
            this,
            _User_appID,
            "f"
          )}/users/`,
          payload,
          __classPrivateFieldGet(this, _User_authorizationHeader, "f")
        )
        .catch((err) => {
          throw new PassageError_1.PassageError("Could not create user", err);
        })
        .then((res) => {
          return res.data.user;
        });
      return userData;
    });
  }
  /**
   * Delete a user using their user ID.
   *
   * @param {string} userID The userID used to delete the corresponding user.
   * Either an E164 phone number or email address.
   * @return {boolean} True if user was deleted, false if not
   */
  delete(userID) {
    return __awaiter(this, void 0, void 0, function* () {
      if (!__classPrivateFieldGet(this, _User_apiKey, "f")) {
        throw new PassageError_1.PassageError("A Passage API key is needed");
      }
      const response = yield fetch_1.axios
        .delete(
          `https://api.passage.id/v1/apps/${__classPrivateFieldGet(
            this,
            _User_appID,
            "f"
          )}/users/${userID}`,
          __classPrivateFieldGet(this, _User_authorizationHeader, "f")
        )
        .catch((err) => {
          throw new PassageError_1.PassageError("Could not delete user.", err);
        })
        .then((res) => {
          return res.status.valueOf();
        });
      return response === 200;
    });
  }
  /**
   * Get a user's devices using their user ID.
   *
   * @param {string} userID The Passage user ID
   * @return {Promise<Array<WebAuthnDevices>>} List of devices
   */
  listDevices(userID) {
    return __awaiter(this, void 0, void 0, function* () {
      if (!__classPrivateFieldGet(this, _User_apiKey, "f")) {
        throw new PassageError_1.PassageError("A Passage API key is needed");
      }
      const devices = yield fetch_1.axios
        .get(
          `https://api.passage.id/v1/apps/${__classPrivateFieldGet(
            this,
            _User_appID,
            "f"
          )}/users/${userID}/devices`,
          __classPrivateFieldGet(this, _User_authorizationHeader, "f")
        )
        .catch((err) => {
          throw new PassageError_1.PassageError(
            "Could not fetch user's devices.",
            err
          );
        })
        .then((res) => {
          return res.data.devices;
        });
      return devices;
    });
  }
  /**
   * Revoke a user's device using their user ID and the device ID.
   *
   * @param {string} userID The Passage user ID
   * @param {string} deviceID The Passage user's device ID
   * @return {Promise<boolean>}
   */
  revokeDevice(userID, deviceID) {
    return __awaiter(this, void 0, void 0, function* () {
      if (!__classPrivateFieldGet(this, _User_apiKey, "f")) {
        throw new PassageError_1.PassageError("A Passage API key is needed");
      }
      const success = yield fetch_1.axios
        .delete(
          `https://api.passage.id/v1/apps/${__classPrivateFieldGet(
            this,
            _User_appID,
            "f"
          )}/users/${userID}/devices/${deviceID}`,
          __classPrivateFieldGet(this, _User_authorizationHeader, "f")
        )
        .catch((err) => {
          throw new PassageError_1.PassageError(
            "Could not delete user's device",
            err
          );
        })
        .then(() => {
          return true;
        });
      return success;
    });
  }
  /**
   * Revokes all of a user's Refresh Tokens using their User ID.
   *
   * @param {string} userID The Passage user ID
   * @return {Promise<boolean>}
   */
  signOut(userID) {
    return __awaiter(this, void 0, void 0, function* () {
      if (!__classPrivateFieldGet(this, _User_apiKey, "f")) {
        throw new PassageError_1.PassageError("A Passage API key is needed");
      }
      return fetch_1.axios
        .delete(
          `https://api.passage.id/v1/apps/${__classPrivateFieldGet(
            this,
            _User_appID,
            "f"
          )}/users/${userID}/tokens/`,
          __classPrivateFieldGet(this, _User_authorizationHeader, "f")
        )
        .catch((err) => {
          throw new PassageError_1.PassageError(
            "Could not revoke user's refresh tokens.",
            err
          );
        })
        .then(() => {
          return true;
        });
    });
  }
}
(_User_appID = new WeakMap()),
  (_User_apiKey = new WeakMap()),
  (_User_authorizationHeader = new WeakMap());
exports.default = User;
