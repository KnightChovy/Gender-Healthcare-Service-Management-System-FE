import React from 'react';
import { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from '../../../assets/MenstrualCycle.module.scss';

const cx = classNames.bind(styles);

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
        <div className={cx('notifications-section')}>
            <h2>Cài đặt thông báo</h2>

            <div className={cx('notification-options')}>
                <label className={cx('checkbox-label')}>
                    <input
                        type="checkbox"
                        name='notications.period'
                        checked={tempNotifications.period}
                        onChange={handleNotificationChange}
                    />
                    <span>Nhắc nhở kì kinh nguyệt</span>
                </label>

                <label className={cx('checkbox-label')}>
                    <input
                        type='checkbox'
                        name='notifications.ovulation'
                        checked={tempNotifications.ovulation}
                        onChange={handleNotificationChange}
                    />
                    <span>Nhắc nhở kì rụng trứng</span>
                </label>

                <label className={cx('checkbox-label')}>
                    <input
                        type='checkbox'
                        name='notifications.fertility'
                        checked={tempNotifications.fertility}
                        onChange={handleNotificationChange}
                    />
                    <span>Nhắc nhở cửa sổ thụ thai</span>
                </label>

                <label className={cx('checkbox-label')}>
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
                <div className={cx("notification-actions")}>
                    <button
                        className={cx("save-btn")}
                        onClick={handleSave}
                        title="Lưu cài đặt thông báo"
                    >
                        💾 Lưu
                    </button>
                    <button
                        className={cx("cancel-btn")}
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
