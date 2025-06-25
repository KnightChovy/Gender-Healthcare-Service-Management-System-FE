import React from 'react';
import { useState, useEffect } from 'react';

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

    return (
        <div className="notifications-section">
            <h2>Cài đặt thông báo</h2>

            <div className="notification-options">
                <label className="checkbox-label">
                    <input
                        type="checkbox"
                        name='notications.period'
                        checked={tempNotifications.period}
                        onChange={handleNotificationChange}
                    />
                    <span>Nhắc nhở kì kinh nguyệt</span>
                </label>

                <label className="checkbox-label">
                    <input
                        type='checkbox'
                        name='notifications.ovulation'
                        checked={tempNotifications.ovulation}
                        onChange={handleNotificationChange}
                    />
                    <span>Nhắc nhở kì rụng trứng</span>
                </label>

                <label className="checkbox-label">
                    <input
                        type='checkbox'
                        name='notifications.fertility'
                        checked={tempNotifications.fertility}
                        onChange={handleNotificationChange}
                    />
                    <span>Nhắc nhở cửa sổ thụ thai</span>
                </label>

                <label className="checkbox-label">
                    <input
                        type='checkbox'
                        name='notifications.birthControl'
                        checked={tempNotifications.birthControl}
                        onChange={handleNotificationChange}
                    />
                    <span>Nhắc nhở uống thuốc tránh thai</span>
                </label>
            </div>

            {hasChanges && (
                <div className="flex gap-4 mt-6">
                    <button
                        className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all"
                        onClick={handleSave}
                        title="Lưu cài đặt thông báo"
                    >
                        💾 Lưu
                    </button>
                    <button
                        className="bg-gray-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-gray-600 transition-colors"
                        onClick={handleCancel}
                        title="Hủy các thay đổi"
                    >
                        ❌ Hủy
                    </button>
                </div>
            )}
        </div>
    );
}

export default NotificationSettings;
