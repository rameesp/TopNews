import React, {memo, useCallback} from 'react';
import {View} from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import {Button, Text} from 'react-native-paper';
import homeScreenStyle from '../styles';

interface IListItem {
  item: LocalArticle;
  index: number;
  onPinUnPin: () => void;
  onDelete: () => void;
  isPinned?: boolean;
}

/**
 *
 * @param item item from list @LocalArticle
 * @param index  index of the list for handling the swipe functionality
 * @function onPinUnPin on click of pin or unpin button
 * @function onDelete on click of delete button
 * @param isPinned to check weather the item is pinned or not
 *
 * @returns SX.Element
 */
let row: (Swipeable | null)[] = []; //list of swipeable row ref
let prevOpenedRow: Swipeable | null = null; // swipeable item which is previously opened
const ListItem: React.FC<IListItem> = ({
  item,
  index,
  onPinUnPin,
  onDelete,
  isPinned = false,
}): JSX.Element => {
  const closeRow = useCallback(
    (index: number) => {
      //to keep one item a time opened
      if (prevOpenedRow && prevOpenedRow !== row[index]) {
        prevOpenedRow.close();
      }
      prevOpenedRow = row[index];
    },
    [row, prevOpenedRow],
  );

  //render delete and pin button
  const renderRightActions = useCallback(
    (onPin: () => void, onDelete: () => void) => {
      return (
        <View style={homeScreenStyle.listItemActionContainer}>
          <Button onPress={onPin}>
            {
              <Text style={homeScreenStyle.pinButtonTextStyle}>
                {isPinned ? 'unPin' : 'Pin'}
              </Text>
            }
          </Button>
          <Button onPress={onDelete}>
            {<Text style={homeScreenStyle.deleteButtonTextStyle}>Delete</Text>}
          </Button>
        </View>
      );
    },
    [],
  );

  return (
    <Swipeable
      renderRightActions={() => renderRightActions(onPinUnPin, onDelete)}
      onSwipeableOpen={() => closeRow(index)}
      ref={ref => (row[index] = ref)}>
      <View
        style={[
          homeScreenStyle.swipeableContentContainer,
          {backgroundColor: isPinned ? 'grey' : 'white'},
        ]}>
        <Text numberOfLines={2} variant="titleMedium">
          {item?.title ?? 'No heading found'}
        </Text>
        <Text numberOfLines={2} variant="bodySmall">
          {item?.description ?? 'No description available'}
        </Text>
      </View>
    </Swipeable>
  );
};
export default memo(ListItem);
