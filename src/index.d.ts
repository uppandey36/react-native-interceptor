import React from 'react';
import {
  IIndividualApi,
  ConfigureNetwork,
  INetworkApis,
} from './types/network';
import {
  IIndividualLogComponent,
  ConfigureLogger,
  IndividualLogs,
} from './types/logger';

interface NetworkApisProps {
  onBackPress: () => void;
}

interface LogsListProps {
  onBackPress: () => void;
}

interface networkType {
  connect: () => void;
  configure: (configs: ConfigureNetwork) => void;
  disconnect: () => void;
  clearList: () => void;
  getNetworkList: () => Record<string, INetworkApis>;
  getErrorStatues: () => number[];
}

interface loggerType {
  log: (markerText: string, ...args: any[]) => void;
  warn: (markerText: string, ...args: any[]) => void;
  error: (markerText: string, ...args: any[]) => void;
  configure: (configure: ConfigureLogger) => void;
  clearList: () => void;
  getLogsList: () => IndividualLogs[];
}

declare const IndividualApi: React.FC<IIndividualApi>;
declare const NetworkApis: React.FC<NetworkApisProps>;
declare const LogsList: React.FC<LogsListProps>;
declare const IndividualLog: React.FC<IIndividualLogComponent>;
declare const network: networkType;
declare const logger: loggerType;

export { IndividualApi, NetworkApis, LogsList, IndividualLog, network, logger };
