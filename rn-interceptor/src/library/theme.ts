import { ColorSchemeName, useColorScheme } from 'react-native';
import { ColorMap } from '../types/theme';

const colorScheme: ColorSchemeName = useColorScheme() || 'light';

const light: ColorMap = {
  primary: '#FFF',
  secondary: '#2F2F2F',
  commonText: '#FFF',
  secondaryText: '#DAD7D7',
  hyperLink: '#1A8DDB',
  button: '#3768B6',
  buttonDisable: '#6F8099',
  detailsBackground: '#585858',
  errorText: '#F86868',
  errorBackground: '#F86868',
  bracketColor: '#0CA821',
};

const dark: ColorMap = {
  primary: '#2F2F2F',
  secondary: '#FFF',
  commonText: '#000',
  secondaryText: '#3C3C3C',
  hyperLink: '#1A8DDB',
  button: '#3768B6',
  buttonDisable: '#6F8099',
  detailsBackground: '#DDDDDD',
  errorText: '#F86868',
  errorBackground: '#F86868',
  bracketColor: '#0CA821',
};

export const theme = {
  dark,
  light,
};

export enum MethodColorMap {
  GET = '#50863C',
  POST = '#3768B6',
  PATCH = '#A19D18',
  PUT = '#B8B310',
  DELETE = '#B8191A',
}

export enum FunctionColorMap {
  LOG = '#50863C',
  WARN = '#A19D18',
  ERROR = '#940202',
}

export const colors = theme[colorScheme];
