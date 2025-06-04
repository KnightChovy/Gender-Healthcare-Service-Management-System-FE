import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight, faPhone, faKey, faLock } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames/bind';
import styles from './ForgetPassword.module.scss';

const cx = classNames.bind(styles);

function ForgetPassword() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        phone: '',
        otp: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    // Validate phone number
    const validatePhone = (phone) => {
        const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})$/;
        if (!phone) {
            return 'Vui lòng nhập số điện thoại';
        }
        if (!phoneRegex.test(phone)) {
            return 'Số điện thoại không hợp lệ (VD: 0901234567)';
        }
        return '';
    };

    // Validate OTP
    const validateOTP = (otp) => {
        if (!otp) {
            return 'Vui lòng nhập mã OTP';
        }
        if (otp.length !== 6) {
            return 'Mã OTP phải có 6 chữ số';
        }
        if (!/^\d+$/.test(otp)) {
            return 'Mã OTP chỉ được chứa số';
        }
        return '';
    };

    // Validate password
    const validatePassword = (password) => {
        if (!password) {
            return 'Vui lòng nhập mật khẩu';
        }
        if (password.length < 8) {
            return 'Mật khẩu phải có ít nhất 8 ký tự';
        }
        if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
            return 'Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường và 1 số';
        }
        return '';
    };

    // Validate confirm password
    const validateConfirmPassword = (confirmPassword, password) => {
        if (!confirmPassword) {
            return 'Vui lòng xác nhận mật khẩu';
        }
        if (confirmPassword !== password) {
            return 'Mật khẩu xác nhận không khớp';
        }
        return '';
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        
        // Format phone number
        let formattedValue = value;
        if (name === 'phone') {
            // Remove all non-digits
            formattedValue = value.replace(/\D/g, '');
            // Limit to 10 digits
            formattedValue = formattedValue.slice(0, 10);
        }
        
        // Format OTP
        if (name === 'otp') {
            formattedValue = value.replace(/\D/g, '').slice(0, 6);
        }

        setFormData(prev => ({
            ...prev,
            [name]: formattedValue
        }));

        // Clear error for this field
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleSendOTP = async (e) => {
        e.preventDefault();
        
        const phoneError = validatePhone(formData.phone);
        if (phoneError) {
            setErrors({ phone: phoneError });
            return;
        }

        setIsLoading(true);
        setErrors({});
        
        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            setStep(2);
        } catch (error) {
            console.log('Error sending OTP:', error);
            setErrors({ general: 'Có lỗi xảy ra, vui lòng thử lại.' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();

        const otpError = validateOTP(formData.otp);
        if (otpError) {
            setErrors({ otp: otpError });
            return;
        }

        setIsLoading(true);
        setErrors({});
        
        try {
            await new Promise(resolve => setTimeout(resolve, 1500));

            if (formData.otp === '123456') {
                setStep(3);
            } else {
                setErrors({ otp: 'Mã OTP không chính xác. Vui lòng thử lại.' });
            }
        } catch (error) {
            console.log('Error verifying OTP:', error);
            setErrors({ general: 'Có lỗi xảy ra, vui lòng thử lại.' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();

        const passwordError = validatePassword(formData.newPassword);
        const confirmPasswordError = validateConfirmPassword(formData.confirmPassword, formData.newPassword);

        if (passwordError || confirmPasswordError) {
            setErrors({
                newPassword: passwordError,
                confirmPassword: confirmPasswordError
            });
            return;
        }

        setIsLoading(true);
        setErrors({});
        
        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            alert('Mật khẩu đã được đặt lại thành công!');
            navigate('/login');
        } catch (error) {
            console.log('Error resetting password:', error);
            setErrors({ general: 'Có lỗi xảy ra, vui lòng thử lại.' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleBack = () => {
        if (step > 1) {
            setStep(prev => prev - 1);
            setErrors({});
        } else {
            navigate('/login');
        }
    };

    return (
        <div className={cx('forget-password-page')}>
            <div className={cx('forget-password-container')}>
                <button
                    type="button"
                    className={cx('back-button')}
                    onClick={handleBack}
                >
                    <FontAwesomeIcon icon={faArrowLeft} />
                    <span>{step === 1 ? 'Quay lại đăng nhập': 'Quay lại'}</span>
                </button>

                <div className={cx('form-header')}>
                    <h2>
                        {step === 1 && 'Quên mật khẩu'}
                        {step === 2 && 'Nhập mã OTP'}
                        {step === 3 && 'Đặt mật khẩu mới'}
                    </h2>
                    <p>
                        {step === 1 && 'Vui lòng nhập số điện thoại để nhận mã OTP'}
                        {step === 2 && `Mã OTP đã được gửi đến số ${formData.phone}`}
                        {step === 3 && 'Tạo mật khẩu mới cho tài khoản của bạn'}
                    </p>
                </div>

                {errors.general && (
                    <div className={cx('error-message', 'general-error')}>
                        {errors.general}
                    </div>
                )}

                {step === 1 && (
                    <form onSubmit={handleSendOTP}>
                        <div className={cx('form-group')}>
                            <div className={cx('input-container')}>
                                <div className={cx('input-icon')}>
                                    <FontAwesomeIcon icon={faPhone} />
                                </div>
                                <input
                                    type="text"
                                    name="phone"
                                    placeholder="Nhập số điện thoại (VD: 0901234567)"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    className={cx('input-field', { error: errors.phone })}
                                    maxLength="10"
                                />
                            </div>
                            {errors.phone && (
                                <span className={cx('error-text')}>{errors.phone}</span>
                            )}
                        </div>

                        <button 
                            type='submit' 
                            className={cx('submit-button', { loading: isLoading })} 
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <div className={cx('spinner')}></div>
                            ) : (
                                <>
                                    <span>Gửi mã OTP</span>
                                    <FontAwesomeIcon icon={faArrowRight} />
                                </>
                            )}
                        </button>
                    </form>
                )}

                {step === 2 && (
                    <form onSubmit={handleVerifyOTP}>
                        <div className={cx('form-group')}>
                            <div className={cx('input-container')}>
                                <input
                                    type="text"
                                    name="otp"
                                    placeholder="* * * * * *"
                                    value={formData.otp}
                                    onChange={handleInputChange}
                                    className={cx('input-field', 'otp-input', { error: errors.otp })}
                                    maxLength="6"
                                    style={{ textAlign: 'center', letterSpacing: '8px', fontSize: '18px' }}
                                />
                            </div>
                            {errors.otp && (
                                <span className={cx('error-text')}>{errors.otp}</span>
                            )}
                        </div>
                        
                        <p className={cx('otp-note')}>
                            💡 Mã OTP demo: <strong>123456</strong>
                        </p>
                        
                        <button 
                            type='submit' 
                            className={cx('submit-button', { loading: isLoading })} 
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <div className={cx('spinner')}></div>
                            ) : (
                                <>
                                    <span>Xác nhận</span>
                                    <FontAwesomeIcon icon={faArrowRight} />
                                </>
                            )}
                        </button>
                    </form>
                )}

                {step === 3 && (
                    <form onSubmit={handleResetPassword}>
                        <div className={cx('form-group')}>
                            <div className={cx('input-container')}>
                                <div className={cx('input-icon')}>
                                    <FontAwesomeIcon icon={faKey} />
                                </div>
                                <input
                                    type="password"
                                    name="newPassword"
                                    placeholder="Mật khẩu mới (ít nhất 8 ký tự)"
                                    value={formData.newPassword}
                                    onChange={handleInputChange}
                                    className={cx('input-field', { error: errors.newPassword })}
                                />
                            </div>
                            {errors.newPassword && (
                                <span className={cx('error-text')}>{errors.newPassword}</span>
                            )}
                        </div>

                        <div className={cx('form-group')}>
                            <div className={cx('input-container')}>
                                <div className={cx('input-icon')}>
                                    <FontAwesomeIcon icon={faLock} />
                                </div>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    placeholder="Xác nhận mật khẩu mới"
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    className={cx('input-field', { error: errors.confirmPassword })}
                                />
                            </div>
                            {errors.confirmPassword && (
                                <span className={cx('error-text')}>{errors.confirmPassword}</span>
                            )}
                        </div>

                        <div className={cx('password-requirements')}>
                            <small>Mật khẩu phải chứa:</small>
                            <ul>
                                <li className={cx({ valid: /[a-z]/.test(formData.newPassword) })}>
                                    Ít nhất 1 chữ thường
                                </li>
                                <li className={cx({ valid: /[A-Z]/.test(formData.newPassword) })}>
                                    Ít nhất 1 chữ hoa
                                </li>
                                <li className={cx({ valid: /\d/.test(formData.newPassword) })}>
                                    Ít nhất 1 chữ số
                                </li>
                                <li className={cx({ valid: formData.newPassword.length >= 8 })}>
                                    Tối thiểu 8 ký tự
                                </li>
                            </ul>
                        </div>

                        <button 
                            type='submit' 
                            className={cx('submit-button', { loading: isLoading })} 
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <div className={cx('spinner')}></div>
                            ) : (
                                <>
                                    <span>Đặt lại mật khẩu</span>
                                    <FontAwesomeIcon icon={faArrowRight} />
                                </>
                            )}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}

export default ForgetPassword;