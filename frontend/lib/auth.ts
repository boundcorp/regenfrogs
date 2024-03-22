import {
  useMyProfileQuery, UserProfileFragment,
} from "../generated/graphql";
import {useCallback} from "react";
import {useEasySnackbar} from "./snackbar";
import {useProfile} from "../components/Auth/ProfileProvider";
import {useRouter} from "next/router";

const AUTH_TOKEN_KEY = "token";
const REFRESH_TOKEN_KEY = "refresh_token";
const REFRESH_AFTER_KEY = "refresh_after";
const REFRESH_UNTIL_KEY = "refresh_until";

export const getAuthToken = () => process.browser && window.localStorage.getItem(AUTH_TOKEN_KEY) || "";

export const getRefreshToken = () =>
  process.browser && localStorage.getItem(REFRESH_TOKEN_KEY) || "";

export const setAuthToken = (
  token: string,
  refreshToken: string,
  refresh_after?: Date,
  refresh_expires?: Date
) => {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  localStorage.setItem(
    REFRESH_AFTER_KEY,
    (
      refresh_after || new Date(new Date().getTime() + 1000 * 60 * 59)
    ).toISOString()
  ); // Refresh 1 minute before expiry
  localStorage.setItem(
    REFRESH_UNTIL_KEY,
    (
      refresh_expires || new Date(new Date().getTime() + 1000 * 86400 * 7)
    ).toISOString()
  ); // Refresh 7 days after issuance
};

export enum TokenStatus {
  NONE = "NONE",
  VALID = "VALID",
  REFRESH = "REFRESH",
  EXPIRED = "EXPIRED",
}

export const parseLocalstorageDate = (key: string) => {
  const localString = process.browser && window.localStorage.getItem(key);
  if (!localString) return false;

  const parsed = new Date(localString);
  if (parsed.getFullYear() === 1970) return false;

  return parsed;
};

export const tokenRefreshAfter = () => {
  return parseLocalstorageDate(REFRESH_AFTER_KEY);
};
export const tokenRefreshUntil = () => {
  return parseLocalstorageDate(REFRESH_UNTIL_KEY);
};

export const tokenStatus = () => {
  const refresh_after = tokenRefreshAfter();
  const refresh_until = tokenRefreshUntil();
  if (!refresh_after || !refresh_until) return TokenStatus.NONE;

  const now = new Date();
  if (now < refresh_after) return TokenStatus.VALID;

  if (now < refresh_until) return TokenStatus.REFRESH;

  return TokenStatus.EXPIRED;
};

export const clearAuthToken = () => localStorage.clear();
export const clearAuthAndLogout = () => {
  console.debug("Clear auth and log out")
  clearAuthToken();
  if(process.browser && window?.location)
    window.location.pathname = "/";
};