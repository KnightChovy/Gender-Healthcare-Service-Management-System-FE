import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './AppointmentItems/Header';
import UserStatusCard from './AppointmentItems/UserStatusCard';
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
        idCard: '',

        // Thông tin cuộc hẹn
        consultationType: '',
        selectedDoctor: null,
        doctorName: '',
        specialty: '',
        appointmentDate: '',
        appointmentTime: '',

        // Thông tin bổ sung
        symptoms: '',
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
        const token = localStorage.getItem('userToken');
        const savedProfile = localStorage.getItem('userProfile');

        if (token && savedProfile) {
            setIsLoggedIn(true);
            const profile = JSON.parse(savedProfile);
            setUserProfile(profile);

            // Auto-fill form với thông tin user nếu đã đăng nhập
            setFormData(prev => ({
                ...prev,
                fullName: profile.fullName || '',
                phone: profile.phone || '',
                email: profile.email || '',
                birthDate: profile.birthDate || '',
                gender: profile.gender || '',
            }));
        } else {
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
            const birthDate = new Date(value);
            const today = new Date();
            
            if (birthDate > today) {
                setErrors(prev => ({
                    ...prev,
                    birthDate: 'Ngày sinh không được trong tương lai'
                }));
            } else {
                const age = calculateAge(value);
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
                    // Clear error nếu valid
                    setErrors(prev => ({
                        ...prev,
                        birthDate: ''
                    }));
                }
            }
        }
    };

    // Handle special cases for complex inputs
    const handleDoctorSelect = (doctor) => {
        setFormData(prev => ({
            ...prev,
            selectedDoctor: doctor,
            doctorName: doctor.name,
            specialty: doctor.specialty,
            fee: doctor.fee || 200000
        }));

        if (errors.selectedDoctor) {
            setErrors(prev => ({
                ...prev,
                selectedDoctor: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        // Validate thông tin cá nhân (nếu chưa đăng nhập)
        if (!isLoggedIn) {
            // Validate họ tên
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
                
                // Kiểm tra ngày sinh không được trong tương lai
                if (birthDate > today) {
                    newErrors.birthDate = 'Ngày sinh không được trong tương lai';
                } else {
                    // Kiểm tra tuổi hợp lệ (từ 0 đến 120 tuổi)
                    const age = calculateAge(formData.birthDate);
                    
                    if (age < 0) {
                        newErrors.birthDate = 'Ngày sinh không hợp lệ';
                    } else if (age > 120) {
                        newErrors.birthDate = 'Tuổi không được vượt quá 120';
                    }
                    
                    // Kiểm tra định dạng ngày hợp lệ
                    if (isNaN(birthDate.getTime())) {
                        newErrors.birthDate = 'Định dạng ngày sinh không hợp lệ';
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
        }

        // Validate thông tin cuộc hẹn
        if (!formData.consultationType) {
            newErrors.consultationType = 'Vui lòng chọn loại tư vấn';
        }

        if (!formData.selectedDoctor && !formData.doctorName) {
            newErrors.selectedDoctor = 'Vui lòng chọn bác sĩ tư vấn';
        }

        if (!formData.appointmentDate) {
            newErrors.appointmentDate = 'Vui lòng chọn ngày tư vấn';
        } else {
            // Kiểm tra ngày không được trong quá khứ
            const selectedDate = new Date(formData.appointmentDate);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (selectedDate < today) {
                newErrors.appointmentDate = 'Ngày tư vấn không được trong quá khứ';
            }

            // Kiểm tra ngày không được quá xa trong tương lai (6 tháng)
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
        
        // Validation logic here...
        
        try {
            // Tạo appointment data đơn giản
            const appointmentData = {
                // Thông tin bệnh nhân
                fullName: formData.fullName,
                phone: formData.phone,
                email: formData.email,
                birthDate: formData.birthDate,
                address: formData.address,
                
                // Thông tin cuộc hẹn
                consultationType: formData.consultationType,
                doctorName: formData.doctorName || formData.selectedDoctor,
                appointmentDate: formData.appointmentDate,
                appointmentTime: formData.appointmentTime,
                
                // Thông tin y tế
                symptoms: formData.symptoms,
                medicalHistory: formData.medicalHistory,
                notes: formData.notes,
                
                // Thông tin thanh toán
                fee: calculateFee(formData.consultationType),
                
                // Metadata
                id: `APT${Date.now()}`,
                createdAt: new Date().toISOString(),
                status: 'pending'
            };

            // Lưu vào pendingAppointment thay vì appointmentFormData
            localStorage.setItem('pendingAppointment', JSON.stringify(appointmentData));
            
            console.log('✅ Appointment data saved to pendingAppointment');

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
            'Tư vấn chung': 350000,
        };
        return feeMap[consultationType] || 300000;
    };

    return (
        <div className={cx('appointment-container')}>
            <Header />

            {/* User Status Card */}
            {/* <UserStatusCard 
                isLoggedIn={isLoggedIn}
                userProfile={userProfile}
                onLoginRequired={() => navigate('/login')}
            /> */}

            <form onSubmit={handleSubmit} className={cx('appointment-form')}>
                <div className={cx('form-row')}>
                    {/* Personal Info Section - chỉ hiển thị nếu chưa đăng nhập */}
                    {!isLoggedIn && (
                        <PersonalInfoSection
                            formData={formData}
                            errors={errors}
                            onChange={handleInputChange}
                        />
                    )}

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
                    onDoctorSelect={handleDoctorSelect}
                />

                {/* Date Time Section */}
                <DateTimeSection
                    formData={formData}
                    errors={errors}
                    onChange={handleInputChange}
                />

                {/* Form Actions */}
                <div className={cx('form-actions')}>
                    <button
                        type="submit"
                        className={cx('submit-btn')}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <span className={cx('loading-spinner')}></span>{" "}
                                Đang xử lý...
                            </>
                        ) : (
                            <>
                                💳 Tiếp tục thanh toán
                            </>
                        )}
                    </button>

                    {/* Nút hủy/quay lại */}
                    <button
                        type="button"
                        className={cx('cancel-btn')}
                        onClick={() => {
                            if (window.confirm('Bạn có chắc muốn hủy đặt lịch hẹn?')) {
                                // Reset form hoặc quay lại trang trước
                                window.history.back();
                            }
                        }}
                        disabled={isSubmitting}
                    >
                        ↩️ Hủy bỏ
                    </button>
                </div>

                {/* Validation Summary */}
                <div className={cx('validation-summary')}>
                    <h4>Trạng thái form:</h4>
                    <div className={cx('validation-grid')}>
                        {!isLoggedIn && (
                            <>
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
                            </>
                        )}

                        <div className={cx('validation-item', { 'valid': formData.consultationType })}>
                            <span className={cx('validation-icon')}>
                                {formData.consultationType ? '✅' : '❌'}
                            </span>
                            <span>Loại tư vấn</span>
                        </div>

                        <div className={cx('validation-item', { 'valid': formData.selectedDoctor || formData.doctorName })}>
                            <span className={cx('validation-icon')}>
                                {formData.selectedDoctor || formData.doctorName ? '✅' : '❌'}
                            </span>
                            <span>Bác sĩ</span>
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
                            <strong>Lưu ý:</strong> Sau khi thanh toán thành công, lịch hẹn sẽ được xác nhận tự động
                        </p>
                    </div>

                    <div className={cx('notice-item')}>
                        <span className={cx('notice-icon')}>⚡</span>
                        <p>Thời gian xử lý: <strong>1-2 giờ</strong> sau khi thanh toán</p>
                    </div>

                    <div className={cx('notice-item')}>
                        <span className={cx('notice-icon')}>📞</span>
                        <p>Hotline hỗ trợ: <strong>1900-1133</strong></p>
                    </div>

                    <div className={cx('notice-item')}>
                        <span className={cx('notice-icon')}>⏰</span>
                        <p>Giờ làm việc: <strong>7:30-17:00</strong> (T2-T6) | <strong>7:30-12:00</strong> (T7)</p>
                    </div>

                    <div className={cx('notice-item', 'security')}>
                        <span className={cx('notice-icon')}>🔒</span>
                        <p>Thông tin của bạn được <strong>mã hóa và bảo mật</strong> tuyệt đối</p>
                    </div>
                </div>

                {/* Help Section */}
                <div className={cx('help-section')}>
                    <button
                        type="button"
                        className={cx('help-btn')}
                        onClick={() => {
                            alert(`
                                Bạn cần hỗ trợ?

                                📞 Gọi ngay: 1900-1133
                                💬 Chat trực tuyến: Nhấn vào biểu tượng chat
                                📧 Email: support@healthcare.vn

                                Chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7!
                            `);
                        }}
                        title="Cần hỗ trợ?"
                    >
                        ❓ Cần hỗ trợ?
                    </button>
                </div>
            </form>
        </div>
    );
}
export default Appointment;