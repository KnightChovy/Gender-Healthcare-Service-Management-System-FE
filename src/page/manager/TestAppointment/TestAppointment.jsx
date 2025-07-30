import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFlaskVial,
  faEye,
  faPhone,
  faEnvelope,
  faDownload,
  faCheckCircle,
  faHourglassHalf,
  faTimesCircle,
  faSpinner,
  faExclamationTriangle,
  faRefresh,
  faChartBar,
  faCalendarAlt,
} from "@fortawesome/free-solid-svg-icons";
import classNames from "classnames/bind";
import styles from "./TestAppointment.module.scss";
import axiosClient from "../../../services/axiosClient";

const cx = classNames.bind(styles);

export const TestAppointment = () => {
  const [testAppointments, setTestAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filters, setFilters] = useState({
    status: "all",
    dateRange: "all",
    searchTerm: "",
  });

  // Get access token
  const accessToken = localStorage.getItem("accessToken");

  // Fetch test appointments from API
  const fetchTestAppointments = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await axiosClient.get("/v1/staff/getAllOrder", {
        headers: {
          "x-access-token": accessToken,
        },
      });

      if (response.data?.status === "success" && response.data?.data?.orders) {
        // Transform API data to component format
        const transformedData = response.data.data.orders.map((item) => {
          const order = item.order;
          const services = item.services;
          const details = item.details || [];

          // Gắn exam_date, exam_time vào từng service
          const servicesWithDetails = services.map((service) => {
            // Tìm detail tương ứng với service_id
            const detail = details.find(
              (d) => d.service.service_id === service.service_id
            );
            return {
              ...service,
              exam_date: detail?.exam_date ?? null,
              exam_time: detail?.exam_time ?? null,
              // Có thể bổ sung các trường khác của detail nếu muốn
              order_detail_id: detail?.order_detail_id ?? null,
              detail_description:
                detail?.service?.description ?? service.description,
              result_wait_time:
                detail?.service?.result_wait_time ?? service.result_wait_time,
            };
          });

          // Nếu muốn tổng hợp ngày/giờ xét nghiệm chung (nếu chỉ có 1 dịch vụ)
          let test_date = null,
            test_time = null;
          if (details.length === 1) {
            test_date = details[0].exam_date;
            test_time = details[0].exam_time;
          }

          return {
            id: order.order_id,
            order_id: order.order_id,
            user_id: order.user_id,
            user_name: `${order.user.last_name} ${order.user.first_name}`,
            user_phone: order.user.phone,
            user_email: order.user.email,
            test_type: services.map((service) => service.name).join(", "),
            services: servicesWithDetails, // sử dụng service đã gắn detail
            total_amount: order.total_amount,
            order_type: order.order_type,
            payment_method: order.payment_method,
            status: mapOrderStatusToTestStatus(order.order_status),
            original_status: order.order_status,
            created_at: order.created_at,
            // Thông tin test cụ thể (nếu muốn show ngoài bảng)
            test_date,
            test_time,
            notes: null,
            result_summary: null,
            detailed_results: null,
            doctor_notes: null,
            result_file: null,
          };
        });

        setTestAppointments(transformedData);
      } else {
        throw new Error("Không thể tải dữ liệu đơn hàng");
      }
    } catch (error) {
      console.error("Error fetching test appointments:", error);
      setError(
        error.response?.data?.message ||
          "Không thể tải danh sách đơn hàng xét nghiệm"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Map order status to test status
  const mapOrderStatusToTestStatus = (orderStatus) => {
    const statusMap = {
      pending: "pending",
      paid: "paid",
      completed: "completed",
      cancelled: "cancelled",
    };
    return statusMap[orderStatus] || "pending";
  };

  // Fetch data on component mount
  useEffect(() => {
    if (accessToken) {
      fetchTestAppointments();
    } else {
      setError("Không tìm thấy token xác thực");
      setIsLoading(false);
    }
  }, [accessToken]);

  const getStatusInfo = (status) => {
    const statusMap = {
      pending: {
        label: "Chờ xét nghiệm",
        bgColor: "#fbbf24",
        textColor: "#ffffff",
        icon: faHourglassHalf,
      },
      paid: {
        label: "Đã thanh toán, chờ xét nghiệm",
        bgColor: "#3b82f6",
        textColor: "#ffffff",
        icon: faFlaskVial,
      },
      completed: {
        label: "Đã hoàn thành",
        bgColor: "#10b981",
        textColor: "#ffffff",
        icon: faCheckCircle,
      },
      cancelled: {
        label: "Đã hủy",
        bgColor: "#ef4444",
        textColor: "#ffffff",
        icon: faTimesCircle,
      },
    };
    return statusMap[status] || statusMap.pending;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Chưa xác định";
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const viewAppointmentDetails = (appointment) => {
    setSelectedAppointment(appointment);
    setShowModal(true);
  };

  // Filter appointments based on filters
  const filteredAppointments = testAppointments.filter((appointment) => {
    const matchesStatus =
      filters.status === "all" || appointment.status === filters.status;
    const matchesSearch =
      filters.searchTerm === "" ||
      appointment.user_name
        .toLowerCase()
        .includes(filters.searchTerm.toLowerCase()) ||
      appointment.order_id
        .toLowerCase()
        .includes(filters.searchTerm.toLowerCase()) ||
      appointment.test_type
        .toLowerCase()
        .includes(filters.searchTerm.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  // Calculate statistics
  const stats = {
    total: testAppointments.length,
    pending: testAppointments.filter((apt) => apt.status === "pending").length,
    paid: testAppointments.filter((apt) => apt.status === "paid").length,
    completed: testAppointments.filter((apt) => apt.status === "completed")
      .length,
    cancelled: testAppointments.filter((apt) => apt.status === "cancelled")
      .length,
    totalRevenue: testAppointments
      .filter((apt) => apt.original_status === "completed")
      .reduce((sum, apt) => sum + apt.total_amount, 0),
  };

  // Loading state
  if (isLoading) {
    return (
      <div className={cx("test-appointments-page")}>
        <div className={cx("loading-container")}>
          <FontAwesomeIcon
            icon={faSpinner}
            spin
            className={cx("loading-icon")}
          />
          <p>Đang tải danh sách đơn hàng xét nghiệm...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={cx("test-appointments-page")}>
        <div className={cx("error-container")}>
          <FontAwesomeIcon
            icon={faExclamationTriangle}
            className={cx("error-icon")}
          />
          <h3>Có lỗi xảy ra</h3>
          <p>{error}</p>
          <button className={cx("retry-btn")} onClick={fetchTestAppointments}>
            <FontAwesomeIcon icon={faRefresh} /> Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={cx("test-appointments-page")}>
      {/* Header with enhanced stats for Manager */}
      <div className={cx("page-header")}>
        <div className={cx("header-top")}>
          <h1>
            <FontAwesomeIcon icon={faChartBar} className={cx("header-icon")} />
            Quản lý đơn hàng xét nghiệm
          </h1>
          <div className={cx("header-actions")}>
            <button
              className={cx("refresh-btn")}
              onClick={fetchTestAppointments}
            >
              <FontAwesomeIcon icon={faRefresh} />
              Làm mới
            </button>
          </div>
        </div>

        <div className={cx("stats-grid")}>
          <div className={cx("stat-card", "total")}>
            <div className={cx("stat-icon")}>
              <FontAwesomeIcon icon={faFlaskVial} />
            </div>
            <div className={cx("stat-content")}>
              <span className={cx("stat-value")}>{stats.total}</span>
              <span className={cx("stat-label")}>Tổng đơn hàng</span>
            </div>
          </div>

          <div className={cx("stat-card", "pending")}>
            <div className={cx("stat-icon")}>
              <FontAwesomeIcon icon={faHourglassHalf} />
            </div>
            <div className={cx("stat-content")}>
              <span className={cx("stat-value")}>{stats.pending}</span>
              <span className={cx("stat-label")}>Chờ xử lý</span>
            </div>
          </div>

          <div className={cx("stat-card", "progress")}>
            <div className={cx("stat-icon")}>
              <FontAwesomeIcon icon={faFlaskVial} />
            </div>
            <div className={cx("stat-content")}>
              <span className={cx("stat-value")}>{stats.paid}</span>
              <span className={cx("stat-label")}>
                Đã thanh toán, chờ xét nghiệm
              </span>
            </div>
          </div>

          <div className={cx("stat-card", "completed")}>
            <div className={cx("stat-icon")}>
              <FontAwesomeIcon icon={faCheckCircle} />
            </div>
            <div className={cx("stat-content")}>
              <span className={cx("stat-value")}>{stats.completed}</span>
              <span className={cx("stat-label")}>Hoàn thành</span>
            </div>
          </div>

          <div className={cx("stat-card", "revenue")}>
            <div className={cx("stat-icon")}>💰</div>
            <div className={cx("stat-content")}>
              <span className={cx("stat-value")}>
                {formatCurrency(stats.totalRevenue)}
              </span>
              <span className={cx("stat-label")}>Doanh thu</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className={cx("filters-section")}>
        <div className={cx("filters-row")}>
          <div className={cx("filter-group")}>
            <label>Tìm kiếm:</label>
            <input
              type="text"
              placeholder="Tìm theo tên, mã đơn, dịch vụ..."
              value={filters.searchTerm}
              onChange={(e) => handleFilterChange("searchTerm", e.target.value)}
              className={cx("search-input")}
            />
          </div>

          <div className={cx("filter-group")}>
            <label>Trạng thái:</label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange("status", e.target.value)}
              className={cx("status-filter")}
            >
              <option value="all">Tất cả</option>
              <option value="pending">Chờ xử lý</option>
              <option value="paid">Đã thanh toán, chờ xét nghiệm</option>
              <option value="completed">Hoàn thành</option>
              <option value="cancelled">Đã hủy</option>
            </select>
          </div>
        </div>

        <div className={cx("filter-summary")}>
          Hiển thị {filteredAppointments.length} / {testAppointments.length} đơn
          hàng
        </div>
      </div>

      {/* Table Container */}
      <div className={cx("table-container")}>
        <div className={cx("table-wrapper")}>
          <table className={cx("appointments-table")}>
            <thead>
              <tr>
                <th>STT</th>
                <th>Mã đơn hàng</th>
                <th>Trạng thái</th>
                <th>Khách hàng</th>
                <th>Dịch vụ xét nghiệm</th>
                <th>Tổng tiền</th>
                <th>Thanh toán</th>
                <th>Ngày đặt</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.length === 0 ? (
                <tr>
                  <td colSpan="9" className={cx("no-data")}>
                    {filters.searchTerm || filters.status !== "all"
                      ? "Không tìm thấy đơn hàng phù hợp với bộ lọc"
                      : "Không có đơn hàng xét nghiệm nào"}
                  </td>
                </tr>
              ) : (
                filteredAppointments.map((appointment, index) => {
                  const statusInfo = getStatusInfo(appointment.status);

                  return (
                    <tr key={appointment.id} className={cx("table-row")}>
                      {/* STT */}
                      <td className={cx("stt-cell")}>{index + 1}</td>

                      {/* Order ID */}
                      <td className={cx("order-id-cell")}>
                        <span className={cx("order-id")}>
                          {appointment.order_id}
                        </span>
                      </td>

                      {/* Status */}
                      <td className={cx("status-cell")}>
                        <span
                          className={cx("status-badge")}
                          style={{
                            backgroundColor: statusInfo.bgColor,
                            color: statusInfo.textColor,
                          }}
                        >
                          <FontAwesomeIcon icon={statusInfo.icon} />
                          {statusInfo.label}
                        </span>
                      </td>

                      {/* Customer Info */}
                      <td className={cx("customer-cell")}>
                        <div className={cx("customer-info")}>
                          <div className={cx("customer-name")}>
                            <strong>{appointment.user_name}</strong>
                          </div>
                          <div className={cx("contact-info")}>
                            <small>
                              <FontAwesomeIcon icon={faPhone} />{" "}
                              {appointment.user_phone}
                            </small>
                          </div>
                        </div>
                      </td>

                      {/* Test Services */}
                      <td className={cx("test-type-cell")}>
                        <div className={cx("services-list")}>
                          {appointment.services
                            .slice(0, 2)
                            .map((service, index) => (
                              <div key={index} className={cx("service-item")}>
                                <span className={cx("service-name")}>
                                  {service.name}
                                </span>
                              </div>
                            ))}
                          {appointment.services.length > 2 && (
                            <div className={cx("service-more")}>
                              +{appointment.services.length - 2} dịch vụ khác
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Total Amount */}
                      <td className={cx("amount-cell")}>
                        <span className={cx("total-amount")}>
                          {formatCurrency(appointment.total_amount)}
                        </span>
                      </td>

                      {/* Payment Method */}
                      <td className={cx("payment-cell")}>
                        <span className={cx("payment-method")}>
                          {appointment.payment_method === "cash"
                            ? "Tiền mặt"
                            : "Chuyển khoản"}
                        </span>
                      </td>

                      {/* Created Date */}
                      <td className={cx("created-cell")}>
                        <FontAwesomeIcon
                          icon={faCalendarAlt}
                          className={cx("date-icon")}
                        />
                        {formatDate(appointment.created_at)}
                      </td>

                      {/* Actions - Manager only views */}
                      <td className={cx("actions-cell")}>
                        <div className={cx("action-buttons")}>
                          <button
                            className={cx("action-btn", "view-btn")}
                            onClick={() => viewAppointmentDetails(appointment)}
                            title="Xem chi tiết"
                          >
                            <FontAwesomeIcon icon={faEye} />
                          </button>

                          {appointment.status === "completed" &&
                            appointment.result_file && (
                              <button
                                className={cx("action-btn", "download-btn")}
                                onClick={() =>
                                  window.open(appointment.result_file, "_blank")
                                }
                                title="Tải kết quả"
                              >
                                <FontAwesomeIcon icon={faDownload} />
                              </button>
                            )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal - Manager View Only */}
      {showModal && selectedAppointment && (
        <div
          className={cx("modal-overlay")}
          onClick={() => setShowModal(false)}
        >
          <div
            className={cx("modal-content", "manager-view")}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={cx("modal-header")}>
              <h2>
                <FontAwesomeIcon icon={faEye} className={cx("modal-icon")} />
                Chi tiết đơn hàng xét nghiệm
              </h2>
              <button
                className={cx("close-btn")}
                onClick={() => setShowModal(false)}
              >
                ×
              </button>
            </div>

            <div className={cx("modal-body")}>
              {/* Status Overview */}
              <div className={cx("status-overview")}>
                <div className={cx("status-card")}>
                  <FontAwesomeIcon
                    icon={getStatusInfo(selectedAppointment.status).icon}
                    className={cx("status-icon")}
                    style={{
                      color: getStatusInfo(selectedAppointment.status).bgColor,
                    }}
                  />
                  <div className={cx("status-info")}>
                    <h4>Trạng thái hiện tại</h4>
                    <span className={cx("status-label")}>
                      {getStatusInfo(selectedAppointment.status).label}
                    </span>
                  </div>
                </div>
              </div>

              {/* Basic Information */}
              <div className={cx("info-section")}>
                <h3>Thông tin cơ bản</h3>
                <div className={cx("detail-grid")}>
                  <div className={cx("detail-row")}>
                    <strong>Mã đơn hàng:</strong>
                    <span className={cx("highlight")}>
                      {selectedAppointment.order_id}
                    </span>
                  </div>
                  <div className={cx("detail-row")}>
                    <strong>Ngày đặt đơn:</strong>
                    <span>{formatDate(selectedAppointment.created_at)}</span>
                  </div>
                  <div className={cx("detail-row")}>
                    <strong>Loại đơn hàng:</strong>
                    <span>
                      {selectedAppointment.order_type === "directly"
                        ? "Trực tiếp"
                        : "Online"}
                    </span>
                  </div>
                  <div className={cx("detail-row")}>
                    <strong>Phương thức thanh toán:</strong>
                    <span>
                      {selectedAppointment.payment_method === "cash"
                        ? "Tiền mặt"
                        : "Chuyển khoản"}
                    </span>
                  </div>
                  <div className={cx("detail-row")}>
                    <strong>Tổng tiền:</strong>
                    <span className={cx("total-amount", "highlight")}>
                      {formatCurrency(selectedAppointment.total_amount)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Customer Information */}
              <div className={cx("info-section")}>
                <h3>Thông tin khách hàng</h3>
                <div className={cx("customer-detail")}>
                  <div className={cx("customer-avatar")}>
                    {selectedAppointment.user_name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div className={cx("customer-info")}>
                    <h4>{selectedAppointment.user_name}</h4>
                    <div className={cx("contact-details")}>
                      <div>
                        <FontAwesomeIcon icon={faPhone} />
                        <span>{selectedAppointment.user_phone}</span>
                      </div>
                      <div>
                        <FontAwesomeIcon icon={faEnvelope} />
                        <span>{selectedAppointment.user_email}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Services Detail */}
              <div className={cx("info-section")}>
                <h3>
                  Chi tiết dịch vụ ({selectedAppointment.services.length} dịch
                  vụ)
                </h3>
                <div className={cx("services-detail")}>
                  {selectedAppointment.services.map((service, index) => (
                    <div key={index} className={cx("service-detail-card")}>
                      <div className={cx("service-header")}>
                        <div className={cx("service-number")}>#{index + 1}</div>
                        <div className={cx("service-main")}>
                          <span className={cx("service-name")}>
                            {service.name}
                          </span>
                          <span className={cx("service-price")}>
                            {formatCurrency(parseFloat(service.price))}
                          </span>
                        </div>
                      </div>
                      <div className={cx("service-description")}>
                        {service.detail_description}
                      </div>
                      <div className={cx("service-test-info")}>
                        <div>
                          <strong>Ngày xét nghiệm:</strong>{" "}
                          {service.exam_date
                            ? formatDate(service.exam_date)
                            : "Chưa xác định"}
                        </div>
                        <div>
                          <strong>Giờ xét nghiệm:</strong>{" "}
                          {service.exam_time ?? "Chưa xác định"}
                        </div>
                        <div>
                          <strong>Thời gian trả kết quả:</strong>{" "}
                          {service.result_wait_time ?? "Không rõ"}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Result Information (if available) */}
              {selectedAppointment.result_summary && (
                <div className={cx("info-section")}>
                  <h3>Kết quả xét nghiệm</h3>
                  <div className={cx("result-summary")}>
                    <div className={cx("result-item")}>
                      <strong>Tóm tắt kết quả:</strong>
                      <p className={cx("result-text")}>
                        {selectedAppointment.result_summary}
                      </p>
                    </div>
                    {selectedAppointment.detailed_results && (
                      <div className={cx("result-item")}>
                        <strong>Chi tiết kết quả:</strong>
                        <p
                          className={cx("result-text")}
                          style={{ whiteSpace: "pre-line" }}
                        >
                          {selectedAppointment.detailed_results}
                        </p>
                      </div>
                    )}
                    {selectedAppointment.doctor_notes && (
                      <div className={cx("result-item")}>
                        <strong>Ghi chú của bác sĩ:</strong>
                        <p className={cx("result-text")}>
                          {selectedAppointment.doctor_notes}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {selectedAppointment.notes && (
                <div className={cx("info-section")}>
                  <h3>Ghi chú</h3>
                  <p className={cx("notes-text")}>
                    {selectedAppointment.notes}
                  </p>
                </div>
              )}
            </div>

            <div className={cx("modal-footer")}>
              <button
                className={cx("close-modal-btn")}
                onClick={() => setShowModal(false)}
              >
                Đóng
              </button>
              {selectedAppointment.result_file && (
                <button
                  className={cx("download-result-btn")}
                  onClick={() =>
                    window.open(selectedAppointment.result_file, "_blank")
                  }
                >
                  <FontAwesomeIcon icon={faDownload} />
                  Tải kết quả
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
