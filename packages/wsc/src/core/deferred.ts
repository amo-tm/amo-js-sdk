export class Deferred<R> {
  promise: Promise<R>;
  reject: (value?: unknown) => void = () => {};
  resolve: (value?: unknown) => void = () => {};
  constructor() {
    this.promise = new Promise((resolve, reject) => {
      this.resolve = resolve as (value?: unknown) => void;
      this.reject = reject as (value?: unknown) => void;
    });
  }
}
