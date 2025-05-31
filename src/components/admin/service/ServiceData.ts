import type { Service } from './ServiceTypes';

export const servicesData: Service[] = [
  {
    id: 'SV001',
    name: 'Khám sức khỏe tổng quát',
    category: 'Khám tổng quát',
    price: 1500000,
    duration: 60,
    description: 'Gói khám sức khỏe tổng quát bao gồm xét nghiệm máu, nước tiểu, X-quang ngực, điện tâm đồ, siêu âm bụng tổng quát.',
    status: 'active'
  },
  {
    id: 'SV002',
    name: 'Khám sản phụ khoa',
    category: 'Phụ khoa',
    price: 500000,
    duration: 45,
    description: 'Khám và tư vấn các vấn đề về sức khỏe phụ khoa, bao gồm khám âm đạo, siêu âm, xét nghiệm dịch âm đạo.',
    status: 'active'
  },
  {
    id: 'SV003',
    name: 'Siêu âm thai',
    category: 'Thai sản',
    price: 300000,
    duration: 30,
    description: 'Siêu âm kiểm tra tình trạng thai nhi, đo các chỉ số phát triển, nghe tim thai.',
    status: 'active'
  },
  {
    id: 'SV004',
    name: 'Khám và tư vấn dinh dưỡng',
    category: 'Dinh dưỡng',
    price: 400000,
    duration: 45,
    description: 'Đánh giá tình trạng dinh dưỡng, tư vấn chế độ ăn phù hợp với tình trạng sức khỏe.',
    status: 'active'
  },
  {
    id: 'SV005',
    name: 'Tư vấn kế hoạch hóa gia đình',
    category: 'Tư vấn',
    price: 200000,
    duration: 30,
    description: 'Tư vấn các biện pháp tránh thai, kế hoạch sinh con, sức khỏe sinh sản.',
    status: 'active'
  },
  {
    id: 'SV006',
    name: 'Xét nghiệm máu cơ bản',
    category: 'Xét nghiệm',
    price: 250000,
    duration: 15,
    description: 'Xét nghiệm công thức máu, glucose, chức năng gan, thận, chất điện giải.',
    status: 'active'
  },
  {
    id: 'SV007',
    name: 'Theo dõi thai kỳ trọn gói',
    category: 'Thai sản',
    price: 5000000,
    duration: 0,
    description: 'Gói theo dõi thai kỳ trọn gói từ khi mang thai đến khi sinh, bao gồm các lần khám thai định kỳ, siêu âm, xét nghiệm cần thiết.',
    status: 'active'
  },
  {
    id: 'SV008',
    name: 'Tư vấn tâm lý phụ nữ sau sinh',
    category: 'Tâm lý',
    price: 350000,
    duration: 60,
    description: 'Tư vấn, hỗ trợ tâm lý cho phụ nữ sau sinh, đặc biệt là các trường hợp có dấu hiệu trầm cảm sau sinh.',
    status: 'inactive'
  }
]; 