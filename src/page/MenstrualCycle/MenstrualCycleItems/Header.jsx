import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faHeart } from '@fortawesome/free-solid-svg-icons';

function Header() {
    return (
        <header className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white py-12 px-6 rounded-3xl mr-3 ml-3">
            <div className="max-w-4xl mx-auto text-center">
                {/* Icon Section */}
                <div className="flex justify-center mb-6">
                    <div className="relative">
                        <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white border-opacity-30">
                            <FontAwesomeIcon icon={faCalendarAlt} className="text-3xl text-black" />
                        </div>
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-pink-400 rounded-full flex items-center justify-center">
                            <FontAwesomeIcon icon={faHeart} className="text-xs text-white" />
                        </div>
                    </div>
                </div>

                {/* Title */}
                <h1 className="text-4xl lg:text-5xl font-bold mb-4 tracking-tight">
                    Theo dõi chu kỳ
                    <span className="block text-2xl lg:text-3xl font-medium mt-2 text-pink-100">
                        kinh nguyệt
                    </span>
                </h1>

                {/* Description */}
                <p className="text-lg lg:text-xl text-pink-100 mb-6 max-w-2xl mx-auto leading-relaxed">
                    Quản lý và theo dõi chu kỳ kinh nguyệt của bạn một cách khoa học và an toàn
                </p>

                {/* Feature Pills */}
                <div className="flex flex-wrap justify-center gap-3 mt-8">
                    <span className="bg-white bg-opacity-20 text-black px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm border border-white border-opacity-30">
                        📅 Dự đoán chu kỳ
                    </span>
                    <span className="bg-white bg-opacity-20 text-black px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm border border-white border-opacity-30">
                        🥚 Theo dõi rụng trứng
                    </span>
                    <span className="bg-white bg-opacity-20 text-black px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm border border-white border-opacity-30">
                        🔔 Thông báo thông minh
                    </span>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-4 left-4 w-20 h-20 bg-pink-400 bg-opacity-10 rounded-full blur-xl"></div>
                <div className="absolute bottom-4 right-4 w-32 h-32 bg-purple-400 bg-opacity-10 rounded-full blur-xl"></div>
            </div>
        </header>
    );
}

export default Header;
