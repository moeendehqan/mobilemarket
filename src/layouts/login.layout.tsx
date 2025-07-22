



import React from 'react';

const LoginLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
      <div className="absolute top-0 left-0 w-full h-64 bg-blue-500 transform -skew-y-6 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-75"></div>
        <div className="absolute inset-0 bg-grid-white/[0.2] bg-grid-8"></div>
      </div>
      
      <div className="w-full max-w-md space-y-8 relative z-10">
        <div className="text-center">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-2">موبایل مارکت</h2>
          <p className="text-sm text-gray-600 mb-8">خرید و فروش موبایل</p>
        </div>
        
        <div className="bg-white py-8 px-4 shadow-2xl sm:rounded-xl sm:px-10 border border-gray-100">
          {children}
        </div>
        
        <div className="text-center mt-4">
          <p className="text-xs text-gray-500">
            تمامی حقوق محفوظ است © {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginLayout;


