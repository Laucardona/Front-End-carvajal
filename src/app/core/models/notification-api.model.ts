/**
 * Notificación del microservicio Notifications.
 * OJO: no confundir con `AppNotification` (core/models/product.model.ts),
 * que es el modelo local/mock usado hoy por notification.service.ts.
 */
export type NotificationApiType = 'OUT_OF_STOCK';

export interface NotificationApiDTO {
  id: number;
  userId: number;
  productId: number;
  message: string;
  type: NotificationApiType;
  read: boolean;
  createdAt: string; // ISO 8601
}
