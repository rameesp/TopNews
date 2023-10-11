import {FlatList} from 'react-native';
import React, {useCallback} from 'react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import ListItem from '../widgets/list-item';
import PinnedList from './pinned-list';
import homeScreenStyle from '../styles';

/**
 * @param data data to be rendered on the Flat-list
 * @param pinnedNews pinned data to be rendered on the flat-list
 * @function onDataPinItem called when pinned option is clicked
 * @function onDataDelete called when delete button is clicked
 * @function onEndReached called when a list reached to the end
 * @function onDeletePinned called when delete button on the pinned list is clicked
 * @function onUnPin called when unPin button is clicked
 */
const NewsList: React.FC<INewsList> = React.memo(
  ({
    data,
    pinnedNews,
    onDataPinItem,
    onDataDelete,
    onEndReached,
    onDeletePinned,
    onUnPin,
  }): JSX.Element => {
    const renderItem = useCallback(
      ({item, index}: {item: LocalArticle; index: number}) => {
        return (
          <ListItem
            item={item}
            isPinned={false}
            index={index}
            onPinUnPin={() => onDataPinItem(item)}
            onDelete={() => onDataDelete(item)}
          />
        );
      },
      [],
    );
    const childKeyExtractor = useCallback(
      (item: LocalArticle) => `_id${item.id}`,
      [],
    );
    return (
      <>
        <GestureHandlerRootView style={homeScreenStyle.flexOne}>
          <FlatList
            data={data}
            ListHeaderComponent={
              <PinnedList
                pinnedNews={pinnedNews}
                onDeletePinned={item => onDeletePinned(item)}
                onUnPin={item => onUnPin(item)}
              />
            }
            contentContainerStyle={homeScreenStyle.listContentContainer}
            onEndReached={onEndReached}
            renderItem={renderItem}
            keyExtractor={childKeyExtractor}
          />
        </GestureHandlerRootView>
      </>
    );
  },
  (prevProps: Readonly<INewsList>, nextProps: Readonly<INewsList>) => {
    //we need to understand which all data is depended on re rendering the component
    //otherwise the component will re render unnecessarily which will cause performance lag
    return (
      prevProps.data.length === nextProps.data.length &&
      prevProps.pinnedNews.length === nextProps.pinnedNews.length
    );
  },
);

export default NewsList;
