import {useCallback, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  deleteItemInArticle,
  getArticles,
  getIsLoading,
  getListOfNewsFromApi,
  getViewableList,
  updateListWithRandomArticle,
} from '../../store/entities/news';
import {AppDispatch} from '../../store/configure';
import useCountDown from '../../util/hooks/use-timer';
import {StorageService} from '../../services/storage';

const useHomeController = () => {
  const topNews = useSelector(getViewableList);
  const isLoading = useSelector(getIsLoading);
  const articles = useSelector(getArticles);
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
    if (!isLoading) {
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
  return {
    topNews: topNews,
    isLoading: isLoading,
    articlesLength: articles.length,
    getNextSetOnArticle: getNextSetOfArticles,
    getNextBatchOfData: getNextBatchOfData,
    onDeleteItem: onDeleteItem,
  };
};

export default useHomeController;
