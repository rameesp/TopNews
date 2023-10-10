import {PayloadAction, createSelector, createSlice} from '@reduxjs/toolkit';
import {AppDispatch, RootState} from '../configure';
import {httpMethods} from '../../services/http-service/methods';
import {apiCallBegan} from '../actions';
import {StorageService} from '../../services/storage';
import {
  getFilteredByPinnedList,
  getFilteredByVisitedList,
  getRandomIndex,
  getRandomItems,
  getTopNews,
  updatePinned,
  updateVisited,
} from '../util/util';
import {CONST_TOP_LIMIT} from '../../constants/constants';

const initState = (): News => {
  return {
    isError: false,
    isLoading: null,
    articleList: [],
    subArticles: [],
    pinnedArticles: [],
    unPinnedArticle: null,
  };
};
const slice = createSlice({
  name: 'news',
  initialState: initState,
  reducers: {
    //change it to set
    getNewsStart: action => {
      action.articleList = [];
      action.subArticles = [];
      action.pinnedArticles = [];
      action.isError = false;
      action.isLoading = true;
    },
    getNewsSuccess: (action: News, response: PayloadAction<any>) => {
      const articles = response.payload.articles;
      let subArticle: LocalArticle[] = [];

      let newList: LocalArticle[] = [];

      if (articles.length > 0) {
        for (let index = 0; index < articles.length; index++) {
          const element = articles[index];
          const newElement = {
            title: element.title,
            description: element.description,
            visited: element.visited ?? false,
            pinned: element.pinned ?? false,
            id: index + '',
          };
          newList = [...newList, newElement];
        }
        const filteredList: LocalArticle[] = getFilteredByVisitedList({
          isVisited: true,
          articles: newList,
        });

        action.pinnedArticles =
          getFilteredByPinnedList({
            isPinned: true,
            articles: newList,
          }) ?? [];

        if (filteredList.length <= 0) {
          subArticle = getTopNews({
            limit: CONST_TOP_LIMIT,
            articles: newList,
          });
        } else {
          subArticle = filteredList;
        }

        action.subArticles = subArticle;
        const updatedArticle = updateVisited({
          subArticle: subArticle,
          articles: newList,
        });
        action.articleList = updatedArticle;
        action.isLoading = false;
      }
    },
    getNewsFailed: action => {
      action.isError = true;
      action.isLoading = false;
    },
    updatedListWithRandomArticle: (action: News) => {
      let randomArticles: LocalArticle[] = [];
      const filteredList: LocalArticle[] = getFilteredByVisitedList({
        isVisited: false,
        articles: action.articleList,
      });
      if (filteredList.length > 5) {
        const randomIndices: number[] = getRandomIndex({
          quantity: 5,
          max: filteredList.length - 1,
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
    },
    onItemDeleted: (action: News, response: PayloadAction<LocalArticle>) => {
      let copyArticle = [...action.articleList];
      const articleIndex = copyArticle.findIndex(
        item => response.payload.id === item.id,
      );
      if (articleIndex > -1) {
        copyArticle.splice(articleIndex, 1);
        action.articleList = copyArticle;
      }
      if (response.payload.pinned) {
        let copyPinnedArticles = [...action.pinnedArticles];
        const pinnedArticleIndex = copyPinnedArticles.findIndex(
          item => response.payload.id === item.id,
        );
        if (pinnedArticleIndex > -1) {
          copyPinnedArticles.splice(pinnedArticleIndex, 1);
          action.pinnedArticles = copyPinnedArticles;
        }
      } else {
        let copySubArticle = [...action.subArticles];
        const subArticleIndex = copySubArticle.findIndex(
          item => response.payload.id === item.id,
        );
        if (subArticleIndex > -1) {
          copySubArticle.splice(subArticleIndex, 1);
          action.subArticles = copySubArticle;
        }
      }
    },

    onPinItem: (action: News, response: PayloadAction<LocalArticle>) => {
      const copySubArticle = [...action.subArticles];
      const subArticleIndex = copySubArticle.findIndex(
        item => response.payload.id === item.id,
      );
      if (subArticleIndex > -1) {
        const pinnedItem: LocalArticle = {
          ...copySubArticle[subArticleIndex],
          visited: true,
          pinned: true,
        };
        action.pinnedArticles = [...action.pinnedArticles, pinnedItem];
        copySubArticle.splice(subArticleIndex, 1);
        action.subArticles = copySubArticle;
        action.articleList = updateVisited({
          subArticle: [pinnedItem],
          articles: action.articleList,
        });
      }
    },
    onUnPinItem: (action: News, response: PayloadAction<LocalArticle>) => {
      const copyPinnedArticle = [...action.pinnedArticles];
      const pinnedIndex = copyPinnedArticle.findIndex(
        item => item.id === response.payload.id,
      );
      if (pinnedIndex > -1) {
        const pinnedItem: LocalArticle = {
          ...copyPinnedArticle[pinnedIndex],
          visited: true,
          pinned: false,
        };
        copyPinnedArticle.splice(pinnedIndex, 1);
        action.pinnedArticles = copyPinnedArticle;
        action.subArticles = [pinnedItem, ...action.subArticles];
        action.articleList = updatePinned({
          subArticle: [pinnedItem],
          articles: action.articleList,
          isPinned: false,
        });
        action.unPinnedArticle = response.payload;
      }
    },
  },
});
const {
  getNewsStart,
  getNewsSuccess,
  getNewsFailed,
  onItemDeleted,
  onPinItem,
  onUnPinItem,
  updatedListWithRandomArticle,
} = slice.actions;

export default slice.reducer;

export const getListOfNewsFromApi =
  ({invalidateCache = false}: {invalidateCache: boolean}) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
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
export const updateListWithRandomArticle = () => (dispatch: AppDispatch) => {
  return dispatch({type: updatedListWithRandomArticle.type, payload: {}});
};

export const deleteItemInArticle =
  (item: LocalArticle) => (dispatch: AppDispatch) => {
    return dispatch({type: onItemDeleted.type, payload: item});
  };
export const pinItemInArticle =
  (item: LocalArticle) => (dispatch: AppDispatch) => {
    return dispatch({type: onPinItem.type, payload: item});
  };
export const unPinItemInArticle =
  (item: LocalArticle) => (dispatch: AppDispatch) => {
    return dispatch({type: onUnPinItem.type, payload: item});
  };
export const getViewableList = createSelector(
  (state: RootState) => state.news,
  news => news.subArticles,
);
export const getIsLoading = createSelector(
  (state: RootState) => state.news,
  news => news.isLoading,
);
export const getArticles = createSelector(
  (state: RootState) => state.news,
  news => news.articleList,
);

export const getPinnedArticles = createSelector(
  (state: RootState) => state.news,
  news => news.pinnedArticles,
);
export const getUnPinnedArticle = createSelector(
  (state: RootState) => state.news,
  news => news.unPinnedArticle,
);
