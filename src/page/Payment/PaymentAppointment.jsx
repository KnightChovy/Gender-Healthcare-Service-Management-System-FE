import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faMobileAlt, faShieldAlt, faCheckCircle, faTimesCircle, 
    faSpinner, faArrowLeft, faCalendarAlt, faUserMd, faClock, 
    faMapMarkerAlt, faExclamationTriangle 
} from '@fortawesome/free-solid-svg-icons';
import { specialtyMapping } from '../../components/Data/Doctor';
import axiosClient from '../../services/axiosClient';
import classNames from 'classnames/bind';
import styles from './Payment.module.scss';

const cx = classNames.bind(styles);

function PaymentAppointment() {
    const navigate = useNavigate();
    const location = useLocation();
    const { appointmentId } = useParams();

    // States
    const [appointmentData, setAppointmentData] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // User info
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const accessToken = localStorage.getItem('accessToken');

    // Payment methods
    const paymentMethods = [
        { id: 'zalopay', name: 'Ví ZaloPay', icon: faMobileAlt, description: 'Thanh toán qua ví điện tử ZaloPay' },
        { id: 'momo', name: 'Ví MoMo', icon: faMobileAlt, description: 'Thanh toán qua ví điện tử MoMo' },
        { id: 'vnpay', name: 'VNPay', icon: faMobileAlt, description: 'Thanh toán qua cổng VNPay' }
    ];

    // Utility functions
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Chưa chọn';
        const date = dateString.includes('T') ? new Date(dateString) : new Date(dateString + 'T00:00:00');
        return date.toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    };

    const getConsultationTypeDisplay = (consultationType) => {
        const specialtyKey = Object.keys(specialtyMapping).find(key => specialtyMapping[key] === consultationType);
        return specialtyKey ? specialtyMapping[specialtyKey] : (specialtyMapping[consultationType] || consultationType);
    };

    // Load appointment data
    useEffect(() => {
        const loadAppointmentData = async () => {
            if (!user.user_id || !accessToken) {
                setError('Vui lòng đăng nhập để tiếp tục');
                setIsLoading(false);
                return;
            }

            // Use data from location state if available
            if (!appointmentId && location.state?.appointmentData) {
                setAppointmentData(location.state.appointmentData);
                setIsLoading(false);
                return;
            }

            if (!appointmentId) {
                setError('Không tìm thấy thông tin cuộc hẹn');
                setIsLoading(false);
                return;
            }

            try {
                const response = await axiosClient.get(`/v1/appointments/user/${user.user_id}`, {
                    headers: { 'x-access-token': accessToken }
                });

                if (response.data?.success) {
                    const appointment = response.data.data.find(apt => {
                        const aptId = apt.id || apt.appointment_id;
                        return aptId === parseInt(appointmentId) || String(aptId) === String(appointmentId);
                    });

                    if (!appointment) {
                        setError('Không tìm thấy cuộc hẹn hoặc bạn không có quyền truy cập');
                        return;
                    }

                    if (appointment.status !== 'confirmed' && appointment.status !== '1') {
                        setError(`Cuộc hẹn này không thể thanh toán. Trạng thái: ${appointment.status}`);
                        return;
                    }

                    if (!appointment.price_apm || appointment.price_apm <= 0) {
                        setError('Cuộc hẹn này không có phí thanh toán');
                        return;
                    }

                    setAppointmentData(appointment);
                }
            } catch (error) {
                console.error('❌ Error loading appointment:', error);
                setError(error.response?.data?.message || 'Không thể tải thông tin cuộc hẹn');
            } finally {
                setIsLoading(false);
            }
        };

        loadAppointmentData();
    }, [appointmentId, user.user_id, accessToken, location.state]);

    // Handle payment
    const handlePayment = async () => {
        if (!paymentMethod) {
            alert('Vui lòng chọn phương thức thanh toán');
            return;
        }

        setIsProcessing(true);

        try {
            const paymentData = {
                user_id: user.user_id,
                price: 2000,
            };

            const response = await axiosClient.post('/v2/payment/create-checkout-session', paymentData, {
                headers: { 'Content-Type': 'application/json'},
            });

            if (response.data?.success) {
                const paymentResult = response.data.data;
                
                if (paymentResult.checkout_url || paymentResult.payment_url) {
                    // Save payment session
                    localStorage.setItem('currentPaymentSession', JSON.stringify({
                        sessionId: paymentResult.session_id || paymentResult.checkout_session_id,
                        appointmentId: appointmentData.id || appointmentData.appointment_id,
                        amount: appointmentData.price_apm,
                        paymentMethod,
                        createdAt: new Date().toISOString(),
                        status: 'pending'
                    }));
                    
                    // Redirect to payment gateway
                    window.location.href = paymentResult.checkout_url || paymentResult.payment_url;
                } else {
                    throw new Error('Không nhận được URL thanh toán');
                }
            } else {
                throw new Error(response.data?.message || 'Không thể tạo phiên thanh toán');
            }
        } catch (error) {
            console.error('❌ Payment error:', error);
            setPaymentStatus('failed');
            setError(error.response?.data?.message || error.message || 'Có lỗi xảy ra khi xử lý thanh toán');
        } finally {
            setIsProcessing(false);
        }
    };

    // Handle payment success
    const handlePaymentSuccess = (paymentResult) => {
        // Save payment record
        const paymentRecord = {
            appointmentId: appointmentData.id || appointmentData.appointment_id,
            amount: appointmentData.price_apm,
            status: 'completed',
            paidAt: new Date().toISOString(),
            paymentId: paymentResult.payment_id || paymentResult.transaction_id,
            paymentMethod,
            sessionId: paymentResult.session_id
        };

        const existingPayments = JSON.parse(localStorage.getItem('paymentSuccess') || '[]');
        existingPayments.push(paymentRecord);
        localStorage.setItem('paymentSuccess', JSON.stringify(existingPayments));

        localStorage.removeItem('currentPaymentSession');
        setPaymentStatus('success');

        // Redirect after success
        setTimeout(() => {
            navigate('/my-appointments', {
                state: { message: 'Thanh toán thành công! Cuộc hẹn đã được xác nhận.', type: 'success' }
            });
        }, 3000);
    };

    // Check payment callback
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const paymentStatus = urlParams.get('payment_status') || urlParams.get('status');
        const sessionId = urlParams.get('session_id') || urlParams.get('checkout_session_id');
        
        if (paymentStatus && sessionId) {
            const savedSession = JSON.parse(localStorage.getItem('currentPaymentSession') || '{}');
            
            if (savedSession.sessionId === sessionId) {
                if (paymentStatus === 'success' || paymentStatus === 'completed') {
                    handlePaymentSuccess({
                        payment_id: urlParams.get('payment_id') || urlParams.get('transaction_id'),
                        session_id: sessionId,
                        status: paymentStatus
                    });
                } else {
                    setPaymentStatus('failed');
                    setError('Thanh toán đã bị hủy hoặc thất bại. Vui lòng thử lại.');
                }
            }
            
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }, []);

    // Render loading state
    if (isLoading) {
        return (
            <div className={cx('container')}>
                <div className={cx('success-container')}>
                    <FontAwesomeIcon icon={faSpinner} spin style={{ fontSize: '48px', color: '#0ea5e9' }} />
                    <p>Đang tải thông tin cuộc hẹn...</p>
                </div>
            </div>
        );
    }

    // Render error state
    if (error) {
        return (
            <div className={cx('container')}>
                <div className={cx('success-container')}>
                    <FontAwesomeIcon icon={faExclamationTriangle} className={cx('failed-icon')} />
                    <h2 className={cx('failed-title')}>Có lỗi xảy ra</h2>
                    <p>{error}</p>
                    <div className={cx('error-actions')}>
                        <button className={cx('retry-btn')} onClick={() => window.location.reload()}>
                            Thử lại
                        </button>
                        <button className={cx('back-btn')} onClick={() => navigate('/my-appointments')}>
                            Về danh sách cuộc hẹn
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Render success state
    if (paymentStatus === 'success') {
        return (
            <div className={cx('container')}>
                <div className={cx('success-container')}>
                    <FontAwesomeIcon icon={faCheckCircle} className={cx('success-icon')} />
                    <h2 className={cx('success-title')}>Thanh toán thành công!</h2>
                    <p>Cuộc hẹn của bạn đã được xác nhận.</p>
                    <div className={cx('success-details')}>
                        <p><strong>Số tiền:</strong> {formatCurrency(appointmentData.price_apm)}</p>
                        <p><strong>Bác sĩ:</strong> {appointmentData.doctor_name || 'Bác sĩ tư vấn'}</p>
                        <p><strong>Thời gian:</strong> {appointmentData.appointment_time} - {formatDate(appointmentData.appointment_date)}</p>
                    </div>
                </div>
            </div>
        );
    }

    // Render failed state
    if (paymentStatus === 'failed') {
        return (
            <div className={cx('container')}>
                <div className={cx('success-container')}>
                    <FontAwesomeIcon icon={faTimesCircle} className={cx('failed-icon')} />
                    <h2 className={cx('failed-title')}>Thanh toán thất bại!</h2>
                    <p>Vui lòng thử lại sau hoặc chọn phương thức thanh toán khác.</p>
                    <button className={cx('retry-btn')} onClick={() => setPaymentStatus('')}>
                        Thử lại
                    </button>
                </div>
            </div>
        );
    }

    // Main payment UI
    return (
        <div className={cx('wrap')}>
            <div className={cx('container')}>
                {/* Header */}
                <div className={cx('header')}>
                    <button className={cx('back-btn')} onClick={() => navigate('/my-appointments')}>
                        <FontAwesomeIcon icon={faArrowLeft} />
                        Quay lại
                    </button>
                    <h1 className={cx('title')}>Thanh toán cuộc hẹn</h1>
                    <div className={cx('security-badge')}>
                        <FontAwesomeIcon icon={faShieldAlt} />
                        <span>Bảo mật SSL</span>
                    </div>
                </div>

                <div className={cx('content')}>
                    {/* Appointment Summary */}
                    <div className={cx('section')}>
                        <h3 className={cx('section-title')}>
                            <FontAwesomeIcon icon={faCalendarAlt} />
                            Thông tin cuộc hẹn
                        </h3>

                        <div className={cx('detail-item')}>
                            <FontAwesomeIcon icon={faUserMd} className={cx('detail-icon')} />
                            <div className={cx('detail-text')}>
                                <strong>{appointmentData.doctor_name || 'Bác sĩ tư vấn'}</strong>
                                <span>{getConsultationTypeDisplay(appointmentData.consultant_type)}</span>
                            </div>
                        </div>

                        <div className={cx('detail-item')}>
                            <FontAwesomeIcon icon={faCalendarAlt} className={cx('detail-icon')} />
                            <div className={cx('detail-text')}>
                                <strong>Ngày khám</strong>
                                <span>{formatDate(appointmentData.appointment_date)}</span>
                            </div>
                        </div>

                        <div className={cx('detail-item')}>
                            <FontAwesomeIcon icon={faClock} className={cx('detail-icon')} />
                            <div className={cx('detail-text')}>
                                <strong>Giờ khám</strong>
                                <span>{appointmentData.appointment_time}</span>
                            </div>
                        </div>

                        <div className={cx('detail-item')}>
                            <FontAwesomeIcon icon={faMapMarkerAlt} className={cx('detail-icon')} />
                            <div className={cx('detail-text')}>
                                <strong>Hình thức</strong>
                                <span>Tư vấn trực tuyến</span>
                            </div>
                        </div>

                        <div className={cx('price-breakdown')}>
                            <div className={cx('price-item')}>
                                <span>Phí tư vấn</span>
                                <span>{formatCurrency(appointmentData.price_apm)}</span>
                            </div>
                            <div className={cx('price-total')}>
                                <span>Tổng cộng</span>
                                <span>{formatCurrency(appointmentData.price_apm)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Payment Methods */}
                    <div className={cx('section')}>
                        <h3 className={cx('section-title')}>Chọn phương thức thanh toán</h3>
                        <div className={cx('payment-options')}>
                            {paymentMethods.map((method) => (
                                <label key={method.id} className={cx('payment-option', { 'selected': paymentMethod === method.id })}>
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value={method.id}
                                        checked={paymentMethod === method.id}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                    />
                                    <div className={cx('option-content')}>
                                        <FontAwesomeIcon icon={method.icon} className={cx('option-icon')} />
                                        <div className={cx('option-text')}>
                                            <span className={cx('option-name')}>{method.name}</span>
                                            <span className={cx('option-description')}>{method.description}</span>
                                        </div>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Payment Button */}
                    <div className={cx('section')}>
                        <button
                            className={cx('pay-button', { 'disabled': !paymentMethod || isProcessing })}
                            onClick={handlePayment}
                            disabled={!paymentMethod || isProcessing}
                        >
                            {isProcessing ? (
                                <>
                                    <FontAwesomeIcon icon={faSpinner} spin />
                                    Đang xử lý thanh toán...
                                </>
                            ) : (
                                <>
                                    <FontAwesomeIcon icon={faCheckCircle} />
                                    Thanh toán {formatCurrency(appointmentData.price_apm)}
                                </>
                            )}
                        </button>

                        <div className={cx('security-info')}>
                            <FontAwesomeIcon icon={faShieldAlt} style={{ color: '#22c55e' }} />
                            <span>Thông tin thanh toán được mã hóa và bảo mật tuyệt đối</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PaymentAppointment;