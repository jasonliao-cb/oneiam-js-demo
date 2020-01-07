import { expect } from "chai";
import { OneiamAuthenticateResult } from "../../src";
import { changeConfig, mockLocation, redirected, redirectUrl } from "./helpers/mock";
import { openTestPage, TestPageUrl } from "./helpers/nav";
import { oneiam } from "./helpers/oneiam";
import { loginOneiam, logoutLocally, logoutOneiam } from "./helpers/session";

describe("oneiam.authenticate", function () {
  context("silent: false", function () {
    it("should redirect to authenticate uri", function () {
      logoutOneiam();
      logoutLocally();
      openTestPage();

      let result: OneiamAuthenticateResult;

      mockLocation();
      result = oneiam.authenticate({ silent: false });
      expect(result).to.equal("authenticate");
      expect(redirected()).to.be.true;
      expect(redirectUrl()).to.equal(`/oneiam/authenticate?next=${encodeURIComponent(TestPageUrl)}`);

      mockLocation();
      result = oneiam.authenticate({ silent: false, next: "https://custom/next/url?with=query" });
      expect(result).to.equal("authenticate");
      expect(redirected()).to.be.true;
      expect(redirectUrl()).to.equal("/oneiam/authenticate?next=https%3A%2F%2Fcustom%2Fnext%2Furl%3Fwith%3Dquery");

      changeConfig({ authenticateUri: "/custom/authenticate" });
      mockLocation();
      result = oneiam.authenticate({ silent: false });
      expect(result).to.equal("authenticate");
      expect(redirected()).to.be.true;
      expect(redirectUrl()).to.equal(`/custom/authenticate?next=${encodeURIComponent(TestPageUrl)}`);
    });
  });

  context("silent: true", function () {
    it("should authenticate silently", function () {
      logoutOneiam();
      logoutLocally();
      openTestPage();
      mockLocation();

      let result: OneiamAuthenticateResult;

      result = oneiam.authenticate({ silent: true });
      expect(result).to.equal("unauthenticated");
      expect(oneiam.authenticated()).to.be.false;
      expect(oneiam.session.changed()).to.be.false;
      expect(redirected()).to.be.false;

      loginOneiam();
      result = oneiam.authenticate({ silent: true });
      expect(result).to.equal("authenticated");
      expect(oneiam.authenticated()).to.be.true;
      expect(oneiam.session.changed()).to.be.false;
      expect(redirected()).to.be.false;

      logoutOneiam();
      result = oneiam.authenticate({ silent: true });
      expect(result).to.equal("unauthenticated");
      expect(oneiam.authenticated()).to.be.false;
      expect(oneiam.session.changed()).to.be.false;
      expect(redirected()).to.be.false;
    });
  });
});
