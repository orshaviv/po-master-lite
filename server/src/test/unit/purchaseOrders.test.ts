import { plainToInstance } from 'class-transformer';
import 'reflect-metadata';
import { CreatePurchaseOrderDto } from '../../logics/purchaseOrders/dto/createPurchaseOrder.dto';

const CREATE_PO = {
  deliveryMethod: 1,
  paymentMethod: 'Credit',
  paymentStatus: 0,
  completionDate: new Date(),
  supplierName: 'Bob',
  contactName: 'Bobby',
  items: [
    {
      quantity: 2,
      catalogNumber: 'item1',
      details: 'This is item1',
      itemCost: 120,
    },
    {
      quantity: 5,
      catalogNumber: 'item2',
      details: 'This is item2',
      itemCost: 200,
    },

    {
      quantity: 1,
      catalogNumber: 'item3',
      itemCost: 200,
    },
  ],
  taxPercentage: 0.17,
};

describe('Test purchase orders dtos', () => {
  it('should throw validation error because deliveryMethod is not valid', async () => {
    const createPo = { ...CREATE_PO, deliveryMethod: 5 };
    await expect(CreatePurchaseOrderDto.create(createPo)).rejects.toThrow();
  });

  it('should throw validation error because paymentStatus is not valid', async () => {
    const createPo = { ...CREATE_PO, paymentStatus: 5 };
    await expect(CreatePurchaseOrderDto.create(createPo)).rejects.toThrow();
  });

  it('should throw validation error because completionDate is before current date', async () => {
    const completionDate = new Date();
    completionDate.setDate(completionDate.getDate() - 1);
    const createPo = { ...CREATE_PO, completionDate };
    await expect(CreatePurchaseOrderDto.create(createPo)).rejects.toThrow();
  });

  it('should successfully pass validation with items array', async () => {
    const createPo = plainToInstance(CreatePurchaseOrderDto, CREATE_PO);
    await expect(CreatePurchaseOrderDto.create(createPo)).resolves.toStrictEqual(createPo);
  });
});
