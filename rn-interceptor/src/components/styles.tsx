import { StyleSheet, TextStyle, ViewStyle } from 'react-native';
import {
  horizontalScale,
  verticalScale,
  moderateScale,
} from '../library/commons';
import { ColorMap } from '../types/theme';

export interface Styles {
  itemCenter: ViewStyle;
  flexRow: ViewStyle;
  fontBold: TextStyle;
  flexWrap: ViewStyle;
  parentContainer: ViewStyle;
  headerContainer: ViewStyle;
  title: TextStyle;
  headerPressable: ViewStyle;
  pressableText: TextStyle;
  individualContainer: ViewStyle;
  individualInfoContainer: ViewStyle;
  urlText: TextStyle;
  methodInfo: ViewStyle;
  listContainer: ViewStyle;
  methodText: TextStyle;
  carretIcon: TextStyle;
  expandContainer: ViewStyle;
  expandedInfoText: TextStyle;
  keyValueContainer: ViewStyle;
  infoButton: ViewStyle;
  infoButtonText: TextStyle;
  hyperLink: ViewStyle;
  hyperText: TextStyle;
  paddingBottom8: ViewStyle;
  marginHor4: TextStyle;
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
    fontBold: {
      fontWeight: 'bold',
    },
    flexWrap: {
      flexWrap: 'wrap',
    },
    parentContainer: {
      flex: 1,
      backgroundColor: colors.primary,
    },
    headerContainer: {
      paddingHorizontal: horizontalScale(10),
      justifyContent: 'space-between',
      height: verticalScale(36),
      alignItems: 'center',
      marginVertical: verticalScale(16),
    },
    title: {
      color: colors.secondary,
      fontSize: moderateScale(24),
    },
    headerPressable: {
      width: horizontalScale(36),
      height: horizontalScale(36),
      backgroundColor: colors.secondary,
      borderRadius: moderateScale(18),
    },
    pressableText: {
      color: colors.commonText,
      fontSize: moderateScale(20),
      marginBottom: verticalScale(4),
      marginRight: horizontalScale(3),
    },
    individualContainer: {
      marginBottom: verticalScale(16),
    },
    individualInfoContainer: {
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: verticalScale(12),
      paddingHorizontal: horizontalScale(12),
      backgroundColor: colors.secondary,
      borderRadius: moderateScale(36),
    },
    urlText: {
      color: colors.commonText,
      fontSize: moderateScale(12),
      width: horizontalScale(220),
    },
    methodInfo: {
      backgroundColor: colors.primary,
      width: horizontalScale(80),
      height: verticalScale(42),
      borderRadius: moderateScale(24),
      marginRight: horizontalScale(4),
    },
    listContainer: {
      paddingHorizontal: horizontalScale(10),
      paddingBottom: verticalScale(16),
    },
    methodText: {
      fontSize: moderateScale(18),
    },
    carretIcon: {
      color: colors.primary,
      fontSize: moderateScale(20),
    },
    expandContainer: {
      marginTop: verticalScale(8),
      paddingTop: verticalScale(12),
      paddingHorizontal: horizontalScale(12),
      backgroundColor: colors.detailsBackground,
      borderRadius: moderateScale(8),
    },
    expandedInfoText: {
      fontSize: moderateScale(14),
      color: colors.commonText,
    },
    keyValueContainer: {
      width: '92%',
    },
    infoButton: {
      paddingHorizontal: horizontalScale(16),
      paddingVertical: verticalScale(8),
      backgroundColor: colors.button,
      marginRight: horizontalScale(12),
      borderRadius: moderateScale(20),
      marginTop: verticalScale(12),
    },
    infoButtonText: {
      color: colors.commonText,
      fontSize: moderateScale(14),
      fontWeight: 'bold',
    },
    hyperLink: {
      paddingHorizontal: horizontalScale(12),
      paddingVertical: verticalScale(12),
    },
    hyperText: {
      fontSize: moderateScale(16),
      fontWeight: 'bold',
      color: colors.hyperLink,
    },
    paddingBottom8: {
      paddingBottom: verticalScale(12),
    },
    marginHor4: { marginLeft: horizontalScale(4) },
  });
