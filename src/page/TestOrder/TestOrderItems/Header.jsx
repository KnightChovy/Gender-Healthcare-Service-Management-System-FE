import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFlask } from '@fortawesome/free-solid-svg-icons';

function Header() {
    return (
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8">
            <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <FontAwesomeIcon icon={faFlask} className="text-3xl" />
                </div>
            </div>
            <h1 className="text-3xl font-bold text-center mb-2">Đăng Ký Lịch Xét Nghiệm</h1>
            <p className="text-center text-blue-100">Vui lòng điền đầy đủ thông tin để đăng ký lịch xét nghiệm</p>
        </div>
    );
}

export default Header;
