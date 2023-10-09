interface News {
  isError: boolean;
  isLoading: boolean;
  articleList: LocalArticle[];
  subArticles: LocalArticle[];
}
interface Article {
  title: string;
  description: string;
}
interface LocalArticle extends Article {
  visited: boolean;
  id: string;
}
