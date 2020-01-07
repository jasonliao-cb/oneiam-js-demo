export type OneiamEvent = OneiamStateChangeEvent;

export class OneiamStateChangeEvent {
  public constructor(public oldState: string | undefined, public newState: string | undefined) {}
}
