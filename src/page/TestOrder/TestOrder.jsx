import React, { useState, useEffect } from 'react';
import FormInputText from '../../components/ui/FormInputText';
import { validateTestOrderForm } from '../../components/Validation/validateRulesTestOrder';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faFlask, 
  faCalendarAlt, 
  faUser, 
  faNotes, 
  faExclamationTriangle,
  faCheckCircle 
} from '@fortawesome/free-solid-svg-icons';
import { Navbar } from '../../Layouts/LayoutHomePage/Navbar';
import { Footer } from '../../Layouts/LayoutHomePage/Footer';

function TestOrder() {
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
        const token = localStorage.getItem('authToken');
        const savedProfile = localStorage.getItem('userProfile');

        if (token && savedProfile) {
            setIsLoggedIn(true);
            const profile = JSON.parse(savedProfile);
            setUserProfile(profile);
            
            // Pre-fill form with user data
            setFormData(prev => ({
                ...prev,
                fullName: profile.fullName || '',
                email: profile.email || '',
                phone: profile.phone || '',
                birthDate: profile.birthDate || '',
                gender: profile.gender || '',
                address: profile.address || ''
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
            return;
        }

        setIsSubmitting(true);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            alert('Đăng ký lịch xét nghiệm thành công! Chúng tôi sẽ liên hệ với bạn để xác nhận.');
            
            // Reset form
            setFormData({
                fullName: userProfile?.fullName || '',
                birthDate: userProfile?.birthDate || '',
                gender: userProfile?.gender || '',
                phone: userProfile?.phone || '',
                email: userProfile?.email || '',
                address: userProfile?.address || '',
                testType: '',
                preferredDate: '',
                preferredTime: '',
                healthInsurance: '',
                medicalHistory: '',
                currentMedications: '',
                note: '',
                priority: 'normal',
            });
            
        } catch {
            alert('Đã có lỗi xảy ra. Vui lòng thử lại.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-8">
            <NavBar />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8">
                        <div className="flex items-center justify-center mb-4">
                            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                                <FontAwesomeIcon icon={faFlask} className="text-3xl" />
                            </div>
                        </div>
                        <h1 className="text-3xl font-bold text-center mb-2">Đăng Ký Lịch Xét Nghiệm</h1>
                        <p className="text-center text-blue-100">Vui lòng điền đầy đủ thông tin để đăng ký lịch xét nghiệm</p>
                    </div>

                    {/* Login Notice */}
                    {!isLoggedIn && (
                        <div className="mx-8 mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <div className="flex items-center">
                                <FontAwesomeIcon icon={faExclamationTriangle} className="text-yellow-500 mr-3" />
                                <p className="text-yellow-800">
                                    Bạn chưa đăng nhập. Vui lòng đăng nhập để được điền sẵn thông tin cá nhân.
                                </p>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="p-8 space-y-8">
                        {/* Personal Information Section */}
                        <div className="bg-gray-50 rounded-xl p-6">
                            <div className="flex items-center mb-6">
                                <FontAwesomeIcon icon={faUser} className="text-blue-600 text-xl mr-3" />
                                <h3 className="text-xl font-semibold text-gray-800">Thông Tin Cá Nhân</h3>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">Họ và tên *</label>
                                    <FormInputText
                                        textHolder="Nhập họ và tên"
                                        textName="fullName"
                                        value={formData.fullName}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    {errors.fullName && <span className="text-red-500 text-sm">{errors.fullName}</span>}
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700">Ngày sinh *</label>
                                    <input
                                        id="birthDate"
                                        type="date"
                                        name="birthDate"
                                        value={formData.birthDate}
                                        onChange={(e) => handleInputChange(e.target.name, e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    {errors.birthDate && <span className="text-red-500 text-sm">{errors.birthDate}</span>}
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="gender" className="block text-sm font-medium text-gray-700">Giới tính *</label>
                                    <select
                                        id="gender"
                                        name="gender"
                                        value={formData.gender}
                                        onChange={(e) => handleInputChange(e.target.name, e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="">Chọn giới tính</option>
                                        <option value="female">Nữ</option>
                                        <option value="male">Nam</option>
                                        <option value="other">Khác</option>
                                    </select>
                                    {errors.gender && <span className="text-red-500 text-sm">{errors.gender}</span>}
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">Số điện thoại *</label>
                                    <FormInputText
                                        textHolder="Nhập số điện thoại"
                                        textName="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    {errors.phone && <span className="text-red-500 text-sm">{errors.phone}</span>}
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">Email *</label>
                                    <FormInputText
                                        textHolder="Nhập email"
                                        textName="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    {errors.email && <span className="text-red-500 text-sm">{errors.email}</span>}
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">Địa chỉ</label>
                                    <FormInputText
                                        textHolder="Nhập địa chỉ"
                                        textName="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Test Information Section */}
                        <div className="bg-gray-50 rounded-xl p-6">
                            <div className="flex items-center mb-6">
                                <FontAwesomeIcon icon={faCalendarAlt} className="text-purple-600 text-xl mr-3" />
                                <h3 className="text-xl font-semibold text-gray-800">Thông Tin Xét Nghiệm</h3>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2 md:col-span-2">
                                    <label htmlFor="testType" className="block text-sm font-medium text-gray-700">Loại xét nghiệm *</label>
                                    <select
                                        id="testType"
                                        name="testType"
                                        value={formData.testType}
                                        onChange={(e) => handleInputChange(e.target.name, e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                    >
                                        <option value="">Chọn loại xét nghiệm</option>
                                        {testTypes.map(test => (
                                            <option key={test.value} value={test.value}>
                                                {test.label}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.testType && <span className="text-red-500 text-sm">{errors.testType}</span>}
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="preferredDate" className="block text-sm font-medium text-gray-700">Ngày mong muốn *</label>
                                    <input
                                        id="preferredDate"
                                        type="date"
                                        name="preferredDate"
                                        value={formData.preferredDate}
                                        onChange={(e) => handleInputChange(e.target.name, e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                        min={new Date().toISOString().split('T')[0]}
                                    />
                                    {errors.preferredDate && <span className="text-red-500 text-sm">{errors.preferredDate}</span>}
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="preferredTime" className="block text-sm font-medium text-gray-700">Giờ mong muốn *</label>
                                    <select
                                        id="preferredTime"
                                        name="preferredTime"
                                        value={formData.preferredTime}
                                        onChange={(e) => handleInputChange(e.target.name, e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                    >
                                        <option value="">Chọn giờ</option>
                                        <option value="08:00">08:00</option>
                                        <option value="08:30">08:30</option>
                                        <option value="09:00">09:00</option>
                                        <option value="09:30">09:30</option>
                                        <option value="10:00">10:00</option>
                                        <option value="10:30">10:30</option>
                                        <option value="11:00">11:00</option>
                                        <option value="11:30">11:30</option>
                                        <option value="14:00">14:00</option>
                                        <option value="14:30">14:30</option>
                                        <option value="15:00">15:00</option>
                                        <option value="15:30">15:30</option>
                                        <option value="16:00">16:00</option>
                                        <option value="16:30">16:30</option>
                                    </select>
                                    {errors.preferredTime && <span className="text-red-500 text-sm">{errors.preferredTime}</span>}
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="healthInsurance" className="block text-sm font-medium text-gray-700">Bảo hiểm y tế</label>
                                    <input
                                        id="healthInsurance"
                                        type="text"
                                        name="healthInsurance"
                                        value={formData.healthInsurance}
                                        onChange={(e) => handleInputChange(e.target.name, e.target.value)}
                                        placeholder="Nhập số thẻ bảo hiểm y tế (nếu có)"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="priority" className="block text-sm font-medium text-gray-700">Độ ưu tiên</label>
                                    <select
                                        id="priority"
                                        name="priority"
                                        value={formData.priority}
                                        onChange={(e) => handleInputChange(e.target.name, e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                    >
                                        <option value="normal">Bình thường</option>
                                        <option value="urgent">Khẩn cấp</option>
                                        <option value="very-urgent">Rất khẩn cấp</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Medical Information Section */}
                        <div className="bg-gray-50 rounded-xl p-6">
                            <div className="flex items-center mb-6">
                                <FontAwesomeIcon icon={faNotes} className="text-green-600 text-xl mr-3" />
                                <h3 className="text-xl font-semibold text-gray-800">Thông Tin Y Tế</h3>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label htmlFor="medicalHistory" className="block text-sm font-medium text-gray-700">Tiền sử bệnh lý</label>
                                    <textarea
                                        id="medicalHistory"
                                        name="medicalHistory"
                                        value={formData.medicalHistory}
                                        onChange={(e) => handleInputChange(e.target.name, e.target.value)}
                                        placeholder="Mô tả các bệnh lý đã từng mắc (nếu có)"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none"
                                        rows={3}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="currentMedications" className="block text-sm font-medium text-gray-700">Thuốc đang sử dụng</label>
                                    <textarea
                                        id="currentMedications"
                                        name="currentMedications"
                                        value={formData.currentMedications}
                                        onChange={(e) => handleInputChange(e.target.name, e.target.value)}
                                        placeholder="Liệt kê các loại thuốc đang sử dụng (nếu có)"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none"
                                        rows={3}
                                    />
                                </div>

                                <div className="space-y-2 md:col-span-2">
                                    <label htmlFor="note" className="block text-sm font-medium text-gray-700">Ghi chú thêm</label>
                                    <textarea
                                        id="note"
                                        name="note"
                                        value={formData.note}
                                        onChange={(e) => handleInputChange(e.target.name, e.target.value)}
                                        placeholder="Ghi chú thêm về yêu cầu xét nghiệm"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none"
                                        rows={3}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-center pt-6">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold text-lg rounded-xl shadow-lg transition-all duration-300 transform ${
                                    isSubmitting 
                                        ? 'opacity-50 cursor-not-allowed' 
                                        : 'hover:from-blue-700 hover:to-purple-700 hover:shadow-xl hover:scale-105'
                                }`}
                            >
                                <div className="flex items-center space-x-2">
                                    <FontAwesomeIcon icon={isSubmitting ? faFlask : faCheckCircle} className={isSubmitting ? 'animate-pulse' : ''} />
                                    <span>{isSubmitting ? 'Đang xử lý...' : 'Đăng Ký Lịch Xét Nghiệm'}</span>
                                </div>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <Footer />
        </div>
    );  
}

export default TestOrder;