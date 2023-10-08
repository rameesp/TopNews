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
  return articles;
};

export const getFilteredList = ({
  isVisited,
  articles,
}: {
  isVisited: boolean;
  articles: LocalArticle[];
}): LocalArticle[] =>
  articles.filter((val: LocalArticle) => val.visited === isVisited);
export const getRandomIndex = ({
  quantity,
  max,
}: {
  quantity: number;
  max: number;
}) => {
  const array = [];

  while (array.length < quantity) {
    var candidateInt = Math.floor(Math.random() * max) + 1;
    if (array.indexOf(candidateInt) === -1) {
      array.push(candidateInt);
    }
  }
  return array;
};
///articles should be filtered
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
