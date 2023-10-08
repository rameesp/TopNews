import {FlatList, StyleSheet, View} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import AppBar from './widgets/app-bar';

import {Card, FAB, Text} from 'react-native-paper';
import useHomeController from './use-home-controller';
import {Dimensions, StatusBar} from 'react-native';
import AppleStyleSwipeableRow from './widgets/list-item';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import GmailStyleSwipeableRow from './widgets/gmail-item';

const SCREEN_HEIGHT = Dimensions.get('screen').height; // device height
const STATUS_BAR_HEIGHT = StatusBar.currentHeight || 24;
const WINDOW_HEIGHT = Dimensions.get('window').height;
const BOTTOM_BAR_HEIGHT = SCREEN_HEIGHT - WINDOW_HEIGHT + STATUS_BAR_HEIGHT;
interface IItem {
  title: string;
  desc: string;
}
const Item: React.FC<IItem> = ({title, desc}) => {
  return (
    <Card style={{marginTop: 12}}>
      <Card.Content>
        <Text numberOfLines={2} variant="titleMedium">
          {title}
        </Text>
        <Text numberOfLines={2} variant="bodySmall">
          {desc}
        </Text>
      </Card.Content>
    </Card>
  );
};
const HomeScreen: React.FC = (): JSX.Element => {
  const {topNews, articlesLength, getNextSetOnArticle, getNextBatchOfData} =
    useHomeController();
  const [data, setData] = useState<LocalArticle[]>([]);

  useEffect(() => {
    if (data.length <= 0 && topNews) {
      setData(topNews);
    }
  }, [topNews]);

  const renderItem = useCallback(
    ({item, index}: {item: LocalArticle; index: number}) => {
      return (
        <AppleStyleSwipeableRow item={item} index={index} onClick={() => {}} />
      );
    },
    [],
  );
  const childKeyExtractor = useCallback(
    (item: LocalArticle, index: number) => `_id${item.id}`,
    [],
  );

  const onEndReached = useCallback(() => {
    if (data.length < articlesLength) {
      if (topNews) {
        if (data.length < topNews?.length) {
          setData(topNews);
        } else if (data.length >= topNews?.length) {
          getNextSetOnArticle();
        }
      }
    } else if (data.length >= articlesLength) {
      getNextBatchOfData();
      setData([]);
      console.log('end with all');
    }
  }, [setData, data, topNews, articlesLength]);
  return (
    <View style={{marginBottom: BOTTOM_BAR_HEIGHT + 32, height: '100%'}}>
      <AppBar title={'TopNews'} />
      <GestureHandlerRootView>
        <FlatList
          data={data}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingTop: 24,
            paddingBottom: 32,
            marginBottom: 32,
          }}
          onEndReached={onEndReached}
          extraData={data}
          renderItem={renderItem}
          keyExtractor={childKeyExtractor}
        />
      </GestureHandlerRootView>
      <FAB
        icon="plus"
        style={styles.fab}
        label={
          topNews != null
            ? topNews?.length - data.length + ''
            : data.length + ''
        }
        onPress={() => {
          if (topNews) {
            setData(topNews);
          }
        }}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default HomeScreen;
