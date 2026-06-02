import { Dimensions, PixelRatio, Platform } from 'react-native';
import { AvailableMethods } from '../types/network';

const { width, height } = Dimensions.get('window');

const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;

const clamp = (min: number, value: number, max: number) =>
  Math.min(Math.max(value, min), max);

const horizontalScale = (size: number) => {
  const scaled = (width / guidelineBaseWidth) * size;
  return clamp(size * 0.88, scaled, size * 1.25);
};

const verticalScale = (size: number) => {
  const scaled = (height / guidelineBaseHeight) * size;
  return clamp(size * 0.88, scaled, size * 1.25);
};

const moderateScale = (size: number, factor = 0.4) =>
  size + (horizontalScale(size) - size) * factor;

const scaleFont = (size: number) => {
  const scaled = moderateScale(size, 0.35);
  const fontScale = PixelRatio.getFontScale();
  return clamp(size * 0.95, scaled * Math.min(fontScale, 1.35), size * 1.45);
};

const isTablet = width >= 768;

const contentHorizontalPadding = horizontalScale(isTablet ? 24 : 16);

const contentMaxWidth = isTablet ? Math.min(width * 0.82, 720) : width;

const TOUCH_TARGET_MIN = Platform.select({
  ios: 44,
  android: 48,
  default: 44,
})!;

const MONOSPACE_FONT = Platform.select({
  ios: 'Menlo',
  android: 'monospace',
  default: 'monospace',
});

function generateCurlCommand(options: {
  method: AvailableMethods;
  url: string;
  headers: Record<string, string>;
  body: Record<string, unknown> | string;
}): string {
  const { method, url, headers, body } = options;

  let curlCommand = `curl -X ${method.toUpperCase()} "${url}"`;

  if (headers) {
    for (const [key, value] of Object.entries(headers)) {
      curlCommand += ` -H "${key}: ${value}"`;
    }
  }

  if (body) {
    const bodyString = typeof body === 'string' ? body : JSON.stringify(body);
    curlCommand += ` -d '${bodyString}'`;
  }

  return curlCommand;
}

export {
  width,
  height,
  horizontalScale,
  verticalScale,
  moderateScale,
  scaleFont,
  isTablet,
  contentHorizontalPadding,
  contentMaxWidth,
  TOUCH_TARGET_MIN,
  MONOSPACE_FONT,
  generateCurlCommand,
};
