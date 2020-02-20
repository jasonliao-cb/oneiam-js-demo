import { waitForAngular } from "./utils";

export const BaseUrl = process.env.TEST_SERVER || "http://localhost:3000";
export const TestPageUrl = BaseUrl + "/";
export const AngularHomePageUrl = BaseUrl + "/angular/";
export const AngularPublicPageUrl = BaseUrl + "/angular/public";
export const AngularSecurePageUrl = BaseUrl + "/angular/secure";
export const AngularDeepSecurePageUrl = BaseUrl + "/angular/secure/deep";

export function openTestPage(): void {
  browser.navigateTo(TestPageUrl);
}

export function openAngularHomePage(): void {
  browser.navigateTo(AngularHomePageUrl);
}

export function openAngularPublicPage(): void {
  browser.navigateTo(AngularPublicPageUrl);
}

export function openAngularSecurePage(): void {
  browser.navigateTo(AngularSecurePageUrl);
}

export function openAngularDeepSecurePage(): void {
  browser.navigateTo(AngularDeepSecurePageUrl);
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
