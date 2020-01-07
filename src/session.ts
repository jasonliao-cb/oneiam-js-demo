import { CHECK_SESSION_IFRAME_ID, DEFAULT_SESSION_STATE_COOKIE } from "./consts";
import { IframeManager } from "./internal/iframe";
import { Issuer } from "./internal/issuer";
import * as cookies from "./internal/utils/cookies";
import { hex2b64 } from "./internal/utils/hex2b64";
import { Sha256 } from "./internal/utils/sha256";
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
    // This is deeply coupled with the Session Management implementation in Identity Server 4, but it dramatically
    // improves the performance of our seamless login. This is end to end tested.
    const state = buildSessionState(this.config.clientId, "");
    return await this.check(state) === "changed";
  }

  public async changed(): Promise<boolean> {
    await this.initialize();
    if (this.state) {
      return await this.check(this.state) === "changed";
    } else {
      return await this.authenticated();
    }
  }

  private async initialize(): Promise<void> {
    if (!this.iframe.loaded) {
      await this.iframe.navigate(this.issuer.check_session_iframe);
    }
  }

  private async check(state: string): Promise<string> {
    await this.initialize();
    return await this.iframe.receiveMessage(this.issuer.origin, {
      onlisten: () => {
        this.iframe.postMessage(`${this.config.clientId} ${state || this.state}`, this.issuer.origin);
      }
    });
  }
}

function buildSessionState(clientId: string, sid: string | undefined): string {
  const salt = Sha256.hash(Math.random().toString()).slice(-16);
  const hash = Sha256.hash(clientId + location.origin + sid + salt);
  const encoded = hex2b64(hash).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
  return encoded + "." + salt;
}
