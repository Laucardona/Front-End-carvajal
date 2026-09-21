/** Estado del producto dentro del item de favoritos. */
export type FavoriteState = 'DISPONIBLE' | 'SIN_STOCK';

/** Tipo de acción registrada en el histórico de un favorito. */
export type FavoriteActionType = 'AGREGADO' | 'ACTUALIZADO' | 'ELIMINADO';

/** Respuesta del backend para un item de la lista de deseos. */
export interface FavoriteResponseDTO {
  idItemFavorite: number;
  idUser: number;
  idProduct: number;
  nameProduct: string;
  price: number;
  stockAvailable: number;
  quantity: number;
  state: FavoriteState;
  dateSave: string; // ISO 8601
  outOfStock: boolean;
}

/** Body para crear (POST) o actualizar (PUT) un item de favoritos. */
export interface FavoriteRequestDTO {
  idProduct: number;
  /** Opcional; si se envía debe ser >= 1. */
  quantity?: number;
}

/** Entrada del histórico de un item de favoritos. */
export interface HistoryFavoriteResponseDTO {
  idHistory: number;
  idItemFavorite: number;
  action: FavoriteActionType;
  dateAction: string; // ISO 8601
}
