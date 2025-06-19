// NotificationBell.js
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faCircle,
  faCheck,
  faMoneyBillWave,
  faCalendarCheck,
  faTrash,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import classNames from "classnames/bind";
import styles from "./NotificationBell.module.scss";

const cx = classNames.bind(styles);

function NotificationBell() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef(null);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatTime = (timestamp) => {
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Vừa xong";
    if (minutes < 60) return `${minutes} phút trước`;
    if (hours < 24) return `${hours} giờ trước`;
    return `${days} ngày trước`;
  };

  const getIcon = (type) => {
    switch (type) {
      case "payment_required":
        return faMoneyBillWave;
      case "appointment_pending":
        return faCalendarCheck;
      default:
        return faCalendarCheck;
    }
  };

  const getColor = (type) => {
    switch (type) {
      case "payment_required":
        return "warning";
      case "appointment_pending":
        return "info";
      case "appointment_success":
        return "success";
      default:
        return "success";
    }
  };

  const loadNotifications = useCallback(() => {
    try {
      let notifications = [];

      const saved = localStorage.getItem("notificationHistory");
      if (saved) notifications = JSON.parse(saved) || [];

      // Pending Appointment
      const pendingAppointment = localStorage.getItem("pendingAppointment");
      if (pendingAppointment) {
        const appointmentData = JSON.parse(pendingAppointment);
        if (appointmentData.id && appointmentData.status === "0") {
          const confirmNotifId = `confirm_${appointmentData.id}`;
          const hasConfirmNotif = notifications.some(
            (n) => n.id === confirmNotifId
          );

          if (!hasConfirmNotif) {
            const confirmNotification = {
              id: confirmNotifId,
              type: "appointment_pending",
              title: "Lịch hẹn đã được gửi",
              message: `Lịch hẹn ${appointmentData.consultant_type} đã được gửi. Vui lòng đợi xác nhận từ phía quản lý.`,
              timestamp: Date.now(),
              isRead: false,
              appointmentId: appointmentData.id,
            };
            notifications.unshift(confirmNotification);
          }
        }
      }

      // Confirmed Appointments
      const confirmedAppointment = localStorage.getItem("appointmentsList");
      if (confirmedAppointment) {
        let appointmentData = JSON.parse(confirmedAppointment);

        if (Array.isArray(appointmentData) && appointmentData.length > 0) {
          const lastestConfirmed = appointmentData[appointmentData.length - 1];

          if (lastestConfirmed.status === "rejected") {
            appointmentData = appointmentData.filter(
              (item) => item.id !== lastestConfirmed.id
            );

            localStorage.setItem(
              "appointmentsList",
              JSON.stringify(appointmentData)
            );

            const cancelNotification = {
              id: `cancelled_${lastestConfirmed.id}`,
              type: "cancelled",
              title: "Lịch hẹn bị huỷ",
              message: `Lịch hẹn của bạn đã bị huỷ vì chưa được duyệt.`,
              timestamp: Date.now(),
              isRead: false,
              appointmentId: lastestConfirmed.id,
            };

            const alreadyExists = notifications.some(
              (n) => n.id === cancelNotification.id
            );
            if (!alreadyExists) {
              notifications.unshift(cancelNotification);
            }
          }
          if (lastestConfirmed.status === "approved") {
            const paymentNotifId = `payment_${lastestConfirmed.id}`;
            const hasPaymentNotif = notifications.some(
              (n) => n.id === paymentNotifId
            );
            if (!hasPaymentNotif) {
              const paymentNotification = {
                ...lastestConfirmed,
                id: paymentNotifId,
                type: "payment_required",
                title: "Lịch hẹn đã được xác nhận - Yêu cầu thanh toán",
                message: `Lịch hẹn ${
                  lastestConfirmed.consultant_type
                } đã được xác nhận. Vui lòng thanh toán ${formatCurrency(
                  lastestConfirmed.price_apm
                )} để hoàn tất.`,
                timestamp: Date.now(),
                isRead: false,
                amount: lastestConfirmed.price_apm,
                appointmentId: lastestConfirmed.id,
              };
              notifications.unshift(paymentNotification);
            }
          }
        }
      }

      const paymentSuccess = localStorage.getItem("paymentSuccess");
      if (paymentSuccess) {
        const paymentArray = JSON.parse(paymentSuccess);
        // Payment Success
        if (Array.isArray(paymentArray) && paymentArray.length > 0) {
          const latestPayment = paymentArray[paymentArray.length - 1]; // lấy phần tử mới nhất

          const successNotifId = `success_${latestPayment.appointmentId}_${latestPayment.paymentId}`;
          const hasSuccessNotif = notifications.some(
            (n) => n.id === successNotifId
          );

          if (!hasSuccessNotif) {
            const successNotification = {
              id: successNotifId,
              type: "appointment_success",
              title: "🎉 Đặt lịch hẹn thành công!",
              message: `Thanh toán thành công ${formatCurrency(
                latestPayment.amount
              )}. Lịch hẹn ${latestPayment.consultant_type} đã được xác nhận.`,
              timestamp: Date.now(),
              isRead: false,
              appointmentId: latestPayment.appointmentId,
              paymentId: latestPayment.paymentId,
              amount: latestPayment.amount,
            };
            notifications.unshift(successNotification);

            // Xóa thông báo thanh toán cũ liên quan
            notifications = notifications.filter(
              (n) => n.id !== `payment_${latestPayment.appointmentId}`
            );

            localStorage.removeItem("confirmedAppointment");
            localStorage.removeItem("paymentSuccess");
          }
        }
      }

      // Sort
      notifications.sort((a, b) => b.timestamp - a.timestamp);

      setNotifications(notifications);
      setUnreadCount(notifications.filter((n) => !n.isRead).length);
      localStorage.setItem(
        "notificationHistory",
        JSON.stringify(notifications)
      );
    } catch (error) {
      console.error("Error loading notifications:", error);
    }
  }, []);
  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  useEffect(() => {
    const handleStorageChange = () => loadNotifications();
    window.addEventListener("storage", handleStorageChange);

    const paymentCheckInterval = setInterval(() => {
      const paymentSuccess = localStorage.getItem("paymentSuccess");
      if (paymentSuccess) loadNotifications();
    }, 2000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(paymentCheckInterval);
    };
  }, [loadNotifications]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const markAsRead = (notificationId) => {
    const updated = notifications.map((n) =>
      n.id === notificationId ? { ...n, isRead: true } : n
    );
    setNotifications(updated);
    setUnreadCount(updated.filter((n) => !n.isRead).length);
    localStorage.setItem("notificationHistory", JSON.stringify(updated));
  };

  const markAllAsRead = () => {
    const updated = notifications.map((n) => ({ ...n, isRead: true }));
    setNotifications(updated);
    setUnreadCount(0);
    localStorage.setItem("notificationHistory", JSON.stringify(updated));
  };

  const deleteNotification = (notificationId, event) => {
    event.stopPropagation();
    const updated = notifications.filter((n) => n.id !== notificationId);
    setNotifications(updated);
    setUnreadCount(updated.filter((n) => !n.isRead).length);
    localStorage.setItem("notificationHistory", JSON.stringify(updated));
  };

  const handleNotificationClick = (notification) => {
    if (!notification.isRead) {
      markAsRead(notification.id);
    }

    if (notification.type === "payment_required") {
      localStorage.setItem("pendingAppointment", JSON.stringify(notification));
      navigate("/paymentappointment");
    } else if (notification.type === "appointment_success") {
      navigate("/my-appointments");
    }

    setIsOpen(false);
  };

  return (
    <div className={cx("notification-bell")} ref={dropdownRef}>
      <button
        className={cx("bell-button")}
        onClick={toggleDropdown}
        title="Thông báo"
      >
        <FontAwesomeIcon icon={faBell} />
        {unreadCount > 0 && (
          <span className={cx("badge")}>
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className={cx("dropdown")}>
          <div className={cx("header")}>
            <h3>Thông báo</h3>
            <div className={cx("actions")}>
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

          <div className={cx("list")}>
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={cx("item", {
                    unread: !notification.isRead,
                    [getColor(notification.type)]: true,
                    clickable: [
                      "payment_required",
                      "appointment_success",
                    ].includes(notification.type),
                  })}
                  onClick={() => handleNotificationClick(notification)}
                >
                  {!notification.isRead && (
                    <div className={cx("dot")}>
                      <FontAwesomeIcon icon={faCircle} />
                    </div>
                  )}

                  <div className={cx("icon")}>
                    <FontAwesomeIcon icon={getIcon(notification.type)} />
                  </div>

                  <div className={cx("content")}>
                    <h4>{notification.title}</h4>
                    <p>{notification.message}</p>
                    {notification.amount &&
                      notification.type === "payment_required" && (
                        <div className={cx("amount")}>
                          <strong>{formatCurrency(notification.amount)}</strong>
                          <span>💳 Nhấn để thanh toán</span>
                        </div>
                      )}
                    {notification.amount &&
                      notification.type === "appointment_success" && (
                        <div className={cx("amount", "success-amount")}>
                          <strong>
                            ✅ Đã thanh toán:{" "}
                            {formatCurrency(notification.amount)}
                          </strong>
                        </div>
                      )}
                    <span className={cx("time")}>
                      {formatTime(notification.timestamp)}
                    </span>
                  </div>

                  <button
                    className={cx("delete")}
                    onClick={(e) => deleteNotification(notification.id, e)}
                    title="Xóa"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              ))
            ) : (
              <div className={cx("empty")}>
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
