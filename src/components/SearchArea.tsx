import { memo, useState } from 'react';
import {
  TextInput,
  StyleSheet,
  View,
  Text,
  Pressable,
  Platform,
} from 'react-native';
import { colors } from '../library/theme';
import {
  horizontalScale,
  moderateScale,
  verticalScale,
  scaleFont,
  contentHorizontalPadding,
  TOUCH_TARGET_MIN,
} from '../library/commons';
import { ColorMap } from '../types/theme';

interface Search {
  placeholder: string;
  searchFunction: (text: string) => void;
}

function Search(props: Search) {
  const { placeholder, searchFunction } = props;
  const styles = Styles(colors);

  const [searchText, setSearchText] = useState('');
  const onChangeText = (text: string) => {
    setSearchText(text);
    searchFunction(text?.toLowerCase() || '');
  };

  return (
    <View style={styles.inputArea}>
      <TextInput
        value={searchText}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        onChangeText={onChangeText}
        style={styles.textInput}
        accessibilityLabel={placeholder}
        accessibilityRole="search"
        returnKeyType="search"
        autoCapitalize="none"
        autoCorrect={false}
        clearButtonMode="never"
      />
      <Pressable
        onPress={
          searchText
            ? () => {
                onChangeText('');
              }
            : undefined
        }
        accessibilityRole="button"
        accessibilityLabel={searchText ? 'Clear search' : 'Search'}
        hitSlop={8}
        style={styles.clearButton}
      >
        <Text style={[styles.searchIcon, searchText && styles.clearIcon]}>
          {searchText ? '\u2715' : '\u2315'}
        </Text>
      </Pressable>
    </View>
  );
}

const Styles = (color: ColorMap) =>
  StyleSheet.create({
    inputArea: {
      borderWidth: 1,
      borderColor: color.border,
      minHeight: Math.max(verticalScale(48), TOUCH_TARGET_MIN),
      backgroundColor: color.surface,
      marginHorizontal: contentHorizontalPadding,
      marginBottom: verticalScale(12),
      borderRadius: moderateScale(12),
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: horizontalScale(14),
    },
    clearButton: {
      minWidth: TOUCH_TARGET_MIN,
      minHeight: TOUCH_TARGET_MIN,
      justifyContent: 'center',
      alignItems: 'center',
    },
    searchIcon: {
      fontSize: scaleFont(22),
      color: color.textSecondary,
      fontFamily: Platform.select({ ios: 'System', default: undefined }),
    },
    clearIcon: {
      fontSize: scaleFont(18),
      color: color.textPrimary,
    },
    textInput: {
      flex: 1,
      color: color.textPrimary,
      fontSize: scaleFont(16),
      lineHeight: scaleFont(22),
      paddingVertical: verticalScale(Platform.OS === 'ios' ? 12 : 8),
      marginRight: horizontalScale(8),
    },
  });

export default memo(Search);
