import { expect } from "chai";
import { openTestPage } from "./nav";
import { oneiam } from "./oneiam";
import { runInNewWindow, runInOneiamContext, runInTestPage } from "./utils";

export const OneiamLoginPageUrl = "https://wwwtest.auth.careerbuilder.com/account/login";
export const OneiamLogoutPageUrl = "https://wwwtest.auth.careerbuilder.com/account/logout";
export const TestUserEmail = "cbtest.us@gmail.com";
export const TestUserPassword = "c0lumbusrocks!";

export function loginOneiam(): void {
  runInNewWindow(() => {
    browser.navigateTo(OneiamLoginPageUrl);
    if ($("#aspnetForm").isExisting()) {
      $("#Input_Email").setValue(TestUserEmail);
      $("#Input_Password").setValue(TestUserPassword);
      $("#aspnetForm button[type='submit']").click();
      browser.waitUntil(() => browser.getUrl() !== OneiamLoginPageUrl);
    }
  });
}

export function logoutOneiam(): void {
  runInNewWindow(() => {
    browser.navigateTo(OneiamLogoutPageUrl);
    browser.deleteAllCookies();
  });
}

export function syncLocal(): void {
  runInOneiamContext(() => {
    oneiam.authenticate({ silent: true });
  });
}

export function logoutLocally(): void {
  runInTestPage(() => {
    browser.deleteAllCookies();
  });
}

export function prepareSession(localAuthenticated: boolean, oneiamAuthenticated: boolean, stateChanged?: boolean): void {
  openTestPage();

  if (!localAuthenticated && !oneiamAuthenticated) {
    logoutOneiam();
    logoutLocally();
    expect(oneiam.authenticated()).to.be.false;
    expect(oneiam.session.state).not.to.exist;
    return;
  }

  if (!localAuthenticated && oneiamAuthenticated) {
    loginOneiam();
    logoutLocally();
    expect(oneiam.authenticated()).to.be.true;
    expect(oneiam.session.state).not.to.exist;
    return;
  }

  if (localAuthenticated && !oneiamAuthenticated) {
    loginOneiam();
    syncLocal();
    logoutOneiam();
    expect(oneiam.authenticated()).to.be.false;
    expect(oneiam.session.state).to.be.a("string");
  }

  if (localAuthenticated && oneiamAuthenticated && !stateChanged) {
    loginOneiam();
    syncLocal();
    expect(oneiam.authenticated()).to.be.true;
    expect(oneiam.session.state).to.be.a("string");
    expect(oneiam.session.changed()).to.be.false;
  }

  if (localAuthenticated && oneiamAuthenticated && stateChanged) {
    loginOneiam();
    syncLocal();
    logoutOneiam();
    loginOneiam();
    expect(oneiam.authenticated()).to.be.true;
    expect(oneiam.session.state).to.be.a("string");
    expect(oneiam.session.changed()).to.be.true;
  }
}
