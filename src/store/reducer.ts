import {combineReducers} from '@reduxjs/toolkit';
import news from './entities/news';

export default combineReducers({
  news: news,
});
