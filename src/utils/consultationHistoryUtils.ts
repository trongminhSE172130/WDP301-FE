import dayjs from 'dayjs';
import type { ConsultationBooking } from '../service/api/consultantAPI';
import type { ConsultationData } from '../types/consultationHistory';

/**
 * Transform consultation data từ raw API response sang format dễ hiển thị
 */
export const transformConsultationData = (apiData: ConsultationBooking): ConsultationData => {
  return {
    _id: apiData._id,
    consultantName: apiData.consultant_schedule_id.consultant_user_id.full_name,
    consultantEmail: apiData.consultant_schedule_id.consultant_user_id.email,
    specialty: apiData.consultant_schedule_id.schedule_type === 'advice' ? 'Tư vấn chung' : 'Phân tích kết quả',
    date: dayjs(apiData.consultant_schedule_id.date).format('DD/MM/YYYY'),
    time: apiData.consultant_schedule_id.time_slot,
    status: apiData.status,
    meetingStatus: apiData.meeting_status,
    question: apiData.question,
    meetingLink: apiData.meeting_link,
    scheduleType: apiData.consultant_schedule_id.schedule_type,
    createdAt: apiData.created_at,
    updatedAt: apiData.updated_at,
    meetingId: apiData.meeting_id,
    calendarEventId: apiData.calendar_event_id,
  };
};

/**
 * Group consultations theo ngày
 */
export const groupConsultationsByDate = (consultations: ConsultationData[]) => {
  const today = dayjs().format('DD/MM/YYYY');
  const tomorrow = dayjs().add(1, 'day').format('DD/MM/YYYY');
  
  const groups: { [key: string]: ConsultationData[] } = {
    today: [],
    tomorrow: [],
    upcoming: [],
    past: []
  };

  consultations.forEach(consultation => {
    const consultationDate = dayjs(consultation.date, 'DD/MM/YYYY');
    
    if (consultation.date === today) {
      groups.today.push(consultation);
    } else if (consultation.date === tomorrow) {
      groups.tomorrow.push(consultation);
    } else if (consultationDate.isAfter(dayjs(), 'day')) {
      groups.upcoming.push(consultation);
    } else {
      groups.past.push(consultation);
    }
  });

  // Sort each group by time
  Object.keys(groups).forEach(key => {
    groups[key].sort((a, b) => {
      const timeA = a.time.split(' - ')[0];
      const timeB = b.time.split(' - ')[0];
      return timeA.localeCompare(timeB);
    });
  });

  return groups;
};

/**
 * Get status color cho consultation hoặc meeting
 */
export const getStatusColor = (status: string, type: 'consultation' | 'meeting' = 'consultation') => {
  if (type === 'meeting') {
    switch (status) {
      case 'not_created': return 'default';
      case 'pending_setup': return 'orange';
      case 'created': return 'blue';
      case 'started': return 'green';
      case 'ended': return 'gray';
      case 'cancelled': return 'red';
      default: return 'default';
    }
  }
  
  switch (status) {
    case 'pending': return 'orange';
    case 'confirmed': return 'blue';
    case 'in_progress': return 'cyan';
    case 'completed': return 'green';
    case 'cancelled_by_user': return 'red';
    case 'cancelled_by_consultant': return 'volcano';
    default: return 'default';
  }
};

/**
 * Get status text cho consultation hoặc meeting
 */
export const getStatusText = (status: string, type: 'consultation' | 'meeting' = 'consultation') => {
  if (type === 'meeting') {
    const texts = {
      not_created: 'Chưa tạo',
      pending_setup: 'Đang thiết lập',
      created: 'Đã tạo',
      started: 'Đã bắt đầu',
      ended: 'Đã kết thúc',
      cancelled: 'Đã hủy',
    };
    return texts[status as keyof typeof texts] || status;
  }
  
  const texts = {
    pending: 'Chờ xác nhận',
    confirmed: 'Đã xác nhận',
    in_progress: 'Đang diễn ra',
    completed: 'Hoàn thành',
    cancelled_by_user: 'Người dùng hủy',
    cancelled_by_consultant: 'Chuyên gia hủy',
  };
  return texts[status as keyof typeof texts] || status;
};

/**
 * Check if consultation can join meeting
 */
export const canJoinMeeting = (consultation: ConsultationData): boolean => {
  return !!(
    consultation.meetingLink && 
    consultation.meetingLink !== 'null' &&
    ['confirmed', 'in_progress'].includes(consultation.status) &&
    ['created', 'started'].includes(consultation.meetingStatus)
  );
};

/**
 * Format date cho hiển thị
 */
export const formatDisplayDate = (dateString: string): string => {
  return dayjs(dateString).format('DD/MM/YYYY');
};

/**
 * Format datetime cho hiển thị  
 */
export const formatDisplayDateTime = (dateString: string): string => {
  return dayjs(dateString).format('DD/MM/YYYY HH:mm');
};
