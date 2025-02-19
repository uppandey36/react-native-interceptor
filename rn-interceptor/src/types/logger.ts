/* eslint-disable @typescript-eslint/no-explicit-any */
export enum LoggerTypes {
  LOG = 'LOG',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

export type AvailableLoggerType = keyof typeof LoggerTypes;

export interface ConfigureLogger {
  logsLimit?: number;
  customLogFunction?: ((...args: any) => void) | null;
  customWarnFunction?: ((...args: any) => void) | null;
  customErrorFunction?: ((...args: any) => void) | null;
}

export interface IndividualLogs {
  type: AvailableLoggerType;
  markerText: string;
  values: any[];
}

export interface IIndividualLogComponent extends IndividualLogs {
  onInfoButtonClick: (
    data: Record<string, string> | Record<string, unknown>
  ) => void;
}
