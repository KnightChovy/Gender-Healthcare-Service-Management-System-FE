import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faBell, 
    faCircle, 
    faCheck, 
    faMoneyBillWave,
    faCalendarCheck,
    faTrash,
    faTimes
} from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames/bind';
import styles from './NotificationBell.module.scss';

const cx = classNames.bind(styles);

function NotificationBell() {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const dropdownRef = useRef(null);

    // Load notifications từ localStorage
    const loadNotifications = useCallback(() => {
        try {
            let notifications = [];
            
            // Load existing notifications
            const saved = localStorage.getItem('notificationHistory');
            if (saved) {
                notifications = JSON.parse(saved) || [];
            }

            // Check pending appointment - CHỈ tạo thông báo xác nhận
            const pendingAppointment = localStorage.getItem('pendingAppointment');
            if (pendingAppointment) {
                const appointmentData = JSON.parse(pendingAppointment);
                
                if (appointmentData.id && appointmentData.status === 'pending_confirmation') {
                    // CHỈ tạo confirmation notification
                    const confirmNotifId = `confirm_${appointmentData.id}`;
                    const hasConfirmNotif = notifications.some(n => n.id === confirmNotifId);
                    
                    if (!hasConfirmNotif) {
                        const confirmNotification = {
                            id: confirmNotifId,
                            type: 'appointment_pending',
                            title: 'Lịch hẹn đã được gửi',
                            message: `Lịch hẹn ${appointmentData.consultationType} đã được gửi. Vui lòng đợi xác nhận từ phía quản lý.`,
                            timestamp: Date.now(),
                            isRead: false,
                            appointmentId: appointmentData.id
                        };
                        notifications.unshift(confirmNotification);
                    }
                }
            }

            // Check for manager-confirmed appointments - CHỈ khi manager xác nhận mới tạo payment notification
            const confirmedAppointment = localStorage.getItem('confirmedAppointment');
            if (confirmedAppointment) {
                const appointmentData = JSON.parse(confirmedAppointment);
                
                if (appointmentData.id && appointmentData.fee && appointmentData.status === 'confirmed') {
                    // Tạo payment notification khi manager đã xác nhận
                    const paymentNotifId = `payment_${appointmentData.id}`;
                    const hasPaymentNotif = notifications.some(n => n.id === paymentNotifId);
                    
                    if (!hasPaymentNotif) {
                        const paymentNotification = {
                            id: paymentNotifId,
                            type: 'payment_required',
                            title: 'Lịch hẹn đã được xác nhận - Yêu cầu thanh toán',
                            message: `Lịch hẹn ${appointmentData.consultationType} đã được xác nhận. Vui lòng thanh toán ${formatCurrency(appointmentData.fee)} để hoàn tất.`,
                            timestamp: Date.now(),
                            isRead: false,
                            amount: appointmentData.fee,
                            appointmentId: appointmentData.id
                        };
                        notifications.unshift(paymentNotification);
                    }
                }
            }

            // Sort by timestamp
            notifications.sort((a, b) => b.timestamp - a.timestamp);

            setNotifications(notifications);
            setUnreadCount(notifications.filter(n => !n.isRead).length);

            // Save back to localStorage
            localStorage.setItem('notificationHistory', JSON.stringify(notifications));

        } catch (error) {
            console.error('Error loading notifications:', error);
        }
    }, []);

    // Initialize
    useEffect(() => {
        loadNotifications();
    }, [loadNotifications]);

    // Listen for storage changes
    useEffect(() => {
        const handleStorageChange = () => loadNotifications();
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [loadNotifications]);

    // Close dropdown when click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [isOpen]);

    const toggleDropdown = () => setIsOpen(!isOpen);

    const markAsRead = (notificationId) => {
        const updated = notifications.map(n => 
            n.id === notificationId ? { ...n, isRead: true } : n
        );
        setNotifications(updated);
        setUnreadCount(updated.filter(n => !n.isRead).length);
        localStorage.setItem('notificationHistory', JSON.stringify(updated));
    };

    const markAllAsRead = () => {
        const updated = notifications.map(n => ({ ...n, isRead: true }));
        setNotifications(updated);
        setUnreadCount(0);
        localStorage.setItem('notificationHistory', JSON.stringify(updated));
    };

    const deleteNotification = (notificationId, event) => {
        event.stopPropagation();
        const updated = notifications.filter(n => n.id !== notificationId);
        setNotifications(updated);
        setUnreadCount(updated.filter(n => !n.isRead).length);
        localStorage.setItem('notificationHistory', JSON.stringify(updated));
    };

    const handleNotificationClick = (notification) => {
        if (!notification.isRead) {
            markAsRead(notification.id);
        }

        // CHỈ cho phép thanh toán khi có thông báo payment_required
        if (notification.type === 'payment_required') {
            navigate('/paymentappointment');
        }
        // Không làm gì với thông báo pending - chỉ hiển thị thông tin
        
        setIsOpen(false);
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    const formatTime = (timestamp) => {
        const diff = Date.now() - timestamp;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return 'Vừa xong';
        if (minutes < 60) return `${minutes} phút trước`;
        if (hours < 24) return `${hours} giờ trước`;
        return `${days} ngày trước`;
    };

    const getIcon = (type) => {
        switch(type) {
            case 'payment_required': return faMoneyBillWave;
            case 'appointment_pending': return faCalendarCheck;
            default: return faCalendarCheck;
        }
    };

    const getColor = (type) => {
        switch(type) {
            case 'payment_required': return 'warning';
            case 'appointment_pending': return 'info';
            default: return 'success';
        }
    };

    return (
        <div className={cx('notification-bell')} ref={dropdownRef}>
            <button 
                className={cx('bell-button')}
                onClick={toggleDropdown}
                title="Thông báo"
            >
                <FontAwesomeIcon icon={faBell} />
                {unreadCount > 0 && (
                    <span className={cx('badge')}>
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className={cx('dropdown')}>
                    <div className={cx('header')}>
                        <h3>Thông báo</h3>
                        <div className={cx('actions')}>
                            {unreadCount > 0 && (
                                <button onClick={markAllAsRead} title="Đánh dấu tất cả đã đọc">
                                    <FontAwesomeIcon icon={faCheck} />
                                </button>
                            )}
                            <button onClick={() => setIsOpen(false)} title="Đóng">
                                <FontAwesomeIcon icon={faTimes} />
                            </button>
                        </div>
                    </div>

                    <div className={cx('list')}>
                        {notifications.length > 0 ? (
                            notifications.map(notification => (
                                <div
                                    key={notification.id}
                                    className={cx('item', {
                                        'unread': !notification.isRead,
                                        [getColor(notification.type)]: true
                                    })}
                                    onClick={() => handleNotificationClick(notification)}
                                >
                                    {!notification.isRead && (
                                        <div className={cx('dot')}>
                                            <FontAwesomeIcon icon={faCircle} />
                                        </div>
                                    )}

                                    <div className={cx('icon')}>
                                        <FontAwesomeIcon icon={getIcon(notification.type)} />
                                    </div>

                                    <div className={cx('content')}>
                                        <h4>{notification.title}</h4>
                                        <p>{notification.message}</p>
                                        {notification.amount && (
                                            <div className={cx('amount')}>
                                                <strong>{formatCurrency(notification.amount)}</strong>
                                                <span>💳 Nhấn để thanh toán</span>
                                            </div>
                                        )}
                                        <span className={cx('time')}>{formatTime(notification.timestamp)}</span>
                                    </div>

                                    <button
                                        className={cx('delete')}
                                        onClick={(e) => deleteNotification(notification.id, e)}
                                        title="Xóa"
                                    >
                                        <FontAwesomeIcon icon={faTrash} />
                                    </button>
                                </div>
                            ))
                        ) : (
                            <div className={cx('empty')}>
                                <FontAwesomeIcon icon={faBell} />
                                <p>Không có thông báo nào</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default NotificationBell;