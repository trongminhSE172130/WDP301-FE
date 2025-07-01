import React from 'react';
import { Table, Button, Radio } from 'antd';

interface BookingSelectorProps {
  bookings: any[];
  value: any;
  onChange: (booking: any) => void;
  onNext?: () => void;
  onRowClick?: (row: any) => void;
}

const BookingSelector: React.FC<BookingSelectorProps> = ({ bookings, value, onChange, onNext, onRowClick }) => {
  return (
    <div>
      <Radio.Group
        value={value?._id}
        onChange={e => {
          const selected = bookings.find(b => b._id === e.target.value);
          onChange(selected);
        }}
        style={{ width: '100%' }}
      >
        <Table
          rowKey="_id"
          dataSource={bookings}
          pagination={false}
          columns={[
            { title: 'Khách hàng', dataIndex: 'user' },
            { title: 'Dịch vụ', dataIndex: 'service' },
            { title: 'Thời gian', dataIndex: 'time' },
            {
              title: '',
              key: 'select',
              render: (_, record) => (
                <Radio value={record._id} />
              ),
              width: 60,
            },
          ]}
          onRow={record => ({
            onClick: () => onRowClick && onRowClick(record),
          })}
        />
      </Radio.Group>
      <div style={{ textAlign: 'right', marginTop: 24 }}>
        <Button type="primary" disabled={!value} onClick={onNext}>Tiếp tục</Button>
      </div>
    </div>
  );
};

export default BookingSelector; 