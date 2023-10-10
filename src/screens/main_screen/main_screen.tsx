import React, {useEffect} from 'react';
import HomeScreen from '../home-screen/home-screen';
import {useDispatch} from 'react-redux';
import {getListOfNewsFromApi} from '../../store/entities/news';
import {AppDispatch} from '../../store/configure';
import {View} from 'react-native';
import BootSplash from "react-native-bootsplash";
type hide = (config?: { fade?: boolean }) => Promise<void>;
const MainScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    dispatch(getListOfNewsFromApi({invalidateCache: false})); //should be handled from middleware
    setTimeout(() => {
      BootSplash.hide({ fade: true });
    }, 1000);
  }, []);
  return (
    <View style={{height: '100%', width: '100%'}}>
      <HomeScreen />
    </View>
  );
};

export default MainScreen;
