import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faCircle,
  faCheck,
  faCalendarCheck,
  faCalendarPlus,
  faCalendarTimes,
  faTrash,
  faTimes,
  faClock,
  faUserInjured
} from "@fortawesome/free-solid-svg-icons";
import classNames from "classnames/bind";
import styles from "./NotificationBell.module.scss";

const cx = classNames.bind(styles);

function DoctorNotificationBell() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef(null);

  // Format thời gian
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

  // Lấy icon dựa trên loại thông báo
  const getIcon = (type) => {
    switch (type) {
      case "new_appointment":
        return faCalendarPlus;
      case "schedule_registered":
        return faClock;
      case "appointment_cancelled":
        return faCalendarTimes;
      case "appointment_modified":
        return faCalendarCheck;
      case "patient_arrived":
        return faUserInjured;
      default:
        return faCalendarCheck;
    }
  };

  // Lấy màu dựa trên loại thông báo
  const getColor = (type) => {
    switch (type) {
      case "new_appointment":
        return "info";
      case "schedule_registered":
        return "success";
      case "appointment_cancelled":
        return "danger";
      case "appointment_modified":
        return "warning";
      case "patient_arrived":
        return "primary";
      default:
        return "info";
    }
  };

  // Tải thông báo
  const loadNotifications = useCallback(() => {
    try {
      let notifications = [];

      // Lấy thông báo từ localStorage
      const saved = localStorage.getItem("doctorNotifications");
      if (saved) notifications = JSON.parse(saved) || [];

      // Kiểm tra thông báo lịch đăng ký làm việc
      const scheduleRegistered = localStorage.getItem("scheduleRegistered");
      if (scheduleRegistered) {
        const scheduleData = JSON.parse(scheduleRegistered);
        
        // Tạo thông báo nếu chưa tồn tại
        const scheduleNotifId = `schedule_${scheduleData.timestamp || Date.now()}`;
        const hasScheduleNotif = notifications.some((n) => n.id === scheduleNotifId);
        
        if (!hasScheduleNotif) {
          const scheduleNotification = {
            id: scheduleNotifId,
            type: "schedule_registered",
            title: "Đăng ký lịch làm việc thành công",
            message: "Lịch làm việc của bạn đã được đăng ký thành công vào hệ thống.",
            timestamp: scheduleData.timestamp || Date.now(),
            isRead: false
          };
          notifications.unshift(scheduleNotification);
          localStorage.removeItem("scheduleRegistered"); // Xóa sau khi đã tạo thông báo
        }
      }

      // Kiểm tra lịch hẹn mới từ bệnh nhân
      const newAppointments = localStorage.getItem("doctorNewAppointments");
      if (newAppointments) {
        const appointmentList = JSON.parse(newAppointments);
        
        if (Array.isArray(appointmentList) && appointmentList.length > 0) {
          appointmentList.forEach(appointment => {
            const appointmentNotifId = `appointment_${appointment.id}`;
            const hasNotif = notifications.some((n) => n.id === appointmentNotifId);
            
            if (!hasNotif) {
              const appointmentNotification = {
                id: appointmentNotifId,
                type: "new_appointment",
                title: "Bạn có lịch hẹn mới",
                message: `Bệnh nhân ${appointment.patientName} đã đặt lịch hẹn vào ngày ${appointment.date} (${appointment.time}).`,
                timestamp: Date.now(),
                isRead: false,
                appointmentId: appointment.id
              };
              notifications.unshift(appointmentNotification);
            }
          });
          
          // Xóa bớt thông báo đã được xử lý
          localStorage.setItem("doctorNewAppointments", JSON.stringify([]));
        }
      }

      // Kiểm tra bệnh nhân đã đến
      const patientsArrived = localStorage.getItem("patientsArrived");
      if (patientsArrived) {
        const arrivedList = JSON.parse(patientsArrived);
        
        if (Array.isArray(arrivedList) && arrivedList.length > 0) {
          arrivedList.forEach(patient => {
            const notifId = `arrived_${patient.appointmentId}_${Date.now()}`;
            const arrivedNotification = {
              id: notifId,
              type: "patient_arrived",
              title: "Bệnh nhân đã đến",
              message: `Bệnh nhân ${patient.patientName} đã có mặt tại phòng khám cho cuộc hẹn lúc ${patient.time}.`,
              timestamp: Date.now(),
              isRead: false,
              appointmentId: patient.appointmentId
            };
            notifications.unshift(arrivedNotification);
          });
          
          localStorage.removeItem("patientsArrived");
        }
      }

      // Sắp xếp theo thời gian mới nhất
      notifications.sort((a, b) => b.timestamp - a.timestamp);

      setNotifications(notifications);
      setUnreadCount(notifications.filter((n) => !n.isRead).length);
      localStorage.setItem("doctorNotifications", JSON.stringify(notifications));
    } catch (error) {
      console.error("Lỗi tải thông báo:", error);
    }
  }, []);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  // Theo dõi thay đổi localStorage
  useEffect(() => {
    const handleStorageChange = () => loadNotifications();
    window.addEventListener("storage", handleStorageChange);

    // Kiểm tra thông báo mới mỗi 15 giây
    const checkInterval = setInterval(() => {
      loadNotifications();
    }, 15000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(checkInterval);
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
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  const toggleDropdown = () => setIsOpen(!isOpen);

  // Đánh dấu một thông báo là đã đọc
  const markAsRead = (notificationId) => {
    const updated = notifications.map((n) =>
      n.id === notificationId ? { ...n, isRead: true } : n
    );
    setNotifications(updated);
    setUnreadCount(updated.filter((n) => !n.isRead).length);
    localStorage.setItem("doctorNotifications", JSON.stringify(updated));
  };

  // Đánh dấu tất cả là đã đọc
  const markAllAsRead = () => {
    const updated = notifications.map((n) => ({ ...n, isRead: true }));
    setNotifications(updated);
    setUnreadCount(0);
    localStorage.setItem("doctorNotifications", JSON.stringify(updated));
  };

  // Xóa thông báo
  const deleteNotification = (notificationId, event) => {
    event.stopPropagation();
    const updated = notifications.filter((n) => n.id !== notificationId);
    setNotifications(updated);
    setUnreadCount(updated.filter((n) => !n.isRead).length);
    localStorage.setItem("doctorNotifications", JSON.stringify(updated));
  };

  // Xử lý khi nhấp vào thông báo
  const handleNotificationClick = (notification) => {
    if (!notification.isRead) {
      markAsRead(notification.id);
    }

    // Điều hướng dựa trên loại thông báo
    if (notification.type === "new_appointment") {
      navigate("/doctor/appointments");
    } else if (notification.type === "schedule_registered") {
      navigate("/doctor/schedule");
    } else if (notification.type === "patient_arrived") {
      navigate(`/doctor/appointments/${notification.appointmentId}`);
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
                    clickable: true
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

export default DoctorNotificationBell;