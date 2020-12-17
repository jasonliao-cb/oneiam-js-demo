type PromiseResolve<T> = (value: T | PromiseLike<T>) => void;
type PromiseReject = (reason?: any) => void;
type PromiseTimeout = (callback: PromiseTimeoutCallback) => void;
type PromiseTimeoutCallback = () => any;
type PromiseTimeoutExecutor<T> = (resolve: PromiseResolve<T>, reject: PromiseReject, ontimeout: PromiseTimeout) => void;

export function promiseTimeout<T>(timeout: number, executor: PromiseTimeoutExecutor<T>): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    let timeoutCallback: PromiseTimeoutCallback = () => {};
    let timeoutId = setTimeout(ontimeout, timeout);

    function ontimeout() {
      try {
        timeoutCallback();
        reject("timeout");
      } catch (err) {
        reject(err);
      }
    }

    executor(
      value => {
        clearTimeout(timeoutId);
        resolve(value);
      },
      reason => {
        clearTimeout(timeoutId);
        reject(reason);
      },
      callback => timeoutCallback = callback
    );
  });
}
