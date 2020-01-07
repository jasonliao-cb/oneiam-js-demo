import { waitForAngular } from "./utils";

export const TestPageUrl = "http://localhost:3000/";
export const AngularHomePageUrl = "http://localhost:3000/angular/";
export const AngularPublicPageUrl = "http://localhost:3000/angular/public";
export const AngularSecurePageUrl = "http://localhost:3000/angular/secure";
export const AngularDeepSecurePageUrl = "http://localhost:3000/angular/secure/deep";

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
