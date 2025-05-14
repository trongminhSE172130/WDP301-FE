import React from 'react';
import { Link } from 'react-router-dom';

const UnderDevelopmentPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md text-center">
        <div className="mb-8">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-teal-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Trang đang phát triển</h1>
        
        <p className="text-lg text-gray-600 mb-8">
          Chức năng này đang được phát triển và sẽ sớm được ra mắt. 
          Vui lòng quay lại sau!
        </p>
        
        <div className="space-y-4">
          <Link 
            to="/" 
            className="block w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 px-4 rounded-md transition duration-200"
          >
            Quay về trang chủ
          </Link>
          
          <button 
            onClick={() => window.history.back()}
            className="block w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-4 rounded-md transition duration-200"
          >
            Quay lại trang trước
          </button>
        </div>
      </div>
    </div>
  );
};

export default UnderDevelopmentPage;