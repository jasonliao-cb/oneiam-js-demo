// ES5 friendly error "class"

export interface CustomError extends Error {}

export interface CustomErrorConstructor {
  new (message?: string): CustomError;
  prototype: CustomError;
}

export const CustomError: CustomErrorConstructor = <any> function CustomError(this: CustomError, message?: string) {
  if (typeof message !== "undefined") {
    this.message = String(message);
  }
  this.stack = Error(message).stack;
};

CustomError.prototype = Object.create(Error.prototype);

CustomError.prototype.constructor = CustomError;

Object.defineProperty(CustomError.prototype, "name", {
  configurable: true,
  get: function () {
    return this.constructor.name;
  }
});
