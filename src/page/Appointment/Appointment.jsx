import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './AppointmentItems/Header';
import UserStatusCard from './AppointmentItems/UserStatusCard';
import PersonalInfoSection from './AppointmentItems/PersonalInfoSection';
import ConsultationSection from './AppointmentItems/ConsultationSection';
import DateTimeSection from './AppointmentItems/DateTimeSection';
import AdditionalInfoSection from './AppointmentItems/AdditionalInfoSection';
import FormActions from './AppointmentItems/FormActions';
import Navbar from '../../Layouts/LayoutHomePage/Navbar';
import { Footer } from '../../Layouts/LayoutHomePage/Footer';

function Appointment() {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userProfile, setUserProfile] = useState(null);
    const [formData, setFormData] = useState({
        fullName: '',
        birthDate: '',
        gender: '',
        phone: '',
        email: '',
        consultationType: '', // Sửa từ 'consultantionType' thành 'consultationType'
        preferredDate: '',
        preferredTime: '',
        symptoms: '',
        note: '',
        priority: 'normal',
        feedback: '',
        rate: '',
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        checkUserStatus();
    }, []);

    const checkUserStatus = () => {
        const authTokens = localStorage.getItem('authTokens');
        const savedUserData = localStorage.getItem('userData');

        if (authTokens && savedUserData) {
            setIsLoggedIn(true);
            const userData = JSON.parse(savedUserData);
            setUserProfile(userData);

            // Pre-fill form with user data directly from API response
            setFormData(prev => ({
                ...prev,
                fullName: `${userData.first_name} ${userData.last_name}`,
                email: userData.email,
                phone: userData.phone,
                birthDate: userData.birthday,
                gender: userData.gender
            }));
        } else {
            setIsLoggedIn(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        // Luôn validate thông tin cá nhân (dù đã login hay chưa)
        if (!formData.fullName.trim())
            newErrors.fullName = 'Vui lòng nhập họ tên';

        if (!formData.birthDate)
            newErrors.birthDate = 'Vui lòng chọn ngày sinh';

        if (!formData.gender)
            newErrors.gender = 'Vui lòng chọn giới tính';

        if (!formData.phone.trim())
            newErrors.phone = 'Vui lòng nhập số điện thoại';
        else if (!/^\d{10,11}$/.test(formData.phone))
            newErrors.phone = 'Số điện thoại không hợp lệ';

        if (!formData.email.trim())
            newErrors.email = 'Vui lòng nhập email';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
            newErrors.email = 'Email không hợp lệ';

        // Validate thông tin đặt lịch - SỬA TÊN FIELD
        if (!formData.consultationType) // Sửa từ 'consultantionType' thành 'consultationType'
            newErrors.consultationType = 'Vui lòng chọn loại tư vấn';

        if (!formData.preferredDate)
            newErrors.preferredDate = 'Vui lòng chọn ngày ưu tiên';

        if (!formData.preferredTime)
            newErrors.preferredTime = 'Vui lòng chọn giờ ưu tiên';

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log('🚀 Form submission started');
        console.log('📋 Current form data:', formData);

        const newErrors = validateForm();
        console.log('❌ Validation errors:', newErrors);

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            alert('❌ Vui lòng kiểm tra lại thông tin đã nhập!');
            return;
        }

        setIsSubmitting(true);

        try {
            // Tạo appointment data với ID và timestamp
            const appointmentData = {
                id: `APP_${Date.now()}`,
                timestamp: new Date().toISOString(),
                status: 1, // 0: Từ chối, 1: Chờ duyệt, 2: Đã duyệt, 3: Đã thanh toán, 4: Hoàn thành
                ...formData,
                ...(isLoggedIn && userProfile && {
                    userId: userProfile.user_id,
                })
            };

            console.log('💾 Saving appointment data:', appointmentData);

            // Lưu vào localStorage
            const existingAppointments = JSON.parse(localStorage.getItem('appointments') || '[]');
            existingAppointments.push(appointmentData);
            localStorage.setItem('appointments', JSON.stringify(existingAppointments));

            // Tạo thông báo
            const notification = {
                id: `NOTIF_${Date.now()}`,
                type: 'appointment',
                title: 'Đặt lịch hẹn thành công',
                message: 'Lịch hẹn của bạn đang chờ hệ thống xét duyệt. Chúng tôi sẽ liên hệ xác nhận trong vòng 24h.',
                timestamp: new Date().toISOString(),
                read: false,
                appointmentId: appointmentData.id
            };

            // Lưu thông báo vào localStorage
            const existingNotifications = JSON.parse(localStorage.getItem('notifications') || '[]');
            existingNotifications.unshift(notification); // Thêm vào đầu mảng
            localStorage.setItem('notifications', JSON.stringify(existingNotifications));

            console.log('✅ Appointment saved:', appointmentData);
            console.log('🔔 Notification created:', notification);

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            alert('✅ Đặt lịch hẹn thành công! Chúng tôi sẽ liên hệ xác nhận trong vòng 24h.');

            // Reset form (chỉ reset các field không phải thông tin cá nhân nếu đã login)
            if (isLoggedIn) {
                setFormData(prev => ({
                    ...prev,
                    consultationType: '', // Sửa từ 'consultantionType' thành 'consultationType'
                    preferredDate: '',
                    preferredTime: '',
                    symptoms: '',
                    note: '',
                    priority: 'normal'
                }));
            } else {
                // Reset toàn bộ form nếu chưa login
                setFormData({
                    fullName: '',
                    birthDate: '',
                    gender: '',
                    phone: '',
                    email: '',
                    consultationType: '', // Sửa từ 'consultantionType' thành 'consultationType'
                    preferredDate: '',
                    preferredTime: '',
                    symptoms: '',
                    note: '',
                    priority: 'normal',
                    feedback: '',
                    rate: '',
                });
            }

            // Redirect về trang chủ sau 1 giây
            setTimeout(() => {
                navigate('/');
            }, 1000);

        } catch (error) {
            console.error('❌ Appointment submission error:', error);
            alert('❌ Có lỗi xảy ra. Vui lòng thử lại!');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div>
            <Navbar />

            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-pink-50 py-8">
                <Header isLoggedIn={isLoggedIn} />
                <UserStatusCard isLoggedIn={isLoggedIn} userProfile={userProfile} />

                <form onSubmit={handleSubmit} className="max-w-4xl mx-auto px-4">
                    {/* Luôn hiển thị PersonalInfoSection */}
                    <PersonalInfoSection
                        formData={formData}
                        errors={errors}
                        onChange={handleInputChange}
                    />

                    <ConsultationSection
                        formData={formData}
                        errors={errors}
                        onChange={handleInputChange}
                    />

                    <DateTimeSection
                        formData={formData}
                        errors={errors}
                        onChange={handleInputChange}
                    />

                    <AdditionalInfoSection
                        formData={formData}
                        onChange={handleInputChange}
                    />

                    <FormActions
                        isSubmitting={isSubmitting}
                    />
                </form>
            </div>

            <Footer />
        </div>
    );
}

export default Appointment;