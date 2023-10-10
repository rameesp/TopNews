import React, {useEffect} from 'react';
import {View} from 'react-native';
import BootSplash from 'react-native-bootsplash';//for Splash screen

import HomeScreen from '../home-screen/home-screen';
import {useDispatch} from 'react-redux';
import {getListOfNewsFromApi} from '../../store/entities/news';
import {AppDispatch} from '../../store/configure';
import mainScreenStyle from './styles';

const MainScreen: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    dispatch(getListOfNewsFromApi({invalidateCache: false}));
    //Splash screen will show for one second  
    setTimeout(() => {
      BootSplash.hide({fade: true});
    }, 1000);
  }, []);
  return (
    <View style={mainScreenStyle.container}>
      <HomeScreen />
    </View>
  );
};

export default MainScreen;
