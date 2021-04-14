import { DEFAULT_AUTHENTICATE_URI, SILENT_AUTHENTICATE_IFRAME_ID, SILENT_AUTHENTICATE_TIMEOUT } from "./consts";
import { IframeDisconnectedError, IframeManager } from "./internal/iframe";
import { ignore } from "./internal/utils/decorators";
import { buildUrl } from "./internal/utils/url";
import { OneiamSessionManager } from "./session";
import { OneiamAuthenticateOptions, OneiamAuthenticateResult, OneiamConfig, OneiamSynchronizeOptions,
  OneiamSynchronizeResult } from "./types";

export class Oneiam {
  public readonly config: OneiamConfig;
  public readonly session: OneiamSessionManager;

  private location?: Location; // for testing

  public constructor(config: OneiamConfig) {
    this.config = config;
    this.session = new OneiamSessionManager(config);
  }

  public async authenticate(options?: OneiamAuthenticateOptions): Promise<OneiamAuthenticateResult> {
    options = options || {};

    const location = this.location || window.location;
    const authenticateUri = this.config.authenticateUri || DEFAULT_AUTHENTICATE_URI;

    if (!options.silent) {
      location.href = buildUrl(authenticateUri, { next: options.next || location.href });
      return "authenticate";
    }

    const iframe = new IframeManager(SILENT_AUTHENTICATE_IFRAME_ID);
    await iframe.navigate(authenticateUri, { silent: true }, SILENT_AUTHENTICATE_TIMEOUT);

    if (!iframe.href) {
      throw new Error("Silent authentication did not redirect back or landed on a cross-origin page.");
    }

    if (/[?&]error=/.test(iframe.href)) {
      return "unauthenticated";
    }

    const match = /[?&]session_state=(.*?)(?:&|$)/.exec(iframe.href);

    if (!match) {
      throw new Error("Silent authentication did not stop on redirect_uri.");
    }

    if (this.session.state !== match[1]) {
      throw new Error("Silent authentication did not correctly set session state cookie.");
    }

    return "authenticated";
  }

  public async authenticated(): Promise<boolean> {
    return await this.session.authenticated();
  }

  @ignore(IframeDisconnectedError, { return: "disconnected" })
  public async synchronize(options?: OneiamSynchronizeOptions): Promise<OneiamSynchronizeResult> {
    options = options || {};

    const requireAuthentication = !!options.requireAuthentication;
    const refreshOnChange = options.refreshOnChange != null ? !!options.refreshOnChange : true;
    const debug = options.debug || this.config.debug || document.cookie.indexOf("oneiam_js_debug=1") >= 0
                    || localStorage.oneiam_js_debug;
    const location = this.location || window.location;
    const oneiamAuthenticated = await this.session.authenticated();
    const sessionStateChanged = await this.session.changed();

    if (debug) {
      console.log(`[oneiam.synchronize] OneiamAuthenticated: ${oneiamAuthenticated}`);
      console.log(`[oneiam.synchronize] SessionStateValue: ${this.session.state}`);
      console.log(`[oneiam.synchronize] SessionStateChanged: ${sessionStateChanged}`);
      console.log(`[oneiam.synchronize] RequireAuthentication: ${requireAuthentication}`);
      console.log(`[oneiam.synchronize] RefreshOnChange: ${refreshOnChange}`);
    }

    if (this.session.state && !sessionStateChanged) {
      if (debug) {
        console.log("[oneiam.synchronize] Noop");
      }
      return "noop";
    }

    if (!this.session.state && !oneiamAuthenticated && !options.requireAuthentication) {
      if (debug) {
        console.log("[oneiam.synchronize] Noop");
      }
      return "noop";
    }

    if (!oneiamAuthenticated && options.requireAuthentication) {
      if (debug) {
        console.log("[oneiam.synchronize] Redirect to OneIAM");
      }
      return await this.authenticate({ next: options.next });
    }

    if (debug) {
      console.log("[oneiam.synchronize] Silent Authenticate");
    }

    const result = await this.authenticate({ silent: true });
    const localAuthenticated = !!this.session.state;

    if (localAuthenticated !== oneiamAuthenticated || await this.session.changed()) {
      throw new Error("Session synchronization failed.");
    }

    if (debug) {
      if (result === "authenticated") {
        console.log("[oneiam.synchronize] Authenticated");
      } else if (result === "unauthenticated") {
        console.log("[oneiam.synchronize] Logged out");
      }
    }

    if (refreshOnChange) {
      if (debug) {
        console.log("[oneiam.synchronize] Refresh Page");
      }
      if (options.next) {
        location.href = options.next;
      } else {
        location.reload();
      }
    }

    return result;
  }
}
