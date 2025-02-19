/* eslint-disable react-hooks/exhaustive-deps */
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
} from 'react-native';
import { logger } from '..';
import { colors, FunctionColorMap } from '../library/theme';
import { IIndividualLogComponent, IndividualLogs } from '../types/logger';
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
  const onExpandClick = useCallback(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpand((pre) => !pre);
  }, []);

  return (
    <View style={styles.individualContainer}>
      <Pressable
        onPress={onExpandClick}
        style={[styles.individualInfoContainer, styles.flexRow]}
      >
        <View style={[styles.flexRow, styles.itemCenter]}>
          <View style={[styles.methodInfo, styles.itemCenter]}>
            <Text
              style={[
                styles.methodText,
                styles.fontBold,
                { color: FunctionColorMap[type || 'LOG'] },
              ]}
            >
              {type}
            </Text>
          </View>
          <Text numberOfLines={1} style={[styles.urlText]}>
            {markerText}
          </Text>
        </View>
        <Text
          style={[
            styles.carretIcon,
            {
              transform: [{ rotate: !expanded ? '90deg' : '270deg' }],
            },
          ]}
        >
          {'\u25B6'}
        </Text>
      </Pressable>
      {expanded ? (
        <View
          style={[
            styles.expandContainer,
            styles.paddingBottom8,
            { backgroundColor: FunctionColorMap[type || 'LOG'] },
          ]}
        >
          <View style={[styles.flexRow, styles.keyValueContainer]}>
            <View>
              <Text style={[styles.fontBold, styles.expandedInfoText]}>
                Marker :{' '}
              </Text>
            </View>
            <Text style={[styles.expandedInfoText]}>{markerText}</Text>
          </View>
          <View style={[styles.flexRow, styles.flexWrap]}>
            {values?.map((item, index) => {
              return (
                <Pressable
                  key={index}
                  style={[styles.itemCenter, styles.infoButton]}
                  onPress={() => onInfoButtonClick(item)}
                >
                  <Text style={[styles.infoButtonText]}>
                    {(typeof item).toUpperCase() || ''}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      ) : null}
    </View>
  );
}

export function LogsList(props: LogsList) {
  const { onBackPress } = props;
  const styles = Styles(colors);
  const logLists = useMemo(() => logger.getLogsList(), []);

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

  const onInfoButtonClick = useCallback(
    (data: Record<string, unknown> | string | boolean | number) => {
      setModalData({ title: 'Copy', info: data });
      setShowModal(true);
    },
    []
  );

  const searchByMarkerText = useCallback((text?: string) => {
    if (text) {
      const filteredData = logLists?.filter((item) =>
        item?.markerText?.toLowerCase()?.includes(text)
      );
      setSearchedLogs(filteredData);
    } else {
      setSearchedLogs(null);
    }
  }, []);

  const onCopyText = useCallback(() => {
    const data = JSON.stringify(modalData?.info || '');
    Share.share({
      message: data,
    });
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
  }, []);

  return (
    <View style={styles.parentContainer}>
      <View style={[styles.headerContainer, styles.flexRow]}>
        <Pressable
          onPress={onBackPress}
          style={[styles.headerPressable, styles.itemCenter]}
        >
          <Text style={[styles.pressableText, styles.fontBold]}>
            {'\u25C0'}
          </Text>
        </Pressable>
        <View>
          <Text style={[styles.title, styles.fontBold]}>Logger</Text>
        </View>
        <Pressable
          onPress={() => setShowOverlay(true)}
          style={[styles.headerPressable, styles.itemCenter]}
        >
          <Text
            style={[styles.pressableText, styles.fontBold, styles.marginHor4]}
          >
            {'\u22EE'}
          </Text>
        </Pressable>
      </View>
      <Search
        placeholder="Search by market text"
        searchFunction={searchByMarkerText}
      />
      <FlatList
        data={areLogsClear ? [] : (searchedLogs ?? logLists)}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <IndividualLog
            key={index}
            {...item}
            onInfoButtonClick={onInfoButtonClick}
          />
        )}
        contentContainerStyle={styles.listContainer}
      />
      <CustomModal
        onCopyClick={onCopyText}
        modalType="bottom"
        visible={showModal}
        onClose={onModalClose}
        title={modalData.title}
      >
        <ScrollView contentContainerStyle={{ marginHorizontal: 16 }}>
          <ScrollView
            showsHorizontalScrollIndicator={false}
            horizontal
            contentContainerStyle={{ width: '130%' }}
          >
            <ObjectMap obj={modalData.info} />
          </ScrollView>
        </ScrollView>
      </CustomModal>
      <CustomModal
        visible={showOverlay}
        onClose={onModalClose}
        modalType="overlay"
      >
        <View style={{ alignItems: 'center' }}>
          <Pressable onPress={clearAllLogs} style={styles.hyperLink}>
            <Text style={styles.hyperText}>Clear All</Text>
          </Pressable>
        </View>
      </CustomModal>
    </View>
  );
}
