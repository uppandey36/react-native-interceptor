/* eslint-disable react-native/no-inline-styles */
import { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  LayoutAnimation,
  UIManager,
  Platform,
  ScrollView,
  Share,
  ListRenderItem,
} from 'react-native';
import { logger } from '../library/logger';
import { colors, logTypeAccent } from '../library/theme';
import { IIndividualLogComponent, IndividualLogs } from '../types/logger';
import { LogTypeKey } from '../types/theme';
import { isTablet } from '../library/commons';
import ObjectMap from './ObjectMap';
import CustomModal from './CustomModal';
import Search from './SearchArea';
import { Styles } from './styles';

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental &&
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

export interface LogsList {
  onBackPress: () => void;
  displayOrder?: 'FCFS' | 'LCFS';
}

export function IndividualLog(props: IIndividualLogComponent) {
  const styles = Styles(colors);
  const {
    type = 'LOG',
    markerText = '',
    values = [],
    onInfoButtonClick,
  } = props;
  const [expanded, setExpand] = useState(false);
  const logType = (type || 'LOG') as LogTypeKey;
  const accentColor = logTypeAccent[logType];

  const onExpandClick = useCallback(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpand((pre) => !pre);
  }, []);

  return (
    <View style={styles.individualContainer}>
      <Pressable
        onPress={onExpandClick}
        style={[styles.individualInfoContainer, styles.flexRow]}
        accessibilityRole="button"
        accessibilityState={{ expanded }}
        accessibilityLabel={`${type} log: ${markerText}`}
      >
        <View
          style={[styles.typeAccentBar, { backgroundColor: accentColor }]}
        />
        <View style={styles.rowContent}>
          <View style={[styles.methodInfo, styles.itemCenter]}>
            <Text style={[styles.methodText, { color: accentColor }]}>
              {type}
            </Text>
          </View>
          <Text numberOfLines={2} style={styles.urlText}>
            {markerText}
          </Text>
        </View>
        <Text
          style={[
            styles.carretIcon,
            { transform: [{ rotate: expanded ? '270deg' : '90deg' }] },
          ]}
        >
          {'\u25B6'}
        </Text>
      </Pressable>
      {expanded ? (
        <View style={[styles.expandContainer, styles.paddingBottom8]}>
          <View style={styles.keyValueRow}>
            <Text style={styles.expandedLabel}>Marker</Text>
            <Text selectable style={styles.expandedValue}>
              {markerText}
            </Text>
          </View>
          <View style={[styles.flexRow, styles.flexWrap]}>
            {(Array.isArray(values) ? values : []).map((item, index) => (
              <Pressable
                key={index}
                style={[styles.itemCenter, styles.infoButton]}
                onPress={() => onInfoButtonClick(item)}
                accessibilityRole="button"
                accessibilityLabel={`View ${typeof item} value`}
              >
                <Text style={styles.infoButtonText}>
                  {(typeof item).toUpperCase()}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      ) : null}
    </View>
  );
}

export function LogsList(props: LogsList) {
  const { onBackPress, displayOrder = 'FCFS' } = props;
  const styles = Styles(colors);
  const logLists = useMemo(
    () => logger.getLogsList(displayOrder === 'LCFS') ?? [],
    [displayOrder]
  );

  const [modalData, setModalData] = useState<{
    title: string;
    info: Record<string, unknown> | string | boolean | number;
  }>({ title: '', info: {} });
  const [showModal, setShowModal] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [areLogsClear, setAreLogsClear] = useState(false);
  const [searchedLogs, setSearchedLogs] = useState<IndividualLogs[] | null>(
    null
  );

  const listData = areLogsClear ? [] : (searchedLogs ?? logLists ?? []);

  const onInfoButtonClick = useCallback(
    (data: Record<string, unknown> | string | boolean | number) => {
      setModalData({ title: 'Copy', info: data });
      setShowModal(true);
    },
    []
  );

  const searchByMarkerText = useCallback(
    (text?: string) => {
      if (text) {
        setSearchedLogs(
          logLists.filter((item) =>
            item?.markerText?.toLowerCase()?.includes(text)
          )
        );
      } else {
        setSearchedLogs(null);
      }
    },
    [logLists]
  );

  const onCopyText = useCallback(() => {
    Share.share({ message: JSON.stringify(modalData?.info || '') });
  }, [modalData.info]);

  const onModalClose = useCallback(() => {
    setModalData({ title: '', info: {} });
    setShowModal(false);
    setShowOverlay(false);
  }, []);

  const clearAllLogs = useCallback(() => {
    logger.clearList();
    setAreLogsClear(true);
    onModalClose();
  }, [onModalClose]);

  const renderItem: ListRenderItem<IndividualLogs> = useCallback(
    ({ item }) => {
      if (!item) {
        return null;
      }
      return <IndividualLog {...item} onInfoButtonClick={onInfoButtonClick} />;
    },
    [onInfoButtonClick]
  );

  return (
    <View style={styles.parentContainer}>
      <View style={[styles.headerContainer, styles.flexRow]}>
        <Pressable
          onPress={onBackPress}
          style={[styles.headerPressable, styles.itemCenter]}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Text style={[styles.pressableText, styles.fontBold]}>
            {'\u25C0'}
          </Text>
        </Pressable>
        <Text
          style={[styles.title, styles.fontBold]}
          accessibilityRole="header"
        >
          Logger
        </Text>
        <Pressable
          onPress={() => setShowOverlay(true)}
          style={[styles.headerPressable, styles.itemCenter]}
          accessibilityRole="button"
          accessibilityLabel="Open menu"
        >
          <Text style={[styles.pressableText, styles.fontBold]}>
            {'\u22EE'}
          </Text>
        </Pressable>
      </View>
      <Search
        placeholder="Search by marker text"
        searchFunction={searchByMarkerText}
      />
      <FlatList
        data={listData}
        showsVerticalScrollIndicator={false}
        renderItem={renderItem}
        contentContainerStyle={[
          styles.listContainer,
          isTablet && { alignSelf: 'center', width: '100%', maxWidth: 720 },
        ]}
        ListEmptyComponent={
          <View style={styles.emptyList}>
            <Text style={styles.emptyListText}>No logs captured yet</Text>
          </View>
        }
      />
      <CustomModal
        onCopyClick={onCopyText}
        modalType="bottom"
        visible={showModal}
        onClose={onModalClose}
        title={modalData.title}
      >
        <ScrollView
          style={{ backgroundColor: colors.codeBackground }}
          contentContainerStyle={{ padding: 16 }}
          nestedScrollEnabled
        >
          <ObjectMap obj={modalData.info} />
        </ScrollView>
      </CustomModal>
      <CustomModal
        visible={showOverlay}
        onClose={onModalClose}
        modalType="overlay"
      >
        <Pressable
          onPress={clearAllLogs}
          style={styles.hyperLink}
          accessibilityRole="button"
          accessibilityLabel="Clear all logs"
        >
          <Text style={styles.hyperText}>Clear All</Text>
        </Pressable>
      </CustomModal>
    </View>
  );
}
