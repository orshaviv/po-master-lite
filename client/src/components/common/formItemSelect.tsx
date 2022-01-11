import React, { ReactElement } from 'react';
import { Form, Select } from 'antd';
const { Option } = Select;

interface FormItemSelectProps<T> {
  label: string;
  name: string;
  required: boolean;
  options: Array<SelectOptionDto<T>>;
}

export interface SelectOptionDto<T> {
  name: string;
  value: T;
}

export default function FormItemSelect<T>({
  label,
  name,
  required = false,
  options,
}: FormItemSelectProps<T>): ReactElement {
  const message = `Please choose ${label.toLowerCase()}!`;
  return (
    <Form.Item label={label} name={name} rules={[{ required, message }]}>
      <Select>
        {options.map(({ name, value }) => (
          <Option key={`${value}`} value={value}>
            {name}
          </Option>
        ))}
      </Select>
    </Form.Item>
  );
}
