interface News {
  isError: boolean;
  isLoading: boolean | null;
  articleList: LocalArticle[];
  subArticles: LocalArticle[] | null;
  isEndReached: boolean | null;
}
interface Article {
  title: string;
  description: string;
}
interface LocalArticle extends Article {
  visited: boolean;
  id: string;
}
