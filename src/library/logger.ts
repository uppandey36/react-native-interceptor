import { IndividualLogs, LoggerTypes, ConfigureLogger } from '../types/logger';

class Logger {
  private logsList: Array<IndividualLogs>;
  private logsLimit: number;
  private customLogFunction: ((...args: any) => void) | null;
  private customWarnFunction: ((...args: any) => void) | null;
  private customErrorFunction: ((...args: any) => void) | null;

  constructor() {
    this.logsList = [];
    this.logsLimit = 500;
    this.customLogFunction = null;
    this.customWarnFunction = null;
    this.customErrorFunction = null;
  }

  private removeFirstEntry() {
    if (this.logsList.length < this.logsLimit) return;
    else {
      this.logsList?.shift();
      return;
    }
  }

  private insertNewLog(indiLog: IndividualLogs) {
    this.logsList?.push(indiLog);
  }

  log(markerText: string, ...args: any) {
    // adding info to logsList
    this.removeFirstEntry();
    this.insertNewLog({
      type: LoggerTypes.LOG,
      markerText: markerText,
      values: args,
    });

    // if custom function provided then execute that
    if (this.customLogFunction) {
      this.customLogFunction(markerText, ...args);
    }

    // if in debug mode then run there corresponding function too
    if (__DEV__) {
      console.log(markerText, ...args);
    }
  }

  warn(markerText: string, ...args: any) {
    // adding info to logsList
    this.removeFirstEntry();
    this.insertNewLog({
      type: LoggerTypes.WARN,
      markerText: markerText,
      values: args,
    });

    // if custom function provided then execute that
    if (this.customWarnFunction) {
      this.customWarnFunction(markerText, ...args);
    }

    // if in debug mode then run there corresponding function too
    if (__DEV__) {
      console.warn(markerText, ...args);
    }
  }

  error(markerText: string, ...args: any) {
    // adding info to logsList
    this.removeFirstEntry();
    this.insertNewLog({
      type: LoggerTypes.ERROR,
      markerText: markerText,
      values: args,
    });

    // if custom function provided then execute that
    if (this.customErrorFunction) {
      this.customErrorFunction(markerText, ...args);
    }

    // if in debug mode then run there corresponding function too
    if (__DEV__) {
      console.error(markerText, ...args);
    }
  }

  configure(configure: ConfigureLogger) {
    const {
      customErrorFunction = null,
      customLogFunction = null,
      customWarnFunction = null,
      logsLimit = 500,
    } = configure;
    this.logsLimit = logsLimit;
    this.customLogFunction = customLogFunction;
    this.customErrorFunction = customErrorFunction;
    this.customWarnFunction = customWarnFunction;
  }

  clearList() {
    this.logsList = [];
  }

  getLogsList(inverted = false) {
    const list = [...this.logsList];
    return inverted ? list.reverse() : list;
  }
}

export const logger = new Logger();
