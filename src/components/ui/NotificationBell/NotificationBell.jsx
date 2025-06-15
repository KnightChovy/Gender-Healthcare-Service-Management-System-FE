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

            // Check pending appointment
            const pendingAppointment = localStorage.getItem('pendingAppointment');
            if (pendingAppointment) {
                const appointmentData = JSON.parse(pendingAppointment);
                
                if (appointmentData.id && appointmentData.fee && appointmentData.status === 'pending_confirmation') {
                    // Tạo payment notification nếu chưa có
                    const paymentNotifId = `payment_${appointmentData.id}`;
                    const hasPaymentNotif = notifications.some(n => n.id === paymentNotifId);
                    
                    if (!hasPaymentNotif) {
                        const paymentNotification = {
                            id: paymentNotifId,
                            type: 'payment_required',
                            title: 'Yêu cầu thanh toán',
                            message: `Vui lòng thanh toán ${formatCurrency(appointmentData.fee)} cho lịch hẹn ${appointmentData.consultationType}`,
                            timestamp: Date.now(),
                            isRead: false,
                            amount: appointmentData.fee,
                            appointmentId: appointmentData.id
                        };
                        notifications.unshift(paymentNotification);
                    }

                    // Tạo confirmation notification nếu chưa có
                    const confirmNotifId = `confirm_${appointmentData.id}`;
                    const hasConfirmNotif = notifications.some(n => n.id === confirmNotifId);
                    
                    if (!hasConfirmNotif) {
                        const confirmNotification = {
                            id: confirmNotifId,
                            type: 'appointment_confirmed',
                            title: 'Lịch hẹn đã được gửi',
                            message: `Lịch hẹn ${appointmentData.consultationType} đã được gửi. Chúng tôi sẽ xác nhận trong 1-2 giờ.`,
                            timestamp: Date.now(),
                            isRead: false,
                            appointmentId: appointmentData.id
                        };
                        notifications.unshift(confirmNotification);
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

        if (notification.type === 'payment_required') {
            navigate('/paymentappointment');
        }
        
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
        return type === 'payment_required' ? faMoneyBillWave : faCalendarCheck;
    };

    const getColor = (type) => {
        return type === 'payment_required' ? 'warning' : 'success';
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