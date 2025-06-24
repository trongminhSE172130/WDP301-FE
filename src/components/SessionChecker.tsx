import React, { useEffect, useState } from 'react';
import { SessionManager } from '../utils/sessionManager';
import { Modal, Button } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

interface SessionCheckerProps {
  children: React.ReactNode;
}

const SessionChecker: React.FC<SessionCheckerProps> = ({ children }) => {
  const [warningVisible, setWarningVisible] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);

  useEffect(() => {
    // Kiểm tra session mỗi 30 giây
    const sessionCheckInterval = setInterval(() => {
      if (!SessionManager.isSessionValid()) {
        // Session đã hết hạn, redirect
        handleSessionExpired();
        return;
      }

      // Kiểm tra session sắp hết hạn (còn < 5 phút)
      if (SessionManager.isSessionExpiringSoon()) {
        const remaining = SessionManager.getTimeRemaining();
        setTimeRemaining(Math.floor(remaining / 1000)); // Convert to seconds
        setWarningVisible(true);
      }
    }, 30 * 1000); // 30 giây

    // Cleanup interval
    return () => clearInterval(sessionCheckInterval);
  }, []);

  // Countdown timer cho warning modal
  useEffect(() => {
    if (warningVisible && timeRemaining > 0) {
      const countdown = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            clearInterval(countdown);
            handleSessionExpired();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(countdown);
    }
  }, [warningVisible, timeRemaining]);

  const handleSessionExpired = () => {
    SessionManager.clearSession();
    
    // Ẩn warning modal nếu đang hiển thị
    setWarningVisible(false);
    
    // Redirect based on current path
    const currentPath = window.location.pathname;
    if (currentPath.startsWith('/admin') || currentPath.startsWith('/consultant')) {
      window.location.href = '/admin/login';
    } else {
      window.location.href = '/login';
    }
  };

  const handleExtendSession = () => {
    if (SessionManager.extendSession()) {
      setWarningVisible(false);
      setTimeRemaining(0);
    } else {
      handleSessionExpired();
    }
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <>
      {children}
      
      <Modal
        title={
          <div className="flex items-center">
            <ExclamationCircleOutlined className="text-yellow-500 mr-2" />
            <span>Phiên đăng nhập sắp hết hạn</span>
          </div>
        }
        open={warningVisible}
        onCancel={handleSessionExpired}
        closable={false}
        maskClosable={false}
        footer={[
          <Button key="logout" onClick={handleSessionExpired}>
            Đăng xuất
          </Button>,
          <Button key="extend" type="primary" onClick={handleExtendSession}>
            Gia hạn phiên
          </Button>,
        ]}
      >
        <div className="text-center py-4">
          <p className="mb-4">
            Phiên đăng nhập của bạn sẽ hết hạn trong:
          </p>
          <div className="text-2xl font-bold text-red-500 mb-4">
            {formatTime(timeRemaining)}
          </div>
          <p className="text-gray-600">
            Bạn có muốn gia hạn phiên đăng nhập không?
          </p>
        </div>
      </Modal>
    </>
  );
};

export default SessionChecker; 