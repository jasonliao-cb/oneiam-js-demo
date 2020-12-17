import { expect } from "chai";
import { changeConfig } from "./helpers/mock";
import { openTestPage, Server0Origin, Server1Origin } from "./helpers/nav";
import { oneiam } from "./helpers/oneiam";
import { loginOneiam, logoutOneiam, prepareSession } from "./helpers/session";

describe("oneiam.session", function () {
  describe("#state", function () {
    context("config.cookieName is not set", function () {
      it('returns the value of "oneiam_ss" cookie', function () {
        openTestPage();
        browser.deleteAllCookies();
        expect(oneiam.session.state).not.to.exist;
        browser.execute(() => document.cookie = "oneiam_ss=aaa");
        expect(oneiam.session.state).to.equal("aaa");
        browser.execute(() => document.cookie = "oneiam_ss=bbb");
        expect(oneiam.session.state).to.equal("bbb");
      });
    });

    context("config.cookieName is set", function () {
      it("returns the value of the set cookie", function () {
        openTestPage();
        browser.deleteAllCookies();
        browser.execute(() => document.cookie = "oneiam_ss=aaa");

        changeConfig({ cookieName: "app1_oneiam_ss" });
        expect(oneiam.session.state).not.to.exist;

        browser.execute(() => document.cookie = "app1_oneiam_ss=bbb");
        expect(oneiam.session.state).to.equal("bbb");

        changeConfig({ cookieName: "app2_oneiam_ss" });
        expect(oneiam.session.state).not.to.exist;

        browser.execute(() => document.cookie = "app2_oneiam_ss=ccc");
        expect(oneiam.session.state).to.equal("ccc");

        browser.execute(() => document.cookie = "app2_oneiam_ss=ddd");
        expect(oneiam.session.state).to.equal("ddd");
      });
    });
  });

  describe("#authenticated", function () {
    it("should return false if OneIAM is not authenticated", function () {
      logoutOneiam();
      openTestPage();
      expect(oneiam.session.authenticated()).to.be.false;
    });

    it("should return true if OneIAM is authenticated", function () {
      loginOneiam();
      openTestPage();
      expect(oneiam.session.authenticated()).to.be.true;
    });
  });

  describe("#changed", function () {
    context("same origin", function () {
      context("local authenticated: false, oneiam authenticated: false", function () {
        beforeEach(() => prepareSession(false, false));

        it("should return false", function () {
          openTestPage();
          expect(oneiam.session.changed()).to.be.false;
        });
      });

      context("local authenticated: false, oneiam authenticated: true", function () {
        beforeEach(() => prepareSession(false, true));

        it("should return true", function () {
          openTestPage();
          expect(oneiam.session.changed()).to.be.true;
        });
      });

      context("local authenticated: true, oneiam authenticated: false", function () {
        beforeEach(() => prepareSession(true, false));

        it("should return true", function () {
          openTestPage();
          expect(oneiam.session.changed()).to.be.true;
        });
      });

      context("local authenticated: true, oneiam authenticated: true, oneiam reauthenticated: false", function () {
        beforeEach(() => prepareSession(true, true, false));

        it("should return false", function () {
          openTestPage();
          expect(oneiam.session.changed()).to.be.false;
        });
      });

      context("local authenticated: true, oneiam authenticated: true, oneiam reauthenticated: true", function () {
        beforeEach(() => prepareSession(true, true, true));

        it("should return true", function () {
          openTestPage();
          expect(oneiam.session.changed()).to.be.true;
        });
      });
    });

    context("cross origin", function () {
      context("when alternateOrigins is not specified", function () {
        beforeEach(() => prepareSession(true, true, false));

        it("should return true", function () {
          openTestPage({ server: 1 });
          expect(oneiam.session.changed()).to.be.true;
        });
      });

      context("when alternateOrigins is specified but does not contain original origin", function () {
        beforeEach(() => prepareSession(true, true, false));

        it("should return true", function () {
          openTestPage({ server: 1, query: { alternateOrigins: [Server1Origin] } });
          expect(oneiam.session.changed()).to.be.true;
        });
      });

      context("when alternateOrigins is specified and contans original origin", function () {
        context("oneiam reauthenticated: false", function () {
          beforeEach(() => prepareSession(true, true, false));

          it("should return false", function () {
            openTestPage({ server: 1, query: { alternateOrigins: [Server0Origin, Server1Origin] } });
            expect(oneiam.session.changed()).to.be.false;
          });
        });

        context("oneiam reauthenticated: true", function () {
          beforeEach(() => prepareSession(true, true, true));

          it("should return true", function () {
            openTestPage({ server: 1, query: { alternateOrigins: [Server0Origin, Server1Origin] } });
            expect(oneiam.session.changed()).to.be.true;
          });
        });
      });
    });
  });
});
