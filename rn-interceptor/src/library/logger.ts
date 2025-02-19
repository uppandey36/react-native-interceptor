/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import { IndividualLogs, LoggerTypes, ConfigureLogger } from '../types/logger';

class Logger {
  logsList: Array<IndividualLogs>;
  logsLimit: number;
  customLogFunction: ((...args: any) => void) | null;
  customWarnFunction: ((...args: any) => void) | null;
  customErrorFunction: ((...args: any) => void) | null;

  constructor() {
    this.logsList = [];
    this.logsLimit = 500;
    this.customLogFunction = null;
    this.customWarnFunction = null;
    this.customErrorFunction = null;
  }

  private removeFromTop() {
    if (this.logsList.length < this.logsLimit) return;
    else {
      this.logsList?.shift();
      return;
    }
  }

  log(markerText: string, ...args: any) {
    // adding info to logsList
    this.removeFromTop();
    this.logsList.push({
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
    this.removeFromTop();
    this.logsList.push({
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
    this.removeFromTop();
    this.logsList.push({
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
}

export const logger = new Logger();
