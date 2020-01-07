export class Assert {
  public static true(value: any, errMsg: string) {
    if (value !== true) {
      throw new Error(errMsg);
    }
  }
}
