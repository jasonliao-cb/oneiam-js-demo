import { Injectable, NgZone } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivateChild, RouterStateSnapshot } from "@angular/router";
import { BehaviorSubject, Observable } from "rxjs";
import { resolveUrl } from "../internal/utils/url";
import { OneiamService } from "./service";

@Injectable()
export class OneiamAuthGuard implements CanActivateChild {
  public readonly checking: Observable<boolean> = new BehaviorSubject<boolean>(false);

  public constructor(private oneiam: OneiamService, private ngZone: NgZone) {}

  public async canActivateChild(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    if (!next.routeConfig || !next.routeConfig.component) {
      return true;
    }

    this.emitChecking(true);

    try {
      const result = await this.oneiam.synchronize({
        requireAuthentication: !!next.data.requireAuthentication,
        refreshOnChange: false,
        next: resolveUrl(state.url)
      });
      return result !== "authenticate";
    } finally {
      this.emitChecking(false);
    }
  }

  private emitChecking(value: boolean): void {
    const checking = this.checking as BehaviorSubject<boolean>;
    this.ngZone.run(() => checking.next(value));
  }
}
