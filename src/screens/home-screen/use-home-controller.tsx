import {useCallback, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  deleteItemInArticle,
  getArticles,
  getIsLoading,
  callNewsApi,
  getPinnedArticles,
  getUnPinnedArticle,
  getViewableList,
  pinItemInArticle,
  unPinItemInArticle,
  updateListWithRandomArticle,
} from '../../store/entities/news';
import {AppDispatch} from '../../store/configure';
import useCountDown from '../../util/hooks/use-timer';
import {StorageService} from '../../services/storage';
import { CONST_TIME_TO_LOAD_NEXT } from '../../constants/constants';

const useHomeController = () => {
  const topNews = useSelector(getViewableList); //top news or visible news on list
  const pinnedNews = useSelector(getPinnedArticles); //pinned news list
  const isLoading = useSelector(getIsLoading);//is loading of news for initial time
  const articles = useSelector(getArticles);//total news list
  const unPinnedArticle = useSelector(getUnPinnedArticle);//unpinned item from pinned list
  const dispatch = useDispatch<AppDispatch>();
  const {timer, startTimer, stopTimer} = useCountDown({start: 0,fps:10});//count down timer hook
  const storageService = StorageService.getInstance();
  useEffect(() => {
    if (articles.length > 0) {
      storageService.addItemStorage(articles);
      //updating the storage on changes happening
    }
  }, [articles]);
  useEffect(() => {
    //if timer is timed out to randomize and load next set of data
    if (timer <= 0 && topNews.length !== articles.length) {      
      startTimerWithTimeLimit()
      dispatch(updateListWithRandomArticle());
    }
  }, [timer]);

  useEffect(() => {
    if (isLoading != null && !isLoading) {
      startTimerWithTimeLimit()
    }
  }, [isLoading]);

  const startTimerWithTimeLimit=()=>{
    startTimer(CONST_TIME_TO_LOAD_NEXT);
  }
  const getNextSetOfArticles = () => {
    // stopTimer();
    dispatch(updateListWithRandomArticle());
    startTimerWithTimeLimit()
  };
  //to load next batch 
  const getNextBatchOfData = () => {
    storageService.clearStorage();//clear storage before loading next batch
    dispatch(callNewsApi({invalidateCache: true}));
  };
 
  //on delete an item
  const onDeleteItem = useCallback((item: LocalArticle) => {
    dispatch(deleteItemInArticle(item));
  }, []);
  //on pinning an item
  const onPinItem = useCallback((item: LocalArticle) => {
    dispatch(pinItemInArticle(item));
  }, []);
  //on deleting from pinned item
  const onDeletePinned = useCallback((item: LocalArticle) => {
    dispatch(deleteItemInArticle(item));
  }, []);
  //onUnpin clicked
  const onUnPin = useCallback((item: LocalArticle) => {
    dispatch(unPinItemInArticle(item));
  }, []);
  return {
    topNews,
    isLoading,
    articlesLength: articles.length,
    pinnedNews,
    unPinnedArticle,
    visibleListLength: topNews.length + pinnedNews.length,
    getNextSetOnArticle: getNextSetOfArticles,
    getNextBatchOfData,
    onDeleteItem,
    onPinItem,
    onDeletePinned,
    onUnPin,
   
  };
};

export default useHomeController;
