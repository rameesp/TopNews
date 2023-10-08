import React from 'react';
import {Appbar} from 'react-native-paper';

//to show the title of the app
const AppBar: React.FC<IAppBar> = ({title}): JSX.Element => {
  return (
    <Appbar.Header elevated>
      <Appbar.Content title={title} />
    </Appbar.Header>
  );
};

export default AppBar;
