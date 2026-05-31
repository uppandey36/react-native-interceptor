import { Platform, StyleSheet, TextStyle, ViewStyle } from 'react-native';
import {
  horizontalScale,
  verticalScale,
  moderateScale,
  scaleFont,
  contentHorizontalPadding,
  TOUCH_TARGET_MIN,
  isTablet,
} from '../library/commons';
import { ColorMap } from '../types/theme';

export interface Styles {
  itemCenter: ViewStyle;
  flexRow: ViewStyle;
  flex1: ViewStyle;
  fontBold: TextStyle;
  flexWrap: ViewStyle;
  parentContainer: ViewStyle;
  headerContainer: ViewStyle;
  title: TextStyle;
  headerPressable: ViewStyle;
  pressableText: TextStyle;
  individualContainer: ViewStyle;
  individualInfoContainer: ViewStyle;
  rowContent: ViewStyle;
  urlText: TextStyle;
  methodInfo: ViewStyle;
  listContainer: ViewStyle;
  methodText: TextStyle;
  carretIcon: TextStyle;
  expandContainer: ViewStyle;
  expandContainerError: ViewStyle;
  expandedInfoText: TextStyle;
  expandedLabel: TextStyle;
  expandedValue: TextStyle;
  keyValueRow: ViewStyle;
  infoButton: ViewStyle;
  infoButtonText: TextStyle;
  hyperLink: ViewStyle;
  hyperText: TextStyle;
  paddingBottom8: ViewStyle;
  marginHor4: TextStyle;
  emptyList: ViewStyle;
  emptyListText: TextStyle;
  typeAccentBar: ViewStyle;
}

export const Styles = (colors: ColorMap) =>
  StyleSheet.create<Styles>({
    itemCenter: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    flexRow: {
      flexDirection: 'row',
    },
    flex1: {
      flex: 1,
    },
    fontBold: {
      fontWeight: '600',
    },
    flexWrap: {
      flexWrap: 'wrap',
    },
    parentContainer: {
      flex: 1,
      backgroundColor: colors.primary,
    },
    headerContainer: {
      paddingHorizontal: contentHorizontalPadding,
      justifyContent: 'space-between',
      minHeight: verticalScale(48),
      alignItems: 'center',
      marginTop: verticalScale(Platform.OS === 'ios' ? 8 : 12),
      marginBottom: verticalScale(12),
    },
    title: {
      color: colors.textPrimary,
      fontSize: scaleFont(isTablet ? 26 : 22),
      letterSpacing: 0.2,
    },
    headerPressable: {
      minWidth: TOUCH_TARGET_MIN,
      minHeight: TOUCH_TARGET_MIN,
      backgroundColor: colors.surface,
      borderRadius: moderateScale(22),
      borderWidth: 1,
      borderColor: colors.border,
      paddingTop: verticalScale(Platform.OS === 'ios' ? 2 : 0),
    },
    pressableText: {
      color: colors.textPrimary,
      fontSize: scaleFont(18),
    },
    individualContainer: {
      marginBottom: verticalScale(12),
    },
    individualInfoContainer: {
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: verticalScale(14),
      paddingHorizontal: horizontalScale(14),
      backgroundColor: colors.secondary,
      borderRadius: moderateScale(16),
      borderWidth: 1,
      borderColor: colors.border,
      minHeight: TOUCH_TARGET_MIN + verticalScale(8),
    },
    rowContent: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: horizontalScale(8),
    },
    urlText: {
      color: colors.commonText,
      fontSize: scaleFont(14),
      lineHeight: scaleFont(20),
      flex: 1,
    },
    methodInfo: {
      backgroundColor: colors.methodBadgeBg,
      minWidth: horizontalScale(isTablet ? 72 : 64),
      paddingHorizontal: horizontalScale(8),
      minHeight: verticalScale(36),
      borderRadius: moderateScale(10),
      marginRight: horizontalScale(10),
    },
    listContainer: {
      paddingHorizontal: contentHorizontalPadding,
      paddingBottom: verticalScale(24),
      flexGrow: 1,
    },
    methodText: {
      fontSize: scaleFont(13),
      fontWeight: '700',
      letterSpacing: 0.6,
    },
    carretIcon: {
      color: colors.commonText,
      fontSize: scaleFont(14),
      opacity: 0.85,
      minWidth: horizontalScale(24),
      textAlign: 'center',
    },
    expandContainer: {
      marginTop: verticalScale(8),
      paddingTop: verticalScale(14),
      paddingBottom: verticalScale(14),
      paddingHorizontal: horizontalScale(14),
      backgroundColor: colors.detailsBackground,
      borderRadius: moderateScale(12),
      borderWidth: 1,
      borderColor: colors.border,
    },
    expandContainerError: {
      backgroundColor: colors.errorBackground,
      borderColor: colors.errorText,
    },
    expandedInfoText: {
      fontSize: scaleFont(14),
      color: colors.commonText,
      lineHeight: scaleFont(22),
    },
    expandedLabel: {
      fontSize: scaleFont(13),
      color: colors.secondaryText,
      fontWeight: '600',
      minWidth: horizontalScale(56),
    },
    expandedValue: {
      flex: 1,
      fontSize: scaleFont(14),
      color: colors.commonText,
      lineHeight: scaleFont(22),
    },
    keyValueRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: verticalScale(10),
      width: '100%',
    },
    infoButton: {
      paddingHorizontal: horizontalScale(14),
      paddingVertical: verticalScale(10),
      backgroundColor: colors.button,
      marginRight: horizontalScale(8),
      marginBottom: verticalScale(8),
      borderRadius: moderateScale(10),
      minHeight: TOUCH_TARGET_MIN,
      justifyContent: 'center',
    },
    infoButtonText: {
      color: colors.buttonText,
      fontSize: scaleFont(13),
      fontWeight: '600',
    },
    hyperLink: {
      paddingHorizontal: horizontalScale(12),
      paddingVertical: verticalScale(12),
      minHeight: TOUCH_TARGET_MIN,
      justifyContent: 'center',
    },
    hyperText: {
      fontSize: scaleFont(15),
      fontWeight: '600',
      color: colors.hyperLink,
      textDecorationLine: 'underline',
    },
    paddingBottom8: {
      paddingBottom: verticalScale(12),
    },
    marginHor4: {
      marginLeft: horizontalScale(4),
    },
    emptyList: {
      paddingVertical: verticalScale(48),
      alignItems: 'center',
    },
    emptyListText: {
      color: colors.textMuted,
      fontSize: scaleFont(15),
      lineHeight: scaleFont(22),
    },
    typeAccentBar: {
      width: horizontalScale(4),
      borderRadius: moderateScale(2),
      marginRight: horizontalScale(10),
      alignSelf: 'stretch',
    },
  });
