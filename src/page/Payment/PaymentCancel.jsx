// src/page/Payment/PaymentCancel.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faTimesCircle, faArrowLeft, 
    faQuestionCircle, faPhone, faEnvelope,
    faExclamationTriangle, faCalendarAlt,
    faCreditCard
} from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames/bind';
import styles from './Payment.module.scss';

const cx = classNames.bind(styles);

function PaymentCancel() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    
    // States
    const [cancelData, setCancelData] = useState(null);
    const [appointmentData, setAppointmentData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Get params from URL
    const sessionId = searchParams.get('session_id') || searchParams.get('checkout_session_id');
    const reason = searchParams.get('reason') || searchParams.get('error');
    const appointmentId = searchParams.get('appointment_id');
    const amount = searchParams.get('amount');

    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    // Get cancellation reason
    const getCancelReason = (reason) => {
        const reasons = {
            'user_cancelled': 'Bạn đã hủy giao dịch',
            'timeout': 'Giao dịch hết thời gian chờ',
            'insufficient_funds': 'Không đủ số dư tài khoản',
            'card_declined': 'Thẻ bị từ chối',
            'network_error': 'Lỗi kết nối mạng',
            'bank_error': 'Lỗi từ phía ngân hàng',
            'invalid_card': 'Thông tin thẻ không hợp lệ',
            'payment_failed': 'Thanh toán thất bại'
        };
        return reasons[reason] || 'Giao dịch bị hủy';
    };

    // Process cancellation
    useEffect(() => {
        const processCancellation = async () => {
            try {
                setIsLoading(true);

                // Get saved payment session
                const savedSession = JSON.parse(localStorage.getItem('currentPaymentSession') || '{}');
                
                console.log('❌ Payment cancelled:', {
                    sessionId,
                    reason,
                    appointmentId,
                    amount,
                    savedSession
                });

                // Create cancellation record
                const cancelRecord = {
                    sessionId: sessionId || savedSession.sessionId,
                    appointmentId: appointmentId || savedSession.appointmentId,
                    amount: amount || savedSession.amount,
                    reason: reason || 'unknown',
                    cancelledAt: new Date().toISOString(),
                    paymentMethod: savedSession.paymentMethod || 'online'
                };

                setCancelData(cancelRecord);

                // Get appointment data from saved session or localStorage
                if (savedSession.appointmentData) {
                    setAppointmentData(savedSession.appointmentData);
                }

                // Save cancellation record for analytics
                const existingCancellations = JSON.parse(localStorage.getItem('paymentCancellations') || '[]');
                existingCancellations.push(cancelRecord);
                localStorage.setItem('paymentCancellations', JSON.stringify(existingCancellations));

                // Keep payment session for retry
                // Don't remove currentPaymentSession in case user wants to retry

            } catch (error) {
                console.error('❌ Error processing cancellation:', error);
            } finally {
                setIsLoading(false);
            }
        };

        processCancellation();
    }, [sessionId, reason, appointmentId, amount]);

    // Action handlers
    const retryPayment = () => {
        if (cancelData?.appointmentId) {
            navigate(`/paymentappointment/${cancelData.appointmentId}`, {
                state: { 
                    appointmentData: appointmentData,
                    retryPayment: true,
                    previousError: cancelData.reason
                }
            });
        } else {
            navigate('/my-appointments');
        }
    };

    const goToAppointments = () => {
        // Clean up payment session on explicit navigation away
        localStorage.removeItem('currentPaymentSession');
        navigate('/my-appointments');
    };

    const contactSupport = () => {
        const subject = `Hỗ trợ thanh toán - ${cancelData?.sessionId || 'Unknown'}`;
        const body = `Tôi cần hỗ trợ về giao dịch thanh toán:
        
Mã phiên: ${cancelData?.sessionId || 'N/A'}
Cuộc hẹn: ${cancelData?.appointmentId || 'N/A'}
Số tiền: ${formatCurrency(cancelData?.amount || 0)}
Lý do hủy: ${getCancelReason(cancelData?.reason)}
Thời gian: ${new Date(cancelData?.cancelledAt).toLocaleString('vi-VN')}

Vui lòng hỗ trợ tôi hoàn tất thanh toán.`;

        window.location.href = `mailto:support@example.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    };

    // Loading state
    if (isLoading) {
        return (
            <div className={cx('wrap')}>
                <div className={cx('container')}>
                    <div className={cx('cancel-container')}>
                        <FontAwesomeIcon icon={faTimesCircle} className={cx('cancel-icon', 'loading')} />
                        <h2>Đang xử lý...</h2>
                        <p>Vui lòng đợi trong giây lát</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={cx('wrap')}>
            <div className={cx('container')}>
                <div className={cx('cancel-page')}>
                    {/* Cancel Header */}
                    <div className={cx('cancel-header')}>
                        <div className={cx('cancel-animation')}>
                            <FontAwesomeIcon icon={faTimesCircle} className={cx('cancel-icon')} />
                            <div className={cx('cancel-ripple')}></div>
                        </div>
                        <h1 className={cx('cancel-title')}>Thanh toán bị hủy</h1>
                        <p className={cx('cancel-subtitle')}>
                            {getCancelReason(cancelData?.reason)}
                        </p>
                    </div>

                    {/* Cancel Details */}
                    <div className={cx('cancel-summary')}>
                        <h3 className={cx('section-title')}>Chi tiết giao dịch</h3>
                        
                        <div className={cx('summary-grid')}>
                            {cancelData?.sessionId && (
                                <div className={cx('summary-item')}>
                                    <span className={cx('label')}>Mã phiên:</span>
                                    <span className={cx('value')}>{cancelData.sessionId}</span>
                                </div>
                            )}
                            
                            {cancelData?.amount && (
                                <div className={cx('summary-item')}>
                                    <span className={cx('label')}>Số tiền:</span>
                                    <span className={cx('value', 'amount')}>{formatCurrency(cancelData.amount)}</span>
                                </div>
                            )}
                            
                            <div className={cx('summary-item')}>
                                <span className={cx('label')}>Thời gian hủy:</span>
                                <span className={cx('value')}>{new Date(cancelData?.cancelledAt).toLocaleString('vi-VN')}</span>
                            </div>
                            
                            {cancelData?.paymentMethod && (
                                <div className={cx('summary-item')}>
                                    <span className={cx('label')}>Phương thức:</span>
                                    <span className={cx('value')}>{cancelData.paymentMethod.toUpperCase()}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Appointment Info */}
                    {appointmentData && (
                        <div className={cx('appointment-info')}>
                            <h3 className={cx('section-title')}>
                                <FontAwesomeIcon icon={faCalendarAlt} />
                                Cuộc hẹn chưa thanh toán
                            </h3>
                            
                            <div className={cx('appointment-card', 'unpaid')}>
                                <div className={cx('appointment-header')}>
                                    <div className={cx('doctor-info')}>
                                        <h4>{appointmentData.doctor_name || 'Bác sĩ tư vấn'}</h4>
                                        <span>{appointmentData.consultant_type}</span>
                                    </div>
                                    <div className={cx('status-badge', 'unpaid')}>
                                        Chưa thanh toán
                                    </div>
                                </div>
                                
                                <div className={cx('unpaid-warning')}>
                                    <FontAwesomeIcon icon={faExclamationTriangle} />
                                    <span>Cuộc hẹn sẽ được hủy nếu không thanh toán trong 24h</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className={cx('action-section')}>
                        <div className={cx('primary-actions')}>
                            <button className={cx('retry-btn')} onClick={retryPayment}>
                                <FontAwesomeIcon icon={faCreditCard} />
                                Thử thanh toán lại
                            </button>
                        </div>

                        <div className={cx('secondary-actions')}>
                            <button className={cx('secondary-btn')} onClick={goToAppointments}>
                                <FontAwesomeIcon icon={faCalendarAlt} />
                                Xem danh sách cuộc hẹn
                            </button>
                            
                            <button className={cx('secondary-btn')} onClick={contactSupport}>
                                <FontAwesomeIcon icon={faQuestionCircle} />
                                Liên hệ hỗ trợ
                            </button>
                        </div>
                    </div>

                    {/* Troubleshooting */}
                    <div className={cx('troubleshooting')}>
                        <h3 className={cx('section-title')}>
                            <FontAwesomeIcon icon={faQuestionCircle} />
                            Gặp sự cố?
                        </h3>
                        
                        <div className={cx('troubleshooting-grid')}>
                            <div className={cx('troubleshoot-item')}>
                                <h4>Kiểm tra thông tin thẻ</h4>
                                <p>Đảm bảo số thẻ, ngày hết hạn và CVV chính xác</p>
                            </div>
                            
                            <div className={cx('troubleshoot-item')}>
                                <h4>Kiểm tra số dư</h4>
                                <p>Đảm bảo tài khoản có đủ số dư để thực hiện giao dịch</p>
                            </div>
                            
                            <div className={cx('troubleshoot-item')}>
                                <h4>Thử phương thức khác</h4>
                                <p>Sử dụng ví điện tử hoặc thẻ khác nếu có</p>
                            </div>
                            
                            <div className={cx('troubleshoot-item')}>
                                <h4>Liên hệ ngân hàng</h4>
                                <p>Gọi hotline ngân hàng nếu thẻ bị khóa giao dịch online</p>
                            </div>
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div className={cx('contact-section')}>
                        <h3 className={cx('section-title')}>Cần hỗ trợ?</h3>
                        
                        <div className={cx('contact-options')}>
                            <div className={cx('contact-item')}>
                                <FontAwesomeIcon icon={faPhone} />
                                <div>
                                    <strong>Hotline</strong>
                                    <span>1900-xxxx (24/7)</span>
                                </div>
                            </div>
                            
                            <div className={cx('contact-item')}>
                                <FontAwesomeIcon icon={faEnvelope} />
                                <div>
                                    <strong>Email</strong>
                                    <span>support@example.com</span>
                                </div>
                            </div>
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

export default PaymentCancel;