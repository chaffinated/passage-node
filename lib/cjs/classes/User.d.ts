import { PassageConfig } from "../types/PassageConfig";
interface UserEventInfo {
  type: string;
  timestamp: string;
  id: string;
  ip_addr: string;
  user_agent: string;
}
interface WebAuthnDevices {
  id: string;
  cred_id: string;
  friendly_name: string;
  usage_count: number;
  updated_at: string;
  created_at: string;
  last_login_at: string;
}
declare enum UserStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  PENDING = "pending",
}
type UserStatusEnum = keyof typeof UserStatus;
export interface Metadata {
  [key: string]: boolean | string | number;
}
interface UserObject {
  created_at: string;
  updated_at: string;
  status: UserStatusEnum;
  email_verified: boolean;
  phone_verified: boolean;
  email: string;
  phone: string;
  id: string;
  last_login_at: string;
  login_count: number;
  recent_events: Array<UserEventInfo>;
  webauthn: boolean;
  webauthn_devices: Array<WebAuthnDevices>;
  user_metadata?: Metadata;
}
interface UpdateUserPayload {
  email?: string;
  phone?: string;
  user_metadata?: Metadata;
}
interface CreateUserPayload {
  email?: string;
  phone?: string;
  user_metadata?: Metadata;
}
/***/
export default class User {
  #private;
  id: string;
  /**
   * Initialize a new Passage User instance.
   *
   * @param {PassageConfig} config The default config for Passage and User initialization
   */
  constructor(config: PassageConfig);
  /**
   * Get a user's object using their user ID.
   *
   * @param {string} userID The Passage user ID
   * @return {Promise<UserObject>} Passage User object
   */
  get(userID: string): Promise<UserObject>;
  /**
   * Deactivate a user using their user ID.
   *
   * @param {string} userID The Passage user ID
   * @return {Promise<UserObject>} Passage User object
   */
  deactivate(userID: string): Promise<UserObject>;
  /**
   * Update a user.
   *
   * @param {string} userID The passage user ID
   * @param {UpdateUserPayload} payload The user attributes to be updated
   * @return {Promise<UserObject>} Pasasge User Object
   */
  update(userID: string, payload: UpdateUserPayload): Promise<UserObject>;
  /**
   * Activate a user using their user ID.
   *
   * @param {string} userID The passage user ID
   * @return {Promise<UserObject>} Passage User object
   */
  activate(userID: string): Promise<UserObject>;
  /**
   * Create a user.
   *
   * @param {CreateUserPayload} payload To create the user.
   * @return {Promise<UserObject>} Passage User object
   */
  create(payload: CreateUserPayload): Promise<UserObject>;
  /**
   * Delete a user using their user ID.
   *
   * @param {string} userID The userID used to delete the corresponding user.
   * Either an E164 phone number or email address.
   * @return {boolean} True if user was deleted, false if not
   */
  delete(userID: string): Promise<boolean>;
  /**
   * Get a user's devices using their user ID.
   *
   * @param {string} userID The Passage user ID
   * @return {Promise<Array<WebAuthnDevices>>} List of devices
   */
  listDevices(userID: string): Promise<Array<WebAuthnDevices>>;
  /**
   * Revoke a user's device using their user ID and the device ID.
   *
   * @param {string} userID The Passage user ID
   * @param {string} deviceID The Passage user's device ID
   * @return {Promise<boolean>}
   */
  revokeDevice(userID: string, deviceID: string): Promise<boolean>;
  /**
   * Revokes all of a user's Refresh Tokens using their User ID.
   *
   * @param {string} userID The Passage user ID
   * @return {Promise<boolean>}
   */
  signOut(userID: string): Promise<boolean>;
}
export {};
