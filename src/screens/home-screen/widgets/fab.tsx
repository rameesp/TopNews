import {Pressable, StyleSheet, View} from 'react-native';
import React, {memo} from 'react';
import {MD2Colors, Surface, Text} from 'react-native-paper';
import AddIcon from '../../../resources/icons/add-icon';

interface IFab {
  label: string;
  onClick: () => void;
}

const Fab: React.FC<IFab> = ({label, onClick}) => {
  return (
    <Pressable onPress={onClick}>
      <Surface style={styles.fab} elevation={4}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <AddIcon />
          <Text style={{fontSize: 22, marginStart: 6}}>{label}</Text>
        </View>
      </Surface>
    </Pressable>
  );
};

export default memo(Fab);
const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    right: 30,
    bottom: 30,
    borderRadius: 12,
    backgroundColor:MD2Colors.purple50
  },
});
