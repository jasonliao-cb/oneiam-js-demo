import { expect } from "chai";
import { mockLocation, redirected, redirectUrl } from "./helpers/mock";
import { AngularDeepSecurePageUrl, AngularSecurePageUrl, clickAngularDeepSecurePageLink, clickAngularPublicPageLink,
  clickAngularSecurePageLink, openAngularHomePage } from "./helpers/nav";
import { oneiam, oneiamAuthGuard, oneiamService } from "./helpers/oneiam";
import { prepareSession } from "./helpers/session";

describe("oneiam/angular", function () {
  context("local authenticated: false, oneiam authenticated: false", function () {
    beforeEach(() => prepare(false, false));

    context("when a public router link is clicked", function () {
      it("should pass auth guard", function () {
        clickAngularPublicPageLink();
        expect(redirected()).to.be.false;
        expect($("h1").getText()).to.equal("Public Page");
      });

      it("should emit guard checking events", function () {
        oneiamAuthGuard.checking._track();
        clickAngularPublicPageLink();
        const values = oneiamAuthGuard.checking._untrack();
        expect(values).to.eql([false, true, false]);
      });

      it("should not emit state change event", function () {
        oneiamService.events._track();
        clickAngularPublicPageLink();
        const values = oneiamService.events._untrack();
        expect(values).to.be.empty;
      });
    });

    context("when a secure router link is clicked", function () {
      it("should redirect to authenticate uri", function () {
        clickAngularSecurePageLink();
        expect(redirected()).to.be.true;
        expect(redirectUrl()).to.equal(`/oneiam/authenticate?next=${encodeURIComponent(AngularSecurePageUrl)}`);
        expect($("h1").getText()).be.equal("Home Page"); // secure page not entered
      });

      it("should emit guard checking events", function () {
        oneiamAuthGuard.checking._track();
        clickAngularSecurePageLink();
        const values = oneiamAuthGuard.checking._untrack();
        expect(values).to.eql([false, true, false]);
      });

      it("should not emit state change event", function () {
        oneiamService.events._track();
        clickAngularSecurePageLink();
        const values = oneiamService.events._untrack();
        expect(values).to.be.empty;
      });
    });

    context("when a deep secure router link is clicked", function () {
      it("should redirect to authenticate uri", function () {
        clickAngularDeepSecurePageLink();
        expect(redirected()).to.be.true;
        expect(redirectUrl()).to.equal(`/oneiam/authenticate?next=${encodeURIComponent(AngularDeepSecurePageUrl)}`);
        expect($("h1").getText()).be.equal("Home Page"); // deep secure page not entered
      });

      it("should emit guard checking events", function () {
        oneiamAuthGuard.checking._track();
        clickAngularDeepSecurePageLink();
        const values = oneiamAuthGuard.checking._untrack();
        expect(values).to.eql([false, true, false]);
      });

      it("should not emit state change event", function () {
        oneiamService.events._track();
        clickAngularDeepSecurePageLink();
        const values = oneiamService.events._untrack();
        expect(values).to.be.empty;
      });
    });
  });

  context("local authenticated: false, oneiam authenticated: true", function () {
    beforeEach(() => prepare(false, true));

    context("when a public router link is clicked", function () {
      it("should authenticate silently and pass auth guard", function () {
        clickAngularPublicPageLink();
        expect(redirected()).to.be.false;
        expect($("h1").getText()).to.equal("Public Page");
        expect(oneiam.session.state).to.be.a("string").and.not.empty;
        expect(oneiam.session.changed()).to.be.false;
      });

      it("should emit guard checking events", function () {
        oneiamAuthGuard.checking._track();
        clickAngularPublicPageLink();
        const values = oneiamAuthGuard.checking._untrack();
        expect(values).to.eql([false, true, false]);
      });

      it("should emit state change event", function () {
        oneiamService.events._track();
        clickAngularPublicPageLink();
        const values = oneiamService.events._untrack();
        expect(values).to.have.lengthOf(1);
        expect(values[0].oldState).not.to.exist;
        expect(values[0].newState).to.equal(oneiam.session.state);
      });
    });

    context("when a secure router link is clicked", function () {
      it("should authenticate silently and pass auth guard", function () {
        clickAngularSecurePageLink();
        expect(redirected()).to.be.false;
        expect($("h1").getText()).to.equal("Secure Page");
        expect(oneiam.session.state).to.be.a("string").and.not.empty;
        expect(oneiam.session.changed()).to.be.false;
      });

      it("should emit guard checking events", function () {
        oneiamAuthGuard.checking._track();
        clickAngularSecurePageLink();
        const values = oneiamAuthGuard.checking._untrack();
        expect(values).to.eql([false, true, false]);
      });

      it("should emit state change event", function () {
        oneiamService.events._track();
        clickAngularSecurePageLink();
        const values = oneiamService.events._untrack();
        expect(values).to.have.lengthOf(1);
        expect(values[0].oldState).not.to.exist;
        expect(values[0].newState).to.equal(oneiam.session.state);
      });
    });

    context("when a deep secure router link is clicked", function () {
      it("should authenticate silently and pass auth guard", function () {
        clickAngularDeepSecurePageLink();
        expect(redirected()).to.be.false;
        expect($("h1").getText()).to.equal("Deep Secure Page");
        expect(oneiam.session.state).to.be.a("string").and.not.empty;
        expect(oneiam.session.changed()).to.be.false;
      });

      it("should emit guard checking events", function () {
        oneiamAuthGuard.checking._track();
        clickAngularDeepSecurePageLink();
        const values = oneiamAuthGuard.checking._untrack();
        expect(values).to.eql([false, true, false]);
      });

      it("should emit state change event", function () {
        oneiamService.events._track();
        clickAngularDeepSecurePageLink();
        const values = oneiamService.events._untrack();
        expect(values).to.have.lengthOf(1);
        expect(values[0].oldState).not.to.exist;
        expect(values[0].newState).to.equal(oneiam.session.state);
      });
    });
  });

  context("local authenticated: true, oneiam authenticated: false", function () {
    beforeEach(() => prepare(true, false));

    context("when a public router link is clicked", function () {
      it("should logout silently and pass auth guard", function () {
        clickAngularPublicPageLink();
        expect(redirected()).to.be.false;
        expect($("h1").getText()).to.equal("Public Page");
        expect(oneiam.session.state).not.to.exist;
      });

      it("should emit guard checking events", function () {
        oneiamAuthGuard.checking._track();
        clickAngularPublicPageLink();
        const values = oneiamAuthGuard.checking._untrack();
        expect(values).to.eql([false, true, false]);
      });

      it("should emit state change event", function () {
        const oldState = oneiam.session.state;
        oneiamService.events._track();
        clickAngularPublicPageLink();
        const values = oneiamService.events._untrack();
        expect(values).to.have.lengthOf(1);
        expect(values[0].oldState).to.equal(oldState);
        expect(values[0].newState).not.to.exist;
      });
    });

    context("when a secure router link is clicked", function () {
      it("should redirect to authenticate uri", function () {
        clickAngularSecurePageLink();
        expect(redirected()).to.be.true;
        expect(redirectUrl()).to.equal(`/oneiam/authenticate?next=${encodeURIComponent(AngularSecurePageUrl)}`);
        expect($("h1").getText()).be.equal("Home Page"); // secure page not entered
      });

      it("should emit guard checking events", function () {
        oneiamAuthGuard.checking._track();
        clickAngularSecurePageLink();
        const values = oneiamAuthGuard.checking._untrack();
        expect(values).to.eql([false, true, false]);
      });

      it("should not emit state change event", function () {
        oneiamService.events._track();
        clickAngularSecurePageLink();
        const values = oneiamService.events._untrack();
        expect(values).to.be.empty;
      });
    });

    context("when a deep secure router link is clicked", function () {
      it("should redirect to authenticate uri", function () {
        clickAngularDeepSecurePageLink();
        expect(redirected()).to.be.true;
        expect(redirectUrl()).to.equal(`/oneiam/authenticate?next=${encodeURIComponent(AngularDeepSecurePageUrl)}`);
        expect($("h1").getText()).be.equal("Home Page"); // deep secure page not entered
      });

      it("should emit guard checking events", function () {
        oneiamAuthGuard.checking._track();
        clickAngularDeepSecurePageLink();
        const values = oneiamAuthGuard.checking._untrack();
        expect(values).to.eql([false, true, false]);
      });

      it("should not emit state change event", function () {
        oneiamService.events._track();
        clickAngularDeepSecurePageLink();
        const values = oneiamService.events._untrack();
        expect(values).to.be.empty;
      });
    });
  });

  context("local authenticated: true, oneiam authenticated: true, state changed: false", function () {
    beforeEach(() => prepare(true, true, false));

    context("when a public router link is clicked", function () {
      it("should pass auth guard", function () {
        clickAngularPublicPageLink();
        expect(redirected()).to.be.false;
        expect($("h1").getText()).to.equal("Public Page");
        expect(oneiam.session.state).to.be.a("string").and.not.empty;
        expect(oneiam.session.changed()).to.be.false;
      });

      it("should emit guard checking events", function () {
        oneiamAuthGuard.checking._track();
        clickAngularPublicPageLink();
        const values = oneiamAuthGuard.checking._untrack();
        expect(values).to.eql([false, true, false]);
      });

      it("should not emit state change event", function () {
        oneiamService.events._track();
        clickAngularPublicPageLink();
        const values = oneiamService.events._untrack();
        expect(values).to.be.empty;
      });
    });

    context("when a secure router link is clicked", function () {
      it("should pass auth guard", function () {
        clickAngularSecurePageLink();
        expect(redirected()).to.be.false;
        expect($("h1").getText()).to.equal("Secure Page");
        expect(oneiam.session.state).to.be.a("string").and.not.empty;
        expect(oneiam.session.changed()).to.be.false;
      });

      it("should emit guard checking events", function () {
        oneiamAuthGuard.checking._track();
        clickAngularSecurePageLink();
        const values = oneiamAuthGuard.checking._untrack();
        expect(values).to.eql([false, true, false]);
      });

      it("should not emit state change event", function () {
        oneiamService.events._track();
        clickAngularSecurePageLink();
        const values = oneiamService.events._untrack();
        expect(values).to.be.empty;
      });
    });

    context("when a deep secure router link is clicked", function () {
      it("should pass auth guard", function () {
        clickAngularDeepSecurePageLink();
        expect(redirected()).to.be.false;
        expect($("h1").getText()).to.equal("Deep Secure Page");
        expect(oneiam.session.state).to.be.a("string").and.not.empty;
        expect(oneiam.session.changed()).to.be.false;
      });

      it("should emit guard checking events", function () {
        oneiamAuthGuard.checking._track();
        clickAngularDeepSecurePageLink();
        const values = oneiamAuthGuard.checking._untrack();
        expect(values).to.eql([false, true, false]);
      });

      it("should not emit state change event", function () {
        oneiamService.events._track();
        clickAngularDeepSecurePageLink();
        const values = oneiamService.events._untrack();
        expect(values).to.be.empty;
      });
    });
  });

  context("local authenticated: true, oneiam authenticated: true, state changed: true", function () {
    beforeEach(() => prepare(true, true, true));

    context("when a public router link is clicked", function () {
      it("should pass auth guard", function () {
        clickAngularPublicPageLink();
        expect(redirected()).to.be.false;
        expect($("h1").getText()).to.equal("Public Page");
        expect(oneiam.session.state).to.be.a("string").and.not.empty;
        expect(oneiam.session.changed()).to.be.false;
      });

      it("should emit guard checking events", function () {
        oneiamAuthGuard.checking._track();
        clickAngularPublicPageLink();
        const values = oneiamAuthGuard.checking._untrack();
        expect(values).to.eql([false, true, false]);
      });

      it("should emit state change event", function () {
        const oldState = oneiam.session.state;
        oneiamService.events._track();
        clickAngularSecurePageLink();
        const events = oneiamService.events._untrack();
        expect(events).to.have.lengthOf(1);
        expect(events[0].oldState).to.be.a("string").and.not.empty;
        expect(events[0].oldState).to.equal(oldState);
        expect(events[0].newState).to.be.a("string").and.not.empty;
        expect(events[0].newState).to.equal(oneiam.session.state);
        expect(events[0].oldState).not.to.equal(events[0].newState);
      });
    });

    context("when a secure router link is clicked", function () {
      it("should pass auth guard", function () {
        clickAngularSecurePageLink();
        expect(redirected()).to.be.false;
        expect($("h1").getText()).to.equal("Secure Page");
        expect(oneiam.session.state).to.be.a("string").and.not.empty;
        expect(oneiam.session.changed()).to.be.false;
      });

      it("should emit guard checking events", function () {
        oneiamAuthGuard.checking._track();
        clickAngularSecurePageLink();
        const values = oneiamAuthGuard.checking._untrack();
        expect(values).to.eql([false, true, false]);
      });

      it("should emit state change event", function () {
        const oldState = oneiam.session.state;
        oneiamService.events._track();
        clickAngularSecurePageLink();
        const events = oneiamService.events._untrack();
        expect(events).to.have.lengthOf(1);
        expect(events[0].oldState).to.be.a("string").and.not.empty;
        expect(events[0].oldState).to.equal(oldState);
        expect(events[0].newState).to.be.a("string").and.not.empty;
        expect(events[0].newState).to.equal(oneiam.session.state);
        expect(events[0].oldState).not.to.equal(events[0].newState);
      });
    });

    context("when a deep secure router link is clicked", function () {
      it("should pass auth guard", function () {
        clickAngularDeepSecurePageLink();
        expect(redirected()).to.be.false;
        expect($("h1").getText()).to.equal("Deep Secure Page");
        expect(oneiam.session.state).to.be.a("string").and.not.empty;
        expect(oneiam.session.changed()).to.be.false;
      });

      it("should emit guard checking events", function () {
        oneiamAuthGuard.checking._track();
        clickAngularDeepSecurePageLink();
        const values = oneiamAuthGuard.checking._untrack();
        expect(values).to.eql([false, true, false]);
      });

      it("should emit state change event", function () {
        const oldState = oneiam.session.state;
        oneiamService.events._track();
        clickAngularDeepSecurePageLink();
        const events = oneiamService.events._untrack();
        expect(events).to.have.lengthOf(1);
        expect(events[0].oldState).to.be.a("string").and.not.empty;
        expect(events[0].oldState).to.equal(oldState);
        expect(events[0].newState).to.be.a("string").and.not.empty;
        expect(events[0].newState).to.equal(oneiam.session.state);
        expect(events[0].oldState).not.to.equal(events[0].newState);
      });
    });
  });
});

function prepare(localAuthenticated: boolean, oneiamAuthenticated: boolean, stateChanged?: boolean): void {
  prepareSession(localAuthenticated, oneiamAuthenticated, stateChanged);
  openAngularHomePage();
  mockLocation();
}
