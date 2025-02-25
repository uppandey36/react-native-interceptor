# react-native-interceptor

An HTTP/HTTPS traffic monitor and Consoles log, warn and error monitor for React Native including in app interface.

If this project has helped you out, please support us with a star 🌟.

## Features

- Log networks requests on iOS and Android to debug on release builds.
- Copy or share headers, body or full request and cURL representation of request.
- Zero native or JavaScript dependencies with built in TypeScript definitions.
- Monitoring of Console log, warn and error methods to track the application progress.
- Custom function can be assigned to console methods to trigger the events for other libraries.
- Console methods behave the same as original for debug and release build.

## Screenshots

#### Dark Theme
<p float="left" align="center">
  <img src="https://github.com/uppandey36/libraries-reference-images/blob/main/react-native-interceptor/Image1.png" width="300" />
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  <img src="https://github.com/uppandey36/libraries-reference-images/blob/main/react-native-interceptor/image2.png" width="300" /> 
</p>

#### Light Theme
<p float="left" align="center">
  <img src="https://github.com/uppandey36/libraries-reference-images/blob/main/react-native-interceptor/Image3.png" width="300" />
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  <img src="https://github.com/uppandey36/libraries-reference-images/blob/main/react-native-interceptor/image4.png" width="300" /> 
</p>

## Setup

### Install

```bash
yarn add react-native-interceptor
```

or

```
npm install --save react-native-interceptor
```

## Network Monitoring

### Start HTTP/HTTPS network monitoring

Call `network.connect()` in your apps entry point to start monitoring, or call it on a button press to manually trigger it.

```ts
import { network } from 'react-native-interceptor';

network.connect({
  errorStatusList = [400, 401],
  ignoreContentTypesList = [],
  ignoreUrlsList = [
    /http:\/\/10\.0\.2\.2:8081\/[\w\/?=&\-.\%]*/g,
		/^http?:\/\/[^\s]+/
  ],
  networksLimit = 500,
});
AppRegistry.registerComponent('App', () => App);
```

##### Configuration Options

| Key                       | Mandatory | Type     | Default             |
|---------------------------|-----------|----------|---------------------|
| errorStatusList           | No        | number[] | [400, 401, 500]     |
| ignoreContentTypesList    | No        | RegExp[] | empty               |
| ignoreUrlsList            | No        | RegExp[] | empty               |
| networksLimit             | No        | number   | 500                 |

### Display Requests and Responses

```ts
import { NetworkApis } from 'react-native-interceptor';

const MyScreen = () => <NetworkApis onBackPress = {navigation?.goBack} displayOrder = "FCFS" />;
```

##### Configuration Options

| Key                       | Mandatory | Type             | Default             |
|---------------------------|-----------|------------------|---------------------|
| onBackPress               | Yes       | Function         | N/A                 |
| displayOrder              | No        | "FCFS" or "LCFS" | "FCFS"              |

<b>FCFS</b> -> First-Come, First-Served <br>
<b>LCFS</b> -> Last-Come, First-Served

## Console Logger

This logger has 3 functions <b>log</b>, <b>warn</b> and <b>error</b> which works same as contemporary console functions. There is only one thing for consideration, each function first expects a string, called as <b>marker text</b> and then other arguments. If you are in debug mode then these functions will trigger there equivalent console functions and will store logs too, but if you are at release build then they will only store them.

### Logger Configuration

Call `logger.configure()` in your apps entry point if there are props to provide.

```ts
import { logger } from "rn-interceptor";

logger.configure({
  customErrorFunction: (markerText, ...args) => {
    // custom function
  },
  customLogFunction: (markerText, ...args) => {
    // custom function
  },
  customWarnFunction: (markerText, ...args) => {
    // custom function
  },
  logsLimit: 500,
});
```
##### Configuration Options
| Key                       | Mandatory | Type     | Default             |
|---------------------------|-----------|----------|---------------------|
| customLogFunction         | No        | function | null                |
| customWarnFunction        | No        | function | null                |
| customErrorFunction       | No        | function | null                |
| logsLimit                 | No        | number   | 500                 |

### Logger Functions

##### LOG function
```ts
import { logger } from "rn-interceptor";

logger.log("any marker text", arg1, arg2,....)
```
##### WARN function
```ts
import { logger } from "rn-interceptor";

logger.warn("any marker text", arg1, arg2,....)
```
##### ERROR function
```ts
import { logger } from "rn-interceptor";

logger.error("any marker text", arg1, arg2,....)
```

### Display All Calls

```ts
import { LogsList } from 'react-native-interceptor';

const MyScreen = () => <LogsList onBackPress = {navigation?.goBack} displayOrder = "FCFS" />;
```

##### Configuration Options

| Key                       | Mandatory | Type             | Default             |
|---------------------------|-----------|------------------|---------------------|
| onBackPress               | Yes       | Function         | N/A                 |
| displayOrder              | No        | "FCFS" or "LCFS" | "FCFS"              |

<b>FCFS</b> -> First-Come, First-Served <br>
<b>LCFS</b> -> Last-Come, First-Served

## Why

As it is not possible to get web like information of network calls and console logs at installed builds, this can be used with the app to track the network calls and logs to easily debug and resolve issues, which will also reduce the debug and resolution time and as anyone can see and report the issues, it also reduces developers blocking time.

As the library is very small you can safely bundle it with the production version of your app and put it behind a flag, or have a separate testing build of the app with these features enabled.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.