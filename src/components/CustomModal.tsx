import { memo, ReactNode } from 'react';
import { Modal, StyleSheet, View, Text, Pressable } from 'react-native';
import { ColorMap } from '../types/theme';
import { colors } from '../library/theme';
import {
  verticalScale,
  horizontalScale,
  moderateScale,
} from '../library/commons';

interface ICustomModal {
  visible: boolean;
  onClose: () => void;
  modalType: 'bottom' | 'overlay';
  title?: string;
  children: ReactNode;
  onCopyClick?: () => void;
}

function CustomModal(props: ICustomModal) {
  const {
    children,
    modalType,
    onClose,
    visible,
    title = '',
    onCopyClick,
  } = props;
  const styles = Style(colors);
  return (
    <Modal
      onRequestClose={onClose}
      animationType={modalType === 'bottom' ? 'slide' : 'fade'}
      visible={visible}
      transparent={true}
    >
      {modalType === 'bottom' ? (
        <View style={styles.modalParentContainer}>
          <View style={styles.modalInfoContainer}>
            <View style={styles.headeContainer}>
              {onCopyClick ? (
                <Pressable onPress={onCopyClick}>
                  <Text
                    style={[
                      styles.padding16,
                      styles.modalHeaderText,
                      styles.copyLink,
                    ]}
                  >
                    {title}
                  </Text>
                </Pressable>
              ) : (
                <Text style={[styles.padding16, styles.modalHeaderText]}>
                  {title}
                </Text>
              )}
              <Pressable onPress={onClose} style={styles.padding16}>
                <Text style={styles.modalHeaderText}>X</Text>
              </Pressable>
            </View>
            {children}
          </View>
        </View>
      ) : null}
      {modalType === 'overlay' ? (
        <View style={styles.overlayContainer}>
          <View style={styles.overlayInfoContainer}>
            <View style={styles.overlayHead}>
              <Text style={styles.modalHeaderText}>{title}</Text>
              <Pressable onPress={onClose}>
                <Text style={styles.modalHeaderText}>X</Text>
              </Pressable>
            </View>
            {children}
          </View>
        </View>
      ) : null}
    </Modal>
  );
}

const Style = (colors: ColorMap) =>
  StyleSheet.create({
    modalParentContainer: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.4)',
      justifyContent: 'flex-end',
    },
    overlayContainer: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.4)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalInfoContainer: {
      backgroundColor: colors.primary,
      borderTopLeftRadius: moderateScale(16),
      borderTopRightRadius: moderateScale(16),
      maxHeight: verticalScale(600),
      paddingBottom: verticalScale(12),
    },
    overlayInfoContainer: {
      borderRadius: moderateScale(12),
      width: horizontalScale(170),
      paddingHorizontal: horizontalScale(12),
      paddingVertical: verticalScale(8),
      backgroundColor: colors.primary,
    },
    overlayHead: { flexDirection: 'row', justifyContent: 'space-between' },
    headeContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    modalHeaderText: {
      fontWeight: 'bold',
      fontSize: moderateScale(18),
      color: colors.secondary,
    },
    padding16: {
      paddingHorizontal: horizontalScale(16),
      paddingVertical: verticalScale(16),
    },
    copyLink: {
      color: colors.hyperLink,
    },
  });

export default memo(CustomModal);
