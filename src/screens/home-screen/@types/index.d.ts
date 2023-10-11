interface IAppBar {
  title: String;
  onNextBatch: () => void;
  onRandomBatch: () => void;
}
interface INewsList {
  data: ArrayLike<LocalArticle>;
  onDataPinItem: (item: LocalArticle) => void;
  onDataDelete: (item: LocalArticle) => void;
  onEndReached: () => void;
  pinnedNews: LocalArticle[];
  onDeletePinned: (item: LocalArticle) => void;
  onUnPin: (item: LocalArticle) => void;
}
interface IPinnedList {
  pinnedNews: LocalArticle[];
  onUnPin: (item: LocalArticle) => void;
  onDeletePinned: (item: LocalArticle) => void;
}

interface ISnackBar {
  isVisible: boolean;
  message: String;
  actionLabel: string;
  onAction: () => void;
  onDismiss: () => void;
}
interface IListItem {
  item: LocalArticle;
  index: number;
  onPinUnPin: () => void;
  onDelete: () => void;
  isPinned?: boolean;
}
interface ISnackBarState {
  isVisible: boolean;
  messageRefresh?: String;
  messageNextSet?: String;
}