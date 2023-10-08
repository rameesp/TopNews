import React, {useEffect} from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import HomeScreen from './src/screens/home-screen/home-screen';
import {PaperProvider} from 'react-native-paper';
import {Provider} from 'react-redux';
import {store} from './src/store/configure';
import MainScreen from './src/screens/main_screen/main_screen';
const App = (): JSX.Element => {
  return (
    <Provider store={store}>
      <PaperProvider>
        <SafeAreaView style={{flex: 1}}>
         <MainScreen/>
        </SafeAreaView>
      </PaperProvider>
    </Provider>
  );
};
export default App;
