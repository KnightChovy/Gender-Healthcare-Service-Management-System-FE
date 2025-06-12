import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './AppointmentItems/Header';
import PersonalInfoSection from './AppointmentItems/PersonalInfoSection';
import ConsultationSection from './AppointmentItems/ConsultationSection';
import DoctorSelection from './AppointmentItems/DoctorSelection';
import DateTimeSection from './AppointmentItems/DateTimeSection';
import AdditionalInfoSection from './AppointmentItems/AdditionalInfoSection';
import classNames from 'classnames/bind';
import styles from './Appointment.module.scss';

const cx = classNames.bind(styles);

function Appointment() {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userProfile, setUserProfile] = useState(null);
    const [formData, setFormData] = useState({
        // Thông tin cá nhân
        fullName: '',
        birthDate: '',
        gender: '',
        phone: '',
        email: '',
        address: '',

        // Thông tin cuộc hẹn
        consultationType: '',
        selectedDoctor: '',
        doctorName: '',
        appointmentDate: '',
        appointmentTime: '',

        // Thông tin bổ sung
        symptoms: '',
        medicalHistory: '',
        notes: '',
        priority: 'normal',

        // Thông tin thanh toán
        fee: 200000
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        checkUserStatus();
    }, []);

    const checkUserStatus = () => {
        try {
            const isLoggedIn = localStorage.getItem('user') === 'true';
            const userInfo = localStorage.getItem('user');

            if (!isLoggedIn) {
                const profile = JSON.parse(userInfo);
                setIsLoggedIn(true);
                setUserProfile(profile);

                // Auto-fill form với thông tin user
                setFormData(prev => ({
                    ...prev,
                    fullName: profile.fullName || `${profile.last_name || ''} ${profile.first_name || ''}`.trim(),
                    phone: profile.phone || '',
                    email: profile.email || '',
                    birthDate: profile.birthday || profile.birth_date || '',
                    gender: profile.gender || '',
                    address: profile.address || ''
                }));

                console.log('✅ User logged in, auto-filled form data');
            } else {
                setIsLoggedIn(false);
                setUserProfile(null);
                console.log('ℹ️ User not logged in');
            }
        } catch (error) {
            console.error('❌ Error checking user status:', error);
            setIsLoggedIn(false);
        }
    };

    // Tính tuổi từ ngày sinh
    const calculateAge = (birthDate) => {
        if (!birthDate) return null;

        const birth = new Date(birthDate);
        const today = new Date();

        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        const dayDiff = today.getDate() - birth.getDate();

        if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
            age--;
        }

        return age;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error khi user bắt đầu nhập
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }

        // Validate ngày sinh realtime
        if (name === 'birthDate' && value) {
            validateBirthDate(value);
        }

        // Auto calculate fee khi chọn consultation type
        if (name === 'consultationType') {
            const newFee = calculateFee(value);
            setFormData(prev => ({
                ...prev,
                fee: newFee
            }));
        }
    };

    const validateBirthDate = (birthDate) => {
        const birth = new Date(birthDate);
        const today = new Date();

        if (birth > today) {
            setErrors(prev => ({
                ...prev,
                birthDate: 'Ngày sinh không được trong tương lai'
            }));
        } else {
            const age = calculateAge(birthDate);
            if (age < 0) {
                setErrors(prev => ({
                    ...prev,
                    birthDate: 'Ngày sinh không hợp lệ'
                }));
            } else if (age > 120) {
                setErrors(prev => ({
                    ...prev,
                    birthDate: 'Tuổi không được vượt quá 120'
                }));
            } else {
                setErrors(prev => ({
                    ...prev,
                    birthDate: ''
                }));
            }
        }
    };

    const validateForm = () => {
        const newErrors = {};

        // Validate thông tin cá nhân (bắt buộc cho cả user đã đăng nhập và chưa đăng nhập)
        if (!formData.fullName.trim()) {
            newErrors.fullName = 'Vui lòng nhập họ tên';
        } else if (formData.fullName.trim().length < 2) {
            newErrors.fullName = 'Họ tên phải có ít nhất 2 ký tự';
        } else if (!/^[a-zA-ZÀ-ỹ\s]+$/.test(formData.fullName.trim())) {
            newErrors.fullName = 'Họ tên chỉ được chứa chữ cái và khoảng trắng';
        }

        // Validate ngày sinh
        if (!formData.birthDate) {
            newErrors.birthDate = 'Vui lòng chọn ngày sinh';
        } else {
            const birthDate = new Date(formData.birthDate);
            const today = new Date();

            if (birthDate > today) {
                newErrors.birthDate = 'Ngày sinh không được trong tương lai';
            } else {
                const age = calculateAge(formData.birthDate);
                if (age < 0) {
                    newErrors.birthDate = 'Ngày sinh không hợp lệ';
                } else if (age > 120) {
                    newErrors.birthDate = 'Tuổi không được vượt quá 120';
                }
            }
        }

        // Validate giới tính
        if (!formData.gender) {
            newErrors.gender = 'Vui lòng chọn giới tính';
        }

        // Validate số điện thoại
        if (!formData.phone.trim()) {
            newErrors.phone = 'Vui lòng nhập số điện thoại';
        } else if (!/^[0-9]{10,11}$/.test(formData.phone.replace(/\s+/g, ''))) {
            newErrors.phone = 'Số điện thoại không hợp lệ (10-11 chữ số)';
        }

        // Validate email
        if (!formData.email.trim()) {
            newErrors.email = 'Vui lòng nhập email';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Email không hợp lệ';
        }

        // Validate thông tin cuộc hẹn
        if (!formData.consultationType) {
            newErrors.consultationType = 'Vui lòng chọn loại tư vấn';
        }

        // Doctor selection is optional - system will auto-assign if not selected

        if (!formData.appointmentDate) {
            newErrors.appointmentDate = 'Vui lòng chọn ngày tư vấn';
        } else {
            const selectedDate = new Date(formData.appointmentDate);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (selectedDate < today) {
                newErrors.appointmentDate = 'Ngày tư vấn không được trong quá khứ';
            }

            const sixMonthsFromNow = new Date();
            sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6);

            if (selectedDate > sixMonthsFromNow) {
                newErrors.appointmentDate = 'Ngày tư vấn không được quá 6 tháng kể từ hôm nay';
            }
        }

        if (!formData.appointmentTime) {
            newErrors.appointmentTime = 'Vui lòng chọn giờ tư vấn';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            console.warn('❌ Form validation failed:', errors);
            alert('Vui lòng kiểm tra lại thông tin đã nhập.');
            return;
        }

        setIsSubmitting(true);

        try {
            // Tạo appointment data
            const appointmentData = {
                // Thông tin bệnh nhân
                fullName: formData.fullName,
                phone: formData.phone,
                email: formData.email,
                birthDate: formData.birthDate,
                gender: formData.gender,
                age: calculateAge(formData.birthDate),
                address: formData.address,

                // Thông tin cuộc hẹn
                consultationType: formData.consultationType,
                selectedDoctor: formData.selectedDoctor || null, // null if not selected
                doctorName: formData.doctorName || 'Hệ thống sẽ phân công bác sĩ',
                appointmentDate: formData.appointmentDate,
                appointmentTime: formData.appointmentTime,

                // Thông tin y tế
                symptoms: formData.symptoms,
                medicalHistory: formData.medicalHistory,
                notes: formData.notes,
                priority: formData.priority,

                // Thông tin thanh toán
                fee: formData.fee,

                // Metadata
                id: `APT${Date.now()}`,
                createdAt: new Date().toISOString(),
                status: 'pending',
                isUserLoggedIn: isLoggedIn,
                userId: userProfile?.id || null
            };

            // Lưu vào localStorage
            localStorage.setItem('pendingAppointment', JSON.stringify(appointmentData));

            console.log('✅ Appointment data saved successfully:', appointmentData);

            // Chuyển hướng đến trang thanh toán
            navigate('/paymentappointment');

        } catch (error) {
            console.error('❌ Error saving appointment:', error);
            alert('Có lỗi xảy ra. Vui lòng thử lại.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Helper function tính phí
    const calculateFee = (consultationType) => {
        const feeMap = {
            'Khám phụ khoa': 300000,
            'Tư vấn chu kì kinh nguyệt': 200000,
            'Tư vấn tránh thai': 250000,
            'Tư vấn thai kỳ': 250000,
            'Tư vấn sinh sản': 300000,
            'Tư vấn chung': 200000,
        };
        return feeMap[consultationType] || 200000;
    };

    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    // Check if form is valid
    const isFormValid = () => {
        return formData.fullName && 
               formData.birthDate && 
               formData.gender && 
               formData.phone && 
               formData.email && 
               formData.consultationType && 
               formData.appointmentDate && 
               formData.appointmentTime;
    };

    return (
        <div className={cx('wrap')}>
            <div className={cx('appointment-container')}>
                {/* Header Section */}
                <Header />

                <form onSubmit={handleSubmit} className={cx('appointment-form')}>
                    {/* User Status Display */}
                    {isLoggedIn && userProfile && (
                        <div className={cx('user-status-section')}>
                            <div className={cx('user-welcome')}>
                                <span className={cx('welcome-icon')}>👋</span>
                                <div className={cx('welcome-text')}>
                                    <h3>Xin chào, {userProfile.fullName || userProfile.first_name}!</h3>
                                    <p>Thông tin của bạn đã được tự động điền từ tài khoản</p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className={cx('form-content')}>
                        <div className={cx('form-row')}>
                            {/* Personal Info Section */}
                            <PersonalInfoSection
                                formData={formData}
                                errors={errors}
                                onChange={handleInputChange}
                            />

                            {/* Additional Info Section */}
                            <AdditionalInfoSection
                                formData={formData}
                                onChange={handleInputChange}
                            />
                        </div>

                        {/* Consultation Section */}
                        <ConsultationSection
                            formData={formData}
                            errors={errors}
                            onChange={handleInputChange}
                        />

                        {/* Doctor Selection */}
                        <DoctorSelection
                            formData={formData}
                            errors={errors}
                            onChange={handleInputChange}
                        />

                        {/* Date Time Section */}
                        <DateTimeSection
                            formData={formData}
                            errors={errors}
                            onChange={handleInputChange}
                        />
                    </div>

                    {/* Fee Summary */}
                    {formData.consultationType && (
                        <div className={cx('fee-summary')}>
                            <div className={cx('fee-content')}>
                                <h4>💰 Chi phí dự kiến</h4>
                                <div className={cx('fee-breakdown')}>
                                    <div className={cx('fee-item')}>
                                        <span>Loại tư vấn:</span>
                                        <span>{formData.consultationType}</span>
                                    </div>
                                    <div className={cx('fee-item', 'total')}>
                                        <span>Tổng chi phí:</span>
                                        <span className={cx('fee-amount')}>{formatCurrency(formData.fee)}</span>
                                    </div>
                                </div>
                                <p className={cx('fee-note')}>
                                    💡 Chi phí có thể thay đổi tùy thuộc vào yêu cầu cụ thể của bạn
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Form Actions */}
                    <div className={cx('form-actions')}>
                        <button
                            type="submit"
                            className={cx('submit-btn', {
                                'disabled': !isFormValid() || isSubmitting
                            })}
                            disabled={!isFormValid() || isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <span className={cx('spinner')}></span>
                                    Đang xử lý...
                                </>
                            ) : (
                                <>
                                    💳 Tiếp tục thanh toán ({formatCurrency(formData.fee)})
                                </>
                            )}
                        </button>

                        <button
                            type="button"
                            className={cx('cancel-btn')}
                            onClick={() => {
                                if (window.confirm('Bạn có chắc muốn hủy đặt lịch hẹn?')) {
                                    navigate(-1);
                                }
                            }}
                            disabled={isSubmitting}
                        >
                            ↩️ Quay lại
                        </button>
                    </div>

                    {/* Validation Summary */}
                    <div className={cx('validation-summary')}>
                        <h4>Kiểm tra thông tin</h4>
                        <div className={cx('validation-grid')}>
                            <div className={cx('validation-item', { 'valid': formData.fullName && !errors.fullName })}>
                                <span className={cx('validation-icon')}>
                                    {formData.fullName && !errors.fullName ? '✅' : '❌'}
                                </span>
                                <span>Họ và tên</span>
                            </div>

                            <div className={cx('validation-item', { 'valid': formData.birthDate && !errors.birthDate })}>
                                <span className={cx('validation-icon')}>
                                    {formData.birthDate && !errors.birthDate ? '✅' : '❌'}
                                </span>
                                <span>Ngày sinh</span>
                                {formData.birthDate && !errors.birthDate && (
                                    <span className={cx('age-info')}>({calculateAge(formData.birthDate)} tuổi)</span>
                                )}
                            </div>

                            <div className={cx('validation-item', { 'valid': formData.phone && !errors.phone })}>
                                <span className={cx('validation-icon')}>
                                    {formData.phone && !errors.phone ? '✅' : '❌'}
                                </span>
                                <span>Số điện thoại</span>
                            </div>

                            <div className={cx('validation-item', { 'valid': formData.email && !errors.email })}>
                                <span className={cx('validation-icon')}>
                                    {formData.email && !errors.email ? '✅' : '❌'}
                                </span>
                                <span>Email</span>
                            </div>

                            <div className={cx('validation-item', { 'valid': formData.consultationType })}>
                                <span className={cx('validation-icon')}>
                                    {formData.consultationType ? '✅' : '❌'}
                                </span>
                                <span>Loại tư vấn</span>
                            </div>

                            <div className={cx('validation-item', { 'valid': formData.selectedDoctor || !formData.selectedDoctor })}>
                                <span className={cx('validation-icon')}>
                                    {formData.selectedDoctor ? '✅' : '🤖'}
                                </span>
                                <span>
                                    {formData.selectedDoctor ? 'Đã chọn bác sĩ' : 'Tự động phân công'}
                                </span>
                            </div>

                            <div className={cx('validation-item', { 'valid': formData.appointmentDate && !errors.appointmentDate })}>
                                <span className={cx('validation-icon')}>
                                    {formData.appointmentDate && !errors.appointmentDate ? '✅' : '❌'}
                                </span>
                                <span>Ngày tư vấn</span>
                            </div>

                            <div className={cx('validation-item', { 'valid': formData.appointmentTime })}>
                                <span className={cx('validation-icon')}>
                                    {formData.appointmentTime ? '✅' : '❌'}
                                </span>
                                <span>Giờ tư vấn</span>
                            </div>
                        </div>
                    </div>

                    {/* Form Notice */}
                    <div className={cx('form-notice')}>
                        <div className={cx('notice-item', 'highlight')}>
                            <span className={cx('notice-icon')}>💡</span>
                            <p>
                                <strong>Lưu ý:</strong> Sau khi thanh toán thành công, lịch hẹn sẽ được xác nhận trong vòng 1-2 giờ
                            </p>
                        </div>

                        <div className={cx('notice-item')}>
                            <span className={cx('notice-icon')}>🤖</span>
                            <p>
                                Nếu không chọn bác sĩ cụ thể, hệ thống sẽ tự động phân công bác sĩ phù hợp nhất
                            </p>
                        </div>

                        <div className={cx('notice-item')}>
                            <span className={cx('notice-icon')}>📞</span>
                            <p>Hotline hỗ trợ: <strong>1900-1133</strong> (24/7)</p>
                        </div>

                        <div className={cx('notice-item', 'security')}>
                            <span className={cx('notice-icon')}>🔒</span>
                            <p>Thông tin của bạn được <strong>mã hóa và bảo mật</strong> tuyệt đối</p>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Appointment;