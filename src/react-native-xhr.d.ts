declare module 'react-native/Libraries/Network/XMLHttpRequest' {
  class XMLHttpRequest {
    static UNSENT: number;
    static OPENED: number;
    static HEADERS_RECEIVED: number;
    static LOADING: number;
    static DONE: number;

    UNSENT: number;
    OPENED: number;
    HEADERS_RECEIVED: number;
    LOADING: number;
    DONE: number;

    readyState: number;
    status: number;
    timeout: number;
    responseURL: string | null;
    responseType: string;
    response: unknown;
    responseHeaders: Record<string, string> | null | undefined;

    _url: string | null;
    _method: string | null;
    _headers: Record<string, string>;
    _trackingName?: string | number;
    _skipInterceptor?: boolean;
    _timedOut?: boolean;
    _hasError?: boolean;
    /** Raw body from native networking (string for text/json; object descriptor for blob). */
    _response?: string | object;
    _responseType?: string;

    open(method: string, url: string, async?: boolean): void;
    send(data?: unknown): void;
    setRequestHeader(header: string, value: string): void;
    addEventListener(
      type: string,
      listener: () => void,
      useCapture?: boolean
    ): void;
  }

  export default XMLHttpRequest;
}
