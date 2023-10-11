import {View} from 'react-native';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import AppBar from './widgets/app-bar';
import useHomeController from './use-home-controller';
import Fab from './widgets/fab';
import NewsList from './components/news-list';
import SnackBar from './components/snack-bar';
import {SNACKBAR_ACTION} from '../../constants/constants';
import homeScreenStyle from './styles';

const HomeScreen: React.FC = (): JSX.Element => {
  const {
    topNews,
    getNextSetOnArticle,
    getNextBatchOfData,
    onDeleteItem,
    isLoading,
    onPinItem,
    unPinnedArticle,
    articlesLength,
    pinnedNews,
    visibleListLength,
    onDeletePinned,
    onUnPin,
  } = useHomeController();

  const [data, setData] = useState<LocalArticle[]>([]);
  const [openSnackBar, setOpenSnackBar] = useState<ISnackBarState>({
    isVisible: false,
    action: SNACKBAR_ACTION.REFRESH,
    messageRefresh: '',
    messageNextSet: '',
  });
  const [loadNextBatch, setLoadNextBatch] = useState(false);
  const queuedLength = useMemo(
    () =>
      articlesLength !== 0
        ? topNews != null
          ? topNews?.length - data.length + ''
          : data.length + ''
        : '0',
    [topNews, data],
  );

  //after unpinning an article we need to update the state
  useEffect(() => {
    setData(pre => {
      if (unPinnedArticle) {
        return [unPinnedArticle, ...pre];
      }

      return pre;
    });
  }, [unPinnedArticle]);
  //initial loading of data
  useEffect(() => {
    if (isLoading != null && !isLoading && topNews.length > 0) {
      setData(topNews);
    }
  }, [isLoading]);
  //to load the data from API
  useEffect(() => {
    if (data.length <= 0 && loadNextBatch) {
      getNextBatchOfData();
    }
  }, [data, loadNextBatch]);

  //after clicking the delete button we need to delete the data from the state
  const onDataDelete = useCallback((article: LocalArticle) => {
    setData(pre => {
      let newData = [...pre];
      let dataIndex = newData.findIndex(item => {
        return item.id == article.id;
      });
      if (dataIndex > -1) {
        newData.splice(dataIndex, 1);
        //dispatch to redux to update the redux state
        onDeleteItem(article);
        return newData;
      }
      return pre;
    });
  }, []);
  // after pinning the item we need to remove the data from the state array
  const onDataPinItem = useCallback((article: LocalArticle) => {
    setData(pre => {
      let newData = [...pre];
      let dataIndex = newData.findIndex(item => {
        return item.id == article.id;
      });
      if (dataIndex > -1) {
        newData.splice(dataIndex, 1);
        //an dispatch to update redux state
        onPinItem(article);
        return newData;
      }
      return pre;
    });
  }, []);
  //to randomize and load the n set of data
  const onLoadLoadedData = useCallback(() => {
    //if data length is less than the data in the redux state it means there is data in the queue will load all data from the queue
    if (data.length < topNews.length) {
      setData(topNews);
    } else if (data.length >= topNews.length) {
      //no data in the queue will dispatch to redux to random generate next set of data
      getNextSetOnArticle();
    }
  }, [topNews, data]);
  //to reset the snack bar
  const openSnackBarDismissed = useCallback(() => {
    setOpenSnackBar({isVisible: false, action: SNACKBAR_ACTION.REFRESH});
  }, []);

  //to load the next set of data from backend
  const onLoadNextBatch = () => {
    setData([]);
    setLoadNextBatch(true);
  };

  const onSnackBarAction = useCallback(() => {
    switch (openSnackBar.action) {
      case SNACKBAR_ACTION.REFRESH: //refresh means we need to next set of data from local
        onLoadLoadedData();
        break;
      case SNACKBAR_ACTION.NEW_BATCH: //it means we need to load next batch of data from backend
        onLoadNextBatch();
        break;
      default:
        break;
    }
  }, [openSnackBar]);
  //on end of flat-list
  const onEndReached = useCallback(() => {
    if (visibleListLength < articlesLength) {
      if (topNews) {
        if (data.length < topNews?.length) {
          //means there is still data pending in the redux state to load
          setOpenSnackBar({
            isVisible: true,
            action: SNACKBAR_ACTION.REFRESH,
            messageRefresh: AppString.refreshDataMessage,
          });
        }
      }
    } else if (visibleListLength >= articlesLength) {
      //it means all data in the redux has been loaded time to load new set of set of data from backend
      setOpenSnackBar({
        isVisible: true,
        action: SNACKBAR_ACTION.NEW_BATCH,
        messageNextSet: AppString.loadNextBatchMessage,
      });
    }
  }, [data, topNews, articlesLength]);

  return (
    <View style={homeScreenStyle.homeContainer}>
      <AppBar
        onNextBatch={onLoadNextBatch}
        onRandomBatch={getNextSetOnArticle}
        title={AppString.appTitle}
      />

      <NewsList
        data={data}
        pinnedNews={pinnedNews}
        onDeletePinned={item => onDeletePinned(item)}
        onUnPin={item => onUnPin(item)}
        onEndReached={onEndReached}
        onDataDelete={item => onDataDelete(item)}
        onDataPinItem={item => onDataPinItem(item)}
      />
      <Fab label={queuedLength} onClick={onLoadLoadedData} />
      <SnackBar
        isVisible={openSnackBar.isVisible}
        onDismiss={openSnackBarDismissed}
        actionLabel={
          openSnackBar.action == SNACKBAR_ACTION.REFRESH
            ? AppString.loadMore
            : AppString.loadNewBatch
        }
        onAction={onSnackBarAction}
        message={
          (openSnackBar.action == SNACKBAR_ACTION.REFRESH
            ? openSnackBar.messageRefresh
            : openSnackBar.messageNextSet) || ''
        }
      />
    </View>
  );
};

export default HomeScreen;
