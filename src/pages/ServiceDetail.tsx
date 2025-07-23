import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getServiceById } from "../service/api/serviceAPI";
import { getFeedbacksByService, type FeedbackService } from "../service/api/feedbackAPI";
import { FaCheckCircle, FaStar, FaClock, FaVial, FaUsers, FaChevronDown, FaChevronUp } from "react-icons/fa";
import type { Service } from "../components/admin/service/ServiceTypes";

const Accordion: React.FC<{ title: string; content: React.ReactNode; icon?: React.ReactNode }> = ({ 
  title, 
  content, 
  icon 
}) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="mb-4 bg-white rounded-xl shadow-lg overflow-hidden">
      <button
        className="w-full text-left px-6 py-5 bg-gradient-to-r from-blue-600 to-blue-700 text-white focus:outline-none flex justify-between items-center hover:from-blue-700 hover:to-blue-800 transition-all duration-300"
        onClick={() => setOpen((o) => !o)}
      >
        <div className="flex items-center gap-3">
          {icon}
          <span className="font-medium text-lg">{title}</span>
        </div>
        <div className="transform transition-transform duration-300">
          {open ? <FaChevronUp /> : <FaChevronDown />}
        </div>
      </button>
      <div className={`transition-all duration-300 ease-in-out ${open ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
        <div className="px-6 py-5 bg-gray-50 border-t">
          {content}
        </div>
      </div>
    </div>
  );
};

const ServiceDetail: React.FC = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const [service, setService] = useState<Service | null>(null);
  const [feedbacks, setFeedbacks] = useState<FeedbackService[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedbackLoading, setFeedbackLoading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [serviceId]);

  useEffect(() => {
    const fetchServiceDetail = async () => {
      setLoading(true);
      try {
        if (serviceId) {
          const res = await getServiceById(serviceId);
          setService(res.data.service);
        }
      } catch (error) {
        console.error('Error fetching service:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchFeedbacks = async () => {
      setFeedbackLoading(true);
      try {
        if (serviceId) {
          const feedbackRes = await getFeedbacksByService(serviceId, {
            page: 1,
            limit: 10,
            sort_by: 'created_at',
            sort_order: 'desc'
          });
          setFeedbacks(feedbackRes.data);
        }
      } catch (error) {
        console.error('Error fetching feedbacks:', error);
      } finally {
        setFeedbackLoading(false);
      }
    };

    if (serviceId) {
      fetchServiceDetail();
      fetchFeedbacks();
    }
  }, [serviceId]);

  if (loading) return <div className="text-center py-16">Đang tải dịch vụ...</div>;
  if (!service) return <div className="text-center py-16 text-red-500">Không tìm thấy dịch vụ</div>;

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <div className="container mx-auto px-4 pt-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start mb-8">
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              {service.title} <span className="text-orange-500">{typeof service.service_type_id === 'object' && service.service_type_id?.display_name ? `(${service.service_type_id.display_name})` : ''}</span>
            </h1>
            <ul className="mb-4 space-y-2">
              {service.overview_section && (
                <li className="flex items-center gap-2 text-green-600">
                  <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center -mt-[2px]">
                    <FaCheckCircle size="20" />
                  </div>
                  <span className="leading-5">{service.overview_section}</span>
                </li>
              )}
              {service.description && (
                <li className="flex items-center gap-2 text-green-600">
                  <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center -mt-[2px]">
                    <FaCheckCircle size="20" />
                  </div>
                  <span className="leading-5">{service.description}</span>
                </li>
              )}
              {service.duration && (
                <li className="flex items-center gap-2 text-green-600">
                  <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center -mt-[2px]">
                    <FaCheckCircle size="20" />
                  </div>
                  <span className="leading-5">Thời gian thực hiện: {service.duration}</span>
                </li>
              )}
              {service.sample_type && (
                <li className="flex items-center gap-2 text-green-600">
                  <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center -mt-[2px]">
                    <FaCheckCircle size="20" />
                  </div>
                  <span className="leading-5">Loại mẫu: {service.sample_type}</span>
                </li>
              )}
            </ul>
            <button className="bg-orange-400 text-white px-6 py-3 rounded-md font-bold text-lg mb-4">
              Giá chỉ từ Liên hệ
            </button>
          </div>
          <div className="w-full md:w-1/3 flex-shrink-0">
            <img
              src={service.image_url}
              alt={service.title}
              className="rounded-lg w-full object-cover shadow-md"
            />
          </div>
        </div>

        {/* Accordion (FAQ) */}
        <div className="mb-8">
          <Accordion
            title="Xét nghiệm bệnh lây qua đường tình dục là gì?"
            content={<div>{service.overview_section || 'Đang cập nhật...'}</div>}
          />
          <Accordion
            title="Những đối tượng cần xét nghiệm bệnh xã hội (STD)"
            content={<div>{service.target_audience || 'Đang cập nhật...'}</div>}
          />
        </div>

        {/* Đánh giá */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Đánh giá</h2>
          {feedbackLoading ? (
            <div className="text-center py-4">Đang tải đánh giá...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {feedbacks.length === 0 && <div className="col-span-3 text-gray-500">Chưa có đánh giá</div>}
              {feedbacks.map((fb) => (
                <div key={fb._id} className="bg-white rounded-lg shadow p-4">
                  <div className="flex items-center gap-2 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className={i < Math.round(fb.rating) ? 'text-yellow-400' : 'text-gray-300'} />
                    ))}
                    <span className="ml-2 font-semibold">
                      {fb.is_anonymous ? 'Ẩn danh' : fb.user_id?.full_name || 'Người dùng'}
                    </span>
                  </div>
                  <div className="text-gray-700 text-sm mb-2">{fb.comment}</div>
                  {fb.service_quality_rating && (
                    <div className="text-xs text-gray-500">
                      Chất lượng dịch vụ: {fb.service_quality_rating}/5
                    </div>
                  )}
                  {fb.consultant_rating && (
                    <div className="text-xs text-gray-500">
                      Tư vấn viên: {fb.consultant_rating}/5
                    </div>
                  )}
                  {fb.result_accuracy_rating && (
                    <div className="text-xs text-gray-500">
                      Độ chính xác: {fb.result_accuracy_rating}/5
                    </div>
                  )}
                  {fb.admin_reply && (
                    <div className="mt-3 p-2 bg-blue-50 rounded text-sm">
                      <div className="font-semibold text-blue-700">Phản hồi từ quản trị:</div>
                      <div className="text-blue-600">{fb.admin_reply}</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Gói xét nghiệm liên quan */}
        <div>
          <h2 className="text-xl font-bold mb-4">Gói xét nghiệm liên quan</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Có thể lấy từ API hoặc mock tạm */}
            <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
              <img src={service.image_url} alt={service.title} className="w-full h-32 object-cover rounded mb-2" />
              <div className="font-semibold mb-1">{service.title}</div>
              <div className="text-orange-500 font-bold mb-2">Liên hệ</div>
              <button className="bg-blue-100 text-blue-700 px-3 py-1 rounded text-xs">Xem chi tiết</button>
            </div>
            {/* Thêm các gói khác nếu có */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetail; 