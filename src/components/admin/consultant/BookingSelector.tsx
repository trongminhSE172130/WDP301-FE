import React from 'react';
import { Table, Button, Radio } from 'antd';

interface BookingSelectorProps {
  bookings: any[];
  value: any;
  onChange: (booking: any) => void;
  onNext?: () => void;
  onRowClick?: (row: any) => void;
}

// Style button mềm mại, gradient, bo góc
const primaryButtonStyle: React.CSSProperties = {
  borderRadius: 20,
  fontWeight: 600,
  padding: '0 32px',
  height: 44,
  background: 'linear-gradient(90deg, #36cfc9 0%, #08979c 100%)',
  border: 'none',
  boxShadow: '0 2px 12px rgba(8,151,156,0.10)',
  transition: 'all 0.2s',
};

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
        <Button
          type="primary"
          onClick={onNext}
          disabled={!value}
          style={primaryButtonStyle}
          onMouseOver={e => (e.currentTarget.style.background = '#13c2c2')}
          onMouseOut={e => (e.currentTarget.style.background = 'linear-gradient(90deg, #36cfc9 0%, #08979c 100%)')}
        >
          Tiếp tục
        </Button>
      </div>
    </div>
  );
};

export default BookingSelector; 