import { ReactElement, useState } from 'react';
import { Form, Input, DatePicker, Button, Space } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import moment from 'moment';
import { PurchaseOrder } from './model/purchaseOrder.model';
import { CreatePurchaseOrderDto } from './dto/createPurchaseOrder.dto';
import { ItemDto } from './dto/item.dto';
import FormItemSelect, { SelectOptionDto } from '../common/formItemSelect';
import styles from './editPurchaseOrder.module.scss';

interface EditPurchaseOrderProps {
  purchaseOrder: PurchaseOrder | undefined;
}

const initCreatePoDto: CreatePurchaseOrderDto = {
  deliveryMethod: -1,
  paymentMethod: '',
  paymentStatus: 1,
  completionDate: getDateDaysAhead(30),
  supplierName: '',
  contactName: '',
  items: [{ quantity: 2, catalogNumber: '123', cost: 120, details: 'Item blah blah' }],
  taxPercentage: 0.17,
};

const deliveryMethodOptions: SelectOptionDto<number>[] = [
  { name: 'choose', value: -1 },
  { name: 'pickup', value: 0 },
  { name: 'delivery', value: 1 },
];

const paymentStatusOptions: SelectOptionDto<number>[] = [
  { name: 'paid', value: 0 },
  { name: 'pending', value: 1 },
  { name: 'refund', value: 2 },
];

export default function EditPurchaseOrder({ purchaseOrder }: EditPurchaseOrderProps): ReactElement {
  const [updatedPo, setUpdatedPo] = useState(purchaseOrder || initCreatePoDto);

  const onFinish = (values: CreatePurchaseOrderDto) => {
    setUpdatedPo(values);
    console.log('Success:', values);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <div className={styles.editPurchaseOrderWrapper}>
      <Form
        labelCol={{ span: 3 }}
        wrapperCol={{ span: 14 }}
        initialValues={updatedPo}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        labelAlign="left"
        size="small"
      >
        <FormItemSelect
          label={'Delivery Method'}
          name={'deliveryMethod'}
          required={true}
          options={deliveryMethodOptions}
        />

        <Form.Item label="Payment Method" name="paymentMethod" required={true}>
          <Input />
        </Form.Item>

        <FormItemSelect
          label={'Payment Status'}
          name={'paymentStatus'}
          required={true}
          options={paymentStatusOptions}
        />

        <Form.Item label="Completion Date" name="completionDate">
          <DatePicker />
        </Form.Item>

        <Form.Item label="Supplier Name" name="supplierName" required={true}>
          <Input />
        </Form.Item>

        <Form.Item label="Contact Name" name="contactName" required={false}>
          <Input />
        </Form.Item>

        <Form.List name="items">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                  <Form.Item
                    {...restField}
                    name={[name, 'catalogNumber']}
                    rules={[{ required: true, message: 'Missing CAT#' }]}
                  >
                    <Input placeholder="CAT#" />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, 'quantity']}
                    rules={[{ required: true, message: 'Missing quantity' }]}
                  >
                    <Input placeholder="Quantity" />
                  </Form.Item>
                  <Form.Item {...restField} name={[name, 'details']}>
                    <Input placeholder="Details" />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, 'cost']}
                    rules={[{ required: true, message: 'Missing cost' }]}
                  >
                    <Input placeholder="Cost" />
                  </Form.Item>
                  <MinusCircleOutlined onClick={() => remove(name)} />
                </Space>
              ))}
              <Form.Item>
                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                  Add field
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

function getPurchaseOrderIdFromUrl(): string {
  return window.location.pathname.split('/')[-1];
}

function getDateDaysAhead(days: number): moment.Moment {
  return moment().add(days, 'days');
}
