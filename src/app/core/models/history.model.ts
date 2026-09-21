import { FavoriteActionType } from './favorite.model';

/** Evento del histórico de acciones sobre un item de favoritos. */
export interface HistoryEvent {
  idHistory: number;
  idItemFavorite: number;
  action: FavoriteActionType;
  dateAction: string; // ISO 8601 (LocalDateTime del backend)
}
