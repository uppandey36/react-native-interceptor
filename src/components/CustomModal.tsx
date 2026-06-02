import { memo, ReactNode } from 'react';
import {
  Modal,
  StyleSheet,
  View,
  Text,
  Pressable,
  useWindowDimensions,
  Platform,
} from 'react-native';
import { ColorMap } from '../types/theme';
import { colors } from '../library/theme';
import {
  verticalScale,
  horizontalScale,
  moderateScale,
  scaleFont,
  contentHorizontalPadding,
  TOUCH_TARGET_MIN,
  isTablet,
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
  const { height: windowHeight } = useWindowDimensions();
  const styles = Style(colors);

  const modalMaxHeight = Math.min(windowHeight * 0.85, verticalScale(640));
  const bottomInset =
    Platform.OS === 'ios' ? verticalScale(20) : verticalScale(12);

  return (
    <Modal
      onRequestClose={onClose}
      animationType={modalType === 'bottom' ? 'slide' : 'fade'}
      visible={visible}
      transparent
      accessibilityViewIsModal
    >
      {modalType === 'bottom' ? (
        <View style={styles.modalParentContainer}>
          <Pressable
            style={styles.backdrop}
            onPress={onClose}
            accessibilityLabel="Close modal"
          />
          <View
            style={[
              styles.modalInfoContainer,
              {
                maxHeight: modalMaxHeight,
                paddingBottom: bottomInset,
              },
            ]}
          >
            <View style={styles.handle} />
            <View style={styles.headerContainer}>
              {onCopyClick ? (
                <Pressable
                  onPress={onCopyClick}
                  accessibilityRole="button"
                  accessibilityLabel="Copy to clipboard"
                  hitSlop={8}
                >
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
              <Pressable
                onPress={onClose}
                style={styles.closeButton}
                accessibilityRole="button"
                accessibilityLabel="Close"
                hitSlop={8}
              >
                <Text style={styles.closeButtonText}>{'\u2715'}</Text>
              </Pressable>
            </View>
            {children}
          </View>
        </View>
      ) : null}
      {modalType === 'overlay' ? (
        <View style={styles.overlayContainer}>
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={onClose}
            accessibilityLabel="Dismiss menu"
          />
          <View
            style={[
              styles.overlayInfoContainer,
              isTablet && styles.overlayInfoContainerTablet,
            ]}
          >
            <View style={styles.overlayHead}>
              {title ? (
                <Text style={styles.modalHeaderText}>{title}</Text>
              ) : (
                <View />
              )}
              <Pressable
                onPress={onClose}
                accessibilityRole="button"
                accessibilityLabel="Close menu"
                hitSlop={8}
              >
                <Text style={styles.closeButtonText}>{'\u2715'}</Text>
              </Pressable>
            </View>
            {children}
          </View>
        </View>
      ) : null}
    </Modal>
  );
}

const Style = (color: ColorMap) =>
  StyleSheet.create({
    modalParentContainer: {
      flex: 1,
      justifyContent: 'flex-end',
    },
    backdrop: {
      ...StyleSheet.absoluteFill,
      backgroundColor: color.overlay,
    },
    modalInfoContainer: {
      backgroundColor: color.surface,
      borderTopLeftRadius: moderateScale(16),
      borderTopRightRadius: moderateScale(16),
      borderWidth: 1,
      borderColor: color.border,
      borderBottomWidth: 0,
      width: '100%',
      maxWidth: isTablet ? 720 : undefined,
      alignSelf: 'center',
    },
    handle: {
      width: horizontalScale(40),
      height: verticalScale(4),
      borderRadius: moderateScale(2),
      backgroundColor: color.border,
      alignSelf: 'center',
      marginTop: verticalScale(10),
    },
    overlayContainer: {
      flex: 1,
      backgroundColor: color.overlay,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: contentHorizontalPadding,
    },
    overlayInfoContainer: {
      borderRadius: moderateScale(14),
      minWidth: horizontalScale(200),
      paddingHorizontal: horizontalScale(16),
      paddingVertical: verticalScale(12),
      backgroundColor: color.surface,
      borderWidth: 1,
      borderColor: color.border,
      elevation: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 12,
    },
    overlayInfoContainerTablet: {
      minWidth: horizontalScale(280),
    },
    overlayHead: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: verticalScale(4),
    },
    headerContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    modalHeaderText: {
      fontWeight: '600',
      fontSize: scaleFont(17),
      color: color.textPrimary,
    },
    padding16: {
      paddingHorizontal: horizontalScale(16),
      paddingVertical: verticalScale(12),
    },
    copyLink: {
      color: color.hyperLink,
      textDecorationLine: 'underline',
    },
    closeButton: {
      minWidth: TOUCH_TARGET_MIN,
      minHeight: TOUCH_TARGET_MIN,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: horizontalScale(8),
    },
    closeButtonText: {
      fontSize: scaleFont(20),
      color: color.textSecondary,
      fontWeight: '600',
    },
  });

export default memo(CustomModal);
