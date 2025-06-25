import React from 'react';

function Header({ isLoggedIn }) {
    return (
        <div className="text-center mb-8 bg-white rounded-xl shadow-lg p-8 mx-4">
            <h1 className="text-3xl font-bold text-gray-800 mb-4 flex items-center justify-center gap-2">
                📅 Đặt lịch hẹn tư vấn
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                {isLoggedIn
                    ? 'Chào mừng bạn! Hãy chọn dịch vụ và thời gian phù hợp.'
                    : 'Đăng nhập để đặt lịch nhanh chóng hoặc nhập thông tin bên dưới.'
                }
            </p>
        </div>
    );
}

export default Header;