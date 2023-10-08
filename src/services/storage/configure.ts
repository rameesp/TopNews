import {MMKV} from 'react-native-mmkv';

export const storage = new MMKV({
  id: '@key/news#storage',
  encryptionKey: 'hunter2',
});
