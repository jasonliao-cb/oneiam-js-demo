import { Oneiam, OneiamAuthenticateOptions, OneiamAuthenticateResult, OneiamSynchronizeOptions,
  OneiamSynchronizeResult } from "../../../src";
import { OneiamAuthGuard, OneiamEvent, OneiamService } from "../../../src/angular";

// for browser.execute
declare var oneiam: Oneiam;
declare var oneiamService: OneiamService;
declare var oneiamAuthGuard: OneiamAuthGuard;

const oneiamHelper = {
  authenticate(options?: OneiamAuthenticateOptions): OneiamAuthenticateResult {
    return browser.executeAsync((options, done) => oneiam.authenticate(options).then(done), options);
  },
  authenticated(): boolean {
    return this.session.authenticated();
  },
  synchronize(options?: OneiamSynchronizeOptions): OneiamSynchronizeResult {
    return browser.executeAsync((options, done) => oneiam.synchronize(options).then(done), options);
  },
  session: {
    get state(): string | undefined {
      return browser.execute(() => oneiam.session.state);
    },
    authenticated(): boolean {
      return browser.executeAsync(done => oneiam.authenticated().then(done));
    },
    changed(): boolean {
      return browser.executeAsync(done => oneiam.session.changed().then(done));
    }
  }
};

const oneiamServiceHelper = Object.assign({}, oneiamHelper, {
  events: {
    _track(): void {
      browser.execute(() => {
        const tmp = oneiamService.events as any;
        if (tmp._sub_) {
          tmp._sub_.unsubscribe();
        }
        tmp._data_ = [];
        tmp._sub_ = oneiamService.events.subscribe(value => {
          tmp._data_.push(value);
        });
      });
    },
    _untrack(): OneiamEvent[] {
      return browser.execute(() => {
        const tmp = oneiamService.events as any;
        const data = tmp._data_ || [];
        if (tmp._sub_) {
          tmp._sub_.unsubscribe();
        }
        delete tmp._sub_;
        delete tmp._data_;
        return data;
      });
    }
  }
});

const oneiamAuthGuardHelper = {
  checking: {
    _track(): void {
      browser.execute(() => {
        const tmp = oneiamAuthGuard.checking as any;
        if (tmp._sub_) {
          tmp._sub_.unsubscribe();
        }
        tmp._data_ = [];
        tmp._sub_ = oneiamAuthGuard.checking.subscribe(value => {
          tmp._data_.push(value);
        });
      });
    },
    _untrack(): boolean[] {
      return browser.execute(() => {
        const tmp = oneiamAuthGuard.checking as any;
        const data = tmp._data_ || [];
        if (tmp._sub_) {
          tmp._sub_.unsubscribe();
        }
        delete tmp._sub_;
        delete tmp._data_;
        return data;
      });
    }
  }
};

export { oneiamHelper as oneiam };
export { oneiamServiceHelper as oneiamService };
export { oneiamAuthGuardHelper as oneiamAuthGuard };
