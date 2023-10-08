import {configureStore} from '@reduxjs/toolkit';
import axiosMiddleware from './middlewares/axios-middleware';
import reducer from './reducer';


export const store = configureStore({
  reducer: reducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({serializableCheck: false})
      .prepend(axiosMiddleware)
      // prepend and concat calls can be chained
      .concat(),
  enhancers: [],
});
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;