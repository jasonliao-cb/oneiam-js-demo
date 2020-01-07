import { OneiamConfig } from "../../../src";

declare var oneiam: any; // for browser.execute

export function changeConfig(config: Partial<OneiamConfig>): void {
  browser.execute(config => Object.assign(oneiam.config, config), config);
}

export function mockLocation(): void {
  browser.execute(() => {
    oneiam.location = {
      _stats: {
        href: { count: 0 },
        reload: { count: 0 }
      },
      get href() {
        return this._href || location.href;
      },
      set href(value) {
        this._href = value;
        this._stats.href.count++;
      },
      reload() {
        this._stats.reload.count++;
      }
    };
  });
}

export function redirected(): boolean | undefined {
  return browser.execute(() => oneiam.location && oneiam.location._stats.href.count > 0);
}

export function redirectUrl(): string {
  return browser.execute(() => oneiam.location ? oneiam.location.href : location.href);
}

export function refreshed(): boolean | undefined {
  return browser.execute(() => oneiam.location && oneiam.location._stats.reload.count > 0);
}
