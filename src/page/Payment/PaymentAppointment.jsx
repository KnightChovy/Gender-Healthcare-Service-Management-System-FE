import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMobileAlt, faShieldAlt, faCheckCircle, faTimesCircle, faSpinner, faArrowLeft, faCalendarAlt, faUserMd, faClock, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { specialtyMapping } from '../../components/Data/Doctor';

import classNames from 'classnames/bind';
import styles from './Payment.module.scss';

const cx = classNames.bind(styles);

function PaymentAppointment() {
    const navigate = useNavigate();
    
    // State
    const [appointmentData, setAppointmentData] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState('');

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

    // Load dữ liệu từ localStorage
    useEffect(() => {
        const loadData = () => {
            const pendingAppointment = localStorage.getItem('pendingAppointment');
            if (pendingAppointment) {
                const data = JSON.parse(pendingAppointment);
                setAppointmentData(data);
            } else {
                // Fallback: redirect về appointment page
                navigate('/appointment');
            }
        };
        
        loadData();
    }, [navigate]);

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
    const totalAmount = appointmentData ? appointmentData.fee : 0;

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
        return new Date(dateString + 'T00:00:00').toLocaleDateString('vi-VN', {
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

        setIsProcessing(true);

        try {
            // Simulate payment processing
            await new Promise(resolve => setTimeout(resolve, 3000));
            
            // 90% success rate
            const isSuccess = Math.random() > 0.1;

            if (isSuccess) {
                setPaymentStatus('success');
                
                // Save to appointments list
                const existingAppointments = JSON.parse(localStorage.getItem('userAppointments') || '[]');
                const newAppointment = {
                    ...appointmentData,
                    status: 'confirmed',
                    paidAt: new Date().toISOString(),
                    transactionId: `TXN${Date.now()}`
                };
                existingAppointments.push(newAppointment);
                localStorage.setItem('userAppointments', JSON.stringify(existingAppointments));
                
                // Clear pending appointment
                localStorage.removeItem('pendingAppointment');
                
                // Redirect after success
                setTimeout(() => {
                    alert('Thanh toán thành công! Cuộc hẹn đã được xác nhận.');
                    navigate('/appointment');
                }, 2000);
            } else {
                setPaymentStatus('failed');
            }
        } catch (error) {
            console.error('Payment error:', error);
            setPaymentStatus('failed');
        } finally {
            setIsProcessing(false);
        }
    };

    // Loading state
    if (!appointmentData) {
        return (
            <div className={cx('container')}>
                <div className={cx('success-container')}>
                    <FontAwesomeIcon icon={faSpinner} className={cx('spinner')} style={{ fontSize: '48px', color: '#0ea5e9' }} />
                    <p>Đang tải thông tin...</p>
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
                        <p><strong>Mã giao dịch:</strong> TXN{Date.now()}</p>
                        <p><strong>Số tiền:</strong> {formatCurrency(totalAmount)}</p>
                        <p><strong>Bác sĩ:</strong> {appointmentData.doctorName}</p>
                        <p><strong>Thời gian:</strong> {appointmentData.appointmentTime} - {formatDate(appointmentData.appointmentDate)}</p>
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
                    <p>Vui lòng thử lại.</p>
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
        <div className={cx('container')}>
            {/* Header */}
            <div className={cx('header')}>
                <button
                    className={cx('back-btn')}
                    onClick={() => navigate(-1)}
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
                            <strong className={cx('detail-label')}>{appointmentData.doctorName || 'Bác sĩ tư vấn'}</strong>
                            <span className={cx('detail-value')}>{getConsultationTypeDisplay(appointmentData.consultationType)}</span>
                        </div>
                    </div>

                    <div className={cx('detail-item')}>
                        <FontAwesomeIcon icon={faCalendarAlt} className={cx('detail-icon')} />
                        <div className={cx('detail-text')}>
                            <strong className={cx('detail-label')}>Ngày khám</strong>
                            <span className={cx('detail-value')}>{formatDate(appointmentData.appointmentDate)}</span>
                        </div>
                    </div>

                    <div className={cx('detail-item')}>
                        <FontAwesomeIcon icon={faClock} className={cx('detail-icon')} />
                        <div className={cx('detail-text')}>
                            <strong className={cx('detail-label')}>Giờ khám</strong>
                            <span className={cx('detail-value')}>{appointmentData.appointmentTime}</span>
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
                            <span>{formatCurrency(appointmentData.fee || 500000)}</span>
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
                                    <FontAwesomeIcon icon={faSpinner} className={cx('spinner')} />
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
    );
}

export default PaymentAppointment;