import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { validateTestOrderForm } from '../../components/Validation/validateRulesTestOrder';
import Navbar from '../../Layouts/LayoutHomePage/Navbar';
import { Footer } from '../../Layouts/LayoutHomePage/Footer';
import Header from './TestOrderItems/Header';
import UserStatusCard from './TestOrderItems/UserStatusCard';
import PersonalInfoSection from './TestOrderItems/PersonalInfoSection';
import TestInfoSection from './TestOrderItems/TestInfoSection';
import MedicalInfoSection from './TestOrderItems/MedicalInfoSection';
import FormActions from './TestOrderItems/FormActions';

function TestOrder() {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userProfile, setUserProfile] = useState(null);
    const [formData, setFormData] = useState({
        fullName: '',
        birthDate: '',
        gender: '',
        phone: '',
        email: '',
        address: '',
        testType: '',
        preferredDate: '',
        preferredTime: '',
        healthInsurance: '',
        medicalHistory: '',
        currentMedications: '',
        note: '',
        priority: 'normal',
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const testTypes = [
        { value: 'blood-test', label: 'Xét nghiệm máu tổng quát' },
        { value: 'urine-test', label: 'Xét nghiệm nước tiểu' },
        { value: 'hormone-test', label: 'Xét nghiệm hormone' },
        { value: 'pregnancy-test', label: 'Xét nghiệm thai' },
        { value: 'std-test', label: 'Xét nghiệm bệnh lây truyền qua đường tình dục' },
        { value: 'fertility-test', label: 'Xét nghiệm khả năng sinh sản' },
        { value: 'genetic-test', label: 'Xét nghiệm di truyền' },
        { value: 'cancer-screening', label: 'Tầm soát ung thư' },
        { value: 'other', label: 'Khác' }
    ];

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
                gender: userData.gender,
                address: userData.address
            }));
        } else {
            setIsLoggedIn(false);
        }
    };

    const handleInputChange = (name, value) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const validationErrors = validateTestOrderForm(formData);
        setErrors(validationErrors);
        return Object.keys(validationErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            alert('❌ Vui lòng kiểm tra lại thông tin đã nhập!');
            return;
        }

        setIsSubmitting(true);

        try {
            // Tạo test order data với ID và timestamp
            const testOrderData = {
                id: `TEST_${Date.now()}`,
                timestamp: new Date().toISOString(),
                status: 1, // 0: Từ chối, 1: Chờ duyệt, 2: Đã duyệt, 3: Đã thanh toán, 4: Hoàn thành
                type: 'test-order',
                ...formData,
                ...(isLoggedIn && userProfile && {
                    userId: userProfile.user_id,
                })
            };

            // Lưu vào localStorage
            const existingTestOrders = JSON.parse(localStorage.getItem('testOrders') || '[]');
            existingTestOrders.push(testOrderData);
            localStorage.setItem('testOrders', JSON.stringify(existingTestOrders));

            // Tạo thông báo
            const notification = {
                id: `NOTIF_${Date.now()}`,
                type: 'test-order',
                title: 'Đặt lịch xét nghiệm thành công',
                message: 'Lịch xét nghiệm của bạn đang chờ hệ thống xét duyệt. Chúng tôi sẽ liên hệ xác nhận trong vòng 24h.',
                timestamp: new Date().toISOString(),
                read: false,
                testOrderId: testOrderData.id
            };

            // Lưu thông báo vào localStorage
            const existingNotifications = JSON.parse(localStorage.getItem('notifications') || '[]');
            existingNotifications.unshift(notification); // Thêm vào đầu mảng
            localStorage.setItem('notifications', JSON.stringify(existingNotifications));

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            alert('✅ Đặt lịch xét nghiệm thành công! Chúng tôi sẽ liên hệ xác nhận trong vòng 24h.');

            // Reset form (chỉ reset các field không phải thông tin cá nhân nếu đã login)
            if (isLoggedIn) {
                setFormData(prev => ({
                    ...prev,
                    testType: '',
                    preferredDate: '',
                    preferredTime: '',
                    healthInsurance: '',
                    medicalHistory: '',
                    currentMedications: '',
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
                    address: '',
                    testType: '',
                    preferredDate: '',
                    preferredTime: '',
                    healthInsurance: '',
                    medicalHistory: '',
                    currentMedications: '',
                    note: '',
                    priority: 'normal',
                });
            }

            // Redirect về trang chủ sau 1 giây
            setTimeout(() => {
                navigate('/');
            }, 1000);

        } catch (error) {
            console.error('❌ Test order submission error:', error);
            alert('❌ Có lỗi xảy ra. Vui lòng thử lại!');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
            <Navbar />
            
            <div className="py-8">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                        <Header />
                        <UserStatusCard isLoggedIn={isLoggedIn} userProfile={userProfile} />
                        
                        <form onSubmit={handleSubmit} className="p-8 space-y-8">
                            <PersonalInfoSection 
                                formData={formData}
                                errors={errors}
                                onChange={handleInputChange}
                            />
                            
                            <TestInfoSection 
                                formData={formData}
                                errors={errors}
                                onChange={handleInputChange}
                                testTypes={testTypes}
                            />
                            
                            <MedicalInfoSection 
                                formData={formData}
                                onChange={handleInputChange}
                            />
                            
                            <FormActions isSubmitting={isSubmitting} />
                        </form>
                    </div>
                </div>
            </div>
            
            <Footer />
        </div>
    );
}

export default TestOrder;