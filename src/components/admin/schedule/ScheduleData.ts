import type { Schedule } from './ScheduleTypes';

export const schedulesData: Schedule[] = [
  {
    id: 'SCH001',
    title: 'Khám tổng quát',
    doctor: 'Bs. Nguyễn Thị Hương',
    specialty: 'Phụ khoa',
    date: '01/08/2023',
    startTime: '08:00',
    endTime: '09:00',
    status: 'completed',
    note: 'Khám định kỳ'
  },
  {
    id: 'SCH002',
    title: 'Tư vấn thai sản',
    doctor: 'Bs. Trần Văn Minh',
    specialty: 'Thai sản',
    date: '01/08/2023',
    startTime: '09:00',
    endTime: '10:00',
    status: 'completed',
    note: 'Tư vấn thai kỳ'
  },
  {
    id: 'SCH003',
    title: 'Siêu âm thai',
    doctor: 'Bs. Lê Thị An',
    specialty: 'Thai sản',
    date: '01/08/2023',
    startTime: '10:00',
    endTime: '11:00',
    status: 'booked',
    note: 'Siêu âm thai 3 tháng'
  },
  {
    id: 'SCH004',
    title: 'Khám phụ khoa',
    doctor: 'Bs. Nguyễn Thị Hương',
    specialty: 'Phụ khoa',
    date: '01/08/2023',
    startTime: '13:00',
    endTime: '14:00',
    status: 'available'
  },
  {
    id: 'SCH005',
    title: 'Tư vấn dinh dưỡng',
    doctor: 'Bs. Phạm Văn Đức',
    specialty: 'Dinh dưỡng',
    date: '01/08/2023',
    startTime: '14:00',
    endTime: '15:00',
    status: 'available'
  },
  {
    id: 'SCH006',
    title: 'Khám tổng quát',
    doctor: 'Bs. Nguyễn Thị Hương',
    specialty: 'Phụ khoa',
    date: '02/08/2023',
    startTime: '08:00',
    endTime: '09:00',
    status: 'booked'
  },
  {
    id: 'SCH007',
    title: 'Tư vấn kế hoạch hóa gia đình',
    doctor: 'Bs. Trần Văn Minh',
    specialty: 'Sản khoa',
    date: '02/08/2023',
    startTime: '09:00',
    endTime: '10:00',
    status: 'available'
  },
  {
    id: 'SCH008',
    title: 'Siêu âm thai',
    doctor: 'Bs. Lê Thị An',
    specialty: 'Thai sản',
    date: '02/08/2023',
    startTime: '10:00',
    endTime: '11:00',
    status: 'booked'
  },
  {
    id: 'SCH009',
    title: 'Tư vấn dinh dưỡng',
    doctor: 'Bs. Phạm Văn Đức',
    specialty: 'Dinh dưỡng',
    date: '02/08/2023',
    startTime: '13:00',
    endTime: '14:00',
    status: 'cancelled',
    note: 'Bác sĩ có việc đột xuất'
  },
  {
    id: 'SCH010',
    title: 'Khám tổng quát',
    doctor: 'Bs. Nguyễn Thị Hương',
    specialty: 'Phụ khoa',
    date: '03/08/2023',
    startTime: '08:00',
    endTime: '09:00',
    status: 'available'
  }
]; 