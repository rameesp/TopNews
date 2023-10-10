import {useCallback, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  deleteItemInArticle,
  getArticles,
  getIsLoading,
  getListOfNewsFromApi,
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

const useHomeController = () => {
  const topNews = useSelector(getViewableList);
  const pinnedNews = useSelector(getPinnedArticles);
  const isLoading = useSelector(getIsLoading);
  const articles = useSelector(getArticles);
  const unPinnedArticle = useSelector(getUnPinnedArticle);
  const dispatch = useDispatch<AppDispatch>();
  const {timer, startTimer, stopTimer} = useCountDown({start: 0});
  const storageService = StorageService.getInstance();
  useEffect(() => {
    if (articles.length > 0) {
      storageService.addItemStorage(articles);
    }
  }, [articles]);
  useEffect(() => {
    if (timer <= 0 && topNews.length !== articles.length) {
      startTimer(4);
      dispatch(updateListWithRandomArticle());
    }
  }, [timer]);

  useEffect(() => {
    if (isLoading != null && !isLoading) {
      startTimer(4);
    }
  }, [isLoading]);

  const getNextSetOfArticles = () => {
    // stopTimer();
    dispatch(updateListWithRandomArticle());
    startTimer(4);
  };

  const getNextBatchOfData = () => {
    storageService.clearStorage();
    dispatch(getListOfNewsFromApi({invalidateCache: true}));
  };

  const onDeleteItem = useCallback((item: LocalArticle) => {
    dispatch(deleteItemInArticle(item));
  }, []);
  const onPinItem = useCallback((item: LocalArticle) => {
    dispatch(pinItemInArticle(item));
  }, []);
  const onDeletePinned = useCallback((item: LocalArticle) => {
    dispatch(deleteItemInArticle(item));
  }, []);
  const onUnPin = useCallback((item: LocalArticle) => {
    dispatch(unPinItemInArticle(item));
  }, []);
  return {
    topNews,
    isLoading,
    articlesLength: articles.length,
    getNextSetOnArticle: getNextSetOfArticles,
    getNextBatchOfData,
    onDeleteItem,
    pinnedNews,
    onPinItem,
    visibleListLength: topNews.length + pinnedNews.length,
    onDeletePinned,
    onUnPin,
    unPinnedArticle,
  };
};

export default useHomeController;
