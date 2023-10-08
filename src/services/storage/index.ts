import {randomListFromInterval} from '../../util/util';
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
  getItems = (): LocalArticle[] => {
    return JSON.parse(this.#downloads || '[]');
  };
  //if there are more type of data we can use generic type instead of article type
  getItem = (numberItems: number): LocalArticle[] => {
    const filteredList = this.#getUnVisitedList();
    const slicedArray = filteredList.slice(0, numberItems);
    return slicedArray ?? [];
  };
  getRandomItems = (numberItems: number): LocalArticle[] => {
    const filteredList = this.#getUnVisitedList();
    // const listRandom = randomListFromInterval(5, filteredList.length);
    // console.log(listRandom);
    return [];
  };
  #getUnVisitedList = (): LocalArticle[] => {
    const list: LocalArticle[] = JSON.parse(this.#downloads || '[]');
    console.log(JSON.parse(this.#downloads || '[]').length, 'unvisited');
    return (
      list.filter(value => {
        return !value.visited;
      }) ?? []
    );
  };
  clearStorage = () => {
    storage.set('news', JSON.stringify([]));
  };
}
