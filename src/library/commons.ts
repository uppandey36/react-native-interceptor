import { Dimensions } from 'react-native';
import { AvailableMethods } from '../types/network';

export const { width, height } = Dimensions.get('window');

const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;

const horizontalScale = (size: number) => (width / guidelineBaseWidth) * size;
const verticalScale = (size: number) => (height / guidelineBaseHeight) * size;
const moderateScale = (size: number, factor = 0.5) =>
  size + (horizontalScale(size) - size) * factor;

function generateCurlCommand(options: {
  method: AvailableMethods;
  url: string;
  headers: Record<string, string>;
  body: Record<string, unknown> | string;
}): string {
  const { method, url, headers, body } = options;

  // Start building the cURL command
  let curlCommand = `curl -X ${method.toUpperCase()} "${url}"`;

  // Add headers if they exist
  if (headers) {
    for (const [key, value] of Object.entries(headers)) {
      curlCommand += ` -H "${key}: ${value}"`;
    }
  }

  // Add body if it exists
  if (body) {
    const bodyString = typeof body === 'string' ? body : JSON.stringify(body);
    curlCommand += ` -d '${bodyString}'`;
  }

  return curlCommand;
}

export { horizontalScale, verticalScale, moderateScale, generateCurlCommand };
