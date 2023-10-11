import {Pressable, View} from 'react-native';
import React, {memo} from 'react';
import {Surface, Text} from 'react-native-paper';
import AddIcon from '../../../resources/icons/add-icon';
import homeScreenStyle from '../styles';

interface IFab {
  label: string;
  onClick: () => void;
}
/**
 * we can use fab from react native paper library here for more flexibility , created a custom one
 * @param label label to show on a FAB
 * @param onClick click of a fab button
 * @returns  JSX.Element
 */
const Fab: React.FC<IFab> = ({label, onClick}): JSX.Element => {
  return (
    <Pressable hitSlop={40}  onPress={onClick}>
      <Surface style={homeScreenStyle.fab} elevation={4}>
        <View style={homeScreenStyle.fabContentWrapper}>
          <AddIcon />
          <Text style={homeScreenStyle.fabTextStyle}>{label}</Text>
        </View>
      </Surface>
    </Pressable>
  );
};

export default memo(Fab);
