import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalendarAlt,
  faClock,
  faUserMd,
  faPhone,
  faEnvelope,
  faStethoscope,
  faNotesMedical,
  faMoneyBillWave,
  faEye,
  faEdit,
  faTrash,
  faFilter,
  faSearch,
  faSpinner,
  faExclamationTriangle,
  faCheckCircle,
  faTimesCircle,
  faHourglassHalf,
  faCalendarCheck,
  faRefresh
} from '@fortawesome/free-solid-svg-icons';
import axiosClient from '../../services/axiosClient';
import classNames from 'classnames/bind';
import styles from './MyAppointments.module.scss';

const cx = classNames.bind(styles);

function MyAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Filter states
  const [filters, setFilters] = useState({
    status: 'all',
    dateRange: 'all',
    searchTerm: ''
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const appointmentsPerPage = 6;

  // Get user info
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const accessToken = localStorage.getItem('accessToken');

  // Status mapping
  const getStatusInfo = (status) => {
    const statusMap = {
      'pending': {
        label: 'Chờ xác nhận',
        color: 'warning',
        icon: faHourglassHalf,
        bgColor: '#fff8e1',
        textColor: '#e65100'
      },
      'confirmed': {
        label: 'Đã xác nhận',
        color: 'success',
        icon: faCheckCircle,
        bgColor: '#e8f5e8',
        textColor: '#2e7d32'
      },
      'success': {
        label: 'Hoàn thành',
        color: 'info',
        icon: faCalendarCheck,
        bgColor: '#e3f2fd',
        textColor: '#1976d2'
      },
      'rejected': {
        label: 'Đã hủy',
        color: 'danger',
        icon: faTimesCircle,
        bgColor: '#ffebee',
        textColor: '#d32f2f'
      }
    };
    return statusMap[status] || statusMap['pending'];
  };

  // Fetch appointments
  const fetchAppointments = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await axiosClient.get(`/v1/appointments/user/${user.user_id}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'x-access-token': accessToken
        }
      });

      if (response.data?.success) {
        const userAppointments = response.data.data.filter(
          appointment => appointment.user_id === user.user_id
        );

        // Sort by created date (newest first)
        const sortedAppointments = userAppointments.sort((a, b) =>
          new Date(b.created_at) - new Date(a.created_at)
        );

        setAppointments(sortedAppointments);
        setFilteredAppointments(sortedAppointments);
        console.log('✅ Fetched appointments:', sortedAppointments);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('❌ Error fetching appointments:', error);
      setError('Không thể tải danh sách cuộc hẹn. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  // Filter appointments
  const applyFilters = () => {
    let filtered = [...appointments];

    // Filter by status
    if (filters.status !== 'all') {
      filtered = filtered.filter(apt => apt.status === filters.status);
    }

    // Filter by date range
    if (filters.dateRange !== 'all') {
      const today = new Date();
      const filterDate = new Date();

      switch (filters.dateRange) {
        case 'week':
          filterDate.setDate(today.getDate() - 7);
          break;
        case 'month':
          filterDate.setMonth(today.getMonth() - 1);
          break;
        case 'quarter':
          filterDate.setMonth(today.getMonth() - 3);
          break;
        default:
          break;
      }

      if (filters.dateRange !== 'all') {
        filtered = filtered.filter(apt =>
          new Date(apt.created_at) >= filterDate
        );
      }
    }

    // Filter by search term
    if (filters.searchTerm.trim()) {
      const searchTerm = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(apt =>
        apt.fullName?.toLowerCase().includes(searchTerm) ||
        apt.doctorName?.toLowerCase().includes(searchTerm) ||
        apt.consultant_type?.toLowerCase().includes(searchTerm) ||
        apt.symptoms?.toLowerCase().includes(searchTerm)
      );
    }

    setFilteredAppointments(filtered);
    setCurrentPage(1); // Reset to first page
  };

  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  // View appointment details
  const viewAppointmentDetails = (appointment) => {
    setSelectedAppointment(appointment);
    setShowModal(true);
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Format time
  const formatTime = (timeString) => {
    return timeString || 'Chưa xác định';
  };

  // Pagination
  const indexOfLastAppointment = currentPage * appointmentsPerPage;
  const indexOfFirstAppointment = indexOfLastAppointment - appointmentsPerPage;
  const currentAppointments = filteredAppointments.slice(
    indexOfFirstAppointment,
    indexOfLastAppointment
  );
  const totalPages = Math.ceil(filteredAppointments.length / appointmentsPerPage);

  // Effects
  useEffect(() => {
    if (accessToken && user.user_id) {
      fetchAppointments();
    }
  }, [accessToken, user.user_id]);

  useEffect(() => {
    applyFilters();
  }, [filters, appointments]);

  // Loading state
  if (isLoading) {
    return (
      <div className={cx('appointments-page')}>
        <div className={cx('loading-container')}>
          <FontAwesomeIcon icon={faSpinner} spin className={cx('loading-icon')} />
          <p>Đang tải danh sách cuộc hẹn...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={cx('appointments-page')}>
        <div className={cx('error-container')}>
          <FontAwesomeIcon icon={faExclamationTriangle} className={cx('error-icon')} />
          <h3>Có lỗi xảy ra</h3>
          <p>{error}</p>
          <button
            className={cx('retry-btn')}
            onClick={fetchAppointments}
          >
            <FontAwesomeIcon icon={faRefresh} />
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={cx('appointments-page')}>
      {/* Header */}
      <div className={cx('page-header')}>
        <div className={cx('header-content')}>
          <h1 className={cx('page-title')}>
            <FontAwesomeIcon icon={faCalendarAlt} />
            Lịch hẹn của tôi
          </h1>
          <p className={cx('page-subtitle')}>
            Quản lý và theo dõi tất cả các cuộc hẹn tư vấn của bạn
          </p>
        </div>

        <div className={cx('header-stats')}>
          <div className={cx('stat-item')}>
            <span className={cx('stat-number')}>{appointments.length}</span>
            <span className={cx('stat-label')}>Tổng cuộc hẹn</span>
          </div>
          <div className={cx('stat-item')}>
            <span className={cx('stat-number')}>
              {appointments.filter(apt => apt.status === 'confirmed').length}
            </span>
            <span className={cx('stat-label')}>Đã xác nhận</span>
          </div>
          <div className={cx('stat-item')}>
            <span className={cx('stat-number')}>
              {appointments.filter(apt => apt.status === 'pending').length}
            </span>
            <span className={cx('stat-label')}>Chờ xác nhận</span>
          </div>
          <div className={cx('stat-item')}>
            <span className={cx('stat-number')}>
              {appointments.filter(apt => apt.status === 'success').length}
            </span>
            <span className={cx('stat-label')}>Hoàn thành</span>
          </div>
          <div className={cx('stat-item')}>
            <span className={cx('stat-number')}>
              {appointments.filter(apt => apt.status === 'rejected').length}
            </span>
            <span className={cx('stat-label')}>Đã hủy</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className={cx('filters-section')}>
        <div className={cx('filters-container')}>
          {/* Search */}
          <div className={cx('search-box')}>
            <FontAwesomeIcon icon={faSearch} className={cx('search-icon')} />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên, bác sĩ, loại tư vấn..."
              value={filters.searchTerm}
              onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
              className={cx('search-input')}
            />
          </div>

          {/* Status Filter */}
          <div className={cx('filter-group')}>
            <label className={cx('filter-label')}>
              <FontAwesomeIcon icon={faFilter} />
              Trạng thái
            </label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className={cx('filter-select')}
            >
              <option value="all">Tất cả</option>
              <option value="pending">Chờ xác nhận</option>
              <option value="confirmed">Đã xác nhận</option>
              <option value="success">Hoàn thành</option>
              <option value="rejected">Đã hủy</option>
            </select>
          </div>

          {/* Date Range Filter */}
          <div className={cx('filter-group')}>
            <label className={cx('filter-label')}>
              <FontAwesomeIcon icon={faCalendarAlt} />
              Thời gian
            </label>
            <select
              value={filters.dateRange}
              onChange={(e) => handleFilterChange('dateRange', e.target.value)}
              className={cx('filter-select')}
            >
              <option value="all">Tất cả</option>
              <option value="week">7 ngày qua</option>
              <option value="month">1 tháng qua</option>
              <option value="quarter">3 tháng qua</option>
            </select>
          </div>

          {/* Results count */}
          <div className={cx('results-count')}>
            Hiển thị {filteredAppointments.length} cuộc hẹn
          </div>
        </div>
      </div>

      {/* Appointments List */}
      <div className={cx('appointments-container')}>
        {currentAppointments.length > 0 ? (
          <div className={cx('appointments-grid')}>
            {currentAppointments.map((appointment) => {
              const statusInfo = getStatusInfo(appointment.status);

              return (
                <div key={appointment.id} className={cx('appointment-card')}>
                  {/* Card Header */}
                  <div className={cx('card-header')}>
                    <div
                      className={cx('status-badge')}
                      style={{
                        backgroundColor: statusInfo.bgColor,
                        color: statusInfo.textColor
                      }}
                    >
                      <FontAwesomeIcon icon={statusInfo.icon} />
                      {statusInfo.label}
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className={cx('card-content')}>
                    {/* Patient Info */}
                    <div className={cx('info-section')}>
                      <h3 className={cx('patient-name')}>
                        {user.last_name} {user.first_name}
                      </h3>
                      <div className={cx('contact-info')}>
                        <span className={cx('info-item')}>
                          <FontAwesomeIcon icon={faPhone} />
                          {user.phone}
                        </span>
                        <span className={cx('info-item')}>
                          <FontAwesomeIcon icon={faEnvelope} />
                          {user.email}
                        </span>
                      </div>
                    </div>

                    {/* Appointment Details */}
                    <div className={cx('appointment-details')}>
                      <div className={cx('detail-item')}>
                        <FontAwesomeIcon icon={faCalendarAlt} />
                        <span>
                          <strong>Ngày:</strong> {formatDate(appointment.appointmentDate)}
                        </span>
                      </div>
                      <div className={cx('detail-item')}>
                        <FontAwesomeIcon icon={faClock} />
                        <span>
                          <strong>Giờ:</strong> {formatTime(appointment.appointment_time)}
                        </span>
                      </div>
                      <div className={cx('detail-item')}>
                        <FontAwesomeIcon icon={faUserMd} />
                        <span>
                          <strong>Bác sĩ:</strong> {appointment.doctor_id || 'Chưa phân công'}
                        </span>
                      </div>
                      <div className={cx('detail-item')}>
                        <FontAwesomeIcon icon={faStethoscope} />
                        <span>
                          <strong>Loại tư vấn:</strong> {appointment.consultant_type}
                        </span>
                      </div>
                      {appointment.price_apm && (
                        <div className={cx('detail-item')}>
                          <FontAwesomeIcon icon={faMoneyBillWave} />
                          <span>
                            <strong>Phí tư vấn:</strong> {appointment.price_apm.toLocaleString('vi-VN')}đ
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Symptoms */}
                    {appointment.symptoms && (
                      <div className={cx('symptoms-section')}>
                        <div className={cx('symptoms-header')}>
                          <FontAwesomeIcon icon={faNotesMedical} />
                          <span>Triệu chứng:</span>
                        </div>
                        <p className={cx('symptoms-text')}>
                          {appointment.symptoms}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Card Actions */}
                  <div className={cx('card-actions')}>
                    <button
                      className={cx('action-btn', 'view-btn')}
                      onClick={() => viewAppointmentDetails(appointment)}
                    >
                      <FontAwesomeIcon icon={faEye} />
                      Xem chi tiết
                    </button>

                    {['pending', 'confirmed'].includes(appointment.status) && (
                      <button className={cx('action-btn', 'cancel-btn')}>
                        <FontAwesomeIcon icon={faTrash} />
                        Hủy hẹn
                      </button>
                    )}
                  </div>

                  {/* Created Date */}
                  <div className={cx('card-footer')}>
                    <small className={cx('created-date')}>
                      Đặt lịch: {formatDate(appointment.created_at)}
                    </small>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className={cx('empty-state')}>
            <FontAwesomeIcon icon={faCalendarAlt} className={cx('empty-icon')} />
            <h3>Không có cuộc hẹn nào</h3>
            <p>
              {filters.status !== 'all' || filters.dateRange !== 'all' || filters.searchTerm
                ? 'Không tìm thấy cuộc hẹn nào phù hợp với bộ lọc của bạn.'
                : 'Bạn chưa có cuộc hẹn nào. Hãy đặt lịch tư vấn ngay!'
              }
            </p>
            <button
              className={cx('primary-btn')}
              onClick={() => window.location.href = '/appointment'}
            >
              Đặt lịch tư vấn
            </button>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className={cx('pagination')}>
          <button
            className={cx('page-btn', { disabled: currentPage === 1 })}
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Trước
          </button>

          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index + 1}
              className={cx('page-btn', { active: currentPage === index + 1 })}
              onClick={() => setCurrentPage(index + 1)}
            >
              {index + 1}
            </button>
          ))}

          <button
            className={cx('page-btn', { disabled: currentPage === totalPages })}
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Sau
          </button>
        </div>
      )}

      {/* Modal for appointment details */}
      {showModal && selectedAppointment && (
        <div className={cx('modal-overlay')} onClick={() => setShowModal(false)}>
          <div className={cx('modal-content')} onClick={(e) => e.stopPropagation()}>
            <div className={cx('modal-header')}>
              <h2>Chi tiết cuộc hẹn</h2>
              <button
                className={cx('close-btn')}
                onClick={() => setShowModal(false)}
              >
                ×
              </button>
            </div>

            <div className={cx('modal-body')}>
              {/* Detailed appointment information */}
              <div className={cx('detail-grid')}>
                <div className={cx('detail-row')}>
                  <strong>Trạng thái:</strong>
                  <span className={cx('status-text', getStatusInfo(selectedAppointment.status).color)}>
                    {getStatusInfo(selectedAppointment.status).label}
                  </span>
                </div>
                <div className={cx('detail-row')}>
                  <strong>Họ tên:</strong>
                  <span>{user.last_name} {user.first_name}</span>
                </div>
                <div className={cx('detail-row')}>
                  <strong>Ngày sinh:</strong>
                  <span>{formatDate(user.birthDate)}</span>
                </div>
                <div className={cx('detail-row')}>
                  <strong>Số điện thoại:</strong>
                  <span>{user.phone}</span>
                </div>
                <div className={cx('detail-row')}>
                  <strong>Email:</strong>
                  <span>{user.email}</span>
                </div>
                <div className={cx('detail-row')}>
                  <strong>Địa chỉ:</strong>
                  <span>{user.address || 'Không có'}</span>
                </div>
                <div className={cx('detail-row')}>
                  <strong>Loại tư vấn:</strong>
                  <span>{selectedAppointment.consultant_type}</span>
                </div>
                <div className={cx('detail-row')}>
                  <strong>Bác sĩ:</strong>
                  <span>{selectedAppointment.doctor_id || 'Chưa phân công'}</span>
                </div>
                <div className={cx('detail-row')}>
                  <strong>Ngày tư vấn:</strong>
                  <span>{formatDate(selectedAppointment.appointmentDate)}</span>
                </div>
                <div className={cx('detail-row')}>
                  <strong>Giờ tư vấn:</strong>
                  <span>{formatTime(selectedAppointment.appointment_time)}</span>
                </div>
                {selectedAppointment.price_apm && (
                  <div className={cx('detail-row')}>
                    <strong>Phí tư vấn:</strong>
                    <span>{selectedAppointment.price_apm.toLocaleString('vi-VN')}đ</span>
                  </div>
                )}
                <div className={cx('detail-row')}>
                  <strong>Ngày đặt:</strong>
                  <span>{formatDate(selectedAppointment.created_at)}</span>
                </div>
              </div>

              {/* Medical Information */}
              {(selectedAppointment.symptoms || selectedAppointment.medicalHistory || selectedAppointment.notes) && (
                <div className={cx('medical-info')}>
                  <h3>Thông tin y tế</h3>

                  {selectedAppointment.symptoms && (
                    <div className={cx('medical-item')}>
                      <strong>Triệu chứng:</strong>
                      <p>{selectedAppointment.symptoms}</p>
                    </div>
                  )}

                  {selectedAppointment.medicalHistory && (
                    <div className={cx('medical-item')}>
                      <strong>Tiền sử bệnh:</strong>
                      <p>{selectedAppointment.medicalHistory}</p>
                    </div>
                  )}

                  {selectedAppointment.notes && (
                    <div className={cx('medical-item')}>
                      <strong>Ghi chú:</strong>
                      <p>{selectedAppointment.notes}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyAppointments;