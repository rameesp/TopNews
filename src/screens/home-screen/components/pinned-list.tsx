import {View, Text} from 'react-native';
import React from 'react';
import ListItem from '../widgets/list-item';

/**
 * @param pinnedNews pinned news list
 * @function onUnPin onclick of unpin button
 * @function onDeletePinned click of delete pinned item
 */
const PinnedList: React.FC<IPinnedList> = React.memo(
  ({pinnedNews, onUnPin, onDeletePinned}):JSX.Element => {
    return (
      <>
        {pinnedNews.map((item, index) => (
          <ListItem
            key={item.id}
            isPinned={true}
            item={item}
            index={index}
            onPinUnPin={() => onUnPin(item)}
            onDelete={() => onDeletePinned(item)}
          />
        ))}
      </>
    );
  },
  (prevProps: Readonly<IPinnedList>, nextProps: Readonly<IPinnedList>) => {
    return prevProps.pinnedNews.length === nextProps.pinnedNews.length;
  },
);

export default PinnedList;
