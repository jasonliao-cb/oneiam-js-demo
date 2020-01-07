import { Mutable } from "utility-types";
import { NAVIGATE_TIMEOUT, RECEIVE_MESSAGE_TIMEOUT } from "../consts";
import { Assert } from "./utils/assert";
import { CustomError } from "./utils/error";
import { promiseTimeout } from "./utils/promise";
import { buildUrl, Query } from "./utils/url";

export class IframeManager {
  public readonly element: HTMLIFrameElement;
  public readonly loaded: boolean = false;

  public constructor(id?: string) {
    if (id && document.getElementById(id)) {
      this.element = document.getElementById(id) as HTMLIFrameElement;
      Assert.true(this.element.tagName === "IFRAME", `Element #${id} is not an iframe.`);
    } else {
      this.element = document.createElement("iframe");
      this.element.style.display = "none";
      if (id) {
        this.element.id = id;
      }
      document.body.appendChild(this.element);
    }
  }

  public destroy(): void {
    this.element.parentNode!.removeChild(this.element);
  }

  public async navigate(base: string, query?: Query, timeout?: number): Promise<void> {
    return promiseTimeout(timeout || NAVIGATE_TIMEOUT, (resolve, _, ontimeout) => {
      const _this = this as Mutable<this>;

      const onload = () => {
        _this.loaded = true;
        cleanup();
        resolve();
      };

      const cleanup = () => {
        this.element.removeEventListener("load", onload);
      };

      ontimeout(() => {
        cleanup();
        if (!this.isConnected) {
          throw new IframeDisconnectedError();
        }
      });

      _this.loaded = false;
      this.element.addEventListener("load", onload);
      this.element.src = buildUrl(base, query);
    });
  }

  public get href(): string | null {
    try {
      return this.element.contentWindow!.location.href;
    } catch {
      return null;
    }
  }

  public get isConnected(): boolean {
    return document.body.contains(this.element);
  }

  public postMessage(message: any, origin: string): void {
    this.element.contentWindow!.postMessage(message, origin);
  }

  public async receiveMessage(origin: string, options?: ReceiveMessageOptions): Promise<any> {
    const timeout = options && options.timeout || RECEIVE_MESSAGE_TIMEOUT;
    const onlisten = options && options.onlisten;
    const onfinish = options && options.onfinish;

    return promiseTimeout(timeout, (resolve, reject, ontimeout) => {
      const onmessage = (event: MessageEvent) => {
        if (event.source === this.element.contentWindow && (event.origin === origin)) {
          cleanup();
          try {
            onfinish && onfinish();
          } catch (err) {
            reject(err);
            return;
          }
          resolve(event.data);
        }
      };

      const cleanup = () => {
        window.removeEventListener("message", onmessage);
      };

      ontimeout(() => {
        cleanup();
        if (!this.isConnected) {
          throw new IframeDisconnectedError();
        }
      });

      window.addEventListener("message", onmessage);

      try {
        onlisten && onlisten();
      } catch (err) {
        reject(err);
      }
    });
  }
}

export interface ReceiveMessageOptions {
  timeout?: number;
  onlisten?: () => any;
  onfinish?: () => any;
}

/**
 * In case [turbolinks](https://github.com/turbolinks/turbolinks) is used, which is the default in new Rails apps, page
 * navigations would not "refresh" the javascript environment. It's quite often that a previous iframe operation like
 * `navigate` or `receiveMessage` has not finished but the page is rebuilt and the iframe element is disconnected
 * (detached from DOM). This would result in timeout errors. While the functionality is not affected (because it's
 * action of the previous page), it might be caught by monitors like New Relic and annoys developers. To avoid that,
 * this kind of errors are detected and ignored in the session synchronization process.
 */
export class IframeDisconnectedError extends CustomError {}
