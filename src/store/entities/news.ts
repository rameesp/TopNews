import {PayloadAction, createSelector, createSlice} from '@reduxjs/toolkit';
import {AppDispatch, RootState} from '../configure';
import {httpMethods} from '../../services/http-service/methods';
import {apiCallBegan} from '../actions';
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
    visibleArticles: [],
    pinnedArticles: [],
    unPinnedArticle: null,
  };
};
const slice = createSlice({
  name: 'news',
  initialState: initState,
  reducers: {
    //change it to set
    onNewsApiStart: action => {
      action.articleList = [];
      action.visibleArticles = [];
      action.pinnedArticles = [];
      action.isError = false;
      action.isLoading = true;
    },
    onNewsApiSuccess: (action: News, response: PayloadAction<any>) => {
      const articles = response.payload.articles;
      let visibleArticle: LocalArticle[] = [];
      let newArticle: LocalArticle[] = [];
      let updatedArticle: LocalArticle[] = [];

      if (articles.length > 0) {
        for (let index = 0; index < articles.length; index++) {
          const element = articles[index];
          //converting data to our desired form
          const newElement = {
            title: element.title,
            description: element.description,
            visited: element.visited ?? false,
            pinned: element.pinned ?? false,
            id: index + '',
          };

          newArticle = [...newArticle, newElement];
        }
        //if we are loading from the local to get all the pinned article
        action.pinnedArticles =
          getFilteredByPinnedList({
            isPinned: true,
            articles: newArticle,
          }) ?? [];

        //if we are loading from the local to get all the visited article
        const filteredList: LocalArticle[] = getFilteredByVisitedList({
          isVisited: true,
          articles: newArticle,
        });
        if (filteredList.length <= 0) {
          //if visited article is empty that means data will be from backend so it will get the top n data
          visibleArticle = getTopNews({
            limit: CONST_TOP_LIMIT,
            articles: newArticle,
          });
          //we need to update the top n article as visited
          updatedArticle = updateVisited({
            subArticle: visibleArticle,
            articles: newArticle,
          });
        } else {
          //if visited article is not empty i.e it is loading from local it will load all visited article
          visibleArticle = filteredList;
          //if the data is from local our newList will be updated article
          updatedArticle = newArticle;
        }

        action.visibleArticles = visibleArticle;
        action.articleList = updatedArticle;
        action.isLoading = false;
      }
    },
    onNewsApiFailed: action => {
      //we can handle all error functionalities here
      action.isError = true;
      action.isLoading = false;
    },
    updatedListWithRandomArticle: (action: News) => {
      let randomArticles: LocalArticle[] = [];
      //to update random article we need non visited list of data
      const filteredList: LocalArticle[] = getFilteredByVisitedList({
        isVisited: false,
        articles: action.articleList,
      });
      if (filteredList.length > 5) {
        //we will get random n indices here the return value will be  array of indices for example [1,23,45,6.7]
        const randomIndices: number[] = getRandomIndex({
          quantity: 5,
          max: filteredList.length - 1,
        });
        //here we will get random values based on the random indices from above
        randomArticles = getRandomItems({
          randomIndices: randomIndices,
          articles: filteredList,
        });
      } else {
        //if non visited list is less than 5 it will become our random set because there are no value to load
        randomArticles = filteredList;
      }
      //we need to update the visited status of generated list , so that next time that value wont be fetched
      const updatedArticle = updateVisited({
        subArticle: randomArticles,
        articles: action.articleList,
      });

      action.visibleArticles = [...randomArticles, ...action.visibleArticles];

      action.articleList = updatedArticle;
    },
    onItemDeleted: (action: News, response: PayloadAction<LocalArticle>) => {
      let copyArticle = [...action.articleList]; //we will create a copy of our current state
      const articleIndex = copyArticle.findIndex(
        item => response.payload.id === item.id,
      );
      //in order to delete from main list
      if (articleIndex > -1) {
        copyArticle.splice(articleIndex, 1);
        action.articleList = copyArticle;
      }
      if (response.payload.pinned) {
        //if the article  is pinned  we have to delete from pinned list
        let copyPinnedArticles = [...action.pinnedArticles];
        const pinnedArticleIndex = copyPinnedArticles.findIndex(
          item => response.payload.id === item.id,
        );
        if (pinnedArticleIndex > -1) {
          // to check the value exists or not
          copyPinnedArticles.splice(pinnedArticleIndex, 1);
          action.pinnedArticles = copyPinnedArticles;
        }
      } else {
        //if it is not on pinned items it will be on  visible article
        let copyVisibleArticle = [...action.visibleArticles];
        const visibleArticleIndex = copyVisibleArticle.findIndex(
          item => response.payload.id === item.id,
        );
        if (visibleArticleIndex > -1) {
          copyVisibleArticle.splice(visibleArticleIndex, 1); //delete from the visible article
          action.visibleArticles = copyVisibleArticle;
        }
      }
    },

    onPinItem: (action: News, response: PayloadAction<LocalArticle>) => {
      const copyVisibleArticle = [...action.visibleArticles];
      const visibleArticleIndex = copyVisibleArticle.findIndex(
        item => response.payload.id === item.id,
      );
      if (visibleArticleIndex > -1) {
        //to update the pinned status status index
        //we need to update the pinned status as well
        const pinnedItem: LocalArticle = {
          ...copyVisibleArticle[visibleArticleIndex],
          visited: true,
          pinned: true,
        };
        action.pinnedArticles = [...action.pinnedArticles, pinnedItem]; //updating pinned article array
        //update visible article because the item should delete from visible article
        copyVisibleArticle.splice(visibleArticleIndex, 1);
        action.visibleArticles = copyVisibleArticle;
        action.articleList = updateVisited({
          subArticle: [pinnedItem],
          articles: action.articleList,
        });
      }
    },
    onUnPinItem: (action: News, response: PayloadAction<LocalArticle>) => {
      const copyPinnedArticle = [...action.pinnedArticles];
      //finding index from pinned list
      const pinnedIndex = copyPinnedArticle.findIndex(
        item => item.id === response.payload.id,
      );
      if (pinnedIndex > -1) {
        const pinnedItem: LocalArticle = {
          ...copyPinnedArticle[pinnedIndex],
          visited: true,
          pinned: false,
        };
        copyPinnedArticle.splice(pinnedIndex, 1); //delete from pinned list
        action.pinnedArticles = copyPinnedArticle;
        action.visibleArticles = [pinnedItem, ...action.visibleArticles]; //updating the visible article
        //update the status on main list as well
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
  onNewsApiStart: getNewsStart,
  onNewsApiSuccess: getNewsSuccess,
  onNewsApiFailed: getNewsFailed,
  onItemDeleted,
  onPinItem,
  onUnPinItem,
  updatedListWithRandomArticle,
} = slice.actions;

export default slice.reducer;

/**
 * it will call the api and get the list from backend
 * @param invalidateCache is used to invalidate the cache sometimes the storage clearing may take time so if we need to bypass getting data from storage
 */
export const callNewsApi =
  ({invalidateCache = false}: {invalidateCache: boolean}) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    let payload = {
      // url: 'everything?q=india&pageSize=100&page=1&apiKey=93772fedfa9044dda2505c63d9b9dcc1',
      url: '9469c301-0ed9-492c-9993-1d2685edec84',
      invalidateCache: invalidateCache,
      method: httpMethods.GET,
      onStart: getNewsStart.type,
      onSuccess: getNewsSuccess.type,
      onError: getNewsFailed.type,
    };
    return dispatch({type: apiCallBegan.type, payload: payload});
  };
  /**
   * to update the list with random article
   */
export const updateListWithRandomArticle = () => (dispatch: AppDispatch) => {
  return dispatch({type: updatedListWithRandomArticle.type, payload: {}});
};
/**
 * to delete an item
 * @param item item thats needed to be deleted 
 */
export const deleteItemInArticle =
  (item: LocalArticle) => (dispatch: AppDispatch) => {
    return dispatch({type: onItemDeleted.type, payload: item});
  };
/**
 * to pin an item in the top of list
 * @param item item that needed to be pinned
 */
export const pinItemInArticle =
  (item: LocalArticle) => (dispatch: AppDispatch) => {
    return dispatch({type: onPinItem.type, payload: item});
  };
  /**
   * to unpin an item from the list
   * @param item item that needed to be unpinned 
   */
export const unPinItemInArticle =
  (item: LocalArticle) => (dispatch: AppDispatch) => {
    return dispatch({type: onUnPinItem.type, payload: item});
  };
 /**
  * to get viewable list to be set to flat-list
  */ 
export const getViewableList = createSelector(
  (state: RootState) => state.news,
  news => news.visibleArticles,
);
/**
 * Loading status while getting data 
 */
export const getIsLoading = createSelector(
  (state: RootState) => state.news,
  news => news.isLoading,
);
/**
 * to get overall list
 */
export const getArticles = createSelector(
  (state: RootState) => state.news,
  news => news.articleList,
);
/**
 * to get all pinned article
 */
export const getPinnedArticles = createSelector(
  (state: RootState) => state.news,
  news => news.pinnedArticles,
);
/**
 * to get the item that unpinned 
 */
export const getUnPinnedArticle = createSelector(
  (state: RootState) => state.news,
  news => news.unPinnedArticle,
);
