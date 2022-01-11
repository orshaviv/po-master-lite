import moment from 'moment';
import { CreatePurchaseOrderDto } from '../dto/createPurchaseOrder.dto';
import { ItemDto } from '../dto/item.dto';

export class PurchaseOrder implements CreatePurchaseOrderDto {
  deliveryMethod: number = -1;
  paymentMethod: string = '';
  paymentStatus: number = 1;
  completionDate: moment.Moment = moment();
  supplierName: string = '';
  contactName: string = '';
  items: ItemDto[] = [];
  taxPercentage: number = 0.17;
  _id: string = '';
  total: number = 0;
}
