type LogLevelString = 'debug' | 'verbose' | 'info' | 'warn' | 'error' | 'silent';

/**
 * A container for all of the Logger instances
 */
const instances: Logger[] = [];

/**
 * The JS SDK supports 5 log levels and also allows a user the ability to
 * silence the logs altogether.
 *
 * The order is a follows:
 * DEBUG < VERBOSE < INFO < WARN < ERROR
 *
 * All of the log types above the current log level will be captured (i.e. if
 * you set the log level to `INFO`, errors will still be logged, but `DEBUG` and
 * `VERBOSE` logs will not)
 */
export enum LogLevel {
  DEBUG,
  VERBOSE,
  INFO,
  WARN,
  ERROR,
  SILENT,
}

const levelStringToEnum: { [key in LogLevelString]: LogLevel } = {
  debug: LogLevel.DEBUG,
  verbose: LogLevel.VERBOSE,
  info: LogLevel.INFO,
  warn: LogLevel.WARN,
  error: LogLevel.ERROR,
  silent: LogLevel.SILENT,
};

/**
 * The default log level
 */
const defaultLogLevel: LogLevel = LogLevel.INFO;

type LogHandler = (loggerInstance: Logger, logType: LogLevel, ...args: unknown[]) => void;

/**
 * By default, `console.debug` is not displayed in the developer console (in
 * chrome). To avoid forcing users to have to opt-in to these logs twice
 * (i.e. once for amo, and once in the console), we are sending `DEBUG`
 * logs to the `console.log` function.
 */
const ConsoleMethod = {
  [LogLevel.DEBUG]: 'log',
  [LogLevel.VERBOSE]: 'log',
  [LogLevel.INFO]: 'info',
  [LogLevel.WARN]: 'warn',
  [LogLevel.ERROR]: 'error',
};

/**
 * The default log handler will forward DEBUG, VERBOSE, INFO, WARN, and ERROR
 * messages on to their corresponding console counterparts (if the log method
 * is supported by the current log level)
 */
const defaultLogHandler: LogHandler = (instance, logType, ...args): void => {
  if (logType < instance.logLevel) {
    return;
  }
  const now = new Date().toISOString();
  const method = ConsoleMethod[logType as keyof typeof ConsoleMethod];
  if (method) {
    console[method as 'log' | 'info' | 'warn' | 'error'](`[${now}]  ${instance.name}:`, ...args);
  } else {
    throw new Error(`Attempted to log a message with an invalid logType (value: ${logType})`);
  }
};

export class Logger {
  /**
   * Gives you an instance of a Logger to capture messages according to
   * Amo's logging scheme.
   *
   * @param name The name that the logs will be associated with
   */
  constructor(public name: string) {
    /**
     * Capture the current instance for later use
     */
    instances.push(this);
  }

  /**
   * The log level of the given Logger instance.
   */
  private _logLevel = defaultLogLevel;

  get logLevel(): LogLevel {
    return this._logLevel;
  }

  set logLevel(val: LogLevel) {
    if (!(val in LogLevel)) {
      throw new TypeError(`Invalid value "${val}" assigned to \`logLevel\``);
    }
    this._logLevel = val;
  }

  // Workaround for setter/getter having to be the same type.
  setLogLevel(val: LogLevel | LogLevelString): void {
    this._logLevel = typeof val === 'string' ? levelStringToEnum[val] : val;
  }

  /**
   * The main (internal) log handler for the Logger instance.
   * Can be set to a new function in internal package code but not by user.
   */
  private _logHandler: LogHandler = defaultLogHandler;
  get logHandler(): LogHandler {
    return this._logHandler;
  }
  set logHandler(val: LogHandler) {
    if (typeof val !== 'function') {
      throw new TypeError('Value assigned to `logHandler` must be a function');
    }
    this._logHandler = val;
  }

  /**
   * The functions below are all based on the `console` interface
   */

  debug(...args: unknown[]): void {
    this._logHandler(this, LogLevel.DEBUG, ...args);
  }
  log(...args: unknown[]): void {
    this._logHandler(this, LogLevel.VERBOSE, ...args);
  }
  info(...args: unknown[]): void {
    this._logHandler(this, LogLevel.INFO, ...args);
  }
  warn(...args: unknown[]): void {
    this._logHandler(this, LogLevel.WARN, ...args);
  }
  error(...args: unknown[]): void {
    this._logHandler(this, LogLevel.ERROR, ...args);
  }
}

export function setLogLevel(level: LogLevelString | LogLevel): void {
  instances.forEach((instance) => {
    instance.setLogLevel(level);
  });
}
