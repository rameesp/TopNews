import React, {useEffect} from 'react';
import HomeScreen from '../home-screen/home-screen';
import {useDispatch} from 'react-redux';
import {getListOfNewsFromApi} from '../../store/entities/news';
import {AppDispatch} from '../../store/configure';
import {View} from 'react-native';

const MainScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    dispatch(getListOfNewsFromApi({invalidateCache: false})); //should be handled from middleware
  }, []);
  return (
    <View style={{height: '100%', width: '100%'}}>
      <HomeScreen />
    </View>
  );
};

export default MainScreen;
