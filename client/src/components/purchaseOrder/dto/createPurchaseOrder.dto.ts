import { ItemDto } from './item.dto';

export interface CreatePurchaseOrderDto {
  deliveryMethod: number;
  paymentMethod: string;
  paymentStatus: number;
  completionDate: moment.Moment;
  supplierName: string;
  contactName: string;
  items: ItemDto[];
  taxPercentage: number;
}
