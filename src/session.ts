import { CHECK_SESSION_IFRAME_ID, DEFAULT_SESSION_STATE_COOKIE } from "./consts";
import { IframeManager } from "./internal/iframe";
import { Issuer } from "./internal/issuer";
import * as cookies from "./internal/utils/cookies";
import { OneiamConfig } from "./types";

export class OneiamSessionManager {
  private config: OneiamConfig;
  private issuer: Issuer;
  private iframe: IframeManager;

  public constructor(config: OneiamConfig) {
    this.config = config;
    this.issuer = new Issuer(config.issuer);
    this.iframe = new IframeManager(CHECK_SESSION_IFRAME_ID);
  }

  public get state(): string | undefined {
    return cookies.get(this.config.cookieName || DEFAULT_SESSION_STATE_COOKIE);
  }

  public async authenticated(): Promise<boolean> {
    await this.initialize();
    return await this.check(undefined) === "changed";
  }

  public async changed(): Promise<boolean> {
    await this.initialize();
    return await this.check(this.state) === "changed";
  }

  private async initialize(): Promise<void> {
    if (!this.iframe.loaded) {
      await this.iframe.navigate(this.issuer.check_session_iframe);
    }
  }

  private async check(state: string | undefined): Promise<string> {
    await this.initialize();
    const result = await this.iframe.receiveMessage(this.issuer.origin, {
      onlisten: () => {
        const message = JSON.stringify({
          clientId: this.config.clientId,
          sessionState: state,
          alternateOrigins: this.config.alternateOrigins
        });
        this.iframe.postMessage(message, this.issuer.origin);
      }
    });
    if (result === "changed" || result === "unchanged") {
      return result;
    } else {
      throw new Error("OneIAM checksession failed.");
    }
  }
}
