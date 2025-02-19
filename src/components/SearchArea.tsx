import { memo, useState } from 'react';
import { TextInput, StyleSheet, View, Text, Pressable } from 'react-native';
import { colors } from '../library/theme';
import {
  horizontalScale,
  moderateScale,
  verticalScale,
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
  const onChnageText = (text: string) => {
    setSearchText(text);
    searchFunction(text?.toLowerCase() || '');
  };

  return (
    <View style={styles.inputArea}>
      <TextInput
        value={searchText}
        placeholder={placeholder}
        placeholderTextColor={colors.secondaryText}
        onChangeText={onChnageText}
        style={styles.textInput}
      />
      <Pressable
        onPress={
          searchText
            ? () => {
                onChnageText('');
              }
            : null
        }
      >
        <Text
          style={[
            styles.searchIcon,
            searchText
              ? {
                  fontSize: moderateScale(20),
                  marginTop: verticalScale(8),
                }
              : {},
          ]}
        >
          {searchText ? '\u2715' : '⌕'}
        </Text>
      </Pressable>
    </View>
  );
}

const Styles = (colors: ColorMap) =>
  StyleSheet.create({
    inputArea: {
      borderWidth: 1,
      height: verticalScale(50),
      backgroundColor: colors.secondary,
      marginHorizontal: horizontalScale(10),
      marginBottom: verticalScale(16),
      borderRadius: moderateScale(25),
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: horizontalScale(12),
    },
    searchIcon: {
      fontSize: moderateScale(30),
      color: colors.primary,
      fontFamily: 'monospace',
    },
    textInput: {
      width: '85%',
      color: colors.primary,
      fontSize: moderateScale(14),
    },
  });

export default memo(Search);
