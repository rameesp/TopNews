import {StyleSheet} from 'react-native';
import {MD2Colors} from 'react-native-paper';

const homeScreenStyle = StyleSheet.create({
  refreshIconWrapper: {marginHorizontal: 8},
  fabContentWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fab: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    right: 30,
    bottom: 30,
    borderRadius: 12,
    backgroundColor: MD2Colors.purple50,
  },
  listItemActionContainer: {
    margin: 12,
    alignContent: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  deleteButtonTextStyle: {color: 'red', fontWeight: '900'},
  pinButtonTextStyle: {color: 'green', fontWeight: '900'},
  swipeableContentContainer: {
    margin: 4,
    borderColor: 'grey',
    borderWidth: 1,
    padding: 6,
  },
  listContentContainer: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 92,
  },
  homeContainer: {height: '100%'},
  flexOne: {flex: 1},
  fabTextStyle:{fontSize: 22, marginStart: 6}
});
export default homeScreenStyle;
