import React, { useState } from 'react';
import { Layout, Typography } from 'antd';
import PatientFilter from '../../components/admin/patient/PatientFilter';
import PatientTable from '../../components/admin/patient/PatientTable';
import PatientForm from '../../components/admin/patient/PatientForm';
import { patientsData } from '../../components/admin/patient/PatientData';
import type { Patient } from '../../components/admin/patient/PatientTypes';
import type { PatientFilterValues } from '../../components/admin/patient/PatientFilter';

const { Content } = Layout;
const { Title } = Typography;

const PatientPage: React.FC = () => {
  const [patients] = useState<Patient[]>(patientsData);
  const [loading] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | undefined>(undefined);
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false);

  const handleSearch = (values: PatientFilterValues) => {
    console.log('Tìm kiếm:', values);
    // Implement search logic here
  };

  const handleAdd = () => {
    setSelectedPatient(undefined);
    setModalVisible(true);
  };

  const handleEdit = (patientId: string) => {
    const patient = patients.find(p => p.id === patientId);
    if (patient) {
      setSelectedPatient(patient);
      setModalVisible(true);
    }
  };

  const handleFormSubmit = (values: Omit<Patient, 'id' | 'registeredDate'>) => {
    setConfirmLoading(true);
    console.log('Form submitted:', values);
    
    // Simulate API call
    setTimeout(() => {
      setConfirmLoading(false);
      setModalVisible(false);
    }, 1000);
  };

  const handleFormCancel = () => {
    setModalVisible(false);
  };

  return (
    <Content style={{ padding: '20px' }}>
      <Title level={2} style={{ marginBottom: '20px' }}>Quản lý bệnh nhân</Title>
      
      <PatientFilter onSearch={handleSearch} onAdd={handleAdd} />
      
      <PatientTable 
        data={patients} 
        loading={loading}
        onEdit={handleEdit} 
      />
      
      <PatientForm
        visible={modalVisible}
        onCancel={handleFormCancel}
        onSubmit={handleFormSubmit}
        initialValues={selectedPatient}
        title={selectedPatient ? 'Chỉnh sửa bệnh nhân' : 'Thêm bệnh nhân mới'}
        confirmLoading={confirmLoading}
      />
    </Content>
  );
};

export default PatientPage; 