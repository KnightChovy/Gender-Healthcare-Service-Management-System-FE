import React from "react";
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faPhone, faEnvelope, faCalendarAlt, faVenus, faMars } from '@fortawesome/free-solid-svg-icons';

function PersonalInfoSection({formData, errors, onChange}) {
    return (  
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-100">
            {/* Section Header */}
            <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mr-3">
                    <FontAwesomeIcon icon={faUser} className="text-white text-lg" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Thông tin cá nhân</h3>
            </div>

            <div className="space-y-6">
                {/* First Row - Name and Phone */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label 
                            htmlFor="fullName" 
                            className="flex items-center text-sm font-semibold text-gray-700 mb-2"
                        >
                            <FontAwesomeIcon icon={faUser} className="text-blue-500 mr-2" />
                            Họ và tên *
                        </label>
                        <input
                            type="text"
                            id="fullName"
                            name="fullName"
                            value={formData.fullName}
                            onChange={onChange}
                            placeholder="Nhập họ và tên đầy đủ"
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                                errors.fullName 
                                    ? 'border-red-300 bg-red-50 focus:ring-red-500 focus:border-red-500' 
                                    : 'border-gray-300 bg-white hover:border-blue-400'
                            }`}
                        />
                        {errors.fullName && (
                            <span className="text-red-500 text-sm font-medium flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                {errors.fullName}
                            </span>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label 
                            htmlFor="phone" 
                            className="flex items-center text-sm font-semibold text-gray-700 mb-2"
                        >
                            <FontAwesomeIcon icon={faPhone} className="text-green-500 mr-2" />
                            Số điện thoại *
                        </label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={onChange}
                            placeholder="0123456789"
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 ${
                                errors.phone 
                                    ? 'border-red-300 bg-red-50 focus:ring-red-500 focus:border-red-500' 
                                    : 'border-gray-300 bg-white hover:border-green-400'
                            }`}
                        />
                        {errors.phone && (
                            <span className="text-red-500 text-sm font-medium flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                {errors.phone}
                            </span>
                        )}
                    </div>
                </div>

                {/* Second Row - Email and Birth Date */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label 
                            htmlFor="email" 
                            className="flex items-center text-sm font-semibold text-gray-700 mb-2"
                        >
                            <FontAwesomeIcon icon={faEnvelope} className="text-purple-500 mr-2" />
                            Email *
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={onChange}
                            placeholder="example@email.com"
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 ${
                                errors.email 
                                    ? 'border-red-300 bg-red-50 focus:ring-red-500 focus:border-red-500' 
                                    : 'border-gray-300 bg-white hover:border-purple-400'
                            }`}
                        />
                        {errors.email && (
                            <span className="text-red-500 text-sm font-medium flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                {errors.email}
                            </span>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label 
                            htmlFor="birthDate" 
                            className="flex items-center text-sm font-semibold text-gray-700 mb-2"
                        >
                            <FontAwesomeIcon icon={faCalendarAlt} className="text-orange-500 mr-2" />
                            Ngày sinh *
                        </label>
                        <input
                            type="date"
                            id="birthDate"
                            name="birthDate"
                            value={formData.birthDate}
                            onChange={onChange}
                            max={new Date().toISOString().split('T')[0]}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 ${
                                errors.birthDate 
                                    ? 'border-red-300 bg-red-50 focus:ring-red-500 focus:border-red-500' 
                                    : 'border-gray-300 bg-white hover:border-orange-400'
                            }`}
                        />
                        {errors.birthDate && (
                            <span className="text-red-500 text-sm font-medium flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                {errors.birthDate}
                            </span>
                        )}
                    </div>
                </div>

                {/* Gender Selection */}
                <div className="space-y-2">
                    <label 
                        className="flex items-center text-sm font-semibold text-gray-700 mb-2"
                    >
                        <FontAwesomeIcon icon={faVenus} className="text-pink-500 mr-2" />
                        Giới tính *
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <label className={`relative cursor-pointer group transition-all duration-200 ${
                            formData.gender === 'female' ? 'transform scale-105' : 'hover:scale-102'
                        }`}>
                            <input
                                type="radio"
                                id="gender-female"
                                name="gender"
                                value="female"
                                checked={formData.gender === 'female'}
                                onChange={onChange}
                                className="sr-only"
                            />
                            <div className={`flex items-center justify-center p-4 border-2 rounded-lg transition-all duration-200 ${
                                formData.gender === 'female'
                                    ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white border-transparent shadow-lg'
                                    : 'bg-white text-gray-700 border-gray-300 hover:border-pink-400 hover:bg-pink-50'
                            }`}>
                                <FontAwesomeIcon icon={faVenus} className="mr-2" />
                                <span className="font-medium">Nữ</span>
                            </div>
                            {formData.gender === 'female' && (
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                            )}
                        </label>

                        <label className={`relative cursor-pointer group transition-all duration-200 ${
                            formData.gender === 'male' ? 'transform scale-105' : 'hover:scale-102'
                        }`}>
                            <input
                                type="radio"
                                name="gender"
                                value="male"
                                checked={formData.gender === 'male'}
                                onChange={onChange}
                                className="sr-only"
                            />
                            <div className={`flex items-center justify-center p-4 border-2 rounded-lg transition-all duration-200 ${
                                formData.gender === 'male'
                                    ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-transparent shadow-lg'
                                    : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                            }`}>
                                <FontAwesomeIcon icon={faMars} className="mr-2" />
                                <span className="font-medium">Nam</span>
                            </div>
                            {formData.gender === 'male' && (
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                            )}
                        </label>
                    </div>
                    {errors.gender && (
                        <span className="text-red-500 text-sm font-medium flex items-center mt-2">
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            {errors.gender}
                        </span>
                    )}
                </div>
            </div>

            {/* Helper Text */}
            <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                <div className="flex items-start space-x-2">
                    <svg className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <div className="text-sm text-gray-700">
                        <p className="font-medium text-blue-700 mb-1">Thông tin cá nhân:</p>
                        <ul className="space-y-1 text-gray-600">
                            <li>• Thông tin này sẽ được sử dụng để liên hệ xác nhận lịch hẹn</li>
                            <li>• Dữ liệu cá nhân được bảo mật theo quy định pháp luật</li>
                            <li>• Vui lòng kiểm tra kỹ thông tin trước khi gửi</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

PersonalInfoSection.propTypes = {
    formData: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
};

export default PersonalInfoSection;