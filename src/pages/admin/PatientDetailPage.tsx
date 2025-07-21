import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Card, 
  Typography, 
  Divider, 
  Row, 
  Col, 
  Tag, 
  Button, 
  Descriptions, 
  Space, 
  Avatar,
  Collapse,
  Input,
  DatePicker
} from 'antd';
import { 
  ArrowLeftOutlined, 
  UserOutlined, 
  PhoneOutlined, 
  MailOutlined,
  EditOutlined,
  HomeOutlined,
  CalendarOutlined,
  FileTextOutlined,
  MedicineBoxOutlined
} from '@ant-design/icons';
import { patientsData } from '../../components/admin/patient/PatientData';
import type { Patient } from '../../components/admin/patient/PatientTypes';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Panel } = Collapse;
const { TextArea } = Input;

interface MedicalRecord {
  id: string;
  date: string;
  diagnosis: string;
  treatment: string;
  doctor: string;
}

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

// Dữ liệu mẫu cho bệnh án
const sampleMedicalRecords: MedicalRecord[] = [
  {
    id: 'MR001',
    date: '11/03/2023',
    diagnosis: 'Ợ nóng',
    treatment: 'Kê đơn thuốc Famotidin',
    doctor: 'Bác sĩ Trần Duy'
  },
  {
    id: 'MR002',
    date: '20/03/2023',
    diagnosis: 'Sốt',
    treatment: 'Nghỉ ngơi và bổ sung nước',
    doctor: 'Bác sĩ Trần Duy'
  }
];

// Dữ liệu mẫu cho thuốc
const sampleMedications: Medication[] = [
  {
    id: 'MED001',
    name: 'Famotidin',
    dosage: '20mg',
    frequency: 'Ngày một lần',
    duration: '7 ngày',
    instructions: 'Uống sau bữa ăn'
  }
];

// Dữ liệu mẫu cho chỉ số sức khỏe
const vitalRecords = [
  {
    id: 'V001',
    glucoseBefore: '120mg/dt',
    glucoseAfter: '120mg/dt',
    temperature: '36.7°C',
    bloodPressure: '120/80 mm Hg',
    height: '160cm',
    weight: '55Kg',
    date: '11/03/2023'
  },
  {
    id: 'V002',
    glucoseBefore: '118mg/dt',
    glucoseAfter: '122mg/dt',
    temperature: '36.8°C',
    bloodPressure: '118/78 mm Hg',
    height: '160cm',
    weight: '54.5Kg',
    date: '20/03/2023'
  }
];

const PatientDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [notesCollapsed, setNotesCollapsed] = useState<boolean>(false);
  const [medicalRecordsCollapsed, setMedicalRecordsCollapsed] = useState<boolean>(false);
  const [medicationsCollapsed, setMedicationsCollapsed] = useState<boolean>(false);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [currentRecord, setCurrentRecord] = useState<MedicalRecord | null>(null);
  const [showAddRecordForm, setShowAddRecordForm] = useState<boolean>(false);

  useEffect(() => {
    // Mô phỏng việc lấy dữ liệu
    setLoading(true);
    setTimeout(() => {
      const foundPatient = patientsData.find(item => item.id === id);
      setPatient(foundPatient || null);
      setLoading(false);
    }, 500);
  }, [id]);

  const handleBack = () => {
    navigate('/admin/patients');
  };

  const toggleNotesCollapse = () => {
    setNotesCollapsed(!notesCollapsed);
  };

  const toggleMedicalRecordsCollapse = () => {
    setMedicalRecordsCollapsed(!medicalRecordsCollapsed);
  };

  const toggleMedicationsCollapse = () => {
    setMedicationsCollapsed(!medicationsCollapsed);
  };

  const getStatusTag = (status: string) => {
    return status === 'active' 
      ? <Tag color="green">Hoạt động</Tag>
      : <Tag color="red">Không hoạt động</Tag>;
  };

  const handleAddRecord = () => {
    setCurrentRecord(null);
    setShowAddRecordForm(true);
  };

  const handleEditRecord = (record: MedicalRecord) => {
    setCurrentRecord(record);
    setShowAddRecordForm(true);
  };

  if (loading) {
    return <div>Đang tải...</div>;
  }

  if (!patient) {
    return <div>Không tìm thấy thông tin bệnh nhân</div>;
  }

  return (
    <div className="patient-detail-page">
      {/* Tiêu đề và nút quay lại */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center">
          <Button 
            type="text" 
            icon={<ArrowLeftOutlined />} 
            onClick={handleBack}
            className="mr-4"
          />
          <Title level={2} className="m-0">Chi tiết bệnh nhân</Title>
        </div>
        <Button type="primary" icon={<EditOutlined />} onClick={() => setEditMode(!editMode)}>
          {editMode ? 'Lưu thay đổi' : 'Chỉnh sửa'}
        </Button>
      </div>

      <Row gutter={[24, 24]}>
        {/* Thông tin bệnh nhân */}
        <Col xs={24} lg={8}>
          <Card className="shadow-sm">
            <div className="text-center mb-4">
              <Avatar size={100} src={null} icon={<UserOutlined />} />
              <Title level={3} className="mt-4 mb-0">{patient.fullName}</Title>
              <Text type="secondary">{patient.gender === 'Male' ? 'Nam' : 'Nữ'}</Text>
              <div className="mt-2">
                {getStatusTag(patient.status)}
              </div>
            </div>

            <Divider />

            <Descriptions layout="vertical" column={1}>
              <Descriptions.Item label="Số điện thoại">
                <Space>
                  <PhoneOutlined />
                  <Text>{patient.phone}</Text>
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Email">
                <Space>
                  <MailOutlined />
                  <Text>{patient.email}</Text>
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Ngày sinh">
                <Space>
                  <CalendarOutlined />
                  <Text>{patient.birthdate}</Text>
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Địa chỉ">
                <Space align="start">
                  <HomeOutlined />
                  <Text>{patient.address}</Text>
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Ngày đăng ký">
                <Space>
                  <CalendarOutlined />
                  <Text>{patient.registeredDate}</Text>
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Mã bệnh án">
                <Space>
                  <FileTextOutlined />
                  <Text>{patient.medicalRecord}</Text>
                </Space>
              </Descriptions.Item>
            </Descriptions>

            <Divider />

            <div className="flex justify-center gap-2">
              <Button type="primary">Chỉnh sửa</Button>
              <Button danger>Vô hiệu hóa</Button>
            </div>
          </Card>
        </Col>

        {/* Thông tin chi tiết bệnh nhân */}
        <Col xs={24} lg={16}>
          {/* Chỉ số gần đây */}
          <div className="mb-5 rounded-lg overflow-hidden border border-gray-200">
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <div className="flex justify-between items-center">
                <Title level={4} className="m-0">Chỉ số gần đây</Title>
                <Text type="secondary">{vitalRecords[0].date}</Text>
              </div>
            </div>
            <Card className="shadow-sm border-0" bodyStyle={{ padding: '24px' }}>
              <Row gutter={[24, 24]}>
                <Col xs={24} sm={8}>
                  <div className="p-4 bg-gray-50 rounded-md border border-gray-100">
                    <Text strong>{vitalRecords[0].glucoseBefore}</Text>
                    <div>
                      <Text>Đường huyết</Text>
                    </div>
                    <div>
                      <Text type="secondary">Trước bữa ăn</Text>
                    </div>
                  </div>
                </Col>
                <Col xs={24} sm={8}>
                  <div className="p-4 bg-gray-50 rounded-md border border-gray-100">
                    <Text strong>{vitalRecords[0].temperature}</Text>
                    <div>
                      <Text>Nhiệt độ</Text>
                    </div>
                    <div>
                      <Text type="secondary">Hôm nay</Text>
                    </div>
                  </div>
                </Col>
                <Col xs={24} sm={8}>
                  <div className="p-4 bg-gray-50 rounded-md border border-gray-100">
                    <Text strong>{vitalRecords[0].bloodPressure}</Text>
                    <div>
                      <Text>Huyết áp</Text>
                    </div>
                    <div>
                      <Text type="secondary">Hôm nay</Text>
                    </div>
                  </div>
                </Col>
              </Row>
              <Divider />
              <Row gutter={[24, 24]}>
                <Col xs={24} sm={8}>
                  <div className="p-4 bg-gray-50 rounded-md border border-gray-100">
                    <Text strong>{vitalRecords[0].glucoseAfter}</Text>
                    <div>
                      <Text>Đường huyết</Text>
                    </div>
                    <div>
                      <Text type="secondary">Sau bữa ăn</Text>
                    </div>
                  </div>
                </Col>
                <Col xs={24} sm={8}>
                  <div className="p-4 bg-gray-50 rounded-md border border-gray-100">
                    <Text strong>{vitalRecords[0].height}</Text>
                    <div>
                      <Text>Chiều cao</Text>
                    </div>
                    <div>
                      <Text type="secondary">20/03/23</Text>
                    </div>
                  </div>
                </Col>
                <Col xs={24} sm={8}>
                  <div className="p-4 bg-gray-50 rounded-md border border-gray-100">
                    <Text strong>{vitalRecords[0].weight}</Text>
                    <div>
                      <Text>Cân nặng</Text>
                    </div>
                    <div>
                      <Text type="secondary">20/03/23</Text>
                    </div>
                  </div>
                </Col>
              </Row>
            </Card>
          </div>

          {/* Lịch sử khám bệnh */}
          <div className="mb-5 rounded-lg overflow-hidden border border-gray-200">
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <div className="flex justify-between items-center">
                <Title level={4} className="m-0">Lịch sử khám bệnh</Title>
                <div className="flex items-center">
                  <Button type="primary" size="small" onClick={handleAddRecord} className="mr-2">
                    Thêm bệnh án
                  </Button>
                  <Button 
                    type="text" 
                    icon={<ArrowLeftOutlined rotate={medicalRecordsCollapsed ? 270 : 90} />} 
                    onClick={toggleMedicalRecordsCollapse}
                    className="transition-all duration-300 ease-in-out hover:bg-gray-100 hover:scale-105"
                  />
                </div>
              </div>
            </div>
            <Card className="shadow-sm border-0" bodyStyle={{ padding: '24px' }}>
              <div 
                className={`transition-all duration-500 ease-in-out overflow-hidden ${
                  medicalRecordsCollapsed 
                    ? 'max-h-0 opacity-0 m-0 p-0' 
                    : 'max-h-[1000px] opacity-100'
                }`}
              >
                {showAddRecordForm ? (
                  <div className="p-4 bg-gray-50 rounded-md border border-gray-100 mb-4">
                    <Title level={5}>{currentRecord ? 'Chỉnh sửa bệnh án' : 'Thêm bệnh án mới'}</Title>
                    <Row gutter={[16, 16]}>
                      <Col span={12}>
                        <div className="mb-2">
                          <Text>Ngày khám</Text>
                          <DatePicker 
                            className="w-full mt-1" 
                            format="DD/MM/YYYY"
                            defaultValue={currentRecord ? dayjs(currentRecord.date, 'DD/MM/YYYY') : undefined}
                          />
                        </div>
                      </Col>
                      <Col span={12}>
                        <div className="mb-2">
                          <Text>Bác sĩ</Text>
                          <Input 
                            className="w-full mt-1" 
                            placeholder="Nhập tên bác sĩ" 
                            defaultValue={currentRecord?.doctor}
                          />
                        </div>
                      </Col>
                      <Col span={24}>
                        <div className="mb-2">
                          <Text>Chẩn đoán</Text>
                          <Input 
                            className="w-full mt-1" 
                            placeholder="Nhập chẩn đoán" 
                            defaultValue={currentRecord?.diagnosis}
                          />
                        </div>
                      </Col>
                      <Col span={24}>
                        <div className="mb-2">
                          <Text>Điều trị</Text>
                          <TextArea 
                            className="w-full mt-1" 
                            rows={4} 
                            placeholder="Nhập phương pháp điều trị" 
                            defaultValue={currentRecord?.treatment}
                          />
                        </div>
                      </Col>
                      <Col span={24} className="flex justify-end gap-2">
                        <Button onClick={() => setShowAddRecordForm(false)}>Hủy</Button>
                        <Button type="primary">Lưu</Button>
                      </Col>
                    </Row>
                  </div>
                ) : null}
                
                {sampleMedicalRecords.map((record) => (
                  <div key={record.id} className="p-4 bg-gray-50 rounded-md border border-gray-100 mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <Title level={5} className="m-0">{record.diagnosis}</Title>
                      <Space>
                        <Text type="secondary">{record.date}</Text>
                        <Button 
                          type="text" 
                          icon={<EditOutlined />} 
                          onClick={() => handleEditRecord(record)}
                        />
                      </Space>
                    </div>
                    <Divider className="my-2" />
                    <Descriptions column={1}>
                      <Descriptions.Item label="Bác sĩ">{record.doctor}</Descriptions.Item>
                      <Descriptions.Item label="Điều trị">{record.treatment}</Descriptions.Item>
                    </Descriptions>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Danh sách thuốc */}
          <div className="mb-5 rounded-lg overflow-hidden border border-gray-200">
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <div className="flex justify-between items-center">
                <Title level={4} className="m-0">Danh sách thuốc</Title>
                <Button 
                  type="text" 
                  icon={<ArrowLeftOutlined rotate={medicationsCollapsed ? 270 : 90} />} 
                  onClick={toggleMedicationsCollapse}
                  className="transition-all duration-300 ease-in-out hover:bg-gray-100 hover:scale-105"
                />
              </div>
            </div>
            <Card className="shadow-sm border-0" bodyStyle={{ padding: '24px' }}>
              <div 
                className={`transition-all duration-500 ease-in-out overflow-hidden ${
                  medicationsCollapsed 
                    ? 'max-h-0 opacity-0 m-0 p-0' 
                    : 'max-h-[500px] opacity-100'
                }`}
              >
                {sampleMedications.map((medication) => (
                  <div key={medication.id} className="p-4 bg-gray-50 rounded-md border border-gray-100 mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center">
                        <MedicineBoxOutlined className="mr-2 text-blue-500" />
                        <Title level={5} className="m-0">{medication.name} ({medication.dosage})</Title>
                      </div>
                    </div>
                    <Divider className="my-2" />
                    <Descriptions column={2}>
                      <Descriptions.Item label="Tần suất">{medication.frequency}</Descriptions.Item>
                      <Descriptions.Item label="Thời gian dùng">{medication.duration}</Descriptions.Item>
                      <Descriptions.Item label="Hướng dẫn" span={2}>{medication.instructions}</Descriptions.Item>
                    </Descriptions>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Ghi chú */}
          <div className="mb-5 rounded-lg overflow-hidden border border-gray-200">
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <div className="flex justify-between items-center">
                <Title level={4} className="m-0">Ghi chú</Title>
                <Button 
                  type="text" 
                  icon={<ArrowLeftOutlined rotate={notesCollapsed ? 270 : 90} />} 
                  onClick={toggleNotesCollapse}
                  className="transition-all duration-300 ease-in-out hover:bg-gray-100 hover:scale-105"
                />
              </div>
            </div>
            <Card className="shadow-sm border-0" bodyStyle={{ padding: '24px' }}>
              <div 
                className={`transition-all duration-500 ease-in-out overflow-hidden ${
                  notesCollapsed 
                    ? 'max-h-0 opacity-0 m-0 p-0' 
                    : 'max-h-[500px] opacity-100'
                }`}
              >
                <Collapse 
                  bordered={false} 
                  className="bg-transparent" 
                  defaultActiveKey={['1']}
                >
                  <Panel 
                    header={
                      <span className="transition-colors duration-300 hover:text-blue-500">
                        Lý do khám
                      </span>
                    } 
                    key="1" 
                    className="px-0 bg-transparent"
                  >
                    <Text>{patient.reason || "Không có thông tin"}</Text>
                  </Panel>
                  <Panel 
                    header={
                      <span className="transition-colors duration-300 hover:text-blue-500">
                        Ghi chú của bác sĩ
                      </span>
                    } 
                    key="2" 
                    className="px-0 bg-transparent"
                  >
                    <Text>Bệnh nhân có tiền sử bệnh gia đình về tim mạch. Cần theo dõi huyết áp và chế độ ăn uống.</Text>
                  </Panel>
                </Collapse>
              </div>
            </Card>
          </div>

          {/* Cuộc hẹn sắp tới */}
          <div className="mb-5 rounded-lg overflow-hidden border border-gray-200">
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <Title level={4} className="m-0">Cuộc hẹn sắp tới</Title>
            </div>
            <Card className="shadow-sm border-0" bodyStyle={{ padding: '24px' }}>
              <div className="text-center p-6">
                <Text>Không có cuộc hẹn nào sắp tới</Text>
              </div>
            </Card>
          </div>

          <div className="mt-10 text-right">
            <Button type="primary" size="large">Tạo cuộc hẹn mới</Button>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default PatientDetailPage; 