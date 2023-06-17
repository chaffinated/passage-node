"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const config_json_1 = __importDefault(require("./config.json"));
const instance = axios_1.default.create({
  headers: { "Passage-Version": config_json_1.default.version },
});
exports.default = instance;
