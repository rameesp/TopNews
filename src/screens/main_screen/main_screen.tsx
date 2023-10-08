import {View, Text} from 'react-native';
import React, {useEffect} from 'react';
import HomeScreen from '../home-screen/home-screen';
import {StorageService} from '../../services/storage';
import {useDispatch} from 'react-redux';
import {updateListFromLocal} from '../../store/entities/news';
import {AppDispatch} from '../../store/configure';

const MainScreen = () => {
 
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
   
    dispatch(updateListFromLocal());//should be handled from middleware 
  }, []);
  return <HomeScreen />;
};

export default MainScreen;
