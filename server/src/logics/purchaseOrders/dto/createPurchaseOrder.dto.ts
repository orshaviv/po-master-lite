import { Expose, plainToInstance, Transform, Type } from 'class-transformer';
import Joi from 'joi';
import { DeliveryMethod, PaymentStatus } from '../model/';
import { ItemDto } from './item.dto';

export class CreatePurchaseOrderDto {
  @Expose()
  public deliveryMethod: DeliveryMethod;
  @Expose()
  public paymentMethod: string;
  @Expose()
  public paymentStatus: PaymentStatus;
  @Expose()
  @Type(() => Date)
  public completionDate: Date;
  @Expose()
  public supplierName: string;
  @Expose()
  public contactName: string;
  @Expose()
  @Transform(convertToItemsArray)
  public items: ItemDto[];
  @Expose()
  @Type(() => Number)
  public taxPercentage: number;

  public static schema = Joi.object({
    deliveryMethod: Joi.number().valid(...GetValuesFromEnum(DeliveryMethod)),
    paymentMethod: Joi.string().min(1).allow(null).optional(),
    paymentStatus: Joi.number().valid(...GetValuesFromEnum(PaymentStatus)),
    completionDate: Joi.date().greater(new Date()),
    supplierName: Joi.string().min(1).required(),
    contactName: Joi.string().min(1).allow(null).optional(),
    items: Joi.array().items(ItemDto.schema),
    taxPercentage: Joi.number().min(0).default(0.17),
  });

  public static async validate(createPurchaseOrderDto: CreatePurchaseOrderDto) {
    try {
      await CreatePurchaseOrderDto.schema.validateAsync(createPurchaseOrderDto, {
        abortEarly: false,
      });
    } catch (err) {
      throw err;
    }
  }

  public static async create(raw: any): Promise<CreatePurchaseOrderDto> {
    const createPurchaseOrderDto = plainToInstance(CreatePurchaseOrderDto, raw, {
      excludeExtraneousValues: true,
    });
    await CreatePurchaseOrderDto.validate(createPurchaseOrderDto);
    return createPurchaseOrderDto;
  }
}

function convertToItemsArray({ value: items }: { value: Array<object> }): ItemDto[] {
  return items.map(item => plainToInstance(ItemDto, item, { excludeExtraneousValues: true }));
}

function GetValuesFromEnum(en: Object): Array<number> {
  return Object.values(en).filter(value => typeof value === 'number');
}
