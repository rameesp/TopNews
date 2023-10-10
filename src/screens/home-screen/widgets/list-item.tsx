import React, { memo, useCallback} from 'react';
import { View} from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import {Button, Text} from 'react-native-paper';

const ListItem = ({
  item,
  index,
  onPin,
  onDelete,
  isPinned = false,
}: {
  item: LocalArticle;
  index: number;
  onPin: () => void;
  onDelete: () => void;
  isPinned: boolean;
}) => {
  let row: Array<any> = [];
  let prevOpenedRow: any;
  const closeRow = useCallback((index: number) => {
    if (prevOpenedRow && prevOpenedRow !== row[index]) {
      prevOpenedRow.close();
    }
    prevOpenedRow = row[index];
  }, []);

  const renderRightActions = useCallback(
    (onPin: () => void, onDelete: () => void) => {
      return (
        <View
          style={{
            margin: 0,
            alignContent: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Button onPress={onPin}>
            {
              <Text style={{color: 'green', fontWeight: '900'}}>
                {isPinned ? 'unPin' : 'Pin'}
              </Text>
            }
          </Button>
          <Button onPress={onDelete}>
            {<Text style={{color: 'red', fontWeight: '900'}}>Delete</Text>}
          </Button>
        </View>
      );
    },
    [],
  );

  return (
    <Swipeable
      renderRightActions={() => renderRightActions(onPin, onDelete)}
      onSwipeableOpen={() => closeRow(index)}
      ref={ref => (row[index] = ref)}>
      <View
        style={{
          margin: 4,
          borderColor: 'grey',
          borderWidth: 1,
          padding: 6,
          backgroundColor: isPinned ? 'grey' : 'white',
        }}>
        <Text numberOfLines={2} variant="titleMedium">
          {item.id + ' :' + item.title}
        </Text>
        <Text numberOfLines={2} variant="bodySmall">
          {item.description}
        </Text>
      </View>
    </Swipeable>
  );
};
export default memo(ListItem);
