import XMLHttpRequest from 'react-native/Libraries/Network/XMLHttpRequest';
import {
  IndividualApiInfo,
  INetworkApis,
  ConfigureNetwork,
} from '../types/network';

type SendCallback = (data: any, xhr: IndividualApiInfo) => void;
type ResponseCallback = (
  status: number,
  timeout: boolean,
  response: any,
  url: string,
  type: string,
  xhr: IndividualApiInfo
) => void;

const originalSend = XMLHttpRequest.prototype.send;

let sendCallback: SendCallback | null = null;
let responseCallback: ResponseCallback | null = null;
let isInterceptorEnabled = false;

function asApiInfo(xhr: XMLHttpRequest): IndividualApiInfo {
  return xhr as unknown as IndividualApiInfo;
}

function enableInterception() {
  if (isInterceptorEnabled) {
    return;
  }

  XMLHttpRequest.prototype.send = function (data: any) {
    if (sendCallback) {
      sendCallback(data, asApiInfo(this));
    }

    if (this.addEventListener) {
      this.addEventListener(
        'readystatechange',
        () => {
          if (!isInterceptorEnabled) {
            return;
          }

          if (this.readyState === this.DONE && responseCallback) {
            responseCallback(
              this.status,
              !!this._timedOut,
              this.response,
              this.responseURL || this._url || '',
              this.responseType,
              asApiInfo(this)
            );
          }
        },
        false
      );
    }

    originalSend.apply(this, arguments as any);
  };

  isInterceptorEnabled = true;
}

function Network() {
  let networkList: Record<string, INetworkApis> = {};
  let interceptorCounter: number = 0;
  let ignoreUrls: RegExp[] = [];
  let ignoreContentTypes: RegExp[] = [];
  let errorStatus: number[] = [400, 401, 500];
  let limit: number = 500;

  //Fires when we talk to the server.
  function onSend(data: any, xhr: IndividualApiInfo) {
    if (ignoreUrls?.length && ignoreUrls?.find((url) => url.test(xhr._url))) {
      xhr._skipInterceptor = true;
      return;
    }

    interceptorCounter += 1;
    xhr._trackingName = interceptorCounter;

    try {
      if (interceptorCounter - limit > 0) {
        const removeId = interceptorCounter - limit;
        delete networkList[removeId];
      }
    } catch {}

    networkList[interceptorCounter] = {
      requestBody: typeof data === 'string' ? JSON.parse(data) : data,
      xhr,
      startTime: Date.now(),
      url: xhr._url || '',
      method: xhr._method || 'GET',
      params: {},
      response: {},
      responseHeaders: {},
      requestHeaders: xhr._headers || null,
    };
  }

  function onResponse(
    status: number,
    _timeout: boolean,
    response: any,
    url: string,
    _type: any,
    xhr: IndividualApiInfo
  ) {
    if (xhr._skipInterceptor) {
      return;
    }

    // what type of content is this?
    const contentType =
      xhr.responseHeaders &&
      (xhr.responseHeaders['content-type'] ||
        xhr.responseHeaders['Content-Type'] ||
        '');

    const params: Record<string, string> = {};
    const queryParamIdx = url ? url.indexOf('?') : -1;
    if (queryParamIdx > -1) {
      url
        .slice(queryParamIdx + 1)
        .split('&')
        .forEach((pair) => {
          const [key, value] = pair.split('=');
          if (key && value !== undefined) {
            params[key] = decodeURIComponent(value.replace(/\+/g, ' '));
          }
        });
    }
    const trackingName = xhr._trackingName;
    const cachedRequest = (networkList[trackingName] || {
      xhr,
    }) as INetworkApis;

    const useRealResponse =
      (typeof response === 'string' || typeof response === 'object') &&
      !ignoreContentTypes?.find((content) => content.test(contentType));

    networkList[trackingName] = {
      ...cachedRequest,
      url: url || cachedRequest?.xhr?._url || '',
      method: xhr._method || null,
      requestBody: cachedRequest?.requestBody || {},
      requestHeaders: xhr._headers || null,
      params,
      response: useRealResponse ? JSON?.parse(response) || {} : '--Skipper--',
      responseHeaders: xhr.responseHeaders || null,
      stopTime: Date.now(),
      status,
    };
  }

  return {
    connect: (configs?: ConfigureNetwork) => {
      sendCallback = onSend;
      responseCallback = onResponse;
      enableInterception();

      if (configs) {
        const {
          errorStatusList = [400, 401],
          ignoreContentTypesList = [],
          ignoreUrlsList = [],
          networksLimit = 500,
        } = configs;
        ignoreUrls = [...ignoreUrlsList];
        limit = networksLimit;
        errorStatus = [...errorStatusList];
        ignoreContentTypes = [...ignoreContentTypesList];
      }
    },
    disconnect: () => {
      sendCallback = null;
      responseCallback = null;
    },
    clearList: () => {
      networkList = {};
      interceptorCounter = 0;
    },
    getNetworkList: (inverted = false) => {
      return inverted
        ? Object.values(networkList).reverse()
        : Object.values(networkList);
    },
    getErrorStatues: () => {
      return errorStatus;
    },
  };
}

export const network = Network();
