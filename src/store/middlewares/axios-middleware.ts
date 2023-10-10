import {axios_instance} from '../../services/http-service/config';
import {httpMethods} from '../../services/http-service/methods';
import {AppDispatch} from '../configure';
import {apiCallBegan} from '../actions/index';
import {StorageService} from '../../services/storage';
interface IPayLoadType {
  method: httpMethods;
  url: string;
  onStart: string;
  onSuccess: string;
  onError: string;
  invalidateCache: boolean;
}
interface ILocalPayLoad {
  onUpdate: string;
}
const makeRequest = async (dispatch: AppDispatch, payload: IPayLoadType) => {
  const cachedStorage = StorageService.getInstance();
  const {method, url, onStart, onSuccess, onError, invalidateCache} = payload;
  const cachedItems = cachedStorage.getItems();
  try {
    const request = {
      method: method,
      url: url,
    };
    dispatch({type: onStart, payload: []}); // before requesting for api it will  dispatch onStart which we can listen on the entities with payload []
    if (cachedItems.length > 0 && !invalidateCache) {
      console.log('FROM CACHED');

      dispatch({
        type: onSuccess,
        payload: {articles: cachedItems},
      }); //af

      return;
    }
    const response = await axios_instance.request(request);
    dispatch({
      type: onSuccess,
      payload: response.data ? response.data : [],
    }); //after a successful request we can dispatch onSuccess with payload as response data
  } catch (ex) {
    console.log(ex);

    dispatch({type: onError, payload: ex}); // incase any error happens we will dispatch onError with error message
  }
};
const axiosMiddleware =
  (
    {dispatch}: {dispatch: any}, //dispatch, getState
  ) =>
  (next: any) =>
  async (action: any) => {
    if (action.type == apiCallBegan.type) {
      console.log('home');
      makeRequest(dispatch, action.payload);
      return;
    }
    return next(action);
  };

export default axiosMiddleware;
