import { NgZone } from "@angular/core";
import { openTestPage } from "./nav";

declare var ngZone: NgZone; // for browser.execute

export function runInNewWindow<T>(callback: () => T): T {
  const oldWindow = browser.getWindowHandle();
  const newWindow = browser.newWindow("about:blank", "_blank");
  const result = callback();

  if (browser.getWindowHandle() === newWindow) {
    browser.closeWindow();
  }

  browser.switchToWindow(oldWindow);
  return result;
}

export function runInOneiamContext<T>(callback: () => T): T {
  const hasOneiam = browser.execute(() => !!(window as any).oneiam);
  if (hasOneiam) {
    return callback();
  } else {
    return runInNewWindow(() => {
      openTestPage();
      return callback();
    });
  }
}

export function runInTestPage<T>(callback: () => T): T {
  return runInOneiamContext(callback);
}

export function waitForAngular(): void {
  browser.executeAsync(done => {
    if (ngZone.isStable && !ngZone.hasPendingMacrotasks) {
      return done();
    }
    const subscription = ngZone.onStable.subscribe(() => {
      if (!ngZone.hasPendingMacrotasks) {
        subscription.unsubscribe();
        done();
      }
    });
  });
}
