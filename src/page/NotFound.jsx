import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-pink-50 flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4">🔍</div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          404 - Không tìm thấy trang
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển.
        </p>
        <Link
          to="/"
          className="bg-gradient-to-r from-blue-600 to-pink-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-lg transform hover:scale-105 transition-all inline-block"
        >
          Về trang chủ
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
