import type { NormalizedBookingData } from "../types/bookingHistory";

/**
 * Utility functions for booking history
 */

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("vi-VN");
};

export const formatDateTime = (dateString: string): string => {
  return new Date(dateString).toLocaleString("vi-VN");
};

/**
 * Normalize booking data từ raw API response hoặc transformed data
 */
export const normalizeBookingData = (bookingDetail: any): NormalizedBookingData | null => {
  if (!bookingDetail) return null;

  // Kiểm tra xem đây là raw data hay transformed data
  if (bookingDetail.user_id && bookingDetail.service_id) {
    // Raw data from API
    return {
      id: bookingDetail._id,
      patientName: bookingDetail.user_id.full_name,
      email: bookingDetail.user_id.email,
      phone: bookingDetail.user_id.phone,
      gender: bookingDetail.user_id.gender,
      serviceTitle: bookingDetail.service_id.title,
      serviceDescription: bookingDetail.service_id.description,
      duration: bookingDetail.service_id.duration,
      sampleType: bookingDetail.service_id.sample_type,
      testDetails: bookingDetail.service_id.test_details,
      scheduledDate: bookingDetail.scheduled_date,
      timeSlot: bookingDetail.time_slot,
      status: bookingDetail.status,
      createdAt: bookingDetail.created_at,
      updatedAt: bookingDetail.updated_at,
    };
  } else {
    // Transformed data
    return {
      id: bookingDetail._id,
      patientName: bookingDetail.patientName,
      email: bookingDetail.patientEmail,
      phone: bookingDetail.patientPhone,
      gender: bookingDetail.gender,
      serviceTitle: bookingDetail.service,
      serviceDescription: bookingDetail.serviceDescription,
      duration: bookingDetail.serviceDuration,
      sampleType: bookingDetail.sampleType,
      testDetails: undefined, // Transformed data doesn't have this
      scheduledDate: bookingDetail.appointmentDate,
      timeSlot: bookingDetail.appointmentTime,
      status: bookingDetail.status,
      createdAt: bookingDetail.bookingDate,
      updatedAt: bookingDetail.updatedAt,
    };
  }
};
