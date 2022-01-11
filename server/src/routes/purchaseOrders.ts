import express from 'express';
import createResponse from '../middlewares/createResponse';
import {
  getPurchaseOrderById,
  createPurchaseOrder,
  getPurchaseOrders,
  exportToXlsxFile,
} from '../logics/purchaseOrders/purchaseOrders';
import { CreatePurchaseOrderDto } from '../logics/purchaseOrders/dto/createPurchaseOrder.dto';

const router = express.Router();

router.get(
  '/export-pos',
  async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      await exportToXlsxFile();
      res.httpResponse = { status: 200, data: null };
    } catch (err) {
      res.httpResponse = { status: 500, data: { err } };
    }
    next();
  }
);

router.get(
  '/pos/:id',
  async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const po = await getPurchaseOrderById(req.params.id);
      res.httpResponse = { status: 200, data: po };
    } catch (err) {
      res.httpResponse = { status: 500, data: { err } };
    }
    next();
  }
);

router.get(
  '/pos',
  async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const pos = await getPurchaseOrders();
      res.httpResponse = { status: 200, data: pos };
    } catch (err) {
      res.httpResponse = { status: 500, data: { err } };
    }
    next();
  }
);

router.post(
  '/',
  async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const createPoDto = await CreatePurchaseOrderDto.create(req.body);
      const id = await createPurchaseOrder(createPoDto);
      res.httpResponse = { status: 200, data: { id } };
    } catch (err) {
      res.httpResponse = { status: 500, data: { err } };
    }
    next();
  }
);

router.all('*', [createResponse], (req: express.Request, res: express.Response) => {});

export default router;
