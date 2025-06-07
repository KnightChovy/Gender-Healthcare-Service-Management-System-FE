import React, { useEffect, useState } from 'react';
import Header from './AppointmentItems/Header';
import UserStatusCard from './AppointmentItems/UserStatusCard';
import PersonalInfoSection from './AppointmentItems/PersonalInfoSection';
import ConsultationSection from './AppointmentItems/ConsultationSection';
import DateTimeSection from './AppointmentItems/DateTimeSection';
import AdditionalInfoSection from './AppointmentItems/AdditionalInfoSection';
import FormActions from './AppointmentItems/FormActions';
import classNames from 'classnames/bind';
import styles from './Appointment.module.scss';

const cx = classNames.bind(styles);

function Appointment() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userProfile, setUserProfile] = useState(null);
    const [formData, setFormData] = useState({
        fullName: '',
        birthDate: '',
        gender: '',
        phone: '',
        email: '',
        consultantionType: '',
        preferredDate: '',
        preferredTime: '',
        symptoms: '',
        note: '',
        priority: 'normal',
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        checkUserStatus();
    }, []);

    const checkUserStatus = () => {
        const token = localStorage.getItem('userToken');
        const savedProfile = localStorage.getItem('userProfile');

        if( token && savedProfile) {
            setIsLoggedIn(true);
            setUserProfile(JSON.parse(savedProfile));
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
        
        if (!isLoggedIn) {
            if (!formData.fullName.trim())
                newErrors.fullName = 'Vui lòng nhập họ tên';

            if (!formData.birthDate)
                newErrors.birthDate = 'Vui lòng chọn ngày sinh';

            if (!formData.gender)
                newErrors.gender = 'Vui lòng chọn giới tính';

            if (!formData.phone.trim())
                newErrors.phone = 'Vui lòng nhập số điện thoại';
            else if (!/^[0-9]{10,11}$/.test(formData.phone)) 
                newErrors.phone = 'Số điện thoại không hợp lệ';

            if (!formData.email.trim())
                newErrors.email = 'Vui lòng nhập email';
            else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
                newErrors.email = 'Email không hợp lệ';
        }

        if (!formData.consultantionType)
            newErrors.consultantionType = 'Vui lòng chọn loại tư vấn';

        if (!formData.preferredDate)
            newErrors.preferredDate = 'Vui lòng chọn ngày ưu tiên';

        if (!formData.preferredTime)
            newErrors.preferredTime = 'Vui lòng chọn giờ ưu tiên';

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = validateForm();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setIsSubmitting(true);

        try {
            const appointmentData = {
                ...formData,
                ...(isLoggedIn && userProfile && {
                    fullName: userProfile.fullName,
                    birthDate: userProfile.birthDate,
                    gender: userProfile.gender,
                    phone: userProfile.phone,
                    email: userProfile.email,
                })
            };

            console.log('Submitting appointment data:', appointmentData);
            await new Promise(resolve => setTimeout(resolve, 2000));

            alert('✅ Đặt lịch hẹn thành công! Chúng tôi sẽ liên hệ xác nhận trong vòng 24h.');

            setFormData(prev => ({
                ...prev,
                consultationType: '',
                preferredDate: '',
                preferredTime: '',
                symptoms: '',
                notes: '',
                priority: 'normal'
            }));
            
        } catch (error) {
            console.error(error);
            alert('❌ Có lỗi xảy ra. Vui lòng thử lại!');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Uncomment this section if you want to handle login redirection
    // const handleLogin = () => {
    //     window.location.href = '/login';
    // }

    return ( 
        <div className={cx('appointment-container')}>
            <Header />
            
            {/* <UserStatusCard 
                isLoggedIn={isLoggedIn}
                userProfile={userProfile}
                onLogin={handleLogin}
            /> */}

            <form onSubmit={handleSubmit} className={cx('appointment-form')}>
                {!isLoggedIn && (
                    <PersonalInfoSection
                        formData={formData}
                        errors={errors}
                        onChange={handleInputChange}
                    />
                )}

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
     );
}

export default Appointment;