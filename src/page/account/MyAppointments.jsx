import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalendarAlt, faClock, faUserMd, faPhone, faEnvelope, faStethoscope,
  faNotesMedical, faMoneyBillWave, faEye, faTrash, faFilter, faSearch,
  faSpinner, faExclamationTriangle, faCheckCircle, faTimesCircle, faHourglassHalf,
  faCalendarCheck, faRefresh, faCreditCard, faVideo, faStar, faFlaskVial, faFileAlt, faDownload
} from '@fortawesome/free-solid-svg-icons';
import axiosClient from '../../services/axiosClient';
import { toast } from 'react-toastify';
import classNames from 'classnames/bind';
import styles from './MyAppointments.module.scss';

const cx = classNames.bind(styles);

// Mã hóa ID cuộc hẹn
const hashAppointmentId = (appointmentId) => {
  return btoa(appointmentId.toString()).replace(/=/g, "");
};

function MyAppointments() {
  const navigate = useNavigate();

  // State cho cuộc hẹn tư vấn
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all',
    dateRange: 'all',
    searchTerm: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [appointmentsPerPage] = useState(6); // Đã thêm biến này

  // State cho tab hiện tại
  const [activeTab, setActiveTab] = useState('appointments'); // Đã thêm state này

  // State cho đơn xét nghiệm
  const [testOrders, setTestOrders] = useState([]);
  const [filteredTestOrders, setFilteredTestOrders] = useState([]);
  const [testResults, setTestResults] = useState([]); // Đã thêm state này
  const [testIsLoading, setTestIsLoading] = useState(true);
  const [testError, setTestError] = useState(null);
  const [selectedTestOrder, setSelectedTestOrder] = useState(null);
  const [showTestModal, setShowTestModal] = useState(false);
  const [currentTestPage, setCurrentTestPage] = useState(1);
  const [testOrdersPerPage] = useState(6);
  const [testFilters, setTestFilters] = useState({
    status: 'all',
    dateRange: 'all',
    searchTerm: ''
  });
  const [selectedResult, setSelectedResult] = useState(null);
  const [showResultModal, setShowResultModal] = useState(false);

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const accessToken = localStorage.getItem('accessToken');

  // Hàm kiểm tra trạng thái phản hồi
  const checkFeedbackStatus = (appointment) => {
    return !!appointment.feedback;
  };

  // Xử lý điều hướng phản hồi
  const handleFeedbackNavigation = (appointment) => {
    const appointmentId = appointment.appointment_id || appointment.id;
    const hasFeedback = checkFeedbackStatus(appointment);

    if (hasFeedback) {
      navigate("/feedback", {
        state: {
          highlightAppointment: appointmentId,
          message: "Bạn đã đánh giá buổi tư vấn này. Xem lại đánh giá của bạn bên dưới."
        }
      });
    } else {
      navigate(`/feedback/consultation/${appointmentId}`, {
        state: { appointmentData: appointment }
      });
    }
  };

  // Cấu hình trạng thái cuộc hẹn
  const statusConfig = {
    'pending': { label: 'Chờ xác nhận', icon: faHourglassHalf, bgColor: '#fff8e1', textColor: '#e65100' },
    'confirmed': { label: 'Đã xác nhận', icon: faCheckCircle, bgColor: '#e8f5e8', textColor: '#2e7d32' },
    'success': { label: 'Đã hoàn thành thanh toán', icon: faCalendarCheck, bgColor: '#e3f2fd', textColor: '#1976d2' },
    'completed': { label: 'Đã hoàn thành tư vấn', icon: faCheckCircle, bgColor: '#f3e5f5', textColor: '#7b1fa2' },
    'rejected': { label: 'Đã hủy', icon: faTimesCircle, bgColor: '#ffebee', textColor: '#d32f2f' }
  };

  // Cấu hình trạng thái đơn xét nghiệm
  const testStatusConfig = {
    'pending': { label: 'Chờ xác nhận', icon: faHourglassHalf, bgColor: '#fff8e1', textColor: '#e65100' },
    'paid': { label: 'Đã thanh toán', icon: faCheckCircle, bgColor: '#e8f5e8', textColor: '#2e7d32' },
    'completed': { label: 'Đã hoàn thành', icon: faCheckCircle, bgColor: '#f3e5f5', textColor: '#7b1fa2' },
    'cancelled': { label: 'Đã hủy', icon: faTimesCircle, bgColor: '#ffebee', textColor: '#d32f2f' }
  };

  const getStatusInfo = (status) => statusConfig[status] || statusConfig['pending'];
  const getTestStatusInfo = (status) => testStatusConfig[status] || testStatusConfig['pending']; // Đã thêm hàm này

  // Tải danh sách cuộc hẹn
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
        throw new Error('Định dạng phản hồi không hợp lệ');
      }
    } catch (error) {
      console.error('❌ Lỗi khi tải cuộc hẹn:', error);
      setError('Không thể tải danh sách cuộc hẹn. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  // Tải danh sách đơn xét nghiệm
  const fetchTestOrders = async () => {
    try {
      setTestIsLoading(true);
      setTestError(null);

      const response = await axiosClient.get(`/v1/users/test-appointments/user/${user.user_id}`, {
        headers: { 'x-access-token': accessToken }
      });

      if (response.data?.status === 'success') {
        const userTestOrders = response.data.data?.orders || [];
        setTestOrders(userTestOrders);
        setFilteredTestOrders(userTestOrders);
      } else {
        throw new Error('Định dạng phản hồi không hợp lệ');
      }
    } catch (error) {
      console.error('❌ Lỗi khi tải đơn xét nghiệm:', error);
      setTestError('Không thể tải danh sách đơn xét nghiệm. Vui lòng thử lại.');
    } finally {
      setTestIsLoading(false);
    }
  };

  // Tải kết quả xét nghiệm
  const fetchTestResults = async () => {
    try {
      const response = await axiosClient.get(`/v1/users/test-results`, {
        headers: { 'x-access-token': accessToken }
      });

      if (response.data?.status === 'success') {
        setTestResults(response.data.data?.results || []);
      }
    } catch (error) {
      console.error('❌ Lỗi khi tải kết quả xét nghiệm:', error);
    }
  };

  // Áp dụng bộ lọc cho cuộc hẹn
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

  // Áp dụng bộ lọc cho đơn xét nghiệm
  const applyTestFilters = () => {
    let filtered = [...testOrders];

    if (testFilters.status !== 'all') {
      filtered = filtered.filter(order => order.order.order_status === testFilters.status);
    }

    if (testFilters.dateRange !== 'all') {
      const today = new Date();
      const days = { week: 7, month: 30, quarter: 90 }[testFilters.dateRange];
      const filterDate = new Date(today.getTime() - days * 24 * 60 * 60 * 1000);
      filtered = filtered.filter(order => new Date(order.order.created_at) >= filterDate);
    }

    if (testFilters.searchTerm.trim()) {
      const searchTerm = testFilters.searchTerm.toLowerCase();
      filtered = filtered.filter(order =>
        order.services.some(service =>
          service.name.toLowerCase().includes(searchTerm) ||
          service.description.toLowerCase().includes(searchTerm)
        )
      );
    }

    setFilteredTestOrders(filtered);
    setCurrentTestPage(1);
  };

  // Xử lý thay đổi bộ lọc cuộc hẹn
  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
  };

  // Xử lý thay đổi bộ lọc đơn xét nghiệm
  const handleTestFilterChange = (filterType, value) => {
    setTestFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  // Xử lý thanh toán
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

  // Xử lý đặt lại lịch
  const handleRebook = () => navigate('/services/appointment-consultation');

  // Xem chi tiết cuộc hẹn
  const viewAppointmentDetails = (appointment) => {
    setSelectedAppointment(appointment);
    setShowModal(true);
  };

  // Tham gia cuộc họp
  const handleJoinMeeting = (appointment) => {
    const meetUrl = 'https://meet.google.com/gzq-fqau-uix';
    window.open(meetUrl, '_blank', 'noopener,noreferrer');
    console.log(`Người dùng tham gia cuộc họp cho cuộc hẹn ${appointment.id}`);
  };

  // Xử lý xem đơn xét nghiệm
  const handleViewTestOrder = (order) => {
    setSelectedTestOrder(order);
    setShowTestModal(true);
  };

  // Xử lý xem kết quả xét nghiệm
  const handleViewTestResult = (order) => {
    const result = testResults.find(r => r.order_id === order.order.order_id);
    if (result) {
      setSelectedResult(result);
      setShowResultModal(true);
    }
  };

  // Xử lý hủy đơn xét nghiệm
  const handleCancelTestOrder = (order) => {
    // Thêm logic hủy đơn xét nghiệm ở đây
    console.log('Hủy đơn xét nghiệm:', order.order.order_id);
  };

  // Xử lý tải xuống kết quả
  const handleDownloadResult = (result) => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');

      // Create text content
      const textContent = `
KẾT QUẢ XÉT NGHIỆM
==================

THÔNG TIN BỆNH NHÂN:
- Họ và tên: ${user.last_name} ${user.first_name}
- Số điện thoại: ${user.phone}
- Email: ${user.email}
- Mã kết quả: ${result.testresult_id}

THÔNG TIN XÉT NGHIỆM:
- Tên xét nghiệm: ${result.service.name}
- Mô tả: ${result.service.description}
- Ngày xét nghiệm: ${new Date(result.exam_date).toLocaleDateString('vi-VN')} ${result.exam_time}

KẾT QUẢ:
- Kết quả: ${result.result.result}
- Kết luận: ${result.result.conclusion}
- Chỉ số tham chiếu: ${result.result.normal_range || 'Không có'}
- Ghi chú bác sĩ: ${result.result.recommendation || 'Không có'}

---
Tạo lúc: ${new Date().toLocaleString('vi-VN')}
    `;

      // Download as text file
      const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `KetQua_${result.testresult_id}.txt`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success('Tải xuống thành công!', {
        position: "top-right",
        autoClose: 3000,
      });

    } catch (error) {
      console.error('Error downloading result:', error);
      toast.error('Có lỗi xảy ra khi tải xuống', {
        position: "top-right",
        autoClose: 4000,
      });
    }
  };

  // Hàm tiện ích
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Tính toán phân trang
  const totalTestPages = Math.ceil(filteredTestOrders.length / testOrdersPerPage);
  const currentTestOrders = filteredTestOrders.slice(
    (currentTestPage - 1) * testOrdersPerPage,
    currentTestPage * testOrdersPerPage
  );

  const indexOfLastAppointment = currentPage * appointmentsPerPage;
  const indexOfFirstAppointment = indexOfLastAppointment - appointmentsPerPage;
  const currentAppointments = filteredAppointments.slice(indexOfFirstAppointment, indexOfLastAppointment);
  const totalPages = Math.ceil(filteredAppointments.length / appointmentsPerPage);

  // Kiểm tra ngày tư vấn
  const isConsultationDay = (appointmentDate) => {
    if (!appointmentDate) return false;

    const today = new Date();
    const consultationDate = new Date(appointmentDate);

    today.setHours(0, 0, 0, 0);
    consultationDate.setHours(0, 0, 0, 0);

    return today.getTime() === consultationDate.getTime();
  };

  // Xử lý hủy cuộc hẹn có hoàn tiền
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

      // Bước 1: Gửi email thông báo
      try {
        await axiosClient.post('/v1/emails/send-appointment-cancellation', {
          appointment_id: appointmentId,
          reason: 'Thay đổi lịch trình cá nhân'
        }, {
          headers: { 'x-access-token': accessToken }
        });
        console.log('✅ Email đã được gửi thành công');
      } catch (emailError) {
        console.warn('⚠️ Email thất bại, tiếp tục...', emailError);
      }

      // Bước 2: Hủy cuộc hẹn
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

        // Cập nhật trạng thái
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
      console.error('❌ Lỗi:', error);
      alert(
        error.response?.data?.message ||
        'Có lỗi xảy ra. Vui lòng liên hệ hỗ trợ.'
      );
    } finally {
      setIsCancelling(false);
    }
  };

  // Xử lý hủy cuộc hẹn
  const handleCancel = async (appointment) => {
    const appointmentId = appointment.appointment_id || appointment.id;

    const confirmCancel = window.confirm(
      `Bạn có chắc chắn muốn hủy cuộc hẹn ${appointment.consultant_type} vào ngày ${formatDate(appointment.appointment_date)}?\n\nLưu ý: Sau khi hủy, bạn sẽ không thể hoàn tác được.`
    );

    if (!confirmCancel) return;

    try {
      setIsCancelling(true);

      const response = await axiosClient.post('/v1/users/cancel-appointment', {
        appointment_id: appointmentId
      }, {
        headers: { 'x-access-token': accessToken }
      });

      if (response.data?.success) {
        alert('Hủy cuộc hẹn thành công!');

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
      console.error('❌ Lỗi khi hủy cuộc hẹn:', error);

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

  // Hooks useEffect
  useEffect(() => {
    if (accessToken && user.user_id) {
      fetchAppointments();
      fetchTestOrders();
      fetchTestResults();
    }
  }, [accessToken, user.user_id]);

  useEffect(() => {
    applyFilters();
  }, [filters, appointments]);

  useEffect(() => {
    applyTestFilters();
  }, [testFilters, testOrders]);

  // Xử lý loading
  if (isLoading || testIsLoading) {
    return (
      <div className={cx('appointments-page')}>
        <div className={cx('loading-container')}>
          <FontAwesomeIcon icon={faSpinner} spin className={cx('loading-icon')} />
          <p>Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  // Xử lý lỗi
  if (error || testError) {
    return (
      <div className={cx('appointments-page')}>
        <div className={cx('error-container')}>
          <FontAwesomeIcon icon={faExclamationTriangle} className={cx('error-icon')} />
          <h3>Có lỗi xảy ra</h3>
          <p>{error || testError}</p>
          <button className={cx('retry-btn')} onClick={() => {
            fetchAppointments();
            fetchTestOrders();
            fetchTestResults();
          }}>
            <FontAwesomeIcon icon={faRefresh} /> Thử lại
          </button>
        </div>
      </div>
    );
  }

  // Thống kê
  const stats = [
    { label: 'Tổng cuộc hẹn', value: appointments.length },
    { label: 'Chờ xác nhận', value: appointments.filter(apt => apt.status === 'pending').length },
    { label: 'Đã xác nhận', value: appointments.filter(apt => apt.status === 'confirmed' && apt.booking === 0).length },
    { label: 'Đã thanh toán', value: appointments.filter(apt => apt.status === 'confirmed' && apt.booking === 1).length },
    { label: 'Đã hoàn thành', value: appointments.filter(apt => apt.status === 'completed').length },
    { label: 'Đã hủy', value: appointments.filter(apt => apt.status === 'rejected').length }
  ];

  const testStats = [
    { label: 'Tổng đơn xét nghiệm', value: testOrders.length },
    { label: 'Chờ xác nhận', value: testOrders.filter(order => order.order.order_status === 'pending').length },
    { label: 'Đã thanh toán', value: testOrders.filter(order => order.order.order_status === 'paid').length },
    { label: 'Đã hoàn thành', value: testOrders.filter(order => order.order.order_status === 'completed').length },
    { label: 'Đã hủy', value: testOrders.filter(order => order.order.order_status === 'cancelled').length }
  ];

  return (
    <div className={cx('appointments-page')}>
      {/* Phần header */}
      <div className={cx('page-header')}>
        <div className={cx('header-content')}>
          <h1 className={cx('page-title')}>
            <FontAwesomeIcon icon={faCalendarAlt} />
            Lịch hẹn của tôi
          </h1>
          <p className={cx('page-subtitle')}>
            Quản lý và theo dõi tất cả các cuộc hẹn tư vấn và xét nghiệm của bạn
          </p>
        </div>

        {/* Điều hướng tab */}
        <div className={cx('tab-navigation')}>
          <button
            className={cx('tab-btn', { active: activeTab === 'appointments' })}
            onClick={() => setActiveTab('appointments')}
          >
            <FontAwesomeIcon icon={faCalendarAlt} />
            Tư vấn ({appointments.length})
          </button>
          <button
            className={cx('tab-btn', { active: activeTab === 'tests' })}
            onClick={() => setActiveTab('tests')}
          >
            <FontAwesomeIcon icon={faFlaskVial} />
            Xét nghiệm ({testOrders.length})
          </button>
        </div>

        {/* Phần thống kê */}
        <div className={cx('header-stats')}>
          {activeTab === 'appointments'
            ? stats.map((stat, index) => (
              <div key={index} className={cx('stat-item')}>
                <span className={cx('stat-number')}>{stat.value}</span>
                <span className={cx('stat-label')}>{stat.label}</span>
              </div>
            ))
            : testStats.map((stat, index) => (
              <div key={index} className={cx('stat-item')}>
                <span className={cx('stat-number')}>{stat.value}</span>
                <span className={cx('stat-label')}>{stat.label}</span>
              </div>
            ))
          }
        </div>
      </div>

      {/* Phần bộ lọc */}
      <div className={cx('filters-section')}>
        <div className={cx('filters-container')}>
          <div className={cx('search-box')}>
            <FontAwesomeIcon icon={faSearch} className={cx('search-icon')} />
            <input
              type="text"
              placeholder={
                activeTab === 'appointments'
                  ? "Tìm kiếm theo tên, bác sĩ, loại tư vấn..."
                  : "Tìm kiếm theo tên xét nghiệm, mô tả..."
              }
              value={activeTab === 'appointments' ? filters.searchTerm : testFilters.searchTerm}
              onChange={(e) =>
                activeTab === 'appointments'
                  ? handleFilterChange('searchTerm', e.target.value)
                  : handleTestFilterChange('searchTerm', e.target.value)
              }
              className={cx('search-input')}
            />
          </div>

          <div className={cx('filter-group')}>
            <label className={cx('filter-label')}>
              <FontAwesomeIcon icon={faFilter} /> Trạng thái
            </label>
            <select
              value={activeTab === 'appointments' ? filters.status : testFilters.status}
              onChange={(e) =>
                activeTab === 'appointments'
                  ? handleFilterChange('status', e.target.value)
                  : handleTestFilterChange('status', e.target.value)
              }
              className={cx('filter-select')}
            >
              <option value="all">Tất cả</option>
              {activeTab === 'appointments' ? (
                <>
                  <option value="pending">Chờ xác nhận</option>
                  <option value="confirmed">Đã xác nhận</option>
                  <option value="success">Đã hoàn thành thanh toán</option>
                  <option value="completed">Đã hoàn thành tư vấn</option>
                  <option value="rejected">Đã hủy</option>
                </>
              ) : (
                <>
                  <option value="pending">Chờ xác nhận</option>
                  <option value="paid">Đã thanh toán</option>
                  <option value="completed">Đã hoàn thành</option>
                  <option value="cancelled">Đã hủy</option>
                </>
              )}
            </select>
          </div>

          <div className={cx('filter-group')}>
            <label className={cx('filter-label')}>
              <FontAwesomeIcon icon={faCalendarAlt} /> Thời gian
            </label>
            <select
              value={activeTab === 'appointments' ? filters.dateRange : testFilters.dateRange}
              onChange={(e) =>
                activeTab === 'appointments'
                  ? handleFilterChange('dateRange', e.target.value)
                  : handleTestFilterChange('dateRange', e.target.value)
              }
              className={cx('filter-select')}
            >
              <option value="all">Tất cả</option>
              <option value="week">7 ngày qua</option>
              <option value="month">1 tháng qua</option>
              <option value="quarter">3 tháng qua</option>
            </select>
          </div>

          <div className={cx('results-count')}>
            Hiển thị {activeTab === 'appointments' ? filteredAppointments.length : filteredTestOrders.length}
            {activeTab === 'appointments' ? ' cuộc hẹn' : ' đơn xét nghiệm'}
          </div>
        </div>
      </div>

      {/* Nội dung dựa trên tab hiện tại */}
      {activeTab === 'appointments' ? (
        // Nội dung cuộc hẹn tư vấn
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

                const canCancel = appointment.status === 'pending' ||
                  (appointment.status === 'confirmed' && appointment.booking === 0);

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

                    {/* Nội dung */}
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

                    {/* Hành động */}
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

                          <span style={{ fontSize: '0.85rem', paddingTop: '10px' }}>
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
      ) : (
        // Phần đơn xét nghiệm
        <div className={cx('test-orders-container')}>
          {currentTestOrders.length > 0 ? (
            <div className={cx('test-orders-grid')}>
              {currentTestOrders.map((order) => {
                const statusInfo = getTestStatusInfo(order.order.order_status);
                const hasResults = testResults.some(r => r.order_id === order.order.order_id);

                return (
                  <div key={order.order.order_id} className={cx('test-order-card')}>
                    <div className={cx('card-header')}>
                      <div className={cx('status-badge')} style={{
                        backgroundColor: statusInfo.bgColor,
                        color: statusInfo.textColor
                      }}>
                        <FontAwesomeIcon icon={statusInfo.icon} />
                        {statusInfo.label}
                      </div>

                      {hasResults && (
                        <div className={cx('result-indicator')}>
                          <FontAwesomeIcon icon={faFileAlt} />
                          <span>Có kết quả</span>
                        </div>
                      )}
                    </div>

                    <div className={cx('card-content')}>
                      <div className={cx('order-info')}>
                        <h3 className={cx('order-id')}>
                          Đơn xét nghiệm #{order.order.order_id}
                        </h3>
                        <div className={cx('order-details')}>
                          <div className={cx('detail-item')}>
                            <FontAwesomeIcon icon={faCalendarAlt} />
                            <span><strong>Ngày đặt:</strong> {formatDate(order.order.created_at)}</span>
                          </div>

                          {/* Add exam date and time information */}
                          {order.order.exam_date && (
                            <div className={cx('detail-item')}>
                              <FontAwesomeIcon icon={faCalendarCheck} />
                              <span><strong>Ngày xét nghiệm:</strong> {formatDate(order.order.exam_date)}</span>
                            </div>
                          )}

                          {order.order.exam_time && (
                            <div className={cx('detail-item')}>
                              <FontAwesomeIcon icon={faClock} />
                              <span><strong>Giờ xét nghiệm:</strong> {order.order.exam_time}</span>
                            </div>
                          )}

                          <div className={cx('detail-item')}>
                            <FontAwesomeIcon icon={faMoneyBillWave} />
                            <span><strong>Tổng tiền:</strong> {formatCurrency(order.order.total_amount)}</span>
                          </div>
                          <div className={cx('detail-item')}>
                            <FontAwesomeIcon icon={faCreditCard} />
                            <span><strong>Thanh toán:</strong> {
                              order.order.payment_method === 'cash' ? 'Tiền mặt' : 'Thẻ'
                            }</span>
                          </div>

                          {/* Add appointment type if available */}
                          <div className={cx('detail-item')}>
                            <FontAwesomeIcon icon={faStethoscope} />
                            <span><strong>Loại đơn:</strong> {order.order.order_type === 'directly' ? 'Trực tiếp' : 'Online'}</span>
                          </div>
                        </div>
                      </div>

                      <div className={cx('services-section')}>
                        <h4 className={cx('services-title')}>
                          <FontAwesomeIcon icon={faFlaskVial} />
                          Dịch vụ xét nghiệm ({order.services.length})
                        </h4>
                        <div className={cx('services-list')}>
                          {order.services.map((service, index) => (
                            <div key={index} className={cx('service-item')}>
                              <div className={cx('service-info')}>
                                <h5 className={cx('service-name')}>{service.name}</h5>
                                <div className={cx('service-details')}>
                                  <span className={cx('service-price')}>
                                    {formatCurrency(service.price)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {hasResults && (
                        <div className={cx('result-preview')}>
                          <h4 className={cx('result-title')}>
                            <FontAwesomeIcon icon={faFileAlt} />
                            Kết quả xét nghiệm
                          </h4>
                          <div className={cx('result-summary')}>
                            {testResults
                              .filter(r => r.order_id === order.order.order_id)
                              .map((result, index) => (
                                <div key={index} className={cx('result-item')}>
                                  <span className={cx('result-service')}>{result.service.name}</span>
                                  <span className={cx('result-conclusion', {
                                    'positive': result.result.conclusion.toLowerCase().includes('bình thường'),
                                    'negative': !result.result.conclusion.toLowerCase().includes('bình thường')
                                  })}>
                                    {result.result.conclusion}
                                  </span>
                                </div>
                              ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className={cx('card-actions')}>
                      <button
                        className={cx('action-btn', 'view-btn')}
                        onClick={() => handleViewTestOrder(order)}
                      >
                        <FontAwesomeIcon icon={faEye} /> Xem chi tiết
                      </button>

                      {hasResults && (
                        <button
                          className={cx('action-btn', 'result-btn')}
                          onClick={() => handleViewTestResult(order)}
                        >
                          <FontAwesomeIcon icon={faFileAlt} /> Xem kết quả
                        </button>
                      )}

                      {order.order.order_status === 'pending' && (
                        <button
                          className={cx('action-btn', 'cancel-btn')}
                          onClick={() => handleCancelTestOrder(order)}
                        >
                          <FontAwesomeIcon icon={faTrash} /> Hủy đơn
                        </button>
                      )}
                    </div>

                    <div className={cx('card-footer')}>
                      <small className={cx('order-type')}>
                        {/* Enhanced footer with exam schedule info */}
                        {order.order.exam_date && order.order.exam_time ? (
                          <span>
                            📅 Lịch xét nghiệm: {new Date(order.order.exam_date).toLocaleDateString('vi-VN')} lúc {order.order.exam_time}
                          </span>
                        ) : (
                          <span>
                            Loại đơn: {order.order.order_type === 'directly' ? 'Trực tiếp' : 'Online'}
                          </span>
                        )}
                      </small>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className={cx('empty-state')}>
              <FontAwesomeIcon icon={faFlaskVial} className={cx('empty-icon')} />
              <h3>Không có đơn xét nghiệm nào</h3>
              <p>
                {Object.values(testFilters).some(f => f !== 'all' && f !== '')
                  ? 'Không tìm thấy đơn xét nghiệm nào phù hợp với bộ lọc của bạn.'
                  : 'Bạn chưa có đơn xét nghiệm nào. Hãy đặt lịch xét nghiệm ngay!'
                }
              </p>
              <button
                className={cx('primary-btn')}
                onClick={() => navigate('/services/test')}
              >
                Đặt lịch xét nghiệm
              </button>
            </div>
          )}
        </div>
      )}

      {/* Phân trang cho đơn xét nghiệm */}
      {activeTab === 'tests' && totalTestPages > 1 && (
        <div className={cx('pagination')}>
          <button
            className={cx('page-btn', { disabled: currentTestPage === 1 })}
            onClick={() => setCurrentTestPage(prev => Math.max(prev - 1, 1))}
            disabled={currentTestPage === 1}
          >
            Trước
          </button>

          {[...Array(totalTestPages)].map((_, index) => (
            <button
              key={index + 1}
              className={cx('page-btn', { active: currentTestPage === index + 1 })}
              onClick={() => setCurrentTestPage(index + 1)}
            >
              {index + 1}
            </button>
          ))}

          <button
            className={cx('page-btn', { disabled: currentTestPage === totalTestPages })}
            onClick={() => setCurrentTestPage(prev => Math.min(prev + 1, totalTestPages))}
            disabled={currentTestPage === totalTestPages}
          >
            Sau
          </button>
        </div>
      )}

      {/* Phân trang cho cuộc hẹn */}
      {activeTab === 'appointments' && totalPages > 1 && (
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

      {/* Modal chi tiết đơn xét nghiệm */}
      {showTestModal && selectedTestOrder && (
        <div className={cx('modal-overlay')} onClick={() => setShowTestModal(false)}>
          <div className={cx('modal-content', 'test-modal')} onClick={(e) => e.stopPropagation()}>
            <div className={cx('modal-header')}>
              <h2>Chi tiết đơn xét nghiệm</h2>
              <button className={cx('close-btn')} onClick={() => setShowTestModal(false)}>×</button>
            </div>

            <div className={cx('modal-body')}>
              <div className={cx('test-order-details')}>
                <div className={cx('detail-section')}>
                  <h3>Thông tin đơn hàng</h3>
                  <div className={cx('detail-grid')}>
                    <div className={cx('detail-row')}>
                      <strong>Mã đơn:</strong>
                      <span>{selectedTestOrder.order.order_id}</span>
                    </div>
                    <div className={cx('detail-row')}>
                      <strong>Trạng thái:</strong>
                      <span className={cx('status-text')}>
                        {getTestStatusInfo(selectedTestOrder.order.order_status).label}
                      </span>
                    </div>
                    <div className={cx('detail-row')}>
                      <strong>Loại đơn:</strong>
                      <span>{selectedTestOrder.order.order_type === 'directly' ? 'Trực tiếp' : 'Online'}</span>
                    </div>
                    <div className={cx('detail-row')}>
                      <strong>Phương thức thanh toán:</strong>
                      <span>{selectedTestOrder.order.payment_method === 'cash' ? 'Tiền mặt' : 'Thẻ'}</span>
                    </div>
                    <div className={cx('detail-row')}>
                      <strong>Tổng tiền:</strong>
                      <span>{formatCurrency(selectedTestOrder.order.total_amount)}</span>
                    </div>
                    <div className={cx('detail-row')}>
                      <strong>Ngày đặt:</strong>
                      <span>{formatDate(selectedTestOrder.order.created_at)}</span>
                    </div>

                    {/* Add exam date and time to modal */}
                    {selectedTestOrder.order.exam_date && (
                      <div className={cx('detail-row')}>
                        <strong>Ngày xét nghiệm:</strong>
                        <span>{formatDate(selectedTestOrder.order.exam_date)}</span>
                      </div>
                    )}

                    {selectedTestOrder.order.exam_time && (
                      <div className={cx('detail-row')}>
                        <strong>Giờ xét nghiệm:</strong>
                        <span>{selectedTestOrder.order.exam_time}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className={cx('detail-section')}>
                  <h3>Dịch vụ xét nghiệm</h3>
                  <div className={cx('services-detail')}>
                    {selectedTestOrder.services.map((service, index) => (
                      <div key={index} className={cx('service-detail-item')}>
                        <div className={cx('service-header')}>
                          <h4>{service.name}</h4>
                          <span className={cx('service-price')}>
                            {formatCurrency(service.price)}
                          </span>
                        </div>
                        <p className={cx('service-description')}>{service.description}</p>
                        <div className={cx('service-preparation')}>
                          <strong>Chuẩn bị:</strong>
                          <span>{service.preparation_guidelines}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Add appointment schedule section if exam date/time exists */}
                {(selectedTestOrder.order.exam_date || selectedTestOrder.order.exam_time) && (
                  <div className={cx('detail-section')}>
                    <h3>Lịch hẹn xét nghiệm</h3>
                    <div className={cx('appointment-schedule')}>
                      {selectedTestOrder.order.exam_date && (
                        <div className={cx('schedule-item')}>
                          <FontAwesomeIcon icon={faCalendarCheck} />
                          <span>
                            <strong>Ngày:</strong> {new Date(selectedTestOrder.order.exam_date).toLocaleDateString('vi-VN', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                      )}
                      {selectedTestOrder.order.exam_time && (
                        <div className={cx('schedule-item')}>
                          <FontAwesomeIcon icon={faClock} />
                          <span><strong>Giờ:</strong> {selectedTestOrder.order.exam_time}</span>
                        </div>
                      )}
                      <div className={cx('schedule-note')}>
                        <FontAwesomeIcon icon={faExclamationTriangle} />
                        <span>
                          <strong>Lưu ý:</strong> Vui lòng đến đúng giờ và chuẩn bị theo hướng dẫn của từng dịch vụ xét nghiệm.
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal kết quả xét nghiệm */}
      {showResultModal && selectedResult && (
        <div className={cx('modal-overlay')} onClick={() => setShowResultModal(false)}>
          <div className={cx('modal-content', 'result-modal')} onClick={(e) => e.stopPropagation()}>
            <div className={cx('modal-header')}>
              <h2>Kết quả xét nghiệm</h2>
              <button className={cx('close-btn')} onClick={() => setShowResultModal(false)}>×</button>
            </div>

            <div className={cx('modal-body')}>
              <div className={cx('result-details')}>
                <div className={cx('result-header')}>
                  <h3>{selectedResult.service.name}</h3>
                  <div className={cx('result-meta')}>
                    <span>Ngày xét nghiệm: {formatDate(selectedResult.exam_date)} {selectedResult.exam_time}</span>
                    <span>Mã kết quả: {selectedResult.testresult_id}</span>
                  </div>
                </div>

                <div className={cx('result-content')}>
                  <div className={cx('result-item')}>
                    <label>Kết quả:</label>
                    <div className={cx('result-value')}>{selectedResult.result.result}</div>
                  </div>

                  <div className={cx('result-item')}>
                    <label>Kết luận:</label>
                    <div className={cx('result-conclusion', {
                      'positive': selectedResult.result.conclusion.toLowerCase().includes('bình thường'),
                      'negative': !selectedResult.result.conclusion.toLowerCase().includes('bình thường')
                    })}>
                      {selectedResult.result.conclusion}
                    </div>
                  </div>

                  {selectedResult.result.normal_range && (
                    <div className={cx('result-item')}>
                      <label>Chỉ số bình thường:</label>
                      <div className={cx('result-value')}>{selectedResult.result.normal_range}</div>
                    </div>
                  )}

                  {selectedResult.result.recommendations && (
                    <div className={cx('result-item')}>
                      <label>Khuyến nghị:</label>
                      <div className={cx('result-recommendations')}>
                        {selectedResult.result.recommendations}
                      </div>
                    </div>
                  )}
                </div>

                <div className={cx('result-footer')}>
                  <div className={cx('result-timestamp')}>
                    Tạo kết quả: {formatDate(selectedResult.result.created_at)}
                  </div>
                  <div className={cx('result-actions')}>
                    <button
                      className={cx('action-btn', 'download-btn')}
                      onClick={() => handleDownloadResult(selectedResult)}
                    >
                      <FontAwesomeIcon icon={faDownload} /> Tải xuống
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
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