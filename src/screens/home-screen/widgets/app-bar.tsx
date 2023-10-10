import React from 'react';
import {View} from 'react-native';
import {Appbar} from 'react-native-paper';
import DownloadIcon from '../../../resources/icons/download-icon';
import RefreshIcon from '../../../resources/icons/refresh-icon';

//to show the title of the app
const AppBar: React.FC<IAppBar> = ({
  title,
  onNextBatch,
  onRandomBatch,
}): JSX.Element => {
  return (
    <Appbar.Header elevated>
      <Appbar.Content title={title} />

      <DownloadIcon onClick={onNextBatch} />
      <View style={{marginHorizontal: 8}}>
        <RefreshIcon onClick={onRandomBatch} />
      </View>
    </Appbar.Header>
  );
};

export default AppBar;
