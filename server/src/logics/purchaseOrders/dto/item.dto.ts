import { Expose, Type } from 'class-transformer';
import Joi from 'joi';

export class ItemDto {
  @Expose()
  @Type(() => Number)
  public quantity: number;
  @Expose()
  public catalogNumber?: string;
  @Expose()
  public details?: string;
  @Expose()
  @Type(() => Number)
  public cost: number;

  public static schema = Joi.object({
    quantity: Joi.number().min(1).required(),
    catalogNumber: Joi.string().min(1).allow(null).optional(),
    details: Joi.string().min(1).allow(null).optional(),
    cost: Joi.number().min(0).required(),
  });

  public static async validate(itemsDto: ItemDto) {
    try {
      await ItemDto.schema.validateAsync(itemsDto, { abortEarly: false });
    } catch (err) {
      throw err;
    }
  }
}
