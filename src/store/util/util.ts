//to update the articles or all news visited value
/**
 *
 * @param subArticle items needed to ne updated
 *  @param articles all news list of news
 * @returns  updated article
 */
export const updateVisited = ({
  subArticle,
  articles,
}: {
  subArticle: LocalArticle[];
  articles: LocalArticle[];
}) => {
  for (let index = 0; index < subArticle.length; index++) {
    const element = subArticle[index];
    if (element.id) {
      const indexFound = articles.findIndex(ele => ele.id == element.id);
      if (indexFound > -1) {
        articles[indexFound] = {...articles[indexFound], visited: true};
      }
    }
  }

  return articles;
};
/**
 *
 * @param subArticle items needed to ne updated
 * @param articles overall list of news
 * @param isPinned  weather the item is pinned or unpinned
 * @returns  updated article
 */
export const updatePinned = ({
  subArticle,
  articles,
  isPinned,
}: {
  subArticle: LocalArticle[];
  articles: LocalArticle[];
  isPinned: boolean;
}) => {
  for (let index = 0; index < subArticle.length; index++) {
    const element = subArticle[index];
    if (element.id) {
      const indexFound = articles.findIndex(ele => ele.id == element.id);
      if (indexFound > -1) {
        articles[indexFound] = {...articles[indexFound], visited: isPinned};
      }
    }
  }

  return articles;
};
/**
 *
 * @param limit n number of article that needed to be fetched
 * @param articles overall list of news
 * @returns updated article
 */
export const getTopNews = ({
  limit,
  articles,
}: {
  limit: number;
  articles: LocalArticle[];
}): LocalArticle[] => {
  if (articles.length > limit) {
    return articles.slice(0, limit);
  }
  return articles; //updated article
};

/**
 * to get the list of data based on visited value
 * @param isVisited to status of visited value
 * @param articles all items from state
 * @returns filtered  article
 */
export const getFilteredByVisitedList = ({
  isVisited,
  articles,
}: {
  isVisited: boolean;
  articles: LocalArticle[];
}): LocalArticle[] =>
  articles.filter(
    (val: LocalArticle) => val.visited === isVisited && val.pinned == false, // val.pinned = false bcz pinned items are separate list and separate filter
  );
/**
 * to get the list of data based on pinned value
 * @param isPinned to status of pinned value
 * @param articles all items from state
 * @returns filtered  article
 */
export const getFilteredByPinnedList = ({
  isPinned,
  articles,
}: {
  isPinned: boolean;
  articles: LocalArticle[];
}): LocalArticle[] =>
  articles.filter((val: LocalArticle) => val.pinned === isPinned);

/**
 * to generate random index for random values
 * @param quantity sized of random index means number of index 
 * @param max maximum index value usually list.length-1
 * @returns array of index with quantity size
 */
export const getRandomIndex = ({
  quantity,
  max,
}: {
  quantity: number;
  max: number;
}):number[] => {
  const array = [];

  while (array.length < quantity) {
    var candidateInt = Math.floor(Math.random() * max) + 1;
    if (array.indexOf(candidateInt) === -1) {
      array.push(candidateInt);
    }
  }
  return array;
};
/**
 * to generate list based on random indices
 * @param randomIndices list of indices
 * @param articles overall list from state or from which list we have to take the random items
 * @returns  items with randomly generated items
 */
export const getRandomItems = ({
  randomIndices,
  articles,
}: {
  randomIndices: number[];
  articles: LocalArticle[];
}): LocalArticle[] => {
  let randomArray: LocalArticle[] = [];
  for (let i = 0; i < randomIndices.length; i++) {
    const index = randomIndices[i];
    randomArray.push(articles[index]);
  }
  return randomArray;
};
