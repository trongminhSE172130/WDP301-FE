import React, { useState, useEffect } from "react";
import { Card, Steps, Button, message, Typography, Divider, Spin } from "antd";
import BookingSelector from "./BookingSelector";
import DynamicFormRenderer from "./DynamicFormRenderer";
import apiClient from "../../../service/instance";

const { Paragraph } = Typography;

const steps = [
  {
    title: "Chọn lịch hẹn",
    description: "Chọn một lịch hẹn xét nghiệm để bắt đầu.",
  },
  { title: "Check-in", description: "Xác nhận khách hàng đã đến check-in." },
  {
    title: "Khám lâm sàn",
    description: "Nhập thông tin phiếu khám lâm sàn cho khách hàng.",
  },
  {
    title: "Kết quả xét nghiệm",
    description: "Nhập kết quả xét nghiệm cho khách hàng.",
  },
  {
    title: "Check-out",
    description: "Xác nhận khách hàng hoàn tất và rời đi.",
  },
  { title: "Hoàn tất", description: "Xác nhận và hoàn tất quy trình." },
];

const updateBookingStatus = async (
  submitFormId: string,
  status: string,
  notes: string
) => {
  try {
    const res = await apiClient.put(
      `/dynamic-forms/data/${submitFormId}/review`,
      {
        status,
        notes,
      }
    );
    console.log("API update status response:", res.data);
    if (res.data && res.data.success) {
      const updatedStatus =
        res.data.data?.status || res.data.data?.review_status;
      if (updatedStatus === "completed") {
        message.success("Đã cập nhật trạng thái thành công!");
      } else {
        message.warning(`Trạng thái hiện tại: ${updatedStatus}`);
      }
    } else {
      message.error("Không thể cập nhật trạng thái.");
    }
  } catch (err: unknown) {
    message.error("Không thể cập nhật trạng thái.");
    if (err && typeof err === "object" && "response" in err) {
      // @ts-expect-error: err có thể là bất kỳ kiểu nào, có thể có thuộc tính response nếu là lỗi từ axios
      console.error("Update status error:", err.response?.data || err);
    } else {
      console.error("Update status error:", err);
    }
  }
};

