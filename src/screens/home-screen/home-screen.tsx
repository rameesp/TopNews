import {FlatList, StyleSheet, View} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import AppBar from './widgets/app-bar';
import {Snackbar} from 'react-native-paper';
import useHomeController from './use-home-controller';
import ListItem from './widgets/list-item';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import Fab from './widgets/fab';
import {pinItemInArticle} from '../../store/entities/news';

interface ISnackBar {
  isVisible: boolean;
  action: 'REFRESH' | 'NEW_BATCH';
  messageRefresh?: String;
  messageNextSet?: String;
}
const HomeScreen: React.FC = (): JSX.Element => {
  const {
    topNews,
    articlesLength,
    getNextSetOnArticle,
    getNextBatchOfData,
    onDeleteItem,
    isLoading,
    pinnedNews,
    onPinItem,
    visibleListLength,
    onDeletePinned,
    onUnPin,
    unPinnedArticle,
  } = useHomeController();
  console.log("building home screen");
  
  const [data, setData] = useState<LocalArticle[]>([]);
  const [openSnackBar, setOpenSnackBar] = useState<ISnackBar>({
    isVisible: false,
    action: 'REFRESH',
    messageRefresh: '',
    messageNextSet: '',
  });
  const [loadNextBatch, setLoadNextBatch] = useState(false);

  useEffect(() => {
    setData(pre => {
      if (unPinnedArticle) {
        return [unPinnedArticle, ...pre];
      }

      return pre;
    });
  }, [unPinnedArticle]);

  useEffect(() => {
    if (isLoading != null && !isLoading && topNews.length > 0) {
      setData(topNews);
    }
  }, [isLoading]);
  useEffect(() => {
    if (data.length <= 0 && loadNextBatch) {
      getNextBatchOfData();
    }
  }, [data, loadNextBatch]);
  const onDataDelete = useCallback((article: LocalArticle) => {
    setData(pre => {
      let newData = [...pre];
      let dataIndex = newData.findIndex(item => {
        return item.id == article.id;
      });
      if (dataIndex > -1) {
        newData.splice(dataIndex, 1);
        onDeleteItem(article);
        return newData;
      }
      return pre;
    });
  }, []);
  const onDataPinItem = useCallback((article: LocalArticle) => {
    setData(pre => {
      let newData = [...pre];
      let dataIndex = newData.findIndex(item => {
        return item.id == article.id;
      });
      if (dataIndex > -1) {
        newData.splice(dataIndex, 1);
        onPinItem(article);
        return newData;
      }
      return pre;
    });
  }, []);
  const onLoadLoadedData = useCallback(() => {
    if (topNews && data.length < topNews.length) {
      setData(topNews);
    } else if (topNews && data.length >= topNews.length) {
      getNextSetOnArticle();
    }
  }, [topNews, data]);

  const openSnackBarDismissed = useCallback(() => {
    setOpenSnackBar({isVisible: false, action: 'REFRESH'});
  }, []);

  const onLoadNextBatch = () => {
    setData([]);
    setLoadNextBatch(true);
  };

  const onSnackBarAction = useCallback(() => {
    switch (openSnackBar.action) {
      case 'REFRESH':
        onLoadLoadedData();
        break;
      case 'NEW_BATCH':
        onLoadNextBatch();
        break;
      default:
        break;
    }
  }, [openSnackBar]);

  const renderItem = useCallback(
    ({item, index}: {item: LocalArticle; index: number}) => {
      return (
        <ListItem
          item={item}
          isPinned={false}
          index={index}
          onPinUnPin={() => onDataPinItem(item)}
          onDelete={() => onDataDelete(item)}
        />
      );
    },
    [],
  );
  const childKeyExtractor = useCallback(
    (item: LocalArticle) => `_id${item.id}`,
    [],
  );
  const onEndReached = useCallback(() => {
    if (visibleListLength < articlesLength) {
      if (topNews) {
        if (data.length < topNews?.length) {
          setOpenSnackBar({
            isVisible: true,
            action: 'REFRESH',
            messageRefresh:
              'Click here to load more data or click on plus icon',
          });
        }
      }
    } else if (visibleListLength >= articlesLength) {
      setOpenSnackBar({
        isVisible: true,
        action: 'NEW_BATCH',
        messageNextSet:
          'You have visited all the data , click here to load new data or click on Refresh icon at the top',
      });
    }
  }, [data, topNews, articlesLength]);
  return (
    <View style={{height: '100%'}}>
      <AppBar
        onNextBatch={onLoadNextBatch}
        onRandomBatch={getNextSetOnArticle}
        title={'TopNews'}
      />
      <GestureHandlerRootView style={{flex: 1}}>
        <FlatList
          data={data}
          ListHeaderComponent={
            <>
              {pinnedNews.map((item, index) => (
                <ListItem
                  key={item.id}
                  isPinned={true}
                  item={item}
                  index={index}
                  onPinUnPin={() => onUnPin(item)}
                  onDelete={() => onDeletePinned(item)}
                />
              ))}
            </>
          }
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingTop: 24,
            paddingBottom: 92,
          }}
          onEndReached={onEndReached}
          renderItem={renderItem}
          keyExtractor={childKeyExtractor}
        />
      </GestureHandlerRootView>

      <Fab
        label={
          articlesLength !== 0
            ? topNews != null
              ? topNews?.length - data.length + ''
              : data.length + ''
            : '0'
        }
        onClick={onLoadLoadedData}
      />

      <Snackbar
        visible={openSnackBar.isVisible}
        duration={3000}
        onDismiss={openSnackBarDismissed}
        action={{
          label:
            openSnackBar.action == 'REFRESH' ? 'Load More' : 'Load new batch',
          onPress: onSnackBarAction,
        }}>
        {openSnackBar.action == 'REFRESH'
          ? openSnackBar.messageRefresh
          : openSnackBar.messageNextSet}
      </Snackbar>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  fabStyle: {
    bottom: 16,
    right: 16,
    position: 'absolute',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 8,
  },
  surface: {
    padding: 8,
    height: 80,
    width: 80,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});

export default HomeScreen;
