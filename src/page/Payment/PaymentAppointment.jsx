import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMobileAlt, faShieldAlt, faCheckCircle, faTimesCircle, faSpinner, faArrowLeft, faCalendarAlt, faUserMd, faClock, faMapMarkerAlt, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { specialtyMapping } from '../../components/Data/Doctor';
import axiosClient from '../../services/axiosClient';

import classNames from 'classnames/bind';
import styles from './Payment.module.scss';

const cx = classNames.bind(styles);

function PaymentAppointment() {
    const navigate = useNavigate();
    const location = useLocation();
    const { appointmentId } = useParams();

    // State
    const [appointmentData, setAppointmentData] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Get user info
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const accessToken = localStorage.getItem('accessToken');

    const getConsultationTypeDisplay = (consultationType) => {
        const specialtyKey = Object.keys(specialtyMapping).find(
            key => specialtyMapping[key] === consultationType
        );

        if (specialtyKey) {
            return specialtyMapping[specialtyKey];
        }

        if (specialtyMapping[consultationType]) {
            return specialtyMapping[consultationType];
        }

        return consultationType;
    };

    // Load appointment data from API
    useEffect(() => {
        const loadAppointmentData = async () => {
            // Check if user is logged in
            if (!user.user_id || !accessToken) {
                setError('Vui lòng đăng nhập để tiếp tục');
                setIsLoading(false);
                return;
            }

            // Check if appointmentId is provided
            if (!appointmentId) {
                // Try to get from location state (from notification)
                if (location.state?.appointmentData) {
                    setAppointmentData(location.state.appointmentData);
                    setIsLoading(false);
                    return;
                } else {
                    setError('Không tìm thấy thông tin cuộc hẹn');
                    setIsLoading(false);
                    return;
                }
            }

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
                    const appointments = response.data.data || [];

                    // Find appointment by ID - try multiple fields and data types
                    const appointment = appointments.find(apt => {
                        const aptId = apt.id || apt.appointment_id;
                        const searchId = parseInt(appointmentId);

                        // Try both string and number comparison
                        return aptId === searchId ||
                            String(aptId) === String(appointmentId) ||
                            apt.id === searchId ||
                            apt.appointment_id === searchId;
                    });

                    if (appointment) {
                        if (appointment.status !== 'confirmed') {
                            setError(`Cuộc hẹn này không thể thanh toán. Trạng thái hiện tại: ${appointment.status}`);
                            setIsLoading(false);
                            return;
                        }

                        if (!appointment.price_apm || appointment.price_apm <= 0) {
                            setError('Cuộc hẹn này không có phí thanh toán');
                            setIsLoading(false);
                            return;
                        }

                        setAppointmentData(appointment);
                    } else {
                        setError('Không tìm thấy cuộc hẹn hoặc bạn không có quyền truy cập');
                    }
                } else {
                    throw new Error('Invalid API response');
                }
            } catch (error) {
                console.error('❌ Error loading appointment data:', error);

                let errorMessage = 'Không thể tải thông tin cuộc hẹn';

                if (error.response) {
                    const status = error.response.status;
                    switch (status) {
                        case 401:
                            errorMessage = 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại';
                            break;
                        case 403:
                            errorMessage = 'Bạn không có quyền truy cập cuộc hẹn này';
                            break;
                        case 404:
                            errorMessage = 'Không tìm thấy cuộc hẹn';
                            break;
                        case 500:
                            errorMessage = 'Lỗi server. Vui lòng thử lại sau';
                            break;
                        default:
                            errorMessage = error.response.data?.message || 'Có lỗi xảy ra khi tải dữ liệu';
                    }
                }

                setError(errorMessage);
            } finally {
                setIsLoading(false);
            }
        };

        loadAppointmentData();
    }, [appointmentId, user.user_id, accessToken, location.state]);

    // Payment methods
    const paymentMethods = [
        {
            id: 'zalopay',
            name: 'Ví ZaloPay',
            icon: faMobileAlt,
            description: 'Thanh toán qua ví điện tử ZaloPay'
        },
        {
            id: 'momo',
            name: 'Ví MoMo',
            icon: faMobileAlt,
            description: 'Thanh toán qua ví điện tử MoMo'
        },
        {
            id: 'vnpay',
            name: 'VNPay',
            icon: faMobileAlt,
            description: 'Thanh toán qua cổng VNPay'
        }
    ];

    // Calculate fees
    const serviceFee = 0; // Không phí dịch vụ
    const totalAmount = appointmentData ? appointmentData.price_apm : 0;

    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return 'Chưa chọn';

        // Handle different date formats
        let date;
        if (dateString.includes('T')) {
            date = new Date(dateString);
        } else {
            date = new Date(dateString + 'T00:00:00');
        }

        return date.toLocaleDateString('vi-VN', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Handle payment
    const handlePayment = async () => {
        if (!paymentMethod) {
            alert('Vui lòng chọn phương thức thanh toán');
            return;
        }

        if (!appointmentData) {
            alert('Không tìm thấy thông tin cuộc hẹn');
            return;
        }

        setIsProcessing(true);

        try {
            console.log('💳 Processing payment for appointment:', appointmentData.id);

            // Simulate payment processing
            await new Promise(resolve => setTimeout(resolve, 3000));

            // 90% success rate for demo
            const isSuccess = Math.random() > 0.1;

            if (isSuccess) {
                setPaymentStatus('success');

                // Create payment record
                const paymentRecord = {
                    appointmentId: appointmentData.id || appointmentData.appointment_id,
                    amount: appointmentData.price_apm,
                    status: 'confirmed',
                    paidAt: new Date().toISOString(),
                    paymentId: `PAY${Date.now()}`,
                    paymentMethod: paymentMethod,
                    timestamp: Date.now(),
                    consultant_type: appointmentData.consultant_type,
                    userId: user.user_id,
                    doctorName: appointmentData.doctor_name || appointmentData.doctorName,
                    appointmentDate: appointmentData.appointment_date || appointmentData.appointmentDate,
                    appointmentTime: appointmentData.appointment_time
                };

                // Save payment success
                const existingPayments = JSON.parse(localStorage.getItem('paymentSuccess') || '[]');
                existingPayments.push(paymentRecord);
                localStorage.setItem('paymentSuccess', JSON.stringify(existingPayments));

                console.log('✅ Payment successful:', paymentRecord);

                // TODO: Call API to update appointment status to paid
                // await axiosClient.put(`/v1/appointments/${appointmentData.id}/payment`, {
                //     paymentId: paymentRecord.paymentId,
                //     paymentMethod: paymentMethod,
                //     amount: appointmentData.price_apm
                // });

                // Redirect after success
                setTimeout(() => {
                    navigate('/my-appointments', {
                        state: {
                            message: 'Thanh toán thành công! Cuộc hẹn đã được xác nhận.',
                            type: 'success'
                        }
                    });
                }, 2000);
            } else {
                setPaymentStatus('failed');
                console.log('❌ Payment failed (simulated)');
            }
        } catch (error) {
            console.error('❌ Payment error:', error);
            setPaymentStatus('failed');
        } finally {
            setIsProcessing(false);
        }
    };

    // Loading state
    if (isLoading) {
        return (
            <div className={cx('container')}>
                <div className={cx('success-container')}>
                    <FontAwesomeIcon icon={faSpinner} spin className={cx('spinner')} style={{ fontSize: '48px', color: '#0ea5e9' }} />
                    <p>Đang tải thông tin cuộc hẹn...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className={cx('container')}>
                <div className={cx('success-container')}>
                    <div className={cx('failed-icon')}>
                        <FontAwesomeIcon icon={faExclamationTriangle} />
                    </div>
                    <h2 className={cx('failed-title')}>Có lỗi xảy ra</h2>
                    <p>{error}</p>
                    <div className={cx('error-actions')}>
                        <button
                            className={cx('retry-btn')}
                            onClick={() => window.location.reload()}
                        >
                            Thử lại
                        </button>
                        <button
                            className={cx('back-btn')}
                            onClick={() => navigate('/my-appointments')}
                        >
                            Về danh sách cuộc hẹn
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Success state
    if (paymentStatus === 'success') {
        return (
            <div className={cx('container')}>
                <div className={cx('success-container')}>
                    <div className={cx('success-icon')}>
                        <FontAwesomeIcon icon={faCheckCircle} />
                    </div>
                    <h2 className={cx('success-title')}>Thanh toán thành công!</h2>
                    <p>Cuộc hẹn của bạn đã được xác nhận.</p>
                    <div className={cx('success-details')}>
                        <p><strong>Mã giao dịch:</strong> PAY{Date.now()}</p>
                        <p><strong>Số tiền:</strong> {formatCurrency(totalAmount)}</p>
                        <p><strong>Bác sĩ:</strong> {appointmentData.doctor_name || appointmentData.doctorName || 'Bác sĩ tư vấn'}</p>
                        <p><strong>Thời gian:</strong> {appointmentData.appointment_time} - {formatDate(appointmentData.appointment_date || appointmentData.appointmentDate)}</p>
                    </div>
                </div>
            </div>
        );
    }

    // Failed state
    if (paymentStatus === 'failed') {
        return (
            <div className={cx('container')}>
                <div className={cx('success-container')}>
                    <div className={cx('failed-icon')}>
                        <FontAwesomeIcon icon={faTimesCircle} />
                    </div>
                    <h2 className={cx('failed-title')}>Thanh toán thất bại!</h2>
                    <p>Vui lòng thử lại sau hoặc chọn phương thức thanh toán khác.</p>
                    <button
                        className={cx('retry-btn')}
                        onClick={() => setPaymentStatus('')}
                    >
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
                    <button
                        className={cx('back-btn')}
                        onClick={() => navigate('/my-appointments')}
                    >
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
                            <FontAwesomeIcon icon={faCalendarAlt} className={cx('detail-icon')} />
                            Thông tin cuộc hẹn
                        </h3>

                        <div className={cx('detail-item')}>
                            <FontAwesomeIcon icon={faUserMd} className={cx('detail-icon')} />
                            <div className={cx('detail-text')}>
                                <strong className={cx('detail-label')}>{appointmentData.doctor_name || appointmentData.doctorName || 'Bác sĩ tư vấn'}</strong>
                                <span className={cx('detail-value')}>{getConsultationTypeDisplay(appointmentData.consultant_type)}</span>
                            </div>
                        </div>

                        <div className={cx('detail-item')}>
                            <FontAwesomeIcon icon={faCalendarAlt} className={cx('detail-icon')} />
                            <div className={cx('detail-text')}>
                                <strong className={cx('detail-label')}>Ngày khám</strong>
                                <span className={cx('detail-value')}>{formatDate(appointmentData.appointment_date || appointmentData.appointmentDate || appointmentData.date)}</span>
                            </div>
                        </div>

                        <div className={cx('detail-item')}>
                            <FontAwesomeIcon icon={faClock} className={cx('detail-icon')} />
                            <div className={cx('detail-text')}>
                                <strong className={cx('detail-label')}>Giờ khám</strong>
                                <span className={cx('detail-value')}>{appointmentData.appointment_time}</span>
                            </div>
                        </div>

                        <div className={cx('detail-item')}>
                            <FontAwesomeIcon icon={faMapMarkerAlt} className={cx('detail-icon')} />
                            <div className={cx('detail-text')}>
                                <strong className={cx('detail-label')}>Hình thức</strong>
                                <span className={cx('detail-value')}>Tư vấn trực tuyến</span>
                            </div>
                        </div>

                        {/* Price */}
                        <div className={cx('price-breakdown')}>
                            <div className={cx('price-item')}>
                                <span>Phí tư vấn</span>
                                <span>{formatCurrency(appointmentData.price_apm)}</span>
                            </div>
                            <div className={cx('price-item')}>
                                <span>Phí dịch vụ</span>
                                <span>{formatCurrency(serviceFee)}</span>
                            </div>
                            <div className={cx('price-total')}>
                                <span>Tổng cộng</span>
                                <span>{formatCurrency(totalAmount)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Payment Methods */}
                    <div className={cx('section')}>
                        <h3 className={cx('section-title')}>Chọn phương thức thanh toán</h3>

                        <div className={cx('payment-options')}>
                            {paymentMethods.map((method) => (
                                <label
                                    key={method.id}
                                    className={cx('payment-option', {
                                        'selected': paymentMethod === method.id
                                    })}
                                >
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
                        <div style={{ textAlign: 'center' }}>
                            <button
                                className={cx('pay-button')}
                                onClick={handlePayment}
                                disabled={!paymentMethod || isProcessing}
                            >
                                {isProcessing ? (
                                    <>
                                        <FontAwesomeIcon icon={faSpinner} spin className={cx('spinner')} />
                                        Đang xử lý thanh toán...
                                    </>
                                ) : (
                                    <>
                                        Thanh toán {formatCurrency(totalAmount)}
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
        </div>
    );
}

export default PaymentAppointment;