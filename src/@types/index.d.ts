interface News {
  isError: boolean;
  isLoading: boolean | null;
  articleList: LocalArticle[];
  subArticles: LocalArticle[];
  pinnedArticles: LocalArticle[];
  unPinnedArticle: LocalArticle | null;
}
interface LocalArticle {
  title: string;
  description: string;
  visited: boolean;
  id: string;
  pinned: boolean;
}
