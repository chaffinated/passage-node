declare enum AuthStrategyEnum {
  COOKIE = "COOKIE",
  HEADER = "HEADER",
}
export type AuthStrategy = keyof typeof AuthStrategyEnum;
export {};