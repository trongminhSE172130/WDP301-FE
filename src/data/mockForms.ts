import type { DynamicFormResponse } from '../types/dynamicForm';

export const mockFormsData: DynamicFormResponse = {
  success: true,
  count: 2,
  data: [
    {
      _id: "68459722a4c31170268b965f",
      service_id: {
        _id: "684596f5a4c31170268b9659",
        title: "Xét nghiệm các bệnh lây truyền qua đường tình dục (STDs)",
        description: "Kiểm tra các bệnh lây truyền qua đường tình dục phổ biến như HIV, lậu, giang mai,..."
      },
      form_type: "booking_form",
      form_name: "Thông tin đăng ký xét nghiệm STDs",
      form_description: "Biểu mẫu thu thập thông tin người đăng ký xét nghiệm các bệnh lây truyền qua đường tình dục",
      sections: [
        {
          section_name: "personal_info",
          section_label: "Thông tin cá nhân",
          description: "Vui lòng cung cấp thông tin cá nhân",
          order: 1,
          fields: [
            {
              validation_rules: {
                min: 0,
                max: 0,
                pattern: "",
                min_length: 2,
                max_length: 100,
                options: [],
                file_types: []
              },
              field_name: "full_name",
              field_label: "Họ và tên",
              field_type: "text",
              is_required: true,
              placeholder: "Nguyễn Văn A",
              help_text: "Nhập họ tên đầy đủ",
              order: 1
            },
            {
              validation_rules: {
                min: 0,
                max: 0,
                pattern: "",
                min_length: 0,
                max_length: 0,
                options: ["Nam", "Nữ", "Khác"],
                file_types: []
              },
              field_name: "gender",
              field_label: "Giới tính",
              field_type: "radio",
              is_required: true,
              placeholder: "",
              help_text: "",
              order: 2
            },
            {
              validation_rules: {
                min: 0,
                max: 0,
                pattern: "",
                min_length: 0,
                max_length: 0,
                options: [],
                file_types: []
              },
              field_name: "dob",
              field_label: "Ngày sinh",
              field_type: "date",
              is_required: true,
              placeholder: "dd/mm/yyyy",
              help_text: "",
              order: 3
            }
          ]
        },
        {
          section_name: "test_reason",
          section_label: "Lý do xét nghiệm",
          description: "Giúp chúng tôi hiểu rõ mục đích xét nghiệm của bạn",
          order: 2,
          fields: [
            {
              validation_rules: {
                options: [
                  "Tôi có triệu chứng",
                  "Tôi có quan hệ tình dục không an toàn",
                  "Kiểm tra định kỳ",
                  "Khác"
                ],
                file_types: []
              },
              field_name: "reason",
              field_label: "Lý do",
              field_type: "select",
              is_required: true,
              placeholder: "Chọn lý do",
              help_text: "",
              order: 1
            }
          ]
        }
      ],
      version: 1,
      is_active: true,
      created_by: {
        _id: "683b43d155fb2bfd95efbb1b",
        full_name: "admin",
        email: "admin@gmail.com"
      },
      created_at: "2025-06-08T13:58:58.504Z",
      updated_at: "2025-06-08T13:58:58.504Z",
      __v: 0
    },
    {
      _id: "6840584048d518cf1cab444d",
      service_id: {
        _id: "6840584048d518cf1cab4445",
        title: "Xét nghiệm hormone sinh sản nữ",
        description: "Đánh giá các hormone quan trọng trong chu kỳ kinh nguyệt và khả năng sinh sản của phụ nữ."
      },
      form_type: "booking_form",
      form_name: "Form đặt lịch xét nghiệm hormone sinh sản",
      form_description: "Thông tin cần thiết khi đặt lịch xét nghiệm hormone",
      sections: [
        {
          section_name: "menstrual_info",
          section_label: "Thông tin chu kỳ kinh nguyệt",
          order: 1,
          fields: [
            {
              validation_rules: {
                min: 15,
                max: 50,
                file_types: [],
                options: []
              },
              field_name: "cycle_length",
              field_label: "Độ dài chu kỳ kinh",
              field_type: "number",
              is_required: true,
              placeholder: "Số ngày từ ngày đầu kỳ kinh này đến ngày đầu kỳ kinh tiếp theo",
              help_text: "Ngày thứ mấy của chu kỳ kinh nguyệt khi lấy mẫu (ngày 1 = ngày đầu có kinh)",
              order: 1
            },
            {
              validation_rules: {
                file_types: [],
                options: []
              },
              field_name: "last_menstrual_date",
              field_label: "Ngày kinh cuối cùng",
              field_type: "date",
              is_required: true,
              help_text: "Ngày bắt đầu kỳ kinh gần nhất",
              order: 2
            },
            {
              validation_rules: {
                options: [
                  "Rất đều đặn",
                  "Khá đều đặn",
                  "Không đều",
                  "Rất không đều",
                  "Đã mãn kinh"
                ],
                file_types: []
              },
              field_name: "menstrual_regularity",
              field_label: "Tính đều đặn",
              field_type: "select",
              is_required: true,
              help_text: "Đánh giá tính đều đặn của chu kỳ kinh nguyệt",
              order: 3
            }
          ]
        },
        {
          section_name: "reproductive_concerns",
          section_label: "Vấn đề sinh sản",
          order: 2,
          fields: [
            {
              validation_rules: {
                options: [
                  "Rối loạn kinh nguyệt",
                  "Khó có con",
                  "Triệu chứng mãn kinh",
                  "PCOS/Buồng trứng đa nang",
                  "Theo dõi điều trị hormone",
                  "Khám sức khỏe định kỳ",
                  "Khác"
                ],
                file_types: []
              },
              field_name: "primary_concern",
              field_label: "Mối quan tâm chính",
              field_type: "select",
              is_required: true,
              help_text: "Lý do chính để làm xét nghiệm hormone",
              order: 1
            },
            {
              validation_rules: {
                options: [
                  "Có, đang cố gắng có con",
                  "Không",
                  "Đang điều trị vô sinh"
                ],
                file_types: []
              },
              field_name: "trying_to_conceive",
              field_label: "Đang cố gắng có con",
              field_type: "radio",
              is_required: false,
              help_text: "Tình trạng mong muốn có con",
              order: 2
            },
            {
              validation_rules: {
                options: [
                  "Dưới 6 tháng",
                  "6-12 tháng", 
                  "1-2 năm",
                  "Trên 2 năm",
                  "Không áp dụng"
                ],
                file_types: []
              },
              conditional_logic: {
                show_if: {
                  field: "trying_to_conceive",
                  operator: "equals",
                  value: "Có, đang cố gắng có con"
                }
              },
              field_name: "conception_duration",
              field_label: "Thời gian cố gắng có con",
              field_type: "select",
              is_required: false,
              help_text: "Thời gian cố gắng có con (nếu có)",
              order: 3
            }
          ]
        }
      ],
      version: 1,
      is_active: true,
      created_by: {
        _id: "683b43d155fb2bfd95efbb1b",
        full_name: "admin",
        email: "admin@gmail.com"
      },
      __v: 0,
      created_at: "2025-06-04T14:29:20.723Z",
      updated_at: "2025-06-04T14:29:20.723Z"
    }
  ]
}; 