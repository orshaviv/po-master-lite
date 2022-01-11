import { Expose, Type } from 'class-transformer';
import { CreatePurchaseOrderDto } from '../dto/createPurchaseOrder.dto';
export class PurchaseOrder extends CreatePurchaseOrderDto {
  @Expose()
  _id: string;

  @Expose()
  @Type(() => Number)
  total: number;
}
