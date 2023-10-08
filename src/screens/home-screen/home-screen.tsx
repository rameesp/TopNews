import {FlatList, View} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import AppBar from './widgets/app-bar';

import {Card, Text} from 'react-native-paper';
import useHomeController from './use-home-controller';
interface IItem {
  title: string;
  desc: string;
}
const Item: React.FC<IItem> = ({title, desc}) => {
  return (
    <Card style={{marginTop: 12}}>
      <Card.Content>
        <Text variant="titleMedium">{title}</Text>
        <Text variant="bodySmall">{desc}</Text>
      </Card.Content>
    </Card>
  );
};
const HomeScreen: React.FC = (): JSX.Element => {
  const {topNews} = useHomeController();
  const renderItem = useCallback(
    ({item, index}: {item: LocalArticle; index: number}) => {
      return (
        <Item
          title={index + ' ::  ' + item.title + '   and ' + item.id}
          desc={item.description}
        />
      );
    },
    [],
  );
  const childKeyExtractor = useCallback(
    (item: LocalArticle, index: number) => `_id${item.id}`,
    [],
  );
  return (
    <View
      style={{
        flex: 1,
        height: '100%',
        width: '100%',
        paddingLeft: 16,
        paddingRight: 16,
        paddingBottom: 32,
      }}>
      <AppBar title={'TopNews'} />
      <FlatList
        data={topNews}
        renderItem={renderItem}
        keyExtractor={childKeyExtractor}
      />
    </View>
  );
};

export default HomeScreen;
