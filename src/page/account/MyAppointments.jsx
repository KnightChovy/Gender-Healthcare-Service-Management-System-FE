import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalendarAlt, faClock, faUserMd, faPhone, faEnvelope, faStethoscope,
  faNotesMedical, faMoneyBillWave, faEye, faEdit, faTrash, faFilter, faSearch,
  faSpinner, faExclamationTriangle, faCheckCircle, faTimesCircle, faHourglassHalf,
  faCalendarCheck, faRefresh, faCreditCard, faVideo, faStar, faFlaskVial // Thêm faFlaskVial
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
  const [filters, setFilters] = useState({
    status: 'all',
    dateRange: 'all',
    searchTerm: ''
  });
  const [currentPage, setCurrentPage] = useState(1);

  const appointmentsPerPage = 6;
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const accessToken = localStorage.getItem('accessToken');

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

  const handleRebook = () => navigate('/appointment');

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
    { label: 'Đã hoàn thành tư vấn', value: appointments.filter(apt => apt.status === 'completed').length }, // Thêm completed
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
              <option value="completed">Đã hoàn thành tư vấn</option> {/* Thêm completed */}
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
              
              const needsPayment = appointment.status === 'confirmed' &&
                appointment.booking === 0 &&
                appointment.price_apm &&
                appointment.price_apm > 0;

              // Chỉ kiểm tra ngày, không cần kiểm tra giờ
              const canJoinMeeting = appointment.status === 'confirmed' && 
                                   appointment.booking === 1 && 
                                   isConsultationDay(appointment.appointment_date);

              return (
                <div key={appointment.id} className={cx('appointment-card')}>
                  {/* Header */}
                  <div className={cx('card-header')}>
                    <div className={cx('status-badge')} style={{
                      backgroundColor: statusInfo.bgColor,
                      color: statusInfo.textColor
                    }}>
                      <FontAwesomeIcon icon={statusInfo.icon} />
                      {/* Logic hiển thị label dựa trên booking */}
                      {appointment.status === 'confirmed' && appointment.booking === 0 && 'Chờ thanh toán'}
                      {appointment.status === 'confirmed' && appointment.booking === 1 && 'Đã hoàn thành thanh toán'}
                      {appointment.status === 'completed' && 'Đã hoàn thành tư vấn'} {/* Thêm completed */}
                      {!['confirmed', 'completed'].includes(appointment.status) && statusInfo.label}
                    </div>

                    {needsPayment && (
                      <div className={cx('payment-indicator')}>
                        <FontAwesomeIcon icon={faCreditCard} />
                        <span>Cần thanh toán</span>
                      </div>
                    )}
                  </div>

                  {/* Content - Price formatting */}
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

                  {/* Actions - Sửa lại phần này */}
                  <div className={cx('card-actions')}>
                    {/* Payment button - chỉ hiển thị khi confirmed và booking = 0 */}
                    {needsPayment && (
                      <button
                        className={cx('action-btn', 'payment-btn')}
                        onClick={() => handlePayment(appointment)}
                      >
                        <FontAwesomeIcon icon={faCreditCard} /> Thanh toán
                      </button>
                    )}

                    {/* Edit button - chỉ cho pending */}
                    {appointment.status === 'pending' && (
                      <button className={cx('action-btn', 'edit-btn')}>
                        <FontAwesomeIcon icon={faEdit} /> Chỉnh sửa
                      </button>
                    )}

                    {/* Cancel button - cho pending và confirmed với booking = 0 */}
                    {(appointment.status === 'pending' ||
                      (appointment.status === 'confirmed' && appointment.booking === 0)) && (
                        <button className={cx('action-btn', 'cancel-btn')}>
                          <FontAwesomeIcon icon={faTrash} /> Hủy hẹn
                        </button>
                      )}

                    {/* Join Meeting button - chỉ kiểm tra ngày */}
                    {appointment.status === 'confirmed' && appointment.booking === 1 && (
                      <button
                        className={cx('action-btn', 'meeting-btn', { 
                          'disabled': !canJoinMeeting 
                        })}
                        onClick={() => canJoinMeeting ? handleJoinMeeting(appointment) : null}
                        disabled={!canJoinMeeting}
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

                    {/* Rebook button - chỉ cho rejected */}
                    {appointment.status === 'rejected' && (
                      <button
                        className={cx('action-btn', 'rebook-btn')}
                        onClick={() => handleRebook(appointment)}
                      >
                        <FontAwesomeIcon icon={faCalendarAlt} /> Đặt lại
                      </button>
                    )}

                    {/* Actions cho completed */}
                    {appointment.status === 'completed' && (
                      <div className={cx('completed-actions')}>
                        {/* Hàng đầu: Xem chi tiết + Đánh giá */}
                        <div className={cx('top-actions')}>
                          <button
                            className={cx('action-btn', 'view-btn')}
                            onClick={() => viewAppointmentDetails(appointment)}
                          >
                            <FontAwesomeIcon icon={faEye} /> Xem chi tiết
                          </button>

                          <button
                            className={cx('action-btn', 'feedback-btn')}
                            onClick={() => navigate(`/feedback/consultation/${appointment.appointment_id || appointment.id}`)}
                          >
                            <FontAwesomeIcon icon={faStar} /> Đánh giá
                          </button>
                        </div>

                        {/* Hàng dưới: Đặt lịch xét nghiệm */}
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
                          className={cx('action-btn', 'test-order-btn', 'full-width')}
                        >
                          <FontAwesomeIcon icon={faFlaskVial} /> Đặt lịch xét nghiệm
                        </Link>
                      </div>
                    )}

                    {/* View button cho tất cả status khác (không phải completed) */}
                    {appointment.status !== 'completed' && (
                      <button
                        className={cx('action-btn', 'view-btn')}
                        onClick={() => viewAppointmentDetails(appointment)}
                      >
                        <FontAwesomeIcon icon={faEye} /> Xem chi tiết
                      </button>
                    )}

                    {/* Hiển thị thông báo ngày tư vấn */}
                    {appointment.status === 'confirmed' && appointment.booking === 1 && !canJoinMeeting && (
                      <div className={cx('meeting-info')}>
                        <FontAwesomeIcon icon={faClock} />
                        <span>
                          Có thể tham gia từ ngày {formatDate(appointment.appointment_date)}
                        </span>
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

      {/* Modal - Thêm nút đặt lịch xét nghiệm trong modal */}
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
                    {selectedAppointment.status === 'rejected' && 'Đã hủy'}
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
                  <button
                    className={cx('modal-action-btn', 'feedback-btn')}
                    onClick={() => {
                      setShowModal(false);
                      navigate(`/feedback/consultation/${selectedAppointment.appointment_id || selectedAppointment.id}`);
                    }}
                  >
                    <FontAwesomeIcon icon={faStar} /> Đánh giá cuộc tư vấn
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
                  <p>💡 <strong>Gợi ý:</strong> Sau khi tư vấn, bạn có thể đặt lịch xét nghiệm để theo dõi sức khỏe theo chỉ định của bác sĩ.</p>
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