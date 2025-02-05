import { AuthStrategy } from "../types/AuthStrategy";
import { MagicLinkObject, MagicLinkRequest } from "../types/MagicLink";
import { AppObject } from "../types/App";
import User from "./User";
import { Request } from "express-serve-static-core";
import { PassageConfig } from "../types/PassageConfig";
import { JWKS } from "../types/JWKS";
/**
 * Passage Class
 */
export default class Passage {
  #private;
  appID: string;
  authStrategy: AuthStrategy;
  user: User;
  /**
   * Initialize a new Passage instance.
   * @param {PassageConfig} config The default config for Passage initialization
   */
  constructor(config?: PassageConfig);
  /**
   * Authenticate request with a cookie, or header. If no authentication
   * strategy is given, authenticate the request via cookie (default
   * authentication strategy).
   *
   * @param {Request} req Express request
   * @return {string} UserID of the Passage user
   */
  authenticateRequest(req: Request): Promise<string>;
  /**
   * Set API key for this Passage instance
   * @param {string} _apiKey
   */
  set apiKey(_apiKey: string | undefined);
  /**
   * Get API key for this Passage instance
   * @return {string | undefined} Passage API Key
   */
  get apiKey(): string | undefined;
  /**
   * Fetch the corresponding JWKS for this app.
   *
   * @param {boolean} resetCache Optional value to specify whether or not the cache should be reset
   * @return {JWKS} JWKS for this app.
   */
  fetchJWKS(resetCache?: boolean): Promise<JWKS>;
  /**
   * Authenticate a request via the http header.
   *
   * @param {Request} req Express request
   * @return {string} User ID for Passage User
   */
  authenticateRequestWithHeader(req: Request): Promise<string>;
  /**
   * Authenticate request via cookie.
   *
   * @param {Request} req Express request
   * @return {string} UserID for Passage User
   */
  authenticateRequestWithCookie(req: Request): Promise<string>;
  /**
   *
   * @param {string} kid the KID from the authToken to determine which JWK to use.
   * @return {Promise<JWK | undefined>} the JWK to be used for decoding an authToken with the associated KID.
   */
  private _findJWK;
  /**
   * Determine if the provided token is valid when compared with its
   * respective public key.
   *
   * @param {string} token Authentication token
   * @return {string} sub claim if the jwt can be verified, or undefined
   */
  validAuthToken(token: string): Promise<string | undefined>;
  /**
   * Create a Magic Link for your app.
   *
   * @param {MagicLinkRequest} magicLinkReq options for creating a MagicLink.
   * @return {Promise<MagicLinkObject>} Passage MagicLink object
   */
  createMagicLink(magicLinkReq: MagicLinkRequest): Promise<MagicLinkObject>;
  /**
   * Get App Info about an app
   *
   * @return {Promise<AppObject>} Passage App object
   */
  getApp(): Promise<AppObject>;
}
