import React from 'react';
import { Row, Col, Input, Select, Button, DatePicker } from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';

const { Option } = Select;
const { RangePicker } = DatePicker;

interface FeedbackFilterProps {
  searchText: string;
  ratingFilter: number | null;
  featuredFilter: boolean | null;
  dateRange: [string, string] | null;
  onSearchTextChange: (value: string) => void;
  onRatingFilterChange: (value: number | null) => void;
  onFeaturedFilterChange: (value: boolean | null) => void;
  onDateRangeChange: (dates: [string, string] | null) => void;
  onSearch: () => void;
  onReset: () => void;
}

const FeedbackFilter: React.FC<FeedbackFilterProps> = ({
  searchText,
  ratingFilter,
  featuredFilter,
  onSearchTextChange,
  onRatingFilterChange,
  onFeaturedFilterChange,
  onDateRangeChange,
  onSearch,
  onReset
}) => {
  return (
    <Row gutter={[16, 16]}>
      <Col span={8}>
        <Input
          placeholder="Tìm kiếm theo nội dung, tên người dùng..."
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => onSearchTextChange(e.target.value)}
          onPressEnter={onSearch}
        />
      </Col>
      
      <Col span={8}>
        <Select 
          placeholder="Lọc theo đánh giá" 
          style={{ width: '100%' }}
          value={ratingFilter || undefined}
          onChange={(value) => onRatingFilterChange(value)}
          allowClear
        >
          <Option value={5}>5 sao</Option>
          <Option value={4}>4 sao</Option>
          <Option value={3}>3 sao</Option>
          <Option value={2}>2 sao</Option>
          <Option value={1}>1 sao</Option>
        </Select>
      </Col>
      
      <Col span={8}>
        <Select 
          placeholder="Lọc theo nổi bật" 
          style={{ width: '100%' }}
          value={featuredFilter === null ? undefined : featuredFilter}
          onChange={(value) => onFeaturedFilterChange(value)}
          allowClear
        >
          <Option value={true}>Nổi bật</Option>
          <Option value={false}>Không nổi bật</Option>
        </Select>
      </Col>
      
      <Col span={8}>
        <RangePicker 
          style={{ width: '100%' }}
          onChange={(dates) => {
            if (dates) {
              onDateRangeChange([
                dates[0]?.format('YYYY-MM-DD') || '',
                dates[1]?.format('YYYY-MM-DD') || ''
              ]);
            } else {
              onDateRangeChange(null);
            }
          }}
        />
      </Col>
      
      <Col span={8}>
        <Button 
          type="primary" 
          icon={<SearchOutlined />}
          onClick={onSearch}
        >
          Tìm kiếm
        </Button>
        
        <Button 
          icon={<ReloadOutlined />}
          onClick={onReset}
          className="ml-2"
        >
          Làm mới
        </Button>
      </Col>
    </Row>
  );
};

export default FeedbackFilter; 