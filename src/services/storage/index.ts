import {storage} from './configure';

export class StorageService {
  private static instance: StorageService;
  private constructor() {}
  //Singleton class since only one instance the storage should be available
  public static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService();
    }

    return StorageService.instance;
  }
  #downloads = storage.getString('news');
  //if there are more type of data we can use generic type instead of article type
  addItemStorage = (items: LocalArticle[]) => {
    storage.set('news', JSON.stringify(items));
  };
  //to get all items from the storage
  getItems = (): LocalArticle[] => {
    return JSON.parse(this.#downloads || '[]');
  };
  //to clear mmkv storage
  clearStorage = () => {
    storage.set('news', JSON.stringify([]));
  };
}
