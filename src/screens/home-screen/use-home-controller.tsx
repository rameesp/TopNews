import {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  getArticles,
  getEndReached,
  getIsLoading,
  getListOfNewsFromApi,
  getViewableList,
  updateListWithRandomArticle,
} from '../../store/entities/news';
import {AppDispatch} from '../../store/configure';
import {CONST_TOP_LIMIT} from '../../constants/constants';
import useCountDown from '../../util/hooks/use-timer';
import {StorageService} from '../../services/storage';

const useHomeController = () => {
  const topNews = useSelector(getViewableList);
  const isEndReached = useSelector(getEndReached);
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
    if (timer <= 0 && !isEndReached) {
      startTimer(4);
      dispatch(updateListWithRandomArticle());
    }
  }, [timer, isEndReached]);

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

  const getNextBatchOfData=()=>{
    storageService.clearStorage();
    dispatch(getListOfNewsFromApi({invalidateCache: true}));
  }
  return {
    topNews: topNews,
    isLoading: isLoading,
    articlesLength: articles.length,
    getNextSetOnArticle: getNextSetOfArticles,
    getNextBatchOfData:getNextBatchOfData
    
  };
};

export default useHomeController;
