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

function parseRequestBody(data: unknown): unknown {
  if (data == null) {
    return {};
  }
  if (typeof data !== 'string') {
    return data;
  }
  const trimmed = data.trim();
  if (!trimmed) {
    return {};
  }
  try {
    return JSON.parse(trimmed);
  } catch {
    return data;
  }
}

function parseResponseBody(response: unknown): unknown {
  if (response == null) {
    return null;
  }
  if (typeof response === 'object') {
    return response;
  }
  if (typeof response !== 'string') {
    return response;
  }
  const trimmed = response.trim();
  if (!trimmed) {
    return '';
  }
  const first = trimmed[0];
  if (first === '{' || first === '[') {
    try {
      return JSON.parse(trimmed);
    } catch {
      return response;
    }
  }
  return response;
}

type XhrWithInternals = XMLHttpRequest & {
  _response?: string | object;
  _responseType?: string;
  _hasError?: boolean;
};

/**
 * fetch() in React Native sets responseType to "blob", so xhr.response is a Blob.
 * The actual text/JSON payload is kept on the internal _response string until then.
 */
function getResponseBodyFromXhr(xhr: XhrWithInternals): unknown {
  if (xhr._hasError) {
    return null;
  }

  const responseType = xhr.responseType || xhr._responseType || '';
  const raw = xhr._response;

  if (responseType === 'json') {
    return xhr.response;
  }

  if (responseType === 'arraybuffer') {
    return typeof raw === 'string' && raw.length > 0
      ? '[ArrayBuffer]'
      : xhr.response;
  }

  if (responseType === 'blob') {
    if (typeof raw === 'string') {
      return parseResponseBody(raw);
    }
    if (typeof raw === 'object' && raw) {
      return { __type: 'Blob', note: 'Binary response (not decoded)' };
    }
    const blob = xhr.response;
    if (blob && typeof blob === 'object') {
      return { __type: 'Blob', note: 'Binary response (not decoded)' };
    }
    return '';
  }

  if (responseType === '' || responseType === 'text') {
    if (typeof raw === 'string') {
      return parseResponseBody(raw);
    }
    return parseResponseBody(xhr.response);
  }

  if (typeof raw === 'string') {
    return parseResponseBody(raw);
  }

  const resolved = xhr.response;
  if (resolved == null) {
    return null;
  }
  if (typeof resolved === 'string' || typeof resolved === 'object') {
    return parseResponseBody(resolved);
  }
  return resolved;
}

function isCapturableBody(body: unknown): boolean {
  return (
    body !== undefined &&
    (typeof body === 'string' ||
      typeof body === 'object' ||
      typeof body === 'number' ||
      typeof body === 'boolean')
  );
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
              getResponseBodyFromXhr(this as XhrWithInternals),
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
      requestBody: parseRequestBody(data) as INetworkApis['requestBody'],
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
      isCapturableBody(response) &&
      !ignoreContentTypes?.find((content) => content.test(contentType));

    networkList[trackingName] = {
      ...cachedRequest,
      url: url || cachedRequest?.xhr?._url || '',
      method: xhr._method || null,
      requestBody: cachedRequest?.requestBody || {},
      requestHeaders: xhr._headers || null,
      params,
      response: useRealResponse
        ? (response as INetworkApis['response'])
        : '--Skipper--',
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
