import fs from 'fs';
import path from 'path';
import { v1 as uuidv1 } from 'uuid';
import { plainToInstance } from 'class-transformer';
import xlsx from 'node-xlsx';
import { CreatePurchaseOrderDto } from './dto/createPurchaseOrder.dto';
import { PurchaseOrder } from './model/';
import { poDb } from '../../startup/db';

export async function createPurchaseOrder(createPoDto: CreatePurchaseOrderDto): Promise<string> {
  try {
    const id = uuidv1();
    const total = createPoDto.items.reduce((sum, { cost }) => sum + cost, 0);
    const purchaseOrder: PurchaseOrder = { _id: id, ...createPoDto, total };
    await poDb.setItem(id, purchaseOrder);
    return id;
  } catch (err) {
    console.log(`Error creating PO. Error: ${err}`);
    throw err;
  }
}

export async function getPurchaseOrderById(id: string): Promise<PurchaseOrder> {
  try {
    const item = await poDb.getItem(id);
    return plainToInstance(PurchaseOrder, item, { excludeExtraneousValues: true });
  } catch (err) {
    console.log(`Error fetching PO. Error: ${err}`);
    throw err;
  }
}

export async function getPurchaseOrders(): Promise<PurchaseOrder[]> {
  try {
    const items = await poDb.values();
    return items.map(item =>
      plainToInstance(PurchaseOrder, item, { excludeExtraneousValues: true })
    );
  } catch (err) {
    console.log(`Error fetching PO. Error: ${err}`);
    throw err;
  }
}

interface Column {
  key: keyof PurchaseOrder;
  wch: number;
}

const columns: Column[] = [
  { key: 'completionDate', wch: 14 },
  { key: 'deliveryMethod', wch: 8 },
  { key: 'paymentMethod', wch: 8 },
  { key: 'items', wch: 50 },
  { key: 'supplierName', wch: 20 },
  { key: 'contactName', wch: 20 },
  { key: 'paymentStatus', wch: 8 },
  { key: 'total', wch: 10 },
];
export async function exportToXlsxFile(): Promise<void> {
  const options = { '!cols': columns.map(({ wch }) => ({ wch })) };

  try {
    const pos = await getPurchaseOrders();
    const data = pos.map(po =>
      columns.map(({ key }) => {
        if (key === 'items') {
          return po[key]
            .map(({ catalogNumber, quantity, cost }) => {
              return `(${catalogNumber}, ${quantity}, ${cost})`;
            })
            .join(', ');
        }
        return po[key];
      })
    );
    data.unshift(columns.map(({ key }) => key));
    const buffer = xlsx.build([{ name: getPosFileName(), data, options }]);

    const exportDir = path.join(process.cwd(), 'pos/');
    if (!fs.existsSync(exportDir)) fs.mkdirSync(exportDir);

    await new Promise((res, rej) => {
      fs.writeFile(path.join(exportDir, `${getPosFileName()}.xlsx`), buffer, {}, err => {
        if (err) rej(err);
        else res(true);
      });
    });
  } catch (err) {
    console.log(`Error exporting to xlsx file. Error: ${err}`);
    throw err;
  }
}

function getPosFileName(): string {
  const date = new Date().toLocaleDateString().split('/').join('-');
  const time = new Date().toLocaleTimeString().split(' ')[0].split(':').join('-');
  return `pos-${date}-${time}`;
}
