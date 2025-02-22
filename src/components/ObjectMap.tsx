/* eslint-disable react-hooks/exhaustive-deps */
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
import { verticalScale, horizontalScale } from '../library/commons';
import { theme } from '../library/theme';
import { ColorMap } from '../types/theme';

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental &&
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const tabSpacesHorizontal = '    ';
const tabHeightVertical = 5;

const ScaleUpDown = memo(function ScaleUpDown({
  buttonText,
  onPress,
}: {
  buttonText: string;
  onPress: () => void;
}) {
  const styles = Styles(theme.light);
  return (
    <Pressable onPress={onPress} style={styles.scaleStyle}>
      <Text style={[styles.fontBold, styles.textColor]}>{buttonText}</Text>
    </Pressable>
  );
});

export default function ObjectMap(props: {
  tabCount?: number;
  parentKey?: string;
  extended?: boolean;
  obj: string | boolean | number | Record<string, unknown> | unknown[];
}) {
  const { obj, tabCount = 0, parentKey = '', extended = true } = props;
  const styles = Styles(theme.light);
  const isarray = Array.isArray(obj);
  const [isExpanded, setExpande] = useState(extended);

  const onScalePress = useCallback(() => {
    setExpande((pre) => !pre);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  }, []);

  if (['string', 'boolean', 'number'].includes(typeof obj))
    return (
      <View style={styles.infoMargin}>
        <Text style={[styles.textColor]}>{obj.toString()}</Text>
      </View>
    );
  else
    return isExpanded ? (
      <View>
        <View style={[styles.flexRow, styles.infoMargin]}>
          <Text>{`${tabSpacesHorizontal.repeat(tabCount)}`}</Text>
          {parentKey && <ScaleUpDown buttonText={'-'} onPress={onScalePress} />}
          {parentKey && (
            <Text
              style={[styles.fontBold, styles.textColor]}
            >{`${parentKey}: `}</Text>
          )}
          <Text style={styles.zoneIndicatorColor}>{`${
            isarray ? '[' : '{'
          }`}</Text>
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
          else
            return (
              <View
                key={key}
                style={[styles.flexRow, styles.infoMargin, styles.alignStart]}
              >
                <Text
                  style={[styles.fontBold, styles.textColor]}
                >{`${tabSpacesHorizontal.repeat(tabCount + 1)}${key}: `}</Text>
                <View style={{ maxWidth: '70%' }}>
                  <Text style={styles.textColor}>{value as string}</Text>
                </View>
              </View>
            );
        })}
        <Text
          style={[styles.zoneIndicatorColor, styles.infoMargin]}
        >{`${tabSpacesHorizontal.repeat(tabCount)}${
          isarray ? ']' : '}'
        }`}</Text>
      </View>
    ) : (
      <View style={[styles.flexRow, styles.infoMargin]}>
        <Text>{`${tabSpacesHorizontal.repeat(tabCount)}`}</Text>
        <ScaleUpDown buttonText={'+'} onPress={onScalePress} />
        <View style={styles.flexRow}>
          <Text
            style={[styles.fontBold, styles.textColor]}
          >{`${parentKey}: `}</Text>
          <Text style={styles.zoneIndicatorColor}>{`${
            isarray ? '[...]' : '{...}'
          }`}</Text>
        </View>
      </View>
    );
}

const Styles = (colors: ColorMap) =>
  StyleSheet.create({
    flexRow: {
      flexDirection: 'row',
    },
    fontBold: {
      fontWeight: 'bold',
    },
    infoMargin: {
      marginBottom: verticalScale(tabHeightVertical),
    },
    alignStart: {
      alignItems: 'flex-start',
    },
    textColor: {
      color: colors.secondary,
    },
    zoneIndicatorColor: {
      color: colors.bracketColor,
    },
    scaleStyle: {
      paddingHorizontal: horizontalScale(8),
      marginRight: horizontalScale(tabHeightVertical),
      backgroundColor: colors.errorBackground,
    },
  });
