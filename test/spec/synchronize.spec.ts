import { expect } from "chai";
import { OneiamSynchronizeResult } from "../../src";
import { mockLocation, redirected, redirectUrl, refreshed } from "./helpers/mock";
import { openTestPage, TestPageUrl } from "./helpers/nav";
import { oneiam } from "./helpers/oneiam";
import { prepareSession } from "./helpers/session";

describe("oneiam.synchronize", function () {
  context("local authenticated: false, oneiam authenticated: false", function () {
    beforeEach(() => prepare(false, false));

    context("require authentication: false", function () {
      it("should do nothing", function () {
        const result = oneiam.synchronize({ /* requireAuthentication: false, */ refreshOnChange: true /* any */ });
        expect(result).to.equal("noop");
        expect(oneiam.authenticated()).to.be.false;
        expect(oneiam.session.changed()).to.be.false;
        expect(redirected()).to.be.false;
        expect(refreshed()).to.be.false;
      });
    });

    context("require authentication: true", function () {
      it("should redirect to OneIAM", function () {
        const result = oneiam.synchronize({ requireAuthentication: true });
        expect(result).to.equal("authenticate");
        expect(redirected()).to.be.true;
        expect(redirectUrl()).to.equal(`/oneiam/authenticate?next=${encodeURIComponent(TestPageUrl)}`);
        // we expect /oneiam/authenticate to redirect to OneIAM
      });
    });
  });

  context("local authenticated: false, oneiam authenticated: true", function () {
    beforeEach(() => prepare(false, true));

    context("refresh on change: false", function () {
      it("should authenticate silently", function () {
        const result = oneiam.synchronize({ refreshOnChange: false });
        expect(result).to.equal("authenticated");
        expect(oneiam.authenticated()).to.be.true;
        expect(oneiam.session.changed()).to.be.false;
        expect(redirected()).to.be.false;
        expect(refreshed()).to.be.false;
      });
    });

    context("refresh on change: true", function () {
      it("should authenticate and refresh the page", function () {
        const result = oneiam.synchronize({ /* refreshOnChange: true */ });
        expect(result).to.equal("authenticated");
        expect(oneiam.authenticated()).to.be.true;
        expect(oneiam.session.changed()).to.be.false;
        expect(redirected()).to.be.false;
        expect(refreshed()).to.be.true;
      });
    });
  });

  context("local authenticated: true, oneiam authenticated: false", function () {
    beforeEach(() => prepare(true, false));

    context("require authentication: false", function () {
      context("refresh on change: false", function () {
        it("should logout silently", function () {
          const result = oneiam.synchronize({ /* requireAuthentication: false, */ refreshOnChange: false });
          expect(result).to.equal("unauthenticated");
          expect(oneiam.authenticated()).to.be.false;
          expect(oneiam.session.changed()).to.be.false;
          expect(redirected()).to.be.false;
          expect(refreshed()).to.be.false;
        });
      });

      context("refresh on change: true", function () {
        it("should logout and refresh the page", function () {
          const result = oneiam.synchronize(/* { requireAuthentication: false, refreshOnChange: true } */);
          expect(result).to.equal("unauthenticated");
          expect(oneiam.authenticated()).to.be.false;
          expect(oneiam.session.changed()).to.be.false;
          expect(redirected()).to.be.false;
          expect(refreshed()).to.be.true;
        });
      });
    });

    context("require authentication: true", function () {
      it("should redirect to OneIAM", function () {
        const result = oneiam.synchronize({ requireAuthentication: true });
        expect(result).to.equal("authenticate");
        expect(redirected()).to.be.true;
        expect(redirectUrl()).to.equal(`/oneiam/authenticate?next=${encodeURIComponent(TestPageUrl)}`);
        // we expect /oneiam/authenticate to redirect to OneIAM
      });
    });
  });

  context("local authenticated: true, oneiam authenticated: true, state changed: false", function () {
    beforeEach(() => prepare(true, true, false));

    it("should do nothing", function () {
      let result: OneiamSynchronizeResult;

      result = oneiam.synchronize({ requireAuthentication: false, refreshOnChange: false });
      expect(result).to.equal("noop");
      result = oneiam.synchronize({ requireAuthentication: false, refreshOnChange: true });
      expect(result).to.equal("noop");
      result = oneiam.synchronize({ requireAuthentication: true, refreshOnChange: false });
      expect(result).to.equal("noop");
      result = oneiam.synchronize({ requireAuthentication: true, refreshOnChange: true });
      expect(result).to.equal("noop");
      result = oneiam.synchronize();
      expect(result).to.equal("noop");

      expect(oneiam.authenticated()).to.be.true;
      expect(oneiam.session.changed()).to.be.false;
      expect(redirected()).to.be.false;
      expect(refreshed()).to.be.false;
    });
  });

  context("local authenticated: true, oneiam authenticated: true, state changed: true", function () {
    beforeEach(() => prepare(true, true, true));

    context("refresh on change: false", function () {
      it("should re-authenticate silently", function () {
        const result = oneiam.synchronize({ requireAuthentication: true /* any */, refreshOnChange: false });
        expect(result).to.equal("authenticated");
        expect(oneiam.authenticated()).to.be.true;
        expect(oneiam.session.changed()).to.be.false;
        expect(redirected()).to.be.false;
        expect(refreshed()).to.be.false;
      });
    });

    context("refresh on change: true", function () {
      it("should re-authenticate and refresh the page", function () {
        const result = oneiam.synchronize({ requireAuthentication: true /* any */, /* refreshOnChange: true */ });
        expect(result).to.equal("authenticated");
        expect(oneiam.authenticated()).to.be.true;
        expect(oneiam.session.changed()).to.be.false;
        expect(redirected()).to.be.false;
        expect(refreshed()).to.be.true;
      });
    });
  });
});

function prepare(localAuthenticated: boolean, oneiamAuthenticated: boolean, stateChanged?: boolean): void {
  prepareSession(localAuthenticated, oneiamAuthenticated, stateChanged);
  openTestPage();
  mockLocation();
}
