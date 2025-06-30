import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faCheck, faTimes, faCalendarAlt, faFlask } from '@fortawesome/free-solid-svg-icons';

function NotificationBell() {
    const [notifications, setNotifications] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        loadNotifications();
        
        // Refresh notifications every 5 seconds
        const interval = setInterval(loadNotifications, 5000);
        return () => clearInterval(interval);
    }, []);

    const loadNotifications = () => {
        const storedNotifications = JSON.parse(localStorage.getItem('notifications') || '[]');
        setNotifications(storedNotifications);
        
        const unread = storedNotifications.filter(notif => !notif.read).length;
        setUnreadCount(unread);
    };

    const markAsRead = (notificationId) => {
        const updatedNotifications = notifications.map(notif =>
            notif.id === notificationId ? { ...notif, read: true } : notif
        );
        
        setNotifications(updatedNotifications);
        localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
        
        const unread = updatedNotifications.filter(notif => !notif.read).length;
        setUnreadCount(unread);
    };

    const markAllAsRead = () => {
        const updatedNotifications = notifications.map(notif => ({ ...notif, read: true }));
        setNotifications(updatedNotifications);
        localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
        setUnreadCount(0);
    };

    const deleteNotification = (notificationId) => {
        const updatedNotifications = notifications.filter(notif => notif.id !== notificationId);
        setNotifications(updatedNotifications);
        localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
        
        const unread = updatedNotifications.filter(notif => !notif.read).length;
        setUnreadCount(unread);
    };

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'appointment':
                return faCalendarAlt;
            case 'test-order':
                return faFlask;
            default:
                return faBell;
        }
    };

    const handlePayment = (notification) => {
        // Navigate to payment page
        setShowDropdown(false);
        navigate(`/payment/${notification.requestId}`);
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffInMinutes = Math.floor((now - date) / (1000 * 60));
        
        if (diffInMinutes < 1) return 'Vừa xong';
        if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;
        if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} giờ trước`;
        return `${Math.floor(diffInMinutes / 1440)} ngày trước`;
    };

    return (
        <div className="relative">
            {/* Bell Icon */}
            <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors"
            >
                <FontAwesomeIcon icon={faBell} className="w-6 h-6" />
                
                {/* Badge */}
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown */}
            {showDropdown && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                    {/* Header */}
                    <div className="p-4 border-b border-gray-200">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold text-gray-800">Thông báo</h3>
                            {unreadCount > 0 && (
                                <button
                                    onClick={markAllAsRead}
                                    className="text-sm text-blue-600 hover:text-blue-800"
                                >
                                    Đánh dấu tất cả đã đọc
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Notifications List */}
                    <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="p-6 text-center text-gray-500">
                                <FontAwesomeIcon icon={faBell} className="w-8 h-8 mb-2 opacity-50" />
                                <p>Không có thông báo nào</p>
                            </div>
                        ) : (
                            notifications.slice(0, 10).map((notification) => (
                                <div
                                    key={notification.id}
                                    className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                                        !notification.read ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                                    }`}
                                >
                                    <div className="flex items-start space-x-3">
                                        {/* Icon */}
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                            notification.type === 'appointment' 
                                                ? 'bg-blue-100 text-blue-600'
                                                : 'bg-purple-100 text-purple-600'
                                        }`}>
                                            <FontAwesomeIcon 
                                                icon={getNotificationIcon(notification.type)} 
                                                className="w-4 h-4" 
                                            />
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-sm font-medium text-gray-900 truncate">
                                                {notification.title}
                                            </h4>
                                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                                {notification.message}
                                            </p>
                                            <p className="text-xs text-gray-400 mt-1">
                                                {formatTime(notification.timestamp)}
                                            </p>
                                            
                                            {/* Google Meet link for payment success */}
                                            {notification.meetLink && (
                                                <div className="mt-2">
                                                    <a
                                                        href={notification.meetLink}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                                                    >
                                                        Tham gia cuộc họp tư vấn
                                                    </a>
                                                </div>
                                            )}

                                            {/* Payment button for approved requests */}
                                            {notification.requiresPayment && (
                                                <div className="mt-2">
                                                    <button
                                                        onClick={() => handlePayment(notification)}
                                                        className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-colors"
                                                    >
                                                        Thanh toán {formatCurrency(notification.amount)}
                                                    </button>
                                                </div>
                                            )}
                                        </div>

                                        {/* Actions */}
                                        <div className="flex flex-col space-y-1">
                                            {!notification.read && (
                                                <button
                                                    onClick={() => markAsRead(notification.id)}
                                                    className="text-green-600 hover:text-green-800 p-1"
                                                    title="Đánh dấu đã đọc"
                                                >
                                                    <FontAwesomeIcon icon={faCheck} className="w-3 h-3" />
                                                </button>
                                            )}
                                            <button
                                                onClick={() => deleteNotification(notification.id)}
                                                className="text-red-600 hover:text-red-800 p-1"
                                                title="Xóa thông báo"
                                            >
                                                <FontAwesomeIcon icon={faTimes} className="w-3 h-3" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Footer */}
                    {notifications.length > 0 && (
                        <div className="p-3 bg-gray-50 text-center border-t">
                            <button
                                onClick={() => {
                                    localStorage.removeItem('notifications');
                                    setNotifications([]);
                                    setUnreadCount(0);
                                }}
                                className="text-sm text-red-600 hover:text-red-800"
                            >
                                Xóa tất cả thông báo
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Overlay */}
            {showDropdown && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowDropdown(false)}
                />
            )}
        </div>
    );
}

export default NotificationBell;
