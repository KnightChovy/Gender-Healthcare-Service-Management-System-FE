import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight, faPhone, faKey, faLock } from '@fortawesome/free-solid-svg-icons';
import Navbar from '../../Layouts/LayoutHomePage/Navbar';
import { Footer } from '../../Layouts/LayoutHomePage/Footer';

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
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-pink-50 flex items-center justify-center px-4">
            <Navbar />
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
                <button
                    type="button"
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium mb-6 transition-colors"
                    onClick={handleBack}
                >
                    <FontAwesomeIcon icon={faArrowLeft} />
                    <span>{step === 1 ? 'Quay lại đăng nhập': 'Quay lại'}</span>
                </button>

                <div className="text-center mb-8">
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
                    <div className="text-red-500 text-sm font-medium general-error">
                        {errors.general}
                    </div>
                )}

                {step === 1 && (
                    <form onSubmit={handleSendOTP}>
                        <div className="space-y-2">
                            <div className="input-container">
                                <div className="input-icon">
                                    <FontAwesomeIcon icon={faPhone} />
                                </div>
                                <input
                                    type="text"
                                    name="phone"
                                    placeholder="Nhập số điện thoại (VD: 0901234567)"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                    maxLength="10"
                                />
                            </div>
                            {errors.phone && (
                                <span className="text-red-500 text-sm font-medium">{errors.phone}</span>
                            )}
                        </div>

                        <button 
                            type='submit' 
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg hover:shadow-lg transform hover:scale-105 transition-all" 
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <div className="spinner"></div>
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
                        <div className="space-y-2">
                            <div className="input-container">
                                <input
                                    type="text"
                                    name="otp"
                                    placeholder="* * * * * *"
                                    value={formData.otp}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-center text-lg font-mono tracking-widest ${errors.otp ? 'border-red-500 bg-red-50' : ''}`}
                                    maxLength="6"
                                    style={{ textAlign: 'center', letterSpacing: '8px', fontSize: '18px' }}
                                />
                            </div>
                            {errors.otp && (
                                <span className="text-red-500 text-sm font-medium">{errors.otp}</span>
                            )}
                        </div>
                        
                        <p className="otp-note">
                            💡 Mã OTP demo: <strong>123456</strong>
                        </p>
                        
                        <button 
                            type='submit' 
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg hover:shadow-lg transform hover:scale-105 transition-all" 
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <div className="spinner"></div>
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
                        <div className="space-y-2">
                            <div className="input-container">
                                <div className="input-icon">
                                    <FontAwesomeIcon icon={faKey} />
                                </div>
                                <input
                                    type="password"
                                    name="newPassword"
                                    placeholder="Mật khẩu mới (ít nhất 8 ký tự)"
                                    value={formData.newPassword}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                />
                            </div>
                            {errors.newPassword && (
                                <span className="text-red-500 text-sm font-medium">{errors.newPassword}</span>
                            )}
                        </div>

                        <div className="space-y-2">
                            <div className="input-container">
                                <div className="input-icon">
                                    <FontAwesomeIcon icon={faLock} />
                                </div>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    placeholder="Xác nhận mật khẩu mới"
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                />
                            </div>
                            {errors.confirmPassword && (
                                <span className="text-red-500 text-sm font-medium">{errors.confirmPassword}</span>
                            )}
                        </div>

                        <div className="password-requirements">
                            <small>Mật khẩu phải chứa:</small>
                            <ul>
                                <li className={`text-sm ${/[a-z]/.test(formData.newPassword) ? 'text-green-600' : 'text-gray-500'}`}>
                                    Ít nhất 1 chữ thường
                                </li>
                                <li className={`text-sm ${/[A-Z]/.test(formData.newPassword) ? 'text-green-600' : 'text-gray-500'}`}>
                                    Ít nhất 1 chữ hoa
                                </li>
                                <li className={`text-sm ${/\d/.test(formData.newPassword) ? 'text-green-600' : 'text-gray-500'}`}>
                                    Ít nhất 1 chữ số
                                </li>
                                <li className={`text-sm ${formData.newPassword.length >= 8 ? 'text-green-600' : 'text-gray-500'}`}>
                                    Tối thiểu 8 ký tự
                                </li>
                            </ul>
                        </div>

                        <button 
                            type='submit' 
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg hover:shadow-lg transform hover:scale-105 transition-all" 
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <div className="spinner"></div>
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

            <Footer />
        </div>
    );
}

export default ForgetPassword;