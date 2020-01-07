import { Inject, Injectable, NgZone } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { Oneiam } from "../oneiam";
import { OneiamAuthenticateOptions, OneiamAuthenticateResult, OneiamConfig } from "../types";
import { OneiamEvent, OneiamStateChangeEvent } from "./events";

@Injectable()
export class OneiamService extends Oneiam {
  public readonly events: Observable<OneiamEvent>;

  public constructor(@Inject("@cb/oneiam:OneiamConfig") config: OneiamConfig, private ngZone: NgZone) {
    super(config);
    this.events = new Subject<OneiamEvent>();
  }

  public async authenticate(options?: OneiamAuthenticateOptions): Promise<OneiamAuthenticateResult> {
    const oldState = this.session.state;
    const result = await super.authenticate(options);
    const newState = this.session.state;

    if (oldState !== newState) {
      this.ngZone.run(() => {
        const event = new OneiamStateChangeEvent(oldState, newState);
        (this.events as Subject<OneiamEvent>).next(event);
      });
    }

    return result;
  }
}
