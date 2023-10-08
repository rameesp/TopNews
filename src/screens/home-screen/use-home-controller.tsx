import {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  getEndReached,
  getIsLoading,
  getListOfNewsFromApi,
  getViewableList,
  updateListWithRandomArticle,
} from '../../store/entities/news';
import {AppDispatch} from '../../store/configure';
import {CONST_TOP_LIMIT} from '../../constants/constants';
import useCountDown from '../../util/hooks/use-timer';

const useHomeController = () => {
  const topNews = useSelector(getViewableList);
  const isEndReached = useSelector(getEndReached);
  const isLoading = useSelector(getIsLoading);
  const dispatch = useDispatch<AppDispatch>();
  const {timer, startTimer, stopTimer} = useCountDown({start: 0});
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

  useEffect(() => {
    if (
      isEndReached &&
      topNews &&
      topNews?.length > 0 &&
      topNews.length < CONST_TOP_LIMIT
    ) {
      setTimeout(() => {
        dispatch(getListOfNewsFromApi());
      }, 4);
    } else if (isEndReached && topNews && topNews.length <= 0) {
      console.log("FIRST CASE");
      dispatch(getListOfNewsFromApi());
    }
  }, [isEndReached, topNews]);


  useEffect(() => {
    console.log(topNews?.length);
  }, [topNews]);
  return {topNews: topNews};
};

export default useHomeController;
