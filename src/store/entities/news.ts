import {createSelector, createSlice} from '@reduxjs/toolkit';
import {AppDispatch, RootState} from '../configure';
import {httpMethods} from '../../services/http-service/methods';
import {apiCallBegan, updateFromLocal} from '../actions';
import {StorageService} from '../../services/storage';
import {
  getFilteredList,
  getRandomIndex,
  getRandomItems,
  getTopNews,
  updateVisited,
} from '../util/util';
import {CONST_TOP_LIMIT} from '../../constants/constants';
const storageService = StorageService.getInstance();

const slice = createSlice({
  name: 'news',
  initialState: <News>{
    isError: false,
    isLoading: null,
    articleList: [],
    subArticles: null,
    isEndReached: null,
  },
  reducers: {
    //change it to set
    getNewsStart: action => {
      action.articleList = [];
      action.subArticles = null;
      action.isError = false;
      action.isLoading = true;
      action.isEndReached = null;
      storageService.clearStorage();
    },
    getNewsSuccess: (action, response) => {
      const articles = response.payload.articles;

      let newList: LocalArticle[] = [];
      if (articles.length > 0) {
        for (let index = 0; index < articles.length; index++) {
          const element = articles[index];
          const newElement = {
            title: element.title,
            description: element.description,
            visited: false,
            id: index + '',
          };
          newList = [...newList, newElement];
        }
        //Move to hook
        const subArticle = getTopNews({
          limit: CONST_TOP_LIMIT,
          articles: newList,
        });

        const updatedArticle = updateVisited({
          subArticle: subArticle,
          articles: newList,
        });
        action.articleList = updatedArticle;
        action.subArticles = subArticle;

        action.isEndReached = subArticle.length < CONST_TOP_LIMIT;
        action.isLoading = false;

        storageService.addItemStorage(updatedArticle);
      }
    },
    getNewsFailed: action => {
      action.isError = true;
    },
    updateListFromLocalSuccess: (action, response) => {
      const filteredList: LocalArticle[] = getFilteredList({
        isVisited: true,
        articles: response.payload,
      });
      action.articleList = response.payload;
      action.subArticles = filteredList;
      action.isEndReached = response.payload < CONST_TOP_LIMIT;

      storageService.addItemStorage(response.payload);
    },
    updatedListWithRandomArticle: (action, response) => {
      let randomArticles: LocalArticle[] = [];
      const filteredList: LocalArticle[] = getFilteredList({
        isVisited: false,
        articles: action.articleList,
      });
      action.isEndReached = filteredList.length < 5;
      if (filteredList.length > 5) {
        const randomIndices: number[] = getRandomIndex({
          quantity: 5,
          max: filteredList.length-1,
        });

        randomArticles = getRandomItems({
          randomIndices: randomIndices,
          articles: filteredList,
        });
      } else {
        randomArticles = filteredList;
      }

      const updatedArticle = updateVisited({
        subArticle: randomArticles,
        articles: action.articleList,
      });

      action.subArticles =
        action.subArticles != null
          ? [...randomArticles, ...action.subArticles]
          : randomArticles;

      action.articleList = updatedArticle;
      storageService.addItemStorage(updatedArticle);
    },
  },
});
const {
  getNewsStart,
  getNewsSuccess,
  getNewsFailed,
  updateListFromLocalSuccess,
  updatedListWithRandomArticle,
} = slice.actions;

export default slice.reducer;

export const getListOfNewsFromApi = () => (dispatch: AppDispatch) => {
  let payload = {
    // url: 'everything?q=india&pageSize=100&page=1&apiKey=93772fedfa9044dda2505c63d9b9dcc1',
    url: '9469c301-0ed9-492c-9993-1d2685edec84',
    method: httpMethods.GET,
    onStart: getNewsStart.type,
    onSuccess: getNewsSuccess.type,
    onError: getNewsFailed.type,
  };
  return dispatch({type: apiCallBegan.type, payload: payload});
};
export const updateListFromLocal = () => (dispatch: AppDispatch) => {
  let payload = {
    onUpdate: updateListFromLocalSuccess.type,
  };
  return dispatch({type: updateFromLocal.type, payload: payload});
};
export const updateListWithRandomArticle = () => (dispatch: AppDispatch) => {
  let payload = {};
  return dispatch({type: updatedListWithRandomArticle.type, payload: payload});
};
export const getViewableList = createSelector(
  (state: RootState) => state.news,
  news => news.subArticles,
);

export const getEndReached = createSelector(
  (state: RootState) => state.news,
  news => news.isEndReached,
);
export const getIsLoading = createSelector(
  (state: RootState) => state.news,
  news => news.isLoading,
);