const ConsultantFormsPage: React.FC = () => {
  const [current, setCurrent] = useState(0);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [bookingFormData, setBookingFormData] = useState<any>({});
  const [resultFormData, setResultFormData] = useState<any>({});
  const [bookingFormSchema, setBookingFormSchema] = useState<any | null>(null);
  const [bookingFormSchemaLoading, setBookingFormSchemaLoading] =
    useState(false);
  const [resultFormSchema, setResultFormSchema] = useState<any | null>(null);
  const [resultFormSchemaLoading, setResultFormSchemaLoading] = useState(false);
  const [submitFormId, setSubmitFormId] = useState<string | null>(null); // Thêm state này

  // Lấy danh sách lịch hẹn xét nghiệm khi vào trang
  useEffect(() => {
    setLoading(true);
    apiClient
      .get("/bookings")
      .then((res) => {
        if (res.data && res.data.success) {
          // Chỉ lấy các booking có trạng thái pending
          const bookingsData = (res.data.data || [])
            .filter((b: any) => b.status === "pending")
            .map((b: any) => ({
              _id: b._id,
              user: b.user_id.full_name,
              phone: b.user_id.phone,
              service: b.service_id.title,
              time: `${new Date(
                b.consultant_schedule_id.date
              ).toLocaleDateString("vi-VN")} (${
                b.consultant_schedule_id.time_slot
              })`,
              raw: b, // giữ lại object gốc nếu cần dùng sau này
            }));
          setBookings(bookingsData);
        } else {
          setBookings([]);
        }
      })
      .catch(() => {
        message.error("Không thể tải danh sách lịch hẹn xét nghiệm.");
        setBookings([]);
      })
      .finally(() => setLoading(false));
  }, []);

  // Lấy schema booking_form khi sang bước 2 và đã chọn booking
  useEffect(() => {
    if (current === 1 && selectedBooking) {
      setBookingFormSchemaLoading(true);
      setBookingFormSchema(null);
      const serviceId =
        selectedBooking.raw.service_id._id || selectedBooking.raw.service_id;
      const formType = "booking_form";
      apiClient
        .get(`/dynamic-forms/schemas/${serviceId}/${formType}`)
        .then((res) => {
          if (res.data && res.data.success) {
            setBookingFormSchema(res.data.data);
          } else {
            setBookingFormSchema(null);
          }
        })
        .catch(() => {
          setBookingFormSchema(null);
          message.error("Không thể tải biểu mẫu đặt lịch!");
        })
        .finally(() => setBookingFormSchemaLoading(false));
    }
  }, [current, selectedBooking]);

  // Lấy schema result_form khi sang bước 3 và đã chọn booking
  useEffect(() => {
    if (current === 2 && selectedBooking) {
      setResultFormSchemaLoading(true);
      setResultFormSchema(null);
      const serviceId =
        selectedBooking.raw.service_id._id || selectedBooking.raw.service_id;
      const formType = "result_form";
      apiClient
        .get(`/dynamic-forms/schemas/${serviceId}/${formType}`)

        .then((res) => {
          if (res.data && res.data.success) {
            setResultFormSchema(res.data.data);
          } else {
            setResultFormSchema(null);
          }
        })
        .catch(() => {
          setResultFormSchema(null);
          message.error("Không thể tải biểu mẫu kết quả!");
        })
        .finally(() => setResultFormSchemaLoading(false));
    }
  }, [current, selectedBooking]);

  useEffect(() => {
    if (current === 5 && submitFormId) {
      updateBookingStatus(
        submitFormId,
        "completed",
        "Hoàn tất quy trình nhập liệu"
      );
    }
    // eslint-disable-next-line
  }, [current, submitFormId]);

  const next = () => setCurrent((c) => c + 1);
  const prev = () => setCurrent((c) => c - 1);

  // Submit booking_form
  const handleSubmitBookingForm = (formData: any) => {
    if (!selectedBooking || !bookingFormSchema) return;
    const serviceId =
      typeof selectedBooking.raw.service_id === "string"
        ? selectedBooking.raw.service_id
        : selectedBooking.raw.service_id._id;

    console.log("Form data received:", formData);

    // API yêu cầu form_data là flat object, không phải sectioned data
    const body = {
      form_type: "booking_form",
      service_id: serviceId,
      booking_id: selectedBooking.raw._id,
      form_data: formData, // Sử dụng form_data thay vì data với sections
    };

    console.log("API body to send:", JSON.stringify(body, null, 2));
    setLoading(true);
    apiClient
      .post("/dynamic-forms/data", body)
      .then((res) => {
        if (res.data && res.data.success) {
          setBookingFormData(res.data.data);
          message.success("Đã lưu phiếu đặt lịch!");
          next();
        } else {
          message.error("Không thể lưu phiếu đặt lịch.");
        }
      })
      .catch((err) => {
        message.error("Không thể lưu phiếu đặt lịch.");
        console.error("Submit booking_form error:", err?.response?.data || err);
      })
      .finally(() => setLoading(false));
  };
  // Submit result_form
  const handleSubmitResultForm = (formData: any) => {
    if (!selectedBooking || !resultFormSchema) return;
    const serviceId =
      typeof selectedBooking.raw.service_id === "string"
        ? selectedBooking.raw.service_id
        : selectedBooking.raw.service_id._id;

    console.log("Result form data received:", formData);

    // Xử lý default values cho các field không có giá trị
    const processedFormData = { ...formData };
    resultFormSchema.sections.forEach((section: any) => {
      section.fields.forEach((field: any) => {
        if (processedFormData[field.field_name] === undefined) {
          if (field.field_type === "checkbox")
            processedFormData[field.field_name] = [];
          else processedFormData[field.field_name] = "";
        }
      });
    });

    // API yêu cầu form_data là flat object
    const body = {
      form_type: "result_form",
      service_id: serviceId,
      booking_id: selectedBooking.raw._id,

      form_data: processedFormData,
    };

    console.log("Result API body to send:", JSON.stringify(body, null, 2));
    setLoading(true);
    apiClient
      .post("/dynamic-forms/data", body)
      .then((res) => {
        if (res.data && res.data.success) {
          setResultFormData(res.data.data);
          setSubmitFormId(res.data.data._id || res.data.data.id); // Lưu lại submitFormId
          message.success("Đã lưu phiếu kết quả!");
          next();
        } else {
          message.error("Không thể lưu phiếu kết quả.");
        }
      })
      .catch((err) => {
        message.error("Không thể lưu phiếu kết quả.");
        console.error("Submit result_form error:", err?.response?.data || err);
      })
      .finally(() => setLoading(false));
  };

  // Style button mềm mại, gradient, bo góc
  const primaryButtonStyle: React.CSSProperties = {
    borderRadius: 20,
    fontWeight: 600,
    padding: "0 32px",
    height: 44,
    background: "linear-gradient(90deg, #36cfc9 0%, #08979c 100%)",
    border: "none",
    boxShadow: "0 2px 12px rgba(8,151,156,0.10)",
    transition: "all 0.2s",
  };
  const secondaryButtonStyle: React.CSSProperties = {
    borderRadius: 20,
    fontWeight: 500,
    padding: "0 28px",
    height: 44,
    background: "#fff",
    border: "1.5px solid #b5f5ec",
    color: "#08979c",
    boxShadow: "0 2px 8px rgba(8,151,156,0.06)",
    transition: "all 0.2s",
  };

  return (
    <div style={{ minHeight: "100vh" }}>
      <Card
        style={{
          borderRadius: 18,
          boxShadow: "0 4px 32px rgba(0,0,0,0.08)",
          padding: 0,
        }}
        bodyStyle={{ padding: 36, paddingTop: 28 }}
      >
        <h2
          style={{
            fontSize: 32,
            fontWeight: 700,
            color: "#08979c",
            marginBottom: 24,
            letterSpacing: 1,
          }}
        >
          Biểu mẫu
        </h2>
        <Paragraph
          style={{
            textAlign: "center",
            color: "#666",
            marginBottom: 32,
            fontSize: 16,
          }}
        >
          Quản lý và nhập liệu các biểu mẫu xét nghiệm cho khách hàng.
        </Paragraph>
        <Steps
          current={current}
          items={steps.map((s) => ({
            title: s.title,
            description: (
              <span style={{ color: "#888", fontSize: 13 }}>
                {s.description}
              </span>
            ),
          }))}
          style={{ marginBottom: 36 }}
          responsive
        />
        <Divider style={{ margin: "16px 0 32px 0" }} />
        {current === 0 &&
          (loading ? (
            <div style={{ textAlign: "center", padding: 40 }}>
              <Spin size="large" />
            </div>
          ) : (
            <BookingSelector
              bookings={bookings}
              value={selectedBooking}
              onChange={setSelectedBooking}
              onNext={selectedBooking ? next : undefined}
            />
          ))}
        {/* Bước check-in */}
        {current === 1 && selectedBooking && (
          <div style={{ textAlign: "center", padding: 40 }}>
            <Typography.Title level={4} style={{ color: "#08979c" }}>
              Check-in khách hàng
            </Typography.Title>
            <Paragraph style={{ fontSize: 16, marginBottom: 32 }}>
              Xác nhận khách hàng <b>{selectedBooking.user}</b> đã đến check-in
              cho lịch xét nghiệm lúc <b>{selectedBooking.time}</b>.
            </Paragraph>
            <div style={{ display: "flex", justifyContent: "center", gap: 16 }}>
              <Button
                onClick={prev}
                style={secondaryButtonStyle}
                onMouseOver={(e) =>
                  (e.currentTarget.style.background = "#e6fffb")
                }
                onMouseOut={(e) => (e.currentTarget.style.background = "#fff")}
              >
                Quay lại chọn lịch
              </Button>
              <Button
                type="primary"
                size="large"
                onClick={next}
                style={primaryButtonStyle}
                onMouseOver={(e) =>
                  (e.currentTarget.style.background = "#13c2c2")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.background =
                    "linear-gradient(90deg, #36cfc9 0%, #08979c 100%)")
                }
              >
                Xác nhận check-in
              </Button>
            </div>
          </div>
        )}
        {current === 2 &&
          (bookingFormSchemaLoading ? (
            <div style={{ textAlign: "center", padding: 40 }}>
              <Spin size="large" />
            </div>
          ) : bookingFormSchema ? (
            <>
              <DynamicFormRenderer
                form={bookingFormSchema}
                initialValues={bookingFormData}
                onSubmit={handleSubmitBookingForm}
                onBack={prev}
              />
            </>
          ) : (
            <div style={{ textAlign: "center", color: "#d4380d", padding: 40 }}>
              Không thể tải biểu mẫu đặt lịch.
            </div>
          ))}
        {current === 3 &&
          (resultFormSchemaLoading ? (
            <div style={{ textAlign: "center", padding: 40 }}>
              <Spin size="large" />
            </div>
          ) : resultFormSchema ? (
            <DynamicFormRenderer
              form={resultFormSchema}
              initialValues={resultFormData}
              onSubmit={handleSubmitResultForm}
              onBack={prev}
            />
          ) : (
            <div style={{ textAlign: "center", color: "#d4380d", padding: 40 }}>
              Chưa có biểu mẫu kết quả cho dịch vụ này.
            </div>
          ))}
        {current === 4 && selectedBooking && (
          <div style={{ textAlign: "center", padding: 40 }}>
            <Typography.Title level={4} style={{ color: "#08979c" }}>
              Check-out khách hàng
            </Typography.Title>
            <Paragraph style={{ fontSize: 16, marginBottom: 32 }}>
              Xác nhận khách hàng <b>{selectedBooking.user}</b> đã hoàn tất và
              rời đi sau xét nghiệm vào lúc <b>{selectedBooking.time}</b>.
            </Paragraph>
            <div style={{ display: "flex", justifyContent: "center", gap: 16 }}>
              <Button
                onClick={prev}
                style={secondaryButtonStyle}
                onMouseOver={(e) =>
                  (e.currentTarget.style.background = "#e6fffb")
                }
                onMouseOut={(e) => (e.currentTarget.style.background = "#fff")}
              >
                Quay lại phiếu kết quả
              </Button>
              <Button
                type="primary"
                size="large"
                onClick={next}
                style={primaryButtonStyle}
                onMouseOver={(e) =>
                  (e.currentTarget.style.background = "#13c2c2")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.background =
                    "linear-gradient(90deg, #36cfc9 0%, #08979c 100%)")
                }
              >
                Xác nhận check-out
              </Button>
            </div>
          </div>
        )}

        {current === 5 && (
          <div style={{ textAlign: "center", padding: 40 }}>
            <Typography.Title
              level={3}
              style={{ color: "#52c41a", marginBottom: 12 }}
            >
              Hoàn tất quy trình!
            </Typography.Title>
            <Paragraph style={{ fontSize: 16 }}>
              Đã cập nhật trạng thái thành công.
            </Paragraph>
            <Button
              type="primary"
              onClick={() => setCurrent(0)}
              style={{ ...primaryButtonStyle, marginTop: 16 }}
              onMouseOver={(e) =>
                (e.currentTarget.style.background = "#13c2c2")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.background =
                  "linear-gradient(90deg, #36cfc9 0%, #08979c 100%)")
              }
            >
              Làm lại
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ConsultantFormsPage;
