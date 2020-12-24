import querystring from "querystring";
import { waitForAngular } from "./utils";

export const Server0Origin = process.env.TEST_SERVER_0 || "http://localhost:3000";
export const Server1Origin = process.env.TEST_SERVER_1 || "http://localhost:3001";
export const TestPagePath = "/";
export const AngularHomePagePath = "/angular/";
export const AngularPublicPagePath = "/angular/public";
export const AngularSecurePagePath = "/angular/secure";
export const AngularDeepSecurePagePath = "/angular/secure/deep";

export interface NavigationOptions {
  server?: number;
  query?: any;
}

export function getTestPageUrl(options?: NavigationOptions): string {
  return getNavUrl(TestPagePath, options);
}

export function openTestPage(options?: NavigationOptions): void {
  browser.navigateTo(getTestPageUrl(options));
}

export function getAngularHomePageUrl(options?: NavigationOptions): string {
  return getNavUrl(AngularHomePagePath, options);
}

export function openAngularHomePage(options?: NavigationOptions): void {
  browser.navigateTo(getAngularHomePageUrl(options));
}

export function getAngularPublicPageUrl(options?: NavigationOptions): string {
  return getNavUrl(AngularPublicPagePath, options);
}

export function openAngularPublicPage(options?: NavigationOptions): void {
  browser.navigateTo(getAngularPublicPageUrl(options));
}

export function getAngularSecurePageUrl(options?: NavigationOptions): string {
  return getNavUrl(AngularSecurePagePath, options);
}

export function openAngularSecurePage(options?: NavigationOptions): void {
  browser.navigateTo(getAngularSecurePageUrl(options));
}

export function getAngularDeepSecurePageUrl(options?: NavigationOptions): string {
  return getNavUrl(AngularDeepSecurePagePath, options);
}

export function openAngularDeepSecurePage(options?: NavigationOptions): void {
  browser.navigateTo(getAngularDeepSecurePageUrl(options));
}

export function clickAngularPublicPageLink(): void {
  $("a[href='/angular/public']").click();
  waitForAngular();
}

export function clickAngularSecurePageLink(): void {
  $("a[href='/angular/secure']").click();
  waitForAngular();
}

export function clickAngularDeepSecurePageLink(): void {
  $("a[href='/angular/secure/deep']").click();
  waitForAngular();
}

function getNavUrl(path: string, options?: NavigationOptions): string {
  const origin = options?.server !== 1 ? Server0Origin : Server1Origin;
  const query = querystring.stringify(options?.query);
  if (query) {
    return origin + path + "?" + query;
  } else {
    return origin + path;
  }
}
