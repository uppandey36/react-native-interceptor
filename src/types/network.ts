export type AvailableMethods = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';

export interface ConfigureNetwork {
  networksLimit?: number;
  errorStatusList?: number[];
  ignoreContentTypesList?: RegExp[];
  ignoreUrlsList?: RegExp[];
}

export interface IndividualApiInfo {
  _url: string;
  _skipInterceptor?: boolean;
  _trackingName: string | number;
  _method: AvailableMethods;
  _headers: Record<string, string>;
  responseHeaders: Record<string, string>;
}
export interface INetworkApis {
  url: string;
  method: AvailableMethods;
  requestBody: Record<string, unknown>;
  requestHeaders: Record<string, string>;
  params: Record<string, string>;
  response: Record<string, unknown>;
  responseHeaders: Record<string, string>;
  status?: number;
  stopTime?: number;
  startTime: number;
  xhr: IndividualApiInfo;
}

export interface IIndividualApi extends INetworkApis {
  onInfoButtonClick: (
    data: Record<string, string> | Record<string, unknown>
  ) => void;
}
