import { ColorSchemeName, Appearance } from 'react-native';
import { ColorMap, LogTypeKey } from '../types/theme';

const colorScheme: ColorSchemeName = Appearance.getColorScheme() ?? 'light';

const light: ColorMap = {
  primary: '#F1F5F9',
  secondary: '#1E293B',
  surface: '#FFFFFF',
  commonText: '#F8FAFC',
  textPrimary: '#0F172A',
  textSecondary: '#475569',
  textMuted: '#94A3B8',
  hyperLink: '#2563EB',
  button: '#2563EB',
  buttonText: '#FFFFFF',
  detailsBackground: '#334155',
  errorText: '#FCA5A5',
  errorBackground: '#991B1B',
  errorSurface: '#FEE2E2',
  success: '#16A34A',
  warning: '#CA8A04',
  secondaryText: '#CBD5E1',
  buttonDisable: '#64748B',
  bracketColor: '#4ADE80',
  border: '#E2E8F0',
  overlay: 'rgba(15, 23, 42, 0.45)',
  methodBadgeBg: 'rgba(255, 255, 255, 0.12)',
  codeBackground: '#0F172A',
  codeText: '#E2E8F0',
  codeKey: '#94A3B8',
};

const dark: ColorMap = {
  primary: '#0F172A',
  secondary: '#F8FAFC',
  surface: '#1E293B',
  commonText: '#0F172A',
  textPrimary: '#F8FAFC',
  textSecondary: '#CBD5E1',
  textMuted: '#94A3B8',
  hyperLink: '#60A5FA',
  button: '#3B82F6',
  buttonText: '#FFFFFF',
  detailsBackground: '#E2E8F0',
  errorText: '#F87171',
  errorBackground: '#DC2626',
  errorSurface: '#450A0A',
  success: '#4ADE80',
  warning: '#FACC15',
  secondaryText: '#64748B',
  buttonDisable: '#94A3B8',
  bracketColor: '#22C55E',
  border: '#334155',
  overlay: 'rgba(0, 0, 0, 0.55)',
  methodBadgeBg: 'rgba(15, 23, 42, 0.08)',
  codeBackground: '#020617',
  codeText: '#F1F5F9',
  codeKey: '#94A3B8',
};

export const theme = {
  dark,
  light,
};

export enum MethodColorMap {
  GET = '#22C55E',
  POST = '#3B82F6',
  PATCH = '#EAB308',
  PUT = '#F59E0B',
  DELETE = '#EF4444',
}

export enum FunctionColorMap {
  LOG = '#22C55E',
  WARN = '#EAB308',
  ERROR = '#EF4444',
}

export const logTypeAccent: Record<LogTypeKey, string> = {
  LOG: FunctionColorMap.LOG,
  WARN: FunctionColorMap.WARN,
  ERROR: FunctionColorMap.ERROR,
};

export const colors = theme[colorScheme === 'dark' ? 'dark' : 'light'];
