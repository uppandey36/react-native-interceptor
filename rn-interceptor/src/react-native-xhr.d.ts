declare module 'react-native/Libraries/Network/XHRInterceptor' {
  const XHRInterceptor: {
    enableInterception: () => void;
    disableInterception: () => void;
    setOpenCallback: (callback: Function) => void;
    setRequestHeaderCallback: (callback: Function) => void;
    setSendCallback: (callback: Function) => void;
    setResponseCallback: (callback: Function) => void;
  };
  export default XHRInterceptor;
}
