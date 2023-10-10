import React from 'react';
import {View} from 'react-native';
import {Appbar} from 'react-native-paper';
import DownloadIcon from '../../../resources/icons/download-icon';
import RefreshIcon from '../../../resources/icons/refresh-icon';
import homeScreenStyle from '../styles';

//To show the title of the app
/**
 * 
 * @param title for showing the app title 
 * @param onNextBatch click of the icon which will load the data from backend 
 * @param onRandomBatch click of the icon which will generate a random n number of data and load to the Flat-list 
 * @returns ()=> JSX.Element
 */
const AppBar: React.FC<IAppBar> = ({
  title,
  onNextBatch,
  onRandomBatch,
}): JSX.Element => {
  return (
    <Appbar.Header elevated>
      <Appbar.Content title={title} />
       <DownloadIcon onClick={onNextBatch} />
      <View style={homeScreenStyle.refreshIconWrapper}>
        <RefreshIcon onClick={onRandomBatch} />
      </View>
    </Appbar.Header>
  );
};

export default AppBar;
