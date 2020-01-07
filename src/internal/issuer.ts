export class Issuer {
  public origin: string;
  public check_session_iframe: string;

  public constructor(issuer: string) {
    this.origin = issuer.replace(/^(https?:\/\/[^\/]*).*$/, "$1");
    // not using discovery because this is not likely to change and it saves a http request
    this.check_session_iframe = this.origin + "/connect/checksession";
  }
}
