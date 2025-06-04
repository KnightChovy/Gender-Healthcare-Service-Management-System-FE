import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faKey, faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import FormInputText from '../../components/ui/FormInputText';
import './ForgetPassword.css';

function ForgetPassword() {
    const [step, setStep] = useState(1); // 1: nhập SĐT, 2: nhập mã OTP, 3: đặt lại mật khẩu mới
    const [formData, setFormData] = useState({
        phone: '',
        otp: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [errors, setErrors] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleInputChange = (name, value) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setErrors('');
    }

    const handleSendOTP = async (e) => {
        e.preventDefault();

        setIsLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            setStep(2);
            setErrors('');
        } catch (error) {
            console.log('Error sending OTP:', error);
            setErrors('Có lỗi xảy ra, vui lòng thử lại.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();

        if(!formData.otp || formData.otp.length !== 6) {
            setErrors('Vui lòng nhập lại mã OTP với 6 ký tự.');
            return;
        }

        setIsLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1500));

            if(formData.otp === '123456') {
                setStep(3);
                setErrors('');
            } else {
                setErrors('Mã OTP không chính xác. Vui lòng thử lại.');
            }
        } catch (error) {
            console.log('Error verifying OTP:', error);
            setErrors('Có lỗi xảy ra, vui lòng thử lại.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();

        if(formData.newPassword === '') {
            setErrors('Vui lòng nhập mật khẩu và xác nhận mật khẩu.');
            return;
        }

        if(formData.newPassword.length < 8 || formData.newPassword !== '') {
            setErrors('Mật khẩu mới phải có ít nhất 8 ký tự.');
            return;
        } 

        if(formData.newPassword !== formData.confirmPassword) {
            setErrors('Mật khẩu xác nhận không khớp.');
            return;
        }

        setIsLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            alert('Mật khẩu đã được đặt lại thành công!');
            navigate('/login');
        } catch (error) {
            console.log('Error resetting password:', error);
            setErrors('Có lỗi xảy ra, vui lòng thử lại.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleBack = () => {
        if (step > 1) {
            setStep(prev => prev - 1);
            setErrors('');
        } else {
            navigate('/login');
        }
    };

    return (
        <div className='forget-password-page'>
            <div className='forget-password-container'>
                <button
                    type="button"
                    className='back-button'
                    onClick={handleBack}
                >
                    <FontAwesomeIcon icon={faArrowLeft} />
                    <span>{step === 1 ? 'Quay lại đăng nhập': 'Quay lại'}</span>
                </button>

                <div className='form-header'>
                    <h2>
                        {step === 1 && 'Quên mật khẩu'}
                        {step === 2 && 'Nhập mã OTP'}
                        {step === 3 && 'Đặt lại mật khẩu mới'}
                    </h2>
                    <p>
                        {step === 1 && 'Vui lòng nhập số điện thoại của bạn để nhận mã OTP.'}
                        {step === 2 && `Mã OTP đã được gửi đến số ${formData.phone}`}
                        {step === 3 && 'Tạo mật khẩu mới cho tài khoản của bạn.'}
                    </p>
                </div>
                
                {errors && <div className='error-message'>{errors}</div>}

                {step === 1 && (
                    <form onSubmit={handleSendOTP}>
                        <div className='form-group'>
                            <div className='input-icon'>
                                <FontAwesomeIcon icon={faPhone} />
                            </div>
                            <FormInputText 
                                textHolder='phone'
                                textName='phone'
                                type='text'
                                value={formData.phone}
                                onChange={handleInputChange}
                            />
                        </div>

                        <button type='submit' className={`submit-button ${isLoading ? 'loading' : ''}`} disabled={isLoading}>
                            {isLoading ? (
                                <div className='spinner'></div>
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
                        <div className='form-group'>
                            <FormInputText
                                textHolder='Nhập mã OTP (6 ký tự)'
                                textName='otp'
                                type='text'
                                value={formData.otp}
                                onChange={handleInputChange}
                            />
                        </div>
                        <p className='otp-note'>Mã OTP demo: 123456</p>
                        <button type='submit' className={`submit-button ${isLoading ? 'loading' : ''}`} disabled={isLoading}>
                            {isLoading ? (
                                <div className='spinner'></div>
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
                        <div className='form-group'>
                            <div className='input-icon'>
                                <FontAwesomeIcon icon={faKey} />
                            </div>
                            <FormInputText
                                textHolder='password'
                                textName='newPassword'
                                type='password'
                                value={formData.newPassword}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className='form-group'>
                            <div className='input-icon'>
                                <FontAwesomeIcon icon={faKey} />
                            </div>
                            <FormInputText
                                textHolder='confirmPassword'
                                textName='confirmPassword'
                                type='password'
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                            />
                        </div>

                        <button type='submit' className={`submit-button ${isLoading ? 'loading' : ''}`} disabled={isLoading}>
                            {isLoading ? (
                                <div className='spinner'></div>
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