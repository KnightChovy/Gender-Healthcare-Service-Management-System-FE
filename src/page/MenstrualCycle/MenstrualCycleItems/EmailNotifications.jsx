import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';

function EmailNotifications({ cycleData }) {
    const [scheduledNotifications, setScheduledNotifications] = useState([]);

    const loadScheduledNotifications = useCallback(() => {
        const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
        const cycleNotifications = notifications.filter(notif => 
            (notif.type === 'period' || notif.type === 'ovulation') && 
            notif.email === cycleData.email
        );
        
        // Sort by scheduled date
        cycleNotifications.sort((a, b) => new Date(a.scheduledDate) - new Date(b.scheduledDate));
        setScheduledNotifications(cycleNotifications);
    }, [cycleData.email]);

    useEffect(() => {
        loadScheduledNotifications();
    }, [loadScheduledNotifications]);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getNotificationIcon = (type) => {
        return type === 'period' ? '🩸' : '🥚';
    };

    const getNotificationColor = (type) => {
        return type === 'period' ? 'from-red-100 to-pink-100 border-red-200' : 'from-green-100 to-teal-100 border-green-200';
    };

    const deleteNotification = (notificationId) => {
        const allNotifications = JSON.parse(localStorage.getItem('notifications') || '[]');
        const updatedNotifications = allNotifications.filter(notif => notif.id !== notificationId);
        localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
        loadScheduledNotifications();
    };

    if (!cycleData.email) {
        return (
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">📧 Thông báo Email</h2>
                <div className="text-center py-8">
                    <div className="text-gray-400 text-4xl mb-4">📬</div>
                    <p className="text-gray-600">Vui lòng nhập email và lưu thông tin để thiết lập thông báo</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">📧 Thông báo Email đã lên lịch</h2>
            
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                    <strong>Email nhận thông báo:</strong> {cycleData.email}
                </p>
            </div>

            {scheduledNotifications.length === 0 ? (
                <div className="text-center py-8">
                    <div className="text-gray-400 text-4xl mb-4">📭</div>
                    <p className="text-gray-600">Chưa có thông báo nào được lên lịch</p>
                    <p className="text-sm text-gray-500 mt-2">Lưu thông tin chu kỳ để tự động thiết lập thông báo</p>
                </div>
            ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                    {scheduledNotifications.map((notification) => (
                        <div 
                            key={notification.id} 
                            className={`bg-gradient-to-r ${getNotificationColor(notification.type)} border rounded-lg p-4 flex items-start justify-between`}
                        >
                            <div className="flex-1">
                                <div className="flex items-center mb-2">
                                    <span className="text-xl mr-2">{getNotificationIcon(notification.type)}</span>
                                    <h4 className="font-semibold text-gray-800">{notification.title}</h4>
                                </div>
                                <p className="text-sm text-gray-700 mb-2">{notification.message}</p>
                                <p className="text-xs text-gray-600">
                                    <strong>Gửi vào:</strong> {formatDate(notification.scheduledDate)}
                                </p>
                            </div>
                            <button
                                onClick={() => deleteNotification(notification.id)}
                                className="ml-3 text-red-600 hover:text-red-800 transition-colors"
                                title="Xóa thông báo"
                            >
                                ❌
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {scheduledNotifications.length > 0 && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800">
                        <strong>💡 Lưu ý:</strong> Thông báo email sẽ được gửi tự động vào thời gian đã lên lịch. 
                        Trong ứng dụng thực tế, cần tích hợp với dịch vụ email như SendGrid, Mailgun, hoặc SMTP.
                    </p>
                </div>
            )}
        </div>
    );
}

EmailNotifications.propTypes = {
    cycleData: PropTypes.shape({
        email: PropTypes.string
    }).isRequired
};

export default EmailNotifications;
