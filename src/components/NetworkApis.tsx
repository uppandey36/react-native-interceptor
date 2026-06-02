/* eslint-disable react-native/no-inline-styles */
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
  ListRenderItem,
} from 'react-native';
import { network } from '..';
import { colors, MethodColorMap } from '../library/theme';
import { generateCurlCommand, isTablet } from '../library/commons';
import { IIndividualApi, INetworkApis } from '../types/network';
import ObjectMap from './ObjectMap';
import CustomModal from './CustomModal';
import Search from './SearchArea';
import { Styles } from './styles';

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental &&
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

function sectionHasData(data: unknown): boolean {
  if (data == null) {
    return false;
  }
  if (typeof data === 'string') {
    return data.length > 0;
  }
  if (Array.isArray(data)) {
    return data.length > 0;
  }
  if (typeof data === 'object') {
    return Object.keys(data).length > 0;
  }
  return true;
}

export interface NetworkApis {
  onBackPress: () => void;
  displayOrder?: 'FCFS' | 'LCFS';
}

function DetailRow({
  label,
  value,
  styles,
}: {
  label: string;
  value: string | number;
  styles: ReturnType<typeof Styles>;
}) {
  return (
    <View style={styles.keyValueRow}>
      <Text style={styles.expandedLabel}>{label}</Text>
      <Text selectable style={styles.expandedValue}>
        {value}
      </Text>
    </View>
  );
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

  const requestResponseInfoMap = () => [
    {
      title: 'Request',
      data: requestBody,
      disable: !sectionHasData(requestBody),
    },
    {
      title: 'Request Header',
      data: requestHeaders,
      disable: !sectionHasData(requestHeaders),
    },
    {
      title: 'Params',
      data: params,
      disable: !sectionHasData(params),
    },
    {
      title: 'Response',
      data: response,
      disable: !sectionHasData(response),
    },
    {
      title: 'Response Header',
      data: responseHeaders,
      disable: !sectionHasData(responseHeaders),
    },
  ];

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
      await Share.share({ message: cURL });
    } catch {}
  }, [method, url, requestHeaders, requestBody]);

  const failed = isApiFailed();

  return (
    <View style={styles.individualContainer}>
      <Pressable
        onPress={onExpandClick}
        style={[styles.individualInfoContainer, styles.flexRow]}
        accessibilityRole="button"
        accessibilityState={{ expanded }}
        accessibilityLabel={`${method} request to ${url}`}
      >
        <View style={styles.rowContent}>
          <View style={[styles.methodInfo, styles.itemCenter]}>
            <Text
              style={[
                styles.methodText,
                { color: MethodColorMap[method || 'GET'] },
              ]}
            >
              {method}
            </Text>
          </View>
          <Text
            numberOfLines={2}
            style={[styles.urlText, failed && { color: colors.errorText }]}
          >
            {url}
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
        <View
          style={[
            styles.expandContainer,
            failed && styles.expandContainerError,
          ]}
        >
          <DetailRow label="URL" value={url} styles={styles} />
          <DetailRow label="Status" value={status} styles={styles} />
          <DetailRow
            label="Time"
            value={stopTime ? `${stopTime - startTime}ms` : 'Pending...'}
            styles={styles}
          />
          <View style={[styles.flexRow, styles.flexWrap]}>
            {requestResponseInfoMap().map(({ data, disable, title }, index) => (
              <Pressable
                key={index}
                style={[
                  styles.itemCenter,
                  styles.infoButton,
                  disable && { backgroundColor: colors.buttonDisable },
                ]}
                onPress={() => (disable ? undefined : onInfoButtonClick(data))}
                disabled={disable}
                accessibilityRole="button"
                accessibilityLabel={`View ${title}`}
                accessibilityState={{ disabled: disable }}
              >
                <Text
                  style={[
                    styles.infoButtonText,
                    disable && { color: colors.secondaryText },
                  ]}
                >
                  {title}
                </Text>
              </Pressable>
            ))}
          </View>
          <View style={styles.itemCenter}>
            <Pressable
              onPress={generateAndShareCurl}
              style={styles.hyperLink}
              accessibilityRole="button"
              accessibilityLabel="Copy curl command"
            >
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
    info:
      | Record<string, unknown>
      | string
      | boolean
      | number
      | unknown[]
      | null;
  }>({ title: '', info: {} });
  const [showModal, setShowModal] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [areLogsClear, setAreLogsClear] = useState(false);
  const [searchedApis, setSearchedApis] = useState<INetworkApis[] | null>(null);

  const listData = areLogsClear ? [] : (searchedApis ?? apisList);

  const onInfoButtonClick = useCallback(
    (
      data:
        | Record<string, unknown>
        | string
        | boolean
        | number
        | unknown[]
        | null
    ) => {
      setModalData({ title: 'Copy', info: data });
      setShowModal(true);
    },
    []
  );

  const onCopyText = useCallback(() => {
    Share.share({ message: JSON.stringify(modalData?.info || '') });
  }, [modalData.info]);

  const searchByUrl = useCallback(
    (text?: string) => {
      if (text) {
        setSearchedApis(
          apisList.filter((item) => item.url?.toLowerCase()?.includes(text))
        );
      } else {
        setSearchedApis(null);
      }
    },
    [apisList]
  );

  const onModalClose = useCallback(() => {
    setModalData({ title: '', info: {} });
    setShowModal(false);
    setShowOverlay(false);
  }, []);

  const clearAllLogs = useCallback(() => {
    network.clearList();
    setAreLogsClear(true);
    onModalClose();
  }, [onModalClose]);

  const renderItem: ListRenderItem<INetworkApis> = useCallback(
    ({ item }) => (
      <IndividualApi {...item} onInfoButtonClick={onInfoButtonClick} />
    ),
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
        <Text style={[styles.title, styles.fontBold]} accessibilityRole="header">
          Network
        </Text>
        <Pressable
          onPress={() => setShowOverlay(true)}
          style={[styles.headerPressable, styles.itemCenter]}
          accessibilityRole="button"
          accessibilityLabel="Open menu"
        >
          <Text style={[styles.pressableText, styles.fontBold]}>{'\u22EE'}</Text>
        </Pressable>
      </View>
      <Search placeholder="Search by URL" searchFunction={searchByUrl} />
      <FlatList
        data={listData}
        showsVerticalScrollIndicator={false}
        renderItem={renderItem}
        contentContainerStyle={[
          styles.listContainer,
          isTablet && { alignSelf: 'center', width: '100%', maxWidth: 720 },
        ]}
        keyExtractor={(item) => item.xhr._trackingName.toString()}
        ListEmptyComponent={
          <View style={styles.emptyList}>
            <Text style={styles.emptyListText}>No network requests captured</Text>
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
          accessibilityLabel="Clear all network requests"
        >
          <Text style={styles.hyperText}>Clear All</Text>
        </Pressable>
      </CustomModal>
    </View>
  );
}
