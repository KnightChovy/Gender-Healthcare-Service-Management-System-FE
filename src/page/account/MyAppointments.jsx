import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalendarAlt, faClock, faUserMd, faPhone, faEnvelope, faStethoscope,
  faNotesMedical, faMoneyBillWave, faEye, faTrash, faFilter, faSearch,
  faSpinner, faExclamationTriangle, faCheckCircle, faTimesCircle, faHourglassHalf,
  faCalendarCheck, faRefresh, faCreditCard, faVideo, faStar, faFlaskVial
} from '@fortawesome/free-solid-svg-icons';
import axiosClient from '../../services/axiosClient';
import classNames from 'classnames/bind';
import styles from './MyAppointments.module.scss';

const cx = classNames.bind(styles);

const hashAppointmentId = (appointmentId) => {
  return btoa(appointmentId.toString()).replace(/=/g, "");
};

function MyAppointments() {
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false); // Add loading state for cancel
  const [filters, setFilters] = useState({
    status: 'all',
    dateRange: 'all',
    searchTerm: ''
  });
  const [currentPage, setCurrentPage] = useState(1);

  const appointmentsPerPage = 6;
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const accessToken = localStorage.getItem('accessToken');

  // Helper function to check if appointment has feedback
  const checkFeedbackStatus = (appointment) => {
    // Check if appointment has feedback array and valid rating
    return !!appointment.feedback;
  };

  // Handle feedback navigation
  const handleFeedbackNavigation = (appointment) => {
    const appointmentId = appointment.appointment_id || appointment.id;
    const hasFeedback = checkFeedbackStatus(appointment);

    if (hasFeedback) {
      // Đã đánh giá -> đi trang chủ feedback với highlight
      navigate("/feedback", {
        state: { 
          highlightAppointment: appointmentId,
          message: "Bạn đã đánh giá buổi tư vấn này. Xem lại đánh giá của bạn bên dưới."
        }
      });
    } else {
      // Chưa đánh giá -> đi trang đánh giá
      navigate(`/feedback/consultation/${appointmentId}`, {
        state: { appointmentData: appointment }
      });
    }
  };

  // Cập nhật statusConfig để thêm status completed
  const statusConfig = {
    'pending': { label: 'Chờ xác nhận', icon: faHourglassHalf, bgColor: '#fff8e1', textColor: '#e65100' },
    'confirmed': { label: 'Đã xác nhận', icon: faCheckCircle, bgColor: '#e8f5e8', textColor: '#2e7d32' },
    'success': { label: 'Đã hoàn thành thanh toán', icon: faCalendarCheck, bgColor: '#e3f2fd', textColor: '#1976d2' },
    'completed': { label: 'Đã hoàn thành tư vấn', icon: faCheckCircle, bgColor: '#f3e5f5', textColor: '#7b1fa2' },
    'rejected': { label: 'Đã hủy', icon: faTimesCircle, bgColor: '#ffebee', textColor: '#d32f2f' }
  };

  const getStatusInfo = (status) => statusConfig[status] || statusConfig['pending'];

  const fetchAppointments = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await axiosClient.get(`/v1/appointments/user/${user.user_id}`, {
        headers: { 'x-access-token': accessToken }
      });

      if (response.data?.success) {
        const userAppointments = response.data.data
          .filter(appointment => appointment.user_id === user.user_id)
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

        setAppointments(userAppointments);
        setFilteredAppointments(userAppointments);
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

  const applyFilters = () => {
    let filtered = [...appointments];

    if (filters.status !== 'all') {
      filtered = filtered.filter(apt => apt.status === filters.status);
    }

    if (filters.dateRange !== 'all') {
      const today = new Date();
      const days = { week: 7, month: 30, quarter: 90 }[filters.dateRange];
      const filterDate = new Date(today.getTime() - days * 24 * 60 * 60 * 1000);
      filtered = filtered.filter(apt => new Date(apt.created_at) >= filterDate);
    }

    if (filters.searchTerm.trim()) {
      const searchTerm = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(apt =>
        apt.fullName?.toLowerCase().includes(searchTerm) ||
        apt.doctor_name?.toLowerCase().includes(searchTerm) ||
        apt.consultant_type?.toLowerCase().includes(searchTerm) ||
        apt.symptoms?.toLowerCase().includes(searchTerm)
      );
    }

    setFilteredAppointments(filtered);
    setCurrentPage(1);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
  };

  const handlePayment = (appointment) => {
    const appointmentId = appointment.id || appointment.appointment_id;

    if (!appointmentId || !appointment.price_apm || appointment.price_apm <= 0) {
      alert('Cuộc hẹn này không thể thanh toán');
      return;
    }

    if (appointment.status === 'rejected') {
      alert('Không thể thanh toán cho cuộc hẹn đã bị hủy');
      return;
    }

    if (!['confirmed', '1'].includes(appointment.status)) {
      alert('Chỉ có thể thanh toán cho các cuộc hẹn đã được xác nhận');
      return;
    }

    navigate(`/paymentappointment/${appointmentId}`, {
      state: { appointmentData: appointment }
    });
  };

  const handleRebook = () => navigate('/services/appointment-consultation');

  const viewAppointmentDetails = (appointment) => {
    setSelectedAppointment(appointment);
    setShowModal(true);
  };

  const handleJoinMeeting = (appointment) => {
    const meetUrl = 'https://meet.google.com/ymf-dwbi-uhy';
    window.open(meetUrl, '_blank', 'noopener,noreferrer');
    console.log(`User joined meeting for appointment ${appointment.id}`);
  };

  // Utility functions
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    const numericAmount = Math.floor(parseFloat(amount) || 0);
    return numericAmount.toLocaleString('vi-VN') + 'đ';
  };

  const indexOfLastAppointment = currentPage * appointmentsPerPage;
  const indexOfFirstAppointment = indexOfLastAppointment - appointmentsPerPage;
  const currentAppointments = filteredAppointments.slice(indexOfFirstAppointment, indexOfLastAppointment);
  const totalPages = Math.ceil(filteredAppointments.length / appointmentsPerPage);

  useEffect(() => {
    if (accessToken && user.user_id) fetchAppointments();
  }, [accessToken, user.user_id]);

  useEffect(() => {
    applyFilters();
  }, [filters, appointments]);

  const isConsultationDay = (appointmentDate) => {
    if (!appointmentDate) return false;
    
    const today = new Date();
    const consultationDate = new Date(appointmentDate);

    today.setHours(0, 0, 0, 0);
    consultationDate.setHours(0, 0, 0, 0);

    return today.getTime() === consultationDate.getTime();
  };

  // Add handleCancelPaidAppointment function for refund process
  const handleCancelPaidAppointment = async (appointment) => {
    const appointmentId = appointment.appointment_id || appointment.id;
    
    const confirmCancel = window.confirm(
      `⚠️ HỦY CUỘC HẸN ⚠️\n\n` +
      `Cuộc hẹn: ${appointment.consultant_type}\n` +
      `Ngày: ${formatDate(appointment.appointment_date)}\n` +
      `Phí tư vấn: ${formatCurrency(appointment.price_apm)}\n\n` +
      `Bạn có chắc chắn muốn hủy và yêu cầu hoàn tiền?`
    );
    
    if (!confirmCancel) return;

    try {
      setIsCancelling(true);

      // Step 1: Send email notification
      try {
        await axiosClient.post('/v1/emails/send-appointment-cancellation', {
          appointment_id: appointmentId,
          reason: 'Thay đổi lịch trình cá nhân'
        }, {
          headers: { 'x-access-token': accessToken }
        });
        console.log('✅ Email sent successfully');
      } catch (emailError) {
        console.warn('⚠️ Email failed, continuing...', emailError);
      }

      // Step 2: Cancel appointment (existing API)
      const response = await axiosClient.post('/v1/users/cancel-appointment', {
        appointment_id: appointmentId
      }, {
        headers: { 'x-access-token': accessToken }
      });

      if (response.data?.success) {
        alert(
          `✅ HỦY CUỘC HẸN THÀNH CÔNG!\n\n` +
          `📧 Email thông báo đã được gửi đến: ${user.email}\n` +
          `💰 Hoàn tiền sẽ được xử lý trong 3-5 ngày làm việc\n\n` +
          `Vui lòng kiểm tra email để theo dõi.`
        );
        
        // Update status
        setAppointments(prevAppointments => 
          prevAppointments.map(apt => 
            (apt.appointment_id === appointmentId || apt.id === appointmentId)
              ? { ...apt, status: 'rejected' }
              : apt
          )
        );
        
        await fetchAppointments();
        
      } else {
        throw new Error(response.data?.message || 'Không thể hủy cuộc hẹn');
      }
    } catch (error) {
      console.error('❌ Error:', error);
      alert(
        error.response?.data?.message || 
        'Có lỗi xảy ra. Vui lòng liên hệ hỗ trợ.'
      );
    } finally {
      setIsCancelling(false);
    }
  };

  // Add handleCancel function
  const handleCancel = async (appointment) => {
    const appointmentId = appointment.appointment_id || appointment.id;
    
    // Confirmation dialog
    const confirmCancel = window.confirm(
      `Bạn có chắc chắn muốn hủy cuộc hẹn ${appointment.consultant_type} vào ngày ${formatDate(appointment.appointment_date)}?\n\nLưu ý: Sau khi hủy, bạn sẽ không thể hoàn tác được.`
    );
    
    if (!confirmCancel) {
      return;
    }

    try {
      setIsCancelling(true);

      const data = {
        appointment_id: appointmentId
      }

      const response = await axiosClient.post('/v1/users/cancel-appointment', data, {
        headers: { 
          'x-access-token': accessToken,
        }
      });

      if (response.data?.success) {
        // Show success message
        alert('Hủy cuộc hẹn thành công!');
        
        // Update the appointment status locally
        setAppointments(prevAppointments => 
          prevAppointments.map(apt => 
            (apt.appointment_id === appointmentId || apt.id === appointmentId)
              ? { ...apt, status: 'rejected' }
              : apt
          )
        );
        
        // Refresh appointments from server
        await fetchAppointments();
        
      } else {
        throw new Error(response.data?.message || 'Không thể hủy cuộc hẹn');
      }
    } catch (error) {
      console.error('❌ Error cancelling appointment:', error);
      
      // Show specific error messages
      if (error.response?.status === 400) {
        alert('Không thể hủy cuộc hẹn này. Vui lòng kiểm tra trạng thái cuộc hẹn.');
      } else if (error.response?.status === 404) {
        alert('Không tìm thấy cuộc hẹn để hủy.');
      } else if (error.response?.status === 403) {
        alert('Bạn không có quyền hủy cuộc hẹn này.');
      } else {
        alert(error.response?.data?.message || 'Có lỗi xảy ra khi hủy cuộc hẹn. Vui lòng thử lại.');
      }
    } finally {
      setIsCancelling(false);
    }
  };

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

  if (error) {
    return (
      <div className={cx('appointments-page')}>
        <div className={cx('error-container')}>
          <FontAwesomeIcon icon={faExclamationTriangle} className={cx('error-icon')} />
          <h3>Có lỗi xảy ra</h3>
          <p>{error}</p>
          <button className={cx('retry-btn')} onClick={fetchAppointments}>
            <FontAwesomeIcon icon={faRefresh} /> Thử lại
          </button>
        </div>
      </div>
    );
  }

  console.log('Appointments fetched:', appointments);

  const stats = [
    { label: 'Tổng cuộc hẹn', value: appointments.length },
    { label: 'Chờ xác nhận', value: appointments.filter(apt => apt.status === 'pending').length },
    { label: 'Đã xác nhận', value: appointments.filter(apt => apt.status === 'confirmed' && apt.booking === 0).length },
    { label: 'Đã hoàn thành thanh toán', value: appointments.filter(apt => apt.status === 'confirmed' && apt.booking === 1).length },
    { label: 'Đã hoàn thành tư vấn', value: appointments.filter(apt => apt.status === 'completed').length },
    { label: 'Đã hủy', value: appointments.filter(apt => apt.status === 'rejected').length }
  ];

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
          {stats.map((stat, index) => (
            <div key={index} className={cx('stat-item')}>
              <span className={cx('stat-number')}>{stat.value}</span>
              <span className={cx('stat-label')}>{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className={cx('filters-section')}>
        <div className={cx('filters-container')}>
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

          <div className={cx('filter-group')}>
            <label className={cx('filter-label')}>
              <FontAwesomeIcon icon={faFilter} /> Trạng thái
            </label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className={cx('filter-select')}
            >
              <option value="all">Tất cả</option>
              <option value="pending">Chờ xác nhận</option>
              <option value="confirmed">Đã xác nhận</option>
              <option value="success">Đã hoàn thành thanh toán</option>
              <option value="completed">Đã hoàn thành tư vấn</option>
              <option value="rejected">Đã hủy</option>
            </select>
          </div>

          <div className={cx('filter-group')}>
            <label className={cx('filter-label')}>
              <FontAwesomeIcon icon={faCalendarAlt} /> Thời gian
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

          <div className={cx('results-count')}>
            Hiển thị {filteredAppointments.length} cuộc hẹn
          </div>
        </div>
      </div>

      {/* Appointments Grid */}
      <div className={cx('appointments-container')}>
        {currentAppointments.length > 0 ? (
          <div className={cx('appointments-grid')}>
            {currentAppointments.map((appointment) => {
              const statusInfo = getStatusInfo(appointment.status);
              const hasFeedback = checkFeedbackStatus(appointment);
              
              const needsPayment = appointment.status === 'confirmed' &&
                appointment.booking === 0 &&
                appointment.price_apm &&
                appointment.price_apm > 0;

              const canJoinMeeting = appointment.status === 'confirmed' && 
                                   appointment.booking === 1 && 
                                   isConsultationDay(appointment.appointment_date);

              // Check if appointment can be cancelled
              const canCancel = appointment.status === 'pending' || 
                               (appointment.status === 'confirmed' && appointment.booking === 0);

              // Check if appointment is paid and can be cancelled for refund
              const canCancelPaid = appointment.status === 'confirmed' && 
                                   appointment.booking === 1 && 
                                   appointment.price_apm && 
                                   appointment.price_apm > 0;

              return (
                <div key={appointment.id} className={cx('appointment-card')}>
                  {/* Header */}
                  <div className={cx('card-header')}>
                    <div className={cx('status-badge')} style={{
                      backgroundColor: statusInfo.bgColor,
                      color: statusInfo.textColor
                    }}>
                      <FontAwesomeIcon icon={statusInfo.icon} />
                      {appointment.status === 'confirmed' && appointment.booking === 0 && 'Chờ thanh toán'}
                      {appointment.status === 'confirmed' && appointment.booking === 1 && 'Đã hoàn thành thanh toán'}
                      {appointment.status === 'completed' && 'Đã hoàn thành tư vấn'}
                      {appointment.status === 'rejected' && appointment.is_refunded && 'Đã hủy (Có hoàn tiền)'}
                      {appointment.status === 'rejected' && !appointment.is_refunded && 'Đã hủy'}
                      {!['confirmed', 'completed', 'rejected'].includes(appointment.status) && statusInfo.label}
                    </div>

                    {needsPayment && (
                      <div className={cx('payment-indicator')}>
                        <FontAwesomeIcon icon={faCreditCard} />
                        <span>Cần thanh toán</span>
                      </div>
                    )}

                    {/* Feedback status indicator */}
                    {appointment.status === 'completed' && (
                      <div className={cx('feedback-indicator', { 'has-feedback': hasFeedback })}>
                        <FontAwesomeIcon icon={faStar} />
                        <span>{hasFeedback ? 'Đã đánh giá' : 'Chưa đánh giá'}</span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className={cx('card-content')}>
                    <div className={cx('info-section')}>
                      <h3 className={cx('patient-name')}>
                        {user.last_name} {user.first_name}
                      </h3>
                      <div className={cx('contact-info')}>
                        <span className={cx('info-item')}>
                          <FontAwesomeIcon icon={faPhone} /> {user.phone}
                        </span>
                        <span className={cx('info-item')}>
                          <FontAwesomeIcon icon={faEnvelope} /> {user.email}
                        </span>
                      </div>
                    </div>

                    <div className={cx('appointment-details')}>
                      <div className={cx('detail-item')}>
                        <FontAwesomeIcon icon={faCalendarAlt} />
                        <span><strong>Ngày:</strong> {formatDate(appointment.appointment_date)}</span>
                      </div>
                      <div className={cx('detail-item')}>
                        <FontAwesomeIcon icon={faClock} />
                        <span><strong>Giờ:</strong> {appointment.appointment_time || 'Chưa xác định'}</span>
                      </div>
                      <div className={cx('detail-item')}>
                        <FontAwesomeIcon icon={faUserMd} />
                        <span><strong>Bác sĩ:</strong> {appointment.doctor_name || 'Chưa phân công'}</span>
                      </div>
                      <div className={cx('detail-item')}>
                        <FontAwesomeIcon icon={faStethoscope} />
                        <span><strong>Loại tư vấn:</strong> {appointment.consultant_type}</span>
                      </div>
                      {appointment.price_apm && (
                        <div className={cx('detail-item')}>
                          <FontAwesomeIcon icon={faMoneyBillWave} />
                          <span><strong>Phí tư vấn:</strong> {formatCurrency(appointment.price_apm)}</span>
                        </div>
                      )}
                    </div>

                    {appointment.symptoms && (
                      <div className={cx('symptoms-section')}>
                        <div className={cx('symptoms-header')}>
                          <FontAwesomeIcon icon={faNotesMedical} />
                          <span>Triệu chứng:</span>
                        </div>
                        <p className={cx('symptoms-text')}>{appointment.symptoms}</p>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className={cx('card-actions')}>
                    {/* Payment button */}
                    {needsPayment && (
                      <button
                        className={cx('action-btn', 'payment-btn')}
                        onClick={() => handlePayment(appointment)}
                        disabled={isCancelling}
                      >
                        <FontAwesomeIcon icon={faCreditCard} /> Thanh toán
                      </button>
                    )}

                    {/* Cancel button for unpaid appointments */}
                    {canCancel && (
                      <button 
                        className={cx('action-btn', 'cancel-btn', {
                          'loading': isCancelling
                        })}
                        onClick={() => handleCancel(appointment)}
                        disabled={isCancelling}
                      >
                        {isCancelling ? (
                          <>
                            <FontAwesomeIcon icon={faSpinner} spin /> Đang hủy...
                          </>
                        ) : (
                          <>
                            <FontAwesomeIcon icon={faTrash} /> Hủy hẹn
                          </>
                        )}
                      </button>
                    )}

                    {/* Cancel with refund button for paid appointments */}
                    {canCancelPaid && (
                      <button 
                        className={cx('action-btn', 'refund-cancel-btn', {
                          'loading': isCancelling
                        })}
                        onClick={() => handleCancelPaidAppointment(appointment)}
                        disabled={isCancelling}
                        title="Hủy cuộc hẹn và yêu cầu hoàn tiền"
                      >
                        {isCancelling ? (
                          <>
                            <FontAwesomeIcon icon={faSpinner} spin /> Đang xử lý...
                          </>
                        ) : (
                          <>
                            <FontAwesomeIcon icon={faRefresh} /> Hủy & Hoàn tiền
                          </>
                        )}
                      </button>
                    )}

                    {/* Refund status indicator for cancelled paid appointments */}
                    {appointment.status === 'rejected' && appointment.is_refunded && (
                      <div className={cx('refund-status-indicator')}>
                        <FontAwesomeIcon icon={faRefresh} />
                        <div className={cx('refund-info')}>
                          <span className={cx('refund-label')}>✅ Đã hủy và hoàn tiền</span>
                          <span className={cx('refund-amount')}>
                            💰 Số tiền hoàn: {formatCurrency(appointment.refund_amount)}
                          </span>
                          <span className={cx('refund-status-text')}>
                            📋 Trạng thái: {appointment.refund_status === 'processing' ? '🔄 Đang xử lý' : '✅ Hoàn thành'}
                          </span>
                          {appointment.refund_reference && (
                            <span className={cx('refund-reference')}>
                              🔗 Mã tham chiếu: {appointment.refund_reference}
                            </span>
                          )}
                          <span className={cx('refund-note')}>
                            📧 Vui lòng kiểm tra email để theo dõi tiến trình hoàn tiền
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Join Meeting button */}
                    {appointment.status === 'confirmed' && appointment.booking === 1 && (
                      <button
                        className={cx('action-btn', 'meeting-btn', { 
                          'disabled': !canJoinMeeting || isCancelling
                        })}
                        onClick={() => canJoinMeeting ? handleJoinMeeting(appointment) : null}
                        disabled={!canJoinMeeting || isCancelling}
                        title={
                          !canJoinMeeting 
                            ? 'Chỉ có thể tham gia vào ngày tư vấn' 
                            : 'Tham gia cuộc tư vấn'
                        }
                      >
                        <FontAwesomeIcon icon={faVideo} />
                        {canJoinMeeting ? 'Tham gia tư vấn' : 'Chưa tư vấn được'}
                      </button>
                    )}

                    {/* Rebook button */}
                    {appointment.status === 'rejected' && (
                      <button
                        className={cx('action-btn', 'rebook-btn')}
                        onClick={handleRebook}
                        disabled={isCancelling}
                      >
                        <FontAwesomeIcon icon={faCalendarAlt} /> Đặt lại
                      </button>
                    )}

                    {/* Actions cho completed */}
                    {appointment.status === 'completed' && (
                      <div className={cx('completed-actions')}>
                        <div className={cx('top-actions')}>
                          <button
                            className={cx('action-btn', 'view-btn')}
                            onClick={() => viewAppointmentDetails(appointment)}
                            disabled={isCancelling}
                          >
                            <FontAwesomeIcon icon={faEye} /> Xem chi tiết
                          </button>

                          <button
                            className={cx('action-btn', 'feedback-btn', { 
                              'has-feedback': hasFeedback 
                            })}
                            onClick={() => handleFeedbackNavigation(appointment)}
                            title={hasFeedback ? 'Xem lại đánh giá' : 'Đánh giá cuộc tư vấn'}
                            disabled={isCancelling}
                          >
                            <FontAwesomeIcon icon={faStar} />
                            {hasFeedback ? 'Xem đánh giá' : 'Đánh giá'}
                          </button>
                        </div>

                        <span style={{ fontSize: '0.85rem', paddingTop: '10px'}}>
                          Bạn có muốn tiếp tục đặt lịch xét nghiệm?
                        </span>
                        <Link
                          to={{
                            pathname: "/services/test",
                            search: `?appointmentId=${hashAppointmentId(
                              appointment.appointment_id || appointment.id
                            )}`,
                          }}
                          className={cx('action-btn', 'test-order-btn', 'full-width', {
                            'disabled': isCancelling
                          })}
                          onClick={isCancelling ? (e) => e.preventDefault() : undefined}
                        >
                          <FontAwesomeIcon icon={faFlaskVial} /> Đặt lịch xét nghiệm
                        </Link>
                      </div>
                    )}

                    {/* View button cho status khác */}
                    {appointment.status !== 'completed' && (
                      <button
                        className={cx('action-btn', 'view-btn')}
                        onClick={() => viewAppointmentDetails(appointment)}
                        disabled={isCancelling}
                      >
                        <FontAwesomeIcon icon={faEye} /> Xem chi tiết
                      </button>
                    )}

                    {/* Meeting info */}
                    {appointment.status === 'confirmed' && appointment.booking === 1 && !canJoinMeeting && (
                      <div className={cx('meeting-info')}>
                        <FontAwesomeIcon icon={faClock} />
                        <span>
                          Có thể tham gia từ ngày {formatDate(appointment.appointment_date)}
                        </span>
                      </div>
                    )}

                    {/* Cancel loading indicator */}
                    {isCancelling && (
                      <div className={cx('cancel-loading')}>
                        <FontAwesomeIcon icon={faSpinner} spin />
                        <span>Đang xử lý hủy cuộc hẹn...</span>
                      </div>
                    )}
                  </div>

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
              {Object.values(filters).some(f => f !== 'all' && f !== '')
                ? 'Không tìm thấy cuộc hẹn nào phù hợp với bộ lọc của bạn.'
                : 'Bạn chưa có cuộc hẹn nào. Hãy đặt lịch tư vấn ngay!'
              }
            </p>
            <button
              className={cx('primary-btn')}
              onClick={() => navigate('/appointment')}
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

      {/* Modal */}
      {showModal && selectedAppointment && (
        <div className={cx('modal-overlay')} onClick={() => setShowModal(false)}>
          <div className={cx('modal-content')} onClick={(e) => e.stopPropagation()}>
            <div className={cx('modal-header')}>
              <h2>Chi tiết cuộc hẹn</h2>
              <button className={cx('close-btn')} onClick={() => setShowModal(false)}>×</button>
            </div>

            <div className={cx('modal-body')}>
              <div className={cx('detail-grid')}>
                <div className={cx('detail-row')}>
                  <strong>Trạng thái:</strong>
                  <span className={cx('status-text')}>
                    {selectedAppointment.status === 'confirmed' && selectedAppointment.booking === 0 && 'Chờ thanh toán'}
                    {selectedAppointment.status === 'confirmed' && selectedAppointment.booking === 1 && 'Đã hoàn thành thanh toán'}
                    {selectedAppointment.status === 'completed' && 'Đã hoàn thành tư vấn'}
                    {selectedAppointment.status === 'pending' && 'Chờ xác nhận'}
                    {selectedAppointment.status === 'rejected' && selectedAppointment.is_refunded && 'Đã hủy (Có hoàn tiền)'}
                    {selectedAppointment.status === 'rejected' && !selectedAppointment.is_refunded && 'Đã hủy'}
                  </span>
                </div>
                <div className={cx('detail-row')}>
                  <strong>Họ tên:</strong>
                  <span>{user.last_name} {user.first_name}</span>
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
                  <strong>Loại tư vấn:</strong>
                  <span>{selectedAppointment.consultant_type}</span>
                </div>
                <div className={cx('detail-row')}>
                  <strong>Bác sĩ:</strong>
                  <span>{selectedAppointment.doctor_name || 'Chưa phân công'}</span>
                </div>
                <div className={cx('detail-row')}>
                  <strong>Ngày tư vấn:</strong>
                  <span>{formatDate(selectedAppointment.appointment_date)}</span>
                </div>
                <div className={cx('detail-row')}>
                  <strong>Giờ tư vấn:</strong>
                  <span>{selectedAppointment.appointment_time || 'Chưa xác định'}</span>
                </div>
                {selectedAppointment.price_apm && (
                  <div className={cx('detail-row')}>
                    <strong>Phí tư vấn:</strong>
                    <span>{formatCurrency(selectedAppointment.price_apm)}</span>
                  </div>
                )}
                <div className={cx('detail-row')}>
                  <strong>Ngày đặt:</strong>
                  <span>{formatDate(selectedAppointment.created_at)}</span>
                </div>
                
                {/* Refund status trong modal */}
                {selectedAppointment.status === 'rejected' && selectedAppointment.is_refunded && (
                  <>
                    <div className={cx('detail-row')}>
                      <strong>Trạng thái hoàn tiền:</strong>
                      <span className={cx('refund-status', { 
                        'processing': selectedAppointment.refund_status === 'processing'
                      })}>
                        <FontAwesomeIcon icon={faRefresh} />
                        {selectedAppointment.refund_status === 'processing' ? '🔄 Đang xử lý' : '✅ Hoàn thành'}
                      </span>
                    </div>
                    {selectedAppointment.refund_amount && (
                      <div className={cx('detail-row')}>
                        <strong>Số tiền hoàn:</strong>
                        <span className={cx('refund-amount-text')}>
                          💰 {formatCurrency(selectedAppointment.refund_amount)}
                        </span>
                      </div>
                    )}
                    {selectedAppointment.refund_reference && (
                      <div className={cx('detail-row')}>
                        <strong>Mã tham chiếu:</strong>
                        <span className={cx('refund-reference-text')}>
                          🔗 {selectedAppointment.refund_reference}
                        </span>
                      </div>
                    )}
                    {selectedAppointment.refund_date && (
                      <div className={cx('detail-row')}>
                        <strong>Ngày yêu cầu hoàn tiền:</strong>
                        <span>{formatDate(selectedAppointment.refund_date)}</span>
                      </div>
                    )}
                  </>
                )}

                {/* Feedback status trong modal */}
                {selectedAppointment.status === 'completed' && (
                  <div className={cx('detail-row')}>
                    <strong>Trạng thái đánh giá:</strong>
                    <span className={cx('feedback-status', { 
                      'has-feedback': checkFeedbackStatus(selectedAppointment)
                    })}>
                      <FontAwesomeIcon icon={faStar} />
                      {checkFeedbackStatus(selectedAppointment) ? 'Đã đánh giá' : 'Chưa đánh giá'}
                    </span>
                  </div>
                )}
              </div>

              {selectedAppointment.symptoms && (
                <div className={cx('medical-info')}>
                  <h3>Thông tin y tế</h3>
                  <div className={cx('medical-item')}>
                    <strong>Triệu chứng:</strong>
                    <p>{selectedAppointment.symptoms}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            {selectedAppointment.status === 'completed' && (
              <div className={cx('modal-actions')}>
                <h3>Hành động khả dụng</h3>
                <div className={cx('action-buttons-horizontal')}>
                  {/* Updated feedback button trong modal */}
                  <button
                    className={cx('modal-action-btn', 'feedback-btn', {
                      'has-feedback': checkFeedbackStatus(selectedAppointment)
                    })}
                    onClick={() => {
                      setShowModal(false);
                      handleFeedbackNavigation(selectedAppointment);
                    }}
                  >
                    <FontAwesomeIcon icon={faStar} />
                    {checkFeedbackStatus(selectedAppointment) ? 'Xem đánh giá' : 'Đánh giá cuộc tư vấn'}
                  </button>

                  <Link
                    to={{
                      pathname: "/services/test",
                      search: `?appointmentId=${hashAppointmentId(
                        selectedAppointment.appointment_id || selectedAppointment.id
                      )}`,
                    }}
                    className={cx('modal-action-btn', 'test-order-btn')}
                    onClick={() => setShowModal(false)}
                  >
                    <FontAwesomeIcon icon={faFlaskVial} /> Đặt lịch xét nghiệm
                  </Link>
                </div>

                <div className={cx('action-note')}>
                  <p>
                    💡 <strong>Gợi ý:</strong> 
                    {checkFeedbackStatus(selectedAppointment) 
                      ? ' Cảm ơn bạn đã đánh giá! Bạn có thể đặt lịch xét nghiệm để theo dõi sức khỏe theo chỉ định của bác sĩ.'
                      : ' Sau khi tư vấn, hãy chia sẻ đánh giá của bạn và có thể đặt lịch xét nghiệm theo chỉ định của bác sĩ.'
                    }
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default MyAppointments;