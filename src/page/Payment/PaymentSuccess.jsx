// src/page/Payment/PaymentSuccess.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faCheckCircle, faCalendarAlt, faUserMd, 
    faClock, faMoneyBillWave, faDownload,
    faShare, faPrint, faArrowLeft
} from '@fortawesome/free-solid-svg-icons';
import axiosClient from '../../services/axiosClient';
import classNames from 'classnames/bind';
import styles from './Payment.module.scss';

const cx = classNames.bind(styles);

function PaymentSuccess() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    
    // States
    const [paymentData, setPaymentData] = useState(null);
    const [appointmentData, setAppointmentData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Get params from URL
    const sessionId = searchParams.get('session_id') || searchParams.get('checkout_session_id');
    const paymentId = searchParams.get('payment_id') || searchParams.get('transaction_id');
    const appointmentId = searchParams.get('appointment_id');
    const amount = searchParams.get('amount');

    // User info
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const accessToken = localStorage.getItem('accessToken');

    // Format functions
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Chưa xác định';
        const date = dateString.includes('T') ? new Date(dateString) : new Date(dateString + 'T00:00:00');
        return date.toLocaleDateString('vi-VN', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    };

    const formatDateTime = (date) => {
        return new Intl.DateTimeFormat('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        }).format(date);
    };

    // Load payment and appointment data
    useEffect(() => {
        const loadPaymentSuccess = async () => {
            try {
                setIsLoading(true);

                // Get saved payment session
                const savedSession = JSON.parse(localStorage.getItem('currentPaymentSession') || '{}');
                
                console.log('✅ Payment success params:', {
                    sessionId,
                    paymentId,
                    appointmentId,
                    amount,
                    savedSession
                });

                // Create payment record
                const paymentRecord = {
                    sessionId: sessionId || savedSession.sessionId,
                    paymentId: paymentId,
                    appointmentId: appointmentId || savedSession.appointmentId,
                    amount: amount || savedSession.amount,
                    status: 'completed',
                    paidAt: new Date().toISOString(),
                    paymentMethod: savedSession.paymentMethod || 'online'
                };

                setPaymentData(paymentRecord);

                // Load appointment data if available
                if (paymentRecord.appointmentId && accessToken) {
                    try {
                        const response = await axiosClient.get(`/v1/appointments/user/${user.user_id}`, {
                            headers: { 'x-access-token': accessToken }
                        });

                        if (response.data?.success) {
                            const appointment = response.data.data.find(apt => {
                                const aptId = apt.id || apt.appointment_id;
                                return String(aptId) === String(paymentRecord.appointmentId);
                            });

                            if (appointment) {
                                setAppointmentData(appointment);
                            }
                        }
                    } catch (error) {
                        console.warn('Could not load appointment data:', error);
                    }
                }

                // Save payment success record
                const existingPayments = JSON.parse(localStorage.getItem('paymentSuccess') || '[]');
                existingPayments.push(paymentRecord);
                localStorage.setItem('paymentSuccess', JSON.stringify(existingPayments));

                // Clean up payment session
                localStorage.removeItem('currentPaymentSession');

                // Optional: Update appointment payment status via API
                if (paymentRecord.appointmentId && accessToken) {
                    try {
                        await axiosClient.post('/v1/appointments/update-payment-status', {
                            appointment_id: paymentRecord.appointmentId,
                            payment_id: paymentRecord.paymentId,
                            status: 'paid'
                        }, {
                            headers: { 'x-access-token': accessToken }
                        });
                    } catch (error) {
                        console.warn('Could not update appointment payment status:', error);
                    }
                }

            } catch (error) {
                console.error('❌ Error processing payment success:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadPaymentSuccess();
    }, [sessionId, paymentId, appointmentId, amount]);

    // Action handlers
    const handleDownloadReceipt = () => {
        const receiptData = {
            paymentId: paymentData.paymentId,
            amount: paymentData.amount,
            paidAt: paymentData.paidAt,
            appointment: appointmentData,
            user: user
        };
        
        console.log('📄 Download receipt:', receiptData);
        alert('Tính năng tải hóa đơn sẽ được cập nhật sớm!');
    };

    const handlePrintReceipt = () => {
        window.print();
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: 'Thanh toán thành công',
                text: `Đã thanh toán thành công ${formatCurrency(paymentData.amount)} cho cuộc hẹn tư vấn`,
                url: window.location.href
            });
        } else {
            // Fallback - copy to clipboard
            const shareText = `Thanh toán thành công: ${formatCurrency(paymentData.amount)} - Mã GD: ${paymentData.paymentId}`;
            navigator.clipboard.writeText(shareText);
            alert('Đã copy thông tin thanh toán!');
        }
    };

    const goToAppointments = () => {
        navigate('/my-appointments', {
            state: { 
                message: 'Thanh toán thành công! Cuộc hẹn đã được xác nhận.', 
                type: 'success' 
            }
        });
    };

    // Loading state
    if (isLoading) {
        return (
            <div className={cx('wrap')}>
                <div className={cx('container')}>
                    <div className={cx('success-container')}>
                        <div className={cx('loading-animation')}>
                            <FontAwesomeIcon icon={faCheckCircle} className={cx('success-icon', 'animate')} />
                        </div>
                        <h2>Đang xử lý thanh toán...</h2>
                        <p>Vui lòng đợi trong giây lát</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={cx('wrap')}>
            <div className={cx('container')}>
                <div className={cx('success-page')}>
                    {/* Success Header */}
                    <div className={cx('success-header')}>
                        <div className={cx('success-animation')}>
                            <FontAwesomeIcon icon={faCheckCircle} className={cx('success-icon')} />
                            <div className={cx('success-ripple')}></div>
                        </div>
                        <h1 className={cx('success-title')}>Thanh toán thành công!</h1>
                        <p className={cx('success-subtitle')}>
                            Cảm ơn bạn đã tin tưởng sử dụng dịch vụ của chúng tôi
                        </p>
                    </div>

                    {/* Payment Details */}
                    <div className={cx('payment-summary')}>
                        <h3 className={cx('section-title')}>Thông tin thanh toán</h3>
                        
                        <div className={cx('summary-grid')}>
                            <div className={cx('summary-item')}>
                                <span className={cx('label')}>Mã giao dịch:</span>
                                <span className={cx('value', 'highlight')}>{paymentData?.paymentId || `APM${Date.now()}`}</span>
                            </div>
                            
                            <div className={cx('summary-item')}>
                                <span className={cx('label')}>Số tiền:</span>
                                <span className={cx('value', 'amount')}>{formatCurrency(paymentData?.amount || 0)}</span>
                            </div>
                            
                            <div className={cx('summary-item')}>
                                <span className={cx('label')}>Thời gian:</span>
                                <span className={cx('value')}>{formatDateTime(new Date(paymentData?.paidAt))}</span>
                            </div>
                            
                            {paymentData?.paymentMethod && (
                                <div className={cx('summary-item')}>
                                    <span className={cx('label')}>Phương thức:</span>
                                    <span className={cx('value')}>{paymentData.paymentMethod.toUpperCase()}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Appointment Details */}
                    {appointmentData && (
                        <div className={cx('appointment-summary')}>
                            <h3 className={cx('section-title')}>
                                <FontAwesomeIcon icon={faCalendarAlt} />
                                Thông tin cuộc hẹn
                            </h3>
                            
                            <div className={cx('appointment-card')}>
                                <div className={cx('appointment-header')}>
                                    <div className={cx('doctor-info')}>
                                        <FontAwesomeIcon icon={faUserMd} className={cx('doctor-icon')} />
                                        <div>
                                            <h4>{appointmentData.doctor_name || 'Bác sĩ tư vấn'}</h4>
                                            <span>{appointmentData.consultant_type}</span>
                                        </div>
                                    </div>
                                    <div className={cx('status-badge', 'paid')}>
                                        Đã thanh toán
                                    </div>
                                </div>
                                
                                <div className={cx('appointment-details')}>
                                    <div className={cx('detail-row')}>
                                        <FontAwesomeIcon icon={faCalendarAlt} />
                                        <span><strong>Ngày khám:</strong> {formatDate(appointmentData.appointment_date)}</span>
                                    </div>
                                    
                                    <div className={cx('detail-row')}>
                                        <FontAwesomeIcon icon={faClock} />
                                        <span><strong>Giờ khám:</strong> {appointmentData.appointment_time}</span>
                                    </div>
                                    
                                    <div className={cx('detail-row')}>
                                        <FontAwesomeIcon icon={faMoneyBillWave} />
                                        <span><strong>Phí tư vấn:</strong> {formatCurrency(appointmentData.price_apm)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className={cx('action-section')}>
                        <div className={cx('primary-actions')}>
                            <button className={cx('primary-btn')} onClick={goToAppointments}>
                                <FontAwesomeIcon icon={faCalendarAlt} />
                                Xem danh sách cuộc hẹn
                            </button>
                        </div>

                        <div className={cx('secondary-actions')}>
                            <button className={cx('secondary-btn')} onClick={handleDownloadReceipt}>
                                <FontAwesomeIcon icon={faDownload} />
                                Tải hóa đơn
                            </button>
                            
                            <button className={cx('secondary-btn')} onClick={handlePrintReceipt}>
                                <FontAwesomeIcon icon={faPrint} />
                                In hóa đơn
                            </button>
                            
                            <button className={cx('secondary-btn')} onClick={handleShare}>
                                <FontAwesomeIcon icon={faShare} />
                                Chia sẻ
                            </button>
                        </div>
                    </div>

                    {/* Additional Info */}
                    <div className={cx('additional-info')}>
                        <div className={cx('info-card')}>
                            <h4>Thông tin quan trọng</h4>
                            <ul>
                                <li>Vui lòng có mặt đúng giờ hẹn để được tư vấn tốt nhất</li>
                                <li>Bạn sẽ nhận được email xác nhận trong vài phút tới</li>
                                <li>Để thay đổi lịch hẹn, vui lòng liên hệ hotline: <strong>1900-1133</strong></li>
                                <li>Lưu lại mã giao dịch để tra cứu khi cần thiết</li>
                            </ul>
                        </div>
                    </div>

                    {/* Back Button */}
                    <div className={cx('back-section')}>
                        <button className={cx('back-btn')} onClick={() => navigate('/')}>
                            <FontAwesomeIcon icon={faArrowLeft} />
                            Về trang chủ
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PaymentSuccess;