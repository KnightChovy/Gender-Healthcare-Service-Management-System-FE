import React from 'react';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faCheck, faTimes, faSave } from '@fortawesome/free-solid-svg-icons';

function NotificationSettings({ notifications, onNotificationChange }) {
    const [tempNotifications, setTempNotifications] = useState(notifications);
    const [hasChanges, setHasChanges] = useState(false);

    useEffect(() => {
        setTempNotifications(notifications);
        setHasChanges(false);
    }, [notifications]);
    
    const handleNotificationChange = (e) => {
        const { name, checked } = e.target;
        const notificationKey = name.split('.')[1];

        const newNotifications = {
            ...tempNotifications,
            [notificationKey]: checked
        };

        setTempNotifications(newNotifications);
        setHasChanges(true);
    };

    const handleSave = () => {
        onNotificationChange({
            notifications: tempNotifications
        });
        setHasChanges(false);
        alert('✅ Cài đặt thông báo đã được lưu!');
    };

    const handleCancel = () => {
        setTempNotifications(notifications);
        setHasChanges(false);
    };

    const notificationOptions = [
        {
            key: 'period',
            name: 'notifications.period',
            label: 'Nhắc nhở kì kinh nguyệt',
            icon: '🩸',
            color: 'from-red-500 to-pink-500'
        },
        {
            key: 'ovulation',
            name: 'notifications.ovulation',
            label: 'Nhắc nhở kì rụng trứng',
            icon: '🥚',
            color: 'from-yellow-500 to-orange-500'
        },
        {
            key: 'fertility',
            name: 'notifications.fertility',
            label: 'Nhắc nhở cửa sổ thụ thai',
            icon: '🌸',
            color: 'from-green-500 to-teal-500'
        },
        {
            key: 'birthControl',
            name: 'notifications.birthControl',
            label: 'Nhắc nhở uống thuốc tránh thai',
            icon: '💊',
            color: 'from-blue-500 to-purple-500'
        }
    ];

    return (
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            {/* Section Header */}
            <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mr-3">
                    <FontAwesomeIcon icon={faBell} className="text-white text-lg" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">Cài đặt thông báo</h2>
            </div>

            {/* Notification Options */}
            <div className="space-y-4">
                {notificationOptions.map((option) => (
                    <label 
                        key={option.key}
                        className="flex items-center p-4 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all duration-200 cursor-pointer group"
                    >
                        <div className="flex items-center flex-1">
                            <div className="text-2xl mr-3">{option.icon}</div>
                            <div className="flex-1">
                                <span className="text-gray-800 font-medium group-hover:text-purple-700 transition-colors">
                                    {option.label}
                                </span>
                            </div>
                        </div>
                        
                        {/* Custom Toggle Switch */}
                        <div className="relative">
                            <input
                                type="checkbox"
                                name={option.name}
                                checked={tempNotifications[option.key]}
                                onChange={handleNotificationChange}
                                className="sr-only"
                            />
                            <div className={`w-12 h-6 rounded-full transition-all duration-300 ${
                                tempNotifications[option.key] 
                                    ? `bg-gradient-to-r ${option.color}` 
                                    : 'bg-gray-300'
                            }`}>
                                <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 mt-0.5 ${
                                    tempNotifications[option.key] ? 'translate-x-6' : 'translate-x-0.5'
                                }`}>
                                    {tempNotifications[option.key] && (
                                        <FontAwesomeIcon 
                                            icon={faCheck} 
                                            className="text-green-500 text-xs absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" 
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                    </label>
                ))}
            </div>

            {/* Action Buttons */}
            {hasChanges && (
                <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-blue-700">
                            <FontAwesomeIcon icon={faBell} className="mr-2" />
                            Bạn có thay đổi chưa được lưu
                        </div>
                        <div className="flex gap-3">
                            <button
                                className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center space-x-2"
                                onClick={handleSave}
                                title="Lưu cài đặt thông báo"
                            >
                                <FontAwesomeIcon icon={faSave} />
                                <span>Lưu</span>
                            </button>
                            <button
                                className="bg-gray-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-gray-600 transition-colors duration-200 flex items-center space-x-2"
                                onClick={handleCancel}
                                title="Hủy các thay đổi"
                            >
                                <FontAwesomeIcon icon={faTimes} />
                                <span>Hủy</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Helper Text */}
            <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                <div className="flex items-start space-x-2">
                    <svg className="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <div className="text-sm text-gray-700">
                        <p className="font-medium text-purple-700 mb-1">Lưu ý về thông báo:</p>
                        <ul className="space-y-1 text-gray-600">
                            <li>• Thông báo sẽ được gửi qua email hoặc SMS</li>
                            <li>• Bạn có thể tắt/bật thông báo bất kỳ lúc nào</li>
                            <li>• Thông báo giúp bạn theo dõi chu kỳ tốt hơn</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default NotificationSettings;
