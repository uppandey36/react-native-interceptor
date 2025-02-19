type ColorKeys =
  | 'primary'
  | 'secondary'
  | 'commonText'
  | 'hyperLink'
  | 'button'
  | 'detailsBackground'
  | 'errorText'
  | 'errorBackground'
  | 'secondaryText'
  | 'buttonDisable'
  | 'bracketColor';
type ColorValues =
  | '#FFF'
  | '#2F2F2F'
  | '#1A8DDB'
  | '#3768B6'
  | '#585858'
  | '#000'
  | '#DDDDDD'
  | '#F82829'
  | '#940202'
  | '#F86868'
  | '#DAD7D7'
  | '#3C3C3C'
  | '#6F8099'
  | '#0CA821';

export type ColorMap = Record<ColorKeys, ColorValues>;
