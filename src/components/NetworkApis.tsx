/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useState } from 'react';
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
import { network } from '..';
import { colors, MethodColorMap } from '../library/theme';
import { generateCurlCommand } from '../library/commons';
import { IIndividualApi, INetworkApis } from '../types/network';
import ObjectMap from './ObjectMap';
import CustomModal from './CustomModal';
import Search from './SearchArea';
import { Styles } from './styles';

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental &&
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

export interface NetworkApis {
  onBackPress: () => void;
  displayOrder?: 'FCFS' | 'LCFS';
}

export function IndividualApi(props: IIndividualApi) {
  const styles = Styles(colors);
  const {
    url = '',
    method = 'GET',
    status = 200,
    startTime,
    stopTime,
    requestBody,
    requestHeaders,
    response,
    responseHeaders,
    params,
    onInfoButtonClick,
  } = props;
  const [expanded, setExpand] = useState(false);

  const isApiFailed = () => {
    const errorStatues = network.getErrorStatues();
    return errorStatues.includes(status);
  };
  const requestResponseInfoMap = () => {
    return [
      {
        title: 'Request',
        data: requestBody,
        disable: Object.keys(requestBody || {}).length === 0,
      },
      {
        title: 'Request Header',
        data: requestHeaders,
        disable: Object.keys(requestHeaders || {}).length === 0,
      },
      {
        title: 'Params',
        data: params,
        disable: Object.keys(params || {}).length === 0,
      },
      {
        title: 'Response',
        data: response,
        disable: Object.keys(response || {}).length === 0,
      },
      {
        title: 'Response Header',
        data: responseHeaders,
        disable: Object.keys(responseHeaders || {}).length === 0,
      },
    ];
  };
  const onExpandClick = useCallback(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpand((pre) => !pre);
  }, []);

  const generateAndShareCurl = useCallback(async () => {
    const cURL = generateCurlCommand({
      method,
      url,
      headers: requestHeaders,
      body: requestBody,
    });
    try {
      await Share.share({
        message: cURL,
      });
    } catch (e) {}
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
                { color: MethodColorMap[method || 'GET'] },
              ]}
            >
              {method}
            </Text>
          </View>
          <Text
            numberOfLines={1}
            style={[
              styles.urlText,
              isApiFailed() ? { color: colors.errorText } : {},
            ]}
          >
            {url}
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
            isApiFailed() ? { backgroundColor: colors.errorBackground } : {},
          ]}
        >
          <View style={[styles.flexRow, styles.keyValueContainer]}>
            <View>
              <Text style={[styles.fontBold, styles.expandedInfoText]}>
                Url :{' '}
              </Text>
            </View>
            <Text style={[styles.expandedInfoText]}>{url}</Text>
          </View>
          <View style={[styles.flexRow, styles.keyValueContainer]}>
            <View>
              <Text style={[styles.fontBold, styles.expandedInfoText]}>
                Status :{' '}
              </Text>
            </View>
            <Text style={[styles.expandedInfoText]}>{status}</Text>
          </View>
          <View style={[styles.flexRow, styles.keyValueContainer]}>
            <View>
              <Text style={[styles.fontBold, styles.expandedInfoText]}>
                Time :{' '}
              </Text>
            </View>
            <Text style={[styles.expandedInfoText]}>
              {stopTime ? `${stopTime - startTime}ms` : 'Pending...'}
            </Text>
          </View>
          <View style={[styles.flexRow, styles.flexWrap]}>
            {requestResponseInfoMap()?.map(
              ({ data, disable, title }, index) => {
                return (
                  <Pressable
                    key={index}
                    style={[
                      styles.itemCenter,
                      styles.infoButton,
                      disable
                        ? {
                            backgroundColor: colors.buttonDisable,
                          }
                        : {},
                    ]}
                    onPress={() => (disable ? null : onInfoButtonClick(data))}
                  >
                    <Text
                      style={[
                        styles.infoButtonText,
                        disable
                          ? {
                              color: colors.secondaryText,
                            }
                          : {},
                      ]}
                    >
                      {title || ''}
                    </Text>
                  </Pressable>
                );
              }
            )}
          </View>
          <View style={styles.itemCenter}>
            <Pressable onPress={generateAndShareCurl} style={styles.hyperLink}>
              <Text style={styles.hyperText}>Copy curl</Text>
            </Pressable>
          </View>
        </View>
      ) : null}
    </View>
  );
}

export function NetworkApis(props: NetworkApis) {
  const { onBackPress, displayOrder = 'FCFS' } = props;
  const styles = Styles(colors);
  const apisList = network.getNetworkList(displayOrder === 'LCFS');

  const [modalData, setModalData] = useState<{
    title: string;
    info: Record<string, unknown>;
  }>({ title: '', info: {} });
  const [showModal, setShowModal] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [areLogsClear, setAreLogsClear] = useState(false);
  const [searchedApis, setSearchedApis] = useState<INetworkApis[] | null>(null);

  const onInfoButtonClick = useCallback((data: Record<string, unknown>) => {
    setModalData({ title: 'Copy', info: data });
    setShowModal(true);
  }, []);

  const onCopyText = useCallback(() => {
    const data = JSON.stringify(modalData?.info || '');
    Share.share({
      message: data,
    });
  }, [modalData.info]);

  const searchByUrl = useCallback((text?: string) => {
    if (text) {
      const filteredData = apisList.filter((item) =>
        item.url?.toLowerCase()?.includes(text)
      );
      setSearchedApis(filteredData);
    } else {
      setSearchedApis(null);
    }
  }, []);

  const onModalClose = useCallback(() => {
    setModalData({ title: '', info: {} });
    setShowModal(false);
    setShowOverlay(false);
  }, []);

  const clearAllLogs = useCallback(() => {
    network.clearList();
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
          <Text style={[styles.title, styles.fontBold]}>Network</Text>
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
      <Search placeholder="Search by url" searchFunction={searchByUrl} />
      <FlatList
        data={areLogsClear ? [] : (searchedApis ?? apisList)}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <IndividualApi {...item} onInfoButtonClick={onInfoButtonClick} />
        )}
        contentContainerStyle={styles.listContainer}
        keyExtractor={(item) => item.xhr._trackingName.toString()}
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
