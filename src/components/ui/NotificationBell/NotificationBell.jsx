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
  faHourglassHalf,
  faCheckCircle,
  faTimesCircle,
  faSpinner,
  faStar, // Thêm faStar
} from "@fortawesome/free-solid-svg-icons";
import classNames from "classnames/bind";
import styles from "./NotificationBell.module.scss";
import axiosClient from "../../../services/axiosClient";

const cx = classNames.bind(styles);

function NotificationBell() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef(null);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const accessToken = localStorage.getItem("accessToken");

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatTime = (timestamp) => {
    const diff = Date.now() - new Date(timestamp).getTime();
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
        return faHourglassHalf;
      case "appointment_confirmed":
        return faCheckCircle;
      case "appointment_cancelled":
        return faTimesCircle;
      case "appointment_success":
        return faCalendarCheck;
      case "appointment_completed": // Thêm completed
        return faStar;
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
      case "appointment_confirmed":
        return "success";
      case "appointment_cancelled":
        return "danger";
      case "appointment_success":
        return "success";
      case "appointment_completed": // Thêm completed
        return "completed";
      default:
        return "info";
    }
  };

  const createNotificationFromAppointment = (appointment) => {
    const notifications = [];
    const appointmentDate = new Date(appointment.created_at);

    switch (appointment.status) {
      case "pending":
        notifications.push({
          id: `pending_${appointment.appointment_id}`,
          type: "appointment_pending",
          title: "Lịch hẹn đang chờ xác nhận",
          message: `Lịch hẹn ${appointment.consultant_type} vào ${new Date(
            appointment.appointment_date
          ).toLocaleDateString("vi-VN")} đang chờ xác nhận từ quản lý.`,
          timestamp: appointmentDate.toISOString(),
          isRead: false,
          appointmentId: appointment.appointment_id,
          appointmentData: appointment,
        });
        break;

      case "confirmed":
        if (appointment.booking === 1) {
          notifications.push({
            id: `success_${appointment.appointment_id}`,
            type: "appointment_success",
            title: "🎉 Lịch hẹn hoàn thành thanh toán!",
            message: `Lịch hẹn ${appointment.consultant_type} đã hoàn thành thanh toán. Sẵn sàng tham gia buổi tư vấn!`,
            timestamp: appointmentDate.toISOString(),
            isRead: false,
            appointmentId: appointment.appointment_id,
            appointmentData: appointment,
            amount: appointment.price_apm,
            isPaid: true,
          });
        } else if (appointment.booking === 0) {
          if (appointment.price_apm && appointment.price_apm > 0) {
            notifications.push({
              id: `payment_${appointment.appointment_id}`,
              type: "payment_required",
              title: "Yêu cầu thanh toán",
              message: `Vui lòng thanh toán phí tư vấn để hoàn tất lịch hẹn ${appointment.consultant_type}.`,
              timestamp: appointmentDate.toISOString(),
              isRead: false,
              amount: appointment.price_apm,
              appointmentId: appointment.appointment_id,
              appointmentData: appointment,
              isPaid: false,
            });
          }

          notifications.push({
            id: `confirmed_${appointment.appointment_id}`,
            type: "appointment_confirmed",
            title: "Lịch hẹn đã được xác nhận",
            message: `Lịch hẹn ${
              appointment.consultant_type
            } đã được xác nhận. Bác sĩ: ${
              appointment.doctor_name || "Chưa phân công"
            }.`,
            timestamp: appointmentDate.toISOString(),
            isRead: false,
            appointmentId: appointment.appointment_id,
            appointmentData: appointment,
          });
        }
        break;

      // Thêm case completed
      case "completed":
        notifications.push({
          id: `completed_${appointment.appointment_id}`,
          type: "appointment_completed",
          title: "Buổi tư vấn đã hoàn thành!",
          message: `Buổi tư vấn ${appointment.consultant_type} với bác sĩ ${
            appointment.doctor_name || "bác sĩ"
          } đã hoàn thành. Hãy chia sẻ đánh giá của bạn!`,
          timestamp: appointmentDate.toISOString(),
          isRead: false,
          appointmentId: appointment.appointment_id,
          appointmentData: appointment,
          canFeedback: !appointment.feedback, // Kiểm tra đã đánh giá chưa
        });
        break;

      case "rejected":
        notifications.push({
          id: `cancelled_${appointment.appointment_id}`,
          type: "appointment_cancelled",
          title: "Lịch hẹn đã bị từ chối",
          message: `Lịch hẹn ${appointment.consultant_type} đã bị quản lý từ chối. Vui lòng liên hệ hỗ trợ để biết thêm chi tiết.`,
          timestamp: appointmentDate.toISOString(),
          isRead: false,
          appointmentId: appointment.appointment_id,
          appointmentData: appointment,
        });
        break;

      default:
        break;
    }

    return notifications;
  };

  const getDeletedNotifications = () => {
    return JSON.parse(localStorage.getItem("deletedNotifications") || "{}");
  };

  const saveDeletedNotification = (notificationId) => {
    const deletedNotifications = getDeletedNotifications();
    deletedNotifications[notificationId] = {
      deletedAt: new Date().toISOString(),
      status: "deleted",
    };
    localStorage.setItem(
      "deletedNotifications",
      JSON.stringify(deletedNotifications)
    );
  };

  const cleanupDeletedNotifications = () => {
    const deletedNotifications = getDeletedNotifications();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const cleanedDeleted = {};
    Object.keys(deletedNotifications).forEach((id) => {
      const deletedAt = new Date(deletedNotifications[id].deletedAt);
      if (deletedAt >= thirtyDaysAgo) {
        cleanedDeleted[id] = deletedNotifications[id];
      }
    });

    localStorage.setItem(
      "deletedNotifications",
      JSON.stringify(cleanedDeleted)
    );
    return cleanedDeleted;
  };

  const loadNotifications = useCallback(async () => {
    if (!user.user_id || !accessToken) return;

    try {
      setIsLoading(true);

      const response = await axiosClient.get(
        `/v1/appointments/user/${user.user_id}`,
        {
          headers: {
            "x-access-token": accessToken,
          },
        }
      );

      if (response.data?.success) {
        const appointments = response.data.data || [];

        const savedNotifications = JSON.parse(
          localStorage.getItem("notificationReadStatus") || "{}"
        );
        const deletedNotifications = cleanupDeletedNotifications();

        let allNotifications = [];
        appointments.forEach((appointment) => {
          const appointmentNotifications =
            createNotificationFromAppointment(appointment);
          allNotifications = [...allNotifications, ...appointmentNotifications];
        });

        allNotifications = allNotifications.filter((notif) => {
          const isDeleted = deletedNotifications[notif.id];
          if (isDeleted) {
            return false;
          }
          return true;
        });

        allNotifications = allNotifications.map((notif) => ({
          ...notif,
          isRead: savedNotifications[notif.id] || false,
        }));

        allNotifications.sort(
          (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
        );

        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const recentNotifications = allNotifications.filter(
          (notif) => new Date(notif.timestamp) >= thirtyDaysAgo
        );
        // Thêm thông báo tạm thời từ localStorage
        const tempNotifications = JSON.parse(
          localStorage.getItem("tempNotifications") || "[]"
        );

        let combinedNotifications = [
          ...recentNotifications,
          ...tempNotifications,
        ];

        const uniqueNotifications = Array.from(
          new Map(combinedNotifications.map((item) => [item.id, item])).values()
        );

        // Sắp xếp theo thời gian
        uniqueNotifications.sort(
          (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
        );

        setNotifications(uniqueNotifications);
        setUnreadCount(uniqueNotifications.filter((n) => !n.isRead).length);
      }
    } catch (error) {
      console.error("❌ Error loading notifications:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user.user_id, accessToken]);

  useEffect(() => {
    // Lắng nghe sự kiện thông báo mới từ các component khác
    const handleNewNotification = () => {
      loadNotifications();
    };

    window.addEventListener("newNotification", handleNewNotification);

    return () => {
      window.removeEventListener("newNotification", handleNewNotification);
    };
  }, [loadNotifications]);

  useEffect(() => {
    loadNotifications();

    const interval = setInterval(loadNotifications, 30000);

    return () => clearInterval(interval);
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

    const readStatus = JSON.parse(
      localStorage.getItem("notificationReadStatus") || "{}"
    );
    readStatus[notificationId] = true;
    localStorage.setItem("notificationReadStatus", JSON.stringify(readStatus));
  };

  const markAllAsRead = () => {
    const updated = notifications.map((n) => ({ ...n, isRead: true }));
    setNotifications(updated);
    setUnreadCount(0);

    const readStatus = {};
    notifications.forEach((n) => {
      readStatus[n.id] = true;
    });
    localStorage.setItem("notificationReadStatus", JSON.stringify(readStatus));
  };

  const deleteNotification = (notificationId, event) => {
    event.stopPropagation();

    const updated = notifications.filter((n) => n.id !== notificationId);
    setNotifications(updated);
    setUnreadCount(updated.filter((n) => !n.isRead).length);

    saveDeletedNotification(notificationId);

    const readStatus = JSON.parse(
      localStorage.getItem("notificationReadStatus") || "{}"
    );
    delete readStatus[notificationId];
    localStorage.setItem("notificationReadStatus", JSON.stringify(readStatus));
  };

  const handleNotificationClick = (notification) => {
    if (!notification.isRead) {
      markAsRead(notification.id);
    }

    switch (notification.type) {
      case "payment_required":
        if (notification.isPaid) {
          navigate("/my-appointments");
        } else {
          navigate(`/paymentappointment/${notification.appointmentId}`, {
            state: { appointmentData: notification.appointmentData },
          });
        }
        break;
      case "appointment_success":
        navigate("/my-appointments");
        break;
      case "appointment_completed": // Thêm case completed
        // Dẫn đến trang feedback cho appointment cụ thể
        navigate(`/feedback/consultation/${notification.appointmentId}`, {
          state: { appointmentData: notification.appointmentData },
        });
        break;
      case "appointment_confirmed":
      case "appointment_pending":
      case "appointment_cancelled":
        navigate("/my-appointments");
        break;
      default:
        break;
    }

    setIsOpen(false);
  };

  const bellIcon = isLoading ? faSpinner : faBell;

  return (
    <div className={cx("notification-bell")} ref={dropdownRef}>
      <button
        className={cx("bell-button", { loading: isLoading })}
        onClick={toggleDropdown}
        title="Thông báo"
      >
        <FontAwesomeIcon icon={bellIcon} spin={isLoading} />
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
              <button
                onClick={loadNotifications}
                title="Làm mới"
                disabled={isLoading}
              >
                <FontAwesomeIcon icon={faSpinner} spin={isLoading} />
              </button>
              <button onClick={() => setIsOpen(false)} title="Đóng">
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
          </div>

          <div className={cx("list")}>
            {(() => {
              if (isLoading) {
                return (
                  <div className={cx("loading")}>
                    <FontAwesomeIcon icon={faSpinner} spin />
                    <p>Đang tải thông báo...</p>
                  </div>
                );
              } else if (notifications.length > 0) {
                return notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={cx("item", {
                      unread: !notification.isRead,
                      [getColor(notification.type)]: true,
                      clickable: true,
                      paid: notification.isPaid,
                      completed: notification.type === "appointment_completed",
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

                      {/* Hiển thị cho payment_required */}
                      {notification.amount &&
                        notification.type === "payment_required" && (
                          <div
                            className={cx("amount", {
                              "paid-amount": notification.isPaid,
                            })}
                          >
                            <strong>
                              {formatCurrency(notification.amount)}
                            </strong>
                            {notification.isPaid ? (
                              <span className={cx("paid-status")}>
                                ✅ Đã thanh toán
                              </span>
                            ) : (
                              <span className={cx("payment-action")}>
                                💳 Nhấn để thanh toán
                              </span>
                            )}
                          </div>
                        )}

                      {/* Hiển thị cho appointment_success */}
                      {notification.amount &&
                        notification.type === "appointment_success" && (
                          <div className={cx("amount", "success-amount")}>
                            <strong>
                              ✅ Đã thanh toán:{" "}
                              {formatCurrency(notification.amount)}
                            </strong>
                          </div>
                        )}

                      {/* Hiển thị cho appointment_completed */}
                      {notification.type === "appointment_completed" && (
                        <div className={cx("feedback-action")}>
                          {notification.canFeedback ? (
                            <span className={cx("feedback-prompt")}>
                              Nhấn để đánh giá
                            </span>
                          ) : (
                            <span className={cx("feedback-done")}>
                              ✅ Đã đánh giá
                            </span>
                          )}
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
                ));
              } else {
                return (
                  <div className={cx("empty")}>
                    <FontAwesomeIcon icon={faBell} />
                    <p>Không có thông báo nào</p>
                  </div>
                );
              }
            })()}
          </div>

          {notifications.length > 0 && (
            <div className={cx("footer")}>
              <button
                className={cx("view-all-btn")}
                onClick={() => {
                  navigate("/my-appointments");
                  setIsOpen(false);
                }}
              >
                Xem tất cả lịch hẹn
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default NotificationBell;
