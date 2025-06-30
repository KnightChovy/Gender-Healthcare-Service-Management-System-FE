import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faClock } from '@fortawesome/free-solid-svg-icons';

function DateTimeSection({ formData, errors, onChange }) {
    const timeSlots = [
        '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
        '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
    ];

    const getMinDate = () => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    };

    const getMaxDate = () => {
        const maxDate = new Date();
        maxDate.setMonth(maxDate.getMonth() + 2);
        return maxDate.toISOString().split('T')[0];
    };

    return (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-100">
            {/* Section Header */}
            <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mr-3">
                    <FontAwesomeIcon icon={faCalendarAlt} className="text-white text-lg" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Thời gian hẹn</h3>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Date Selection */}
                <div className="space-y-3">
                    <label 
                        htmlFor="preferredDate" 
                        className="flex items-center text-sm font-semibold text-gray-700 mb-2"
                    >
                        <FontAwesomeIcon icon={faCalendarAlt} className="text-blue-500 mr-2" />
                        Ngày hẹn *
                    </label>
                    <div className="relative">
                        <input
                            type="date"
                            id="preferredDate"
                            name="preferredDate"
                            value={formData.preferredDate}
                            onChange={onChange}
                            min={getMinDate()}
                            max={getMaxDate()}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                                errors.preferredDate 
                                    ? 'border-red-300 bg-red-50 focus:ring-red-500 focus:border-red-500' 
                                    : 'border-gray-300 bg-white hover:border-blue-400'
                            }`}
                        />
                        {errors.preferredDate && (
                            <div className="absolute -bottom-6 left-0">
                                <span className="text-red-500 text-sm font-medium flex items-center">
                                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    {errors.preferredDate}
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Time Selection */}
                <div className="space-y-3">
                    <label 
                        htmlFor="preferredTime" 
                        className="flex items-center text-sm font-semibold text-gray-700 mb-2"
                    >
                        <FontAwesomeIcon icon={faClock} className="text-purple-500 mr-2" />
                        Giờ hẹn *
                    </label>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                        {timeSlots.map(time => (
                            <label
                                key={time}
                                className={`relative cursor-pointer group transition-all duration-200 ${
                                    formData.preferredTime === time 
                                        ? 'transform scale-105' 
                                        : 'hover:scale-102'
                                }`}
                            >
                                <input
                                    type="radio"
                                    name="preferredTime"
                                    value={time}
                                    checked={formData.preferredTime === time}
                                    onChange={onChange}
                                    className="sr-only"
                                />
                                <div className={`px-3 py-2 text-center text-sm font-medium rounded-lg border-2 transition-all duration-200 ${
                                    formData.preferredTime === time
                                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white border-transparent shadow-lg'
                                        : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700'
                                }`}>
                                    {time}
                                </div>
                                {formData.preferredTime === time && (
                                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                                )}
                            </label>
                        ))}
                    </div>
                    {errors.preferredTime && (
                        <div className="mt-2">
                            <span className="text-red-500 text-sm font-medium flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                {errors.preferredTime}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* Helper Text */}
            <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                <div className="flex items-start space-x-2">
                    <svg className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <div className="text-sm text-gray-700">
                        <p className="font-medium text-blue-700 mb-1">Lưu ý quan trọng:</p>
                        <ul className="space-y-1 text-gray-600">
                            <li>• Bạn chỉ có thể đặt lịch trong vòng 2 tháng tới</li>
                            <li>• Khung giờ 11:30 - 13:30 là giờ nghỉ trưa</li>
                            <li>• Vui lòng có mặt trước 15 phút so với giờ hẹn</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DateTimeSection;