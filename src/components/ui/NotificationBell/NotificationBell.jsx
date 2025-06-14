import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faBell, 
    faCircle, 
    faCheck, 
    faMoneyBillWave,
    faCalendarCheck,
    faUserMd,
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

    useEffect(() => {
        loadNotifications();
    }, []);

    const loadNotifications = () => {
        // Lấy thông tin appointment đã được lưu từ localStorage
        const pendingAppointment = localStorage.getItem('pendingAppointment');
        const notificationHistory = localStorage.getItem('notificationHistory');
        
        let notifications = [];
        
        // Parse notification history nếu có
        if (notificationHistory) {
            try {
                notifications = JSON.parse(notificationHistory);
            } catch (error) {
                console.error('Error parsing notification history:', error);
                notifications = [];
            }
        }

        // Nếu có appointment đang chờ thanh toán, tạo notification payment
        if (pendingAppointment) {
            try {
                const appointmentData = JSON.parse(pendingAppointment);
                
                // Check xem đã có notification payment cho appointment này chưa
                const existingPaymentNotif = notifications.find(
                    notif => notif.type === 'payment_required' && notif.appointmentId === appointmentData.id
                );

                // Chỉ tạo mới nếu chưa có hoặc appointment status là pending_confirmation
                if (!existingPaymentNotif && appointmentData.status === 'pending_confirmation') {
                    const paymentNotification = {
                        id: `payment_${appointmentData.id}`,
                        type: 'payment_required',
                        title: 'Yêu cầu thanh toán',
                        message: `Vui lòng thanh toán ${formatCurrency(appointmentData.fee)} cho lịch hẹn ${appointmentData.consultationType} ngày ${formatDate(appointmentData.appointmentDate)}`,
                        timestamp: new Date(appointmentData.createdAt),
                        isRead: false,
                        actionUrl: '/paymentappointment',
                        amount: appointmentData.fee,
                        appointmentId: appointmentData.id,
                        appointmentData: appointmentData // Lưu toàn bộ data appointment
                    };

                    notifications.unshift(paymentNotification); // Thêm vào đầu list
                }

                // Tạo notification xác nhận đặt lịch (nếu chưa có)
                const existingConfirmNotif = notifications.find(
                    notif => notif.type === 'appointment_pending' && notif.appointmentId === appointmentData.id
                );

                if (!existingConfirmNotif) {
                    const confirmNotification = {
                        id: `confirm_${appointmentData.id}`,
                        type: 'appointment_pending',
                        title: 'Lịch hẹn đã được gửi',
                        message: `Lịch hẹn ${appointmentData.consultationType} đã được gửi. Chúng tôi sẽ xác nhận trong 1-2 giờ.`,
                        timestamp: new Date(appointmentData.createdAt),
                        isRead: false,
                        actionUrl: '/my-appointments',
                        appointmentId: appointmentData.id
                    };

                    notifications.unshift(confirmNotification);
                }

            } catch (error) {
                console.error('Error parsing pending appointment:', error);
            }
        }

        // Thêm một số notification mẫu khác (có thể bỏ đi trong production)
        const sampleNotifications = [
            {
                id: 'sample_001',
                type: 'appointment_reminder',
                title: 'Nhắc nhở lịch hẹn',
                message: 'Bạn có lịch hẹn vào ngày mai lúc 14:30',
                timestamp: new Date(Date.now() - 24 * 60 * 60000),
                isRead: true,
                actionUrl: '/my-appointments'
            }
        ];

        // Combine và sort theo timestamp
        const allNotifications = [...notifications, ...sampleNotifications]
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        setNotifications(allNotifications);
        
        // Đếm thông báo chưa đọc
        const unread = allNotifications.filter(notif => !notif.isRead).length;
        setUnreadCount(unread);

        // Lưu lại notification history
        localStorage.setItem('notificationHistory', JSON.stringify(allNotifications));
    };

    // Đóng dropdown khi click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const markAsRead = (notificationId) => {
        setNotifications(prevNotifications => {
            const updated = prevNotifications.map(notif =>
                notif.id === notificationId 
                    ? { ...notif, isRead: true }
                    : notif
            );
            
            // Update localStorage
            localStorage.setItem('notificationHistory', JSON.stringify(updated));
            return updated;
        });
        
        setUnreadCount(prev => Math.max(0, prev - 1));
    };

    const markAllAsRead = () => {
        setNotifications(prevNotifications => {
            const updated = prevNotifications.map(notif => ({ ...notif, isRead: true }));
            localStorage.setItem('notificationHistory', JSON.stringify(updated));
            return updated;
        });
        setUnreadCount(0);
    };

    const deleteNotification = (notificationId, event) => {
        event.stopPropagation();
        
        setNotifications(prevNotifications => {
            const updated = prevNotifications.filter(notif => notif.id !== notificationId);
            localStorage.setItem('notificationHistory', JSON.stringify(updated));
            return updated;
        });
        
        // Update unread count if deleted notification was unread
        const deletedNotif = notifications.find(notif => notif.id === notificationId);
        if (deletedNotif && !deletedNotif.isRead) {
            setUnreadCount(prev => Math.max(0, prev - 1));
        }
    };

    const handleNotificationClick = (notification) => {
        // Mark as read
        if (!notification.isRead) {
            markAsRead(notification.id);
        }
        
        // Handle navigation based on notification type
        if (notification.type === 'payment_required' && notification.actionUrl) {
            // Không cần lưu thêm data, chỉ navigate vì data đã có trong localStorage
            navigate('/paymentappointment');
            console.log('🔔 Navigate to payment page for appointment:', notification.appointmentId);
        } else if (notification.actionUrl) {
            navigate(notification.actionUrl);
            console.log('🔔 Navigate to:', notification.actionUrl);
        }
        
        setIsOpen(false);
    };

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'appointment_confirmed':
                return faCalendarCheck;
            case 'appointment_pending':
                return faCalendarCheck;
            case 'payment_required':
                return faMoneyBillWave;
            case 'appointment_reminder':
                return faBell;
            case 'doctor_assigned':
                return faUserMd;
            default:
                return faBell;
        }
    };

    const getNotificationColor = (type) => {
        switch (type) {
            case 'appointment_confirmed':
                return 'success';
            case 'appointment_pending':
                return 'info';
            case 'payment_required':
                return 'warning';
            case 'appointment_reminder':
                return 'info';
            case 'doctor_assigned':
                return 'primary';
            default:
                return 'default';
        }
    };

    const formatTimestamp = (timestamp) => {
        const now = new Date();
        const diff = now - new Date(timestamp);
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) {
            return 'Vừa xong';
        } else if (minutes < 60) {
            return `${minutes} phút trước`;
        } else if (hours < 24) {
            return `${hours} giờ trước`;
        } else {
            return `${days} ngày trước`;
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    // Listen for localStorage changes (khi có appointment mới)
    useEffect(() => {
        const handleStorageChange = () => {
            loadNotifications();
        };

        window.addEventListener('storage', handleStorageChange);
        
        // Polling để check localStorage changes trong cùng tab
        const interval = setInterval(() => {
            loadNotifications();
        }, 30000); // Check mỗi 30 giây

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            clearInterval(interval);
        };
    }, []);

    return (
        <div className={cx('notification-bell')} ref={dropdownRef}>
            {/* Bell Icon */}
            <button 
                className={cx('bell-button')}
                onClick={toggleDropdown}
                title="Thông báo"
            >
                <FontAwesomeIcon icon={faBell} className={cx('bell-icon')} />
                {unreadCount > 0 && (
                    <span className={cx('badge')}>
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown */}
            {isOpen && (
                <div className={cx('notification-dropdown')}>
                    {/* Header */}
                    <div className={cx('dropdown-header')}>
                        <h3>Thông báo</h3>
                        <div className={cx('header-actions')}>
                            {unreadCount > 0 && (
                                <button 
                                    className={cx('mark-all-read')}
                                    onClick={markAllAsRead}
                                    title="Đánh dấu tất cả đã đọc"
                                >
                                    <FontAwesomeIcon icon={faCheck} />
                                </button>
                            )}
                            <button 
                                className={cx('close-button')}
                                onClick={() => setIsOpen(false)}
                                title="Đóng"
                            >
                                <FontAwesomeIcon icon={faTimes} />
                            </button>
                        </div>
                    </div>

                    {/* Notifications List */}
                    <div className={cx('notifications-list')}>
                        {notifications.length > 0 ? (
                            notifications.map(notification => (
                                <div
                                    key={notification.id}
                                    className={cx('notification-item', {
                                        'unread': !notification.isRead,
                                        'clickable': notification.actionUrl,
                                        [getNotificationColor(notification.type)]: true
                                    })}
                                    onClick={() => handleNotificationClick(notification)}
                                >
                                    {/* Unread indicator */}
                                    {!notification.isRead && (
                                        <div className={cx('unread-dot')}>
                                            <FontAwesomeIcon icon={faCircle} />
                                        </div>
                                    )}

                                    {/* Icon */}
                                    <div className={cx('notification-icon')}>
                                        <FontAwesomeIcon icon={getNotificationIcon(notification.type)} />
                                    </div>

                                    {/* Content */}
                                    <div className={cx('notification-content')}>
                                        <h4 className={cx('notification-title')}>
                                            {notification.title}
                                            {notification.type === 'payment_required' && (
                                                <span className={cx('urgent-badge')}>Khẩn cấp</span>
                                            )}
                                        </h4>
                                        <p className={cx('notification-message')}>
                                            {notification.message}
                                        </p>
                                        {notification.amount && (
                                            <div className={cx('notification-amount')}>
                                                <strong>{formatCurrency(notification.amount)}</strong>
                                                <span className={cx('payment-action')}>
                                                    💳 Nhấn để thanh toán
                                                </span>
                                            </div>
                                        )}
                                        <span className={cx('notification-time')}>
                                            {formatTimestamp(notification.timestamp)}
                                        </span>
                                    </div>

                                    {/* Delete button */}
                                    <button
                                        className={cx('delete-button')}
                                        onClick={(e) => deleteNotification(notification.id, e)}
                                        title="Xóa thông báo"
                                    >
                                        <FontAwesomeIcon icon={faTrash} />
                                    </button>
                                </div>
                            ))
                        ) : (
                            <div className={cx('empty-notifications')}>
                                <FontAwesomeIcon icon={faBell} className={cx('empty-icon')} />
                                <p>Không có thông báo nào</p>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    {notifications.length > 0 && (
                        <div className={cx('dropdown-footer')}>
                            <button 
                                className={cx('view-all-button')}
                                onClick={() => {
                                    navigate('/notifications');
                                    setIsOpen(false);
                                }}
                            >
                                Xem tất cả thông báo
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default NotificationBell;