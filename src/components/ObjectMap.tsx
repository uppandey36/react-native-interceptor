import { useState, useCallback, memo } from 'react';
import {
  View,
  Text,
  Pressable,
  Platform,
  UIManager,
  LayoutAnimation,
  StyleSheet,
} from 'react-native';
import {
  verticalScale,
  horizontalScale,
  moderateScale,
  scaleFont,
  MONOSPACE_FONT,
  TOUCH_TARGET_MIN,
} from '../library/commons';
import { colors } from '../library/theme';
import { ColorMap } from '../types/theme';

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental &&
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const tabHeightVertical = 6;

const ScaleUpDown = memo(function ScaleUpDown({
  buttonText,
  onPress,
  accessibilityLabel,
}: {
  buttonText: string;
  onPress: () => void;
  accessibilityLabel: string;
}) {
  const styles = Styles(colors);
  return (
    <Pressable
      onPress={onPress}
      style={styles.scaleStyle}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      hitSlop={6}
    >
      <Text style={[styles.fontBold, styles.textColor]}>{buttonText}</Text>
    </Pressable>
  );
});

export default function ObjectMap(props: {
  tabCount?: number;
  parentKey?: string;
  extended?: boolean;
  obj:
    | string
    | boolean
    | number
    | null
    | undefined
    | Record<string, unknown>
    | unknown[];
}) {
  const { obj, tabCount = 0, parentKey = '', extended = true } = props;
  const styles = Styles(colors);
  const isarray = Array.isArray(obj);
  const [isExpanded, setExpanded] = useState(extended);
  const indent = tabCount * horizontalScale(12);

  const onScalePress = useCallback(() => {
    setExpanded((pre) => !pre);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  }, []);

  if (obj == null || typeof obj !== 'object') {
    return (
      <View style={[styles.infoMargin, { paddingLeft: indent }]}>
        <Text selectable style={[styles.textColor, styles.primitiveText]}>
          {String(obj)}
        </Text>
      </View>
    );
  }

  return isExpanded ? (
    <View style={{ paddingLeft: indent }}>
      <View style={[styles.flexRow, styles.infoMargin, styles.alignStart]}>
        {parentKey ? (
          <ScaleUpDown
            buttonText="-"
            onPress={onScalePress}
            accessibilityLabel={`Collapse ${parentKey}`}
          />
        ) : null}
        {parentKey ? (
          <Text
            style={[styles.fontBold, styles.keyText]}
          >{`${parentKey}: `}</Text>
        ) : null}
        <Text style={styles.zoneIndicatorColor}>{isarray ? '[' : '{'}</Text>
      </View>
      {Object.entries(obj).map(([key, value]) => {
        if (typeof value === 'object' && value !== null)
          return (
            <ObjectMap
              key={key}
              obj={value as Record<string, unknown> | unknown[]}
              tabCount={tabCount + 1}
              parentKey={key}
              extended={false}
            />
          );

        return (
          <View
            key={key}
            style={[styles.flexRow, styles.infoMargin, styles.alignStart]}
          >
            <Text style={[styles.fontBold, styles.keyText]}>{`${key}: `}</Text>
            <Text selectable style={[styles.textColor, styles.valueText]}>
              {String(value)}
            </Text>
          </View>
        );
      })}
      <Text style={[styles.zoneIndicatorColor, styles.infoMargin]}>
        {isarray ? ']' : '}'}
      </Text>
    </View>
  ) : (
    <View style={[styles.flexRow, styles.infoMargin, { paddingLeft: indent }]}>
      <ScaleUpDown
        buttonText="+"
        onPress={onScalePress}
        accessibilityLabel={`Expand ${parentKey}`}
      />
      <View style={[styles.flexRow, styles.flex1]}>
        <Text
          style={[styles.fontBold, styles.keyText]}
        >{`${parentKey}: `}</Text>
        <Text style={styles.zoneIndicatorColor}>
          {isarray ? '[...]' : '{...}'}
        </Text>
      </View>
    </View>
  );
}

const Styles = (color: ColorMap) =>
  StyleSheet.create({
    flexRow: {
      flexDirection: 'row',
    },
    flex1: {
      flex: 1,
    },
    fontBold: {
      fontWeight: '600',
    },
    infoMargin: {
      marginBottom: verticalScale(tabHeightVertical),
    },
    alignStart: {
      alignItems: 'flex-start',
    },
    textColor: {
      color: color.codeText,
      fontFamily: MONOSPACE_FONT,
      fontSize: scaleFont(13),
      lineHeight: scaleFont(20),
    },
    primitiveText: {
      flexShrink: 1,
    },
    keyText: {
      color: color.codeKey,
      fontFamily: MONOSPACE_FONT,
      fontSize: scaleFont(13),
      lineHeight: scaleFont(20),
    },
    valueText: {
      flex: 1,
      flexShrink: 1,
    },
    zoneIndicatorColor: {
      color: color.bracketColor,
      fontFamily: MONOSPACE_FONT,
      fontSize: scaleFont(13),
      fontWeight: '700',
    },
    scaleStyle: {
      minWidth: TOUCH_TARGET_MIN * 0.65,
      minHeight: TOUCH_TARGET_MIN * 0.65,
      paddingHorizontal: horizontalScale(10),
      marginRight: horizontalScale(8),
      backgroundColor: color.button,
      borderRadius: moderateScale(6),
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
