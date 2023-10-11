import React from 'react';
import {SafeAreaView} from 'react-native';
import { PaperProvider} from 'react-native-paper';
import {Provider} from 'react-redux';
import {store} from './src/store/configure';
import MainScreen from './src/screens/main_screen/main_screen';
import theme from './src/theme/theme';
const App = (): JSX.Element => {

  return (
    <Provider store={store}>
      <PaperProvider theme={theme}>
        <SafeAreaView>
         <MainScreen/>
        </SafeAreaView>
      </PaperProvider>
    </Provider>
  );
};
export default App;
