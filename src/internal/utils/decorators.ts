export function ignore(errorType: any, options: { return: any }): MethodDecorator {
  return function (target, method, descriptor) {
    if (typeof descriptor.value !== "function") {
      throw new Error(`${method.toString()} is not a method.`);
    }

    function handle(err: any): any {
      if (typeof errorType === "function" && err instanceof errorType) {
        return options.return;
      } else if (err === errorType) {
        return options.return;
      } else {
        throw err;
      }
    }

    const original = descriptor.value;

    descriptor.value = <any> function (this: any) {
      let result;

      try {
        result = original.apply(this, arguments);
      } catch (err) {
        return handle(err);
      }

      if (result && result.then && result.catch) {
        return result.catch(handle);
      } else {
        return result;
      }
    };
  };
}
