import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faCalendarAlt, 
    faFlask, 
    faEye, 
    faVideo,
    faDownload,
    faCreditCard,
    faSpinner,
    faCheck,
    faStar
} from '@fortawesome/free-solid-svg-icons';
import Navbar from '../../Layouts/LayoutHomePage/Navbar';
import { Footer } from '../../Layouts/LayoutHomePage/Footer';
import AppointmentDetailModal from '../../components/AppointmentDetailModal';
import RatingModal from '../../components/RatingModal';

const MyAppointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [testOrders, setTestOrders] = useState([]);
    const [activeTab, setActiveTab] = useState('appointments');
    const [isLoading, setIsLoading] = useState(true);
    const [selectedItem, setSelectedItem] = useState(null);
    const [selectedType, setSelectedType] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedRatingItem, setSelectedRatingItem] = useState(null);
    const [selectedRatingType, setSelectedRatingType] = useState(null);
    const [showRatingModal, setShowRatingModal] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuthAndLoadData = () => {
            const authTokens = localStorage.getItem('authTokens');
            const storedUserData = localStorage.getItem('userData');

            if (!authTokens || !storedUserData) {
                navigate('/login');
                return;
            }

            try {
                const user = JSON.parse(storedUserData);
                loadUserAppointments(user.user_id);
            } catch (error) {
                console.error('Error parsing user data:', error);
                navigate('/login');
            }
        };

        checkAuthAndLoadData();
    }, [navigate]);

    const loadUserAppointments = (userId) => {
        try {
            // Load appointments
            const allAppointments = JSON.parse(localStorage.getItem('appointments') || '[]');
            const userAppointments = allAppointments.filter(apt => apt.userId === userId);
            setAppointments(userAppointments);

            // Load test orders
            const allTestOrders = JSON.parse(localStorage.getItem('testOrders') || '[]');
            const userTestOrders = allTestOrders.filter(test => test.userId === userId);
            setTestOrders(userTestOrders);

        } catch (error) {
            console.error('Error loading appointments:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 0: return 'text-red-600 bg-red-100';        // Rejected
            case 1: return 'text-yellow-600 bg-yellow-100';  // Pending
            case 2: return 'text-blue-600 bg-blue-100';      // Confirmed
            case 3: return 'text-green-600 bg-green-100';    // Confirmed & Paid
            case 4: return 'text-purple-600 bg-purple-100';  // Test Completed (for tests) / Service Completed (for appointments)
            case 5: return 'text-indigo-600 bg-indigo-100';  // Doctor Reviewed (for tests only)
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    const getStatusText = (status, type) => {
        if (type === 'test') {
            switch (status) {
                case 0: return 'Đã từ chối';
                case 1: return 'Chờ duyệt';
                case 2: return 'Đã duyệt';
                case 3: return 'Chờ xét nghiệm';
                case 4: return 'Chờ bác sĩ xem xét';
                case 5: return 'Hoàn thành';
                default: return 'Không xác định';
            }
        } else {
            switch (status) {
                case 0: return 'Đã từ chối';
                case 1: return 'Chờ duyệt';
                case 2: return 'Đã duyệt';
                case 3: return 'Đã thanh toán';
                case 4: return 'Hoàn thành';
                default: return 'Không xác định';
            }
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getTestTypeName = (testType) => {
        const testTypes = {
            'blood-test': 'Xét nghiệm máu tổng quát',
            'urine-test': 'Xét nghiệm nước tiểu',
            'hormone-test': 'Xét nghiệm hormone',
            'pregnancy-test': 'Xét nghiệm thai',
            'std-test': 'Xét nghiệm bệnh lây truyền qua đường tình dục',
            'fertility-test': 'Xét nghiệm khả năng sinh sản',
            'genetic-test': 'Xét nghiệm di truyền',
            'cancer-screening': 'Tầm soát ung thư',
            'other': 'Khác'
        };
        return testTypes[testType] || testType;
    };

    const handlePayment = (id) => {
        navigate(`/payment/${id}`);
    };

    const handleJoinMeet = () => {
        window.open('https://meet.google.com/sqm-jpse-ovb', '_blank');
    };

    const handleViewDetails = (item, type) => {
        setSelectedItem(item);
        setSelectedType(type);
        setShowModal(true);
    };

    const handleOpenRating = (item, type) => {
        setSelectedRatingItem(item);
        setSelectedRatingType(type);
        setShowRatingModal(true);
    };

    const handleCloseRating = () => {
        setShowRatingModal(false);
        setSelectedRatingItem(null);
        setSelectedRatingType(null);
        // Reload data after rating
        const storedUserData = localStorage.getItem('userData');
        if (storedUserData) {
            const user = JSON.parse(storedUserData);
            loadUserAppointments(user.user_id);
        }
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedItem(null);
        setSelectedType(null);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-pink-50">
                <Navbar />
                <div className="flex justify-center items-center min-h-screen">
                    <div className="text-center">
                        <FontAwesomeIcon icon={faSpinner} className="animate-spin text-4xl text-blue-600 mb-4" />
                        <p className="text-gray-600">Đang tải dữ liệu...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-pink-50">
            <Navbar />
            
            <div className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            Lịch hẹn của tôi
                        </h1>
                        <p className="text-gray-600">
                            Xem và quản lý tất cả các lịch hẹn tư vấn và xét nghiệm của bạn
                        </p>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <FontAwesomeIcon icon={faCalendarAlt} className="h-8 w-8 text-blue-600" />
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">
                                            Tổng lịch hẹn
                                        </dt>
                                        <dd className="text-lg font-medium text-gray-900">
                                            {appointments.length}
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <FontAwesomeIcon icon={faFlask} className="h-8 w-8 text-purple-600" />
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">
                                            Tổng xét nghiệm
                                        </dt>
                                        <dd className="text-lg font-medium text-gray-900">
                                            {testOrders.length}
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <FontAwesomeIcon icon={faSpinner} className="h-8 w-8 text-yellow-600" />
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">
                                            Chờ duyệt
                                        </dt>
                                        <dd className="text-lg font-medium text-gray-900">
                                            {[...appointments, ...testOrders].filter(item => item.status === 1).length}
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <FontAwesomeIcon icon={faCheck} className="h-8 w-8 text-green-600" />
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">
                                            Hoàn thành
                                        </dt>
                                        <dd className="text-lg font-medium text-gray-900">
                                            {appointments.filter(item => item.status === 4).length + 
                                             testOrders.filter(item => item.status === 5).length}
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tab Navigation */}
                    <div className="mb-6">
                        <div className="border-b border-gray-200">
                            <nav className="-mb-px flex space-x-8">
                                <button
                                    onClick={() => setActiveTab('appointments')}
                                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                                        activeTab === 'appointments'
                                            ? 'border-blue-500 text-blue-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                >
                                    <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
                                    Lịch hẹn tư vấn ({appointments.length})
                                </button>
                                <button
                                    onClick={() => setActiveTab('tests')}
                                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                                        activeTab === 'tests'
                                            ? 'border-blue-500 text-blue-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                >
                                    <FontAwesomeIcon icon={faFlask} className="mr-2" />
                                    Lịch xét nghiệm ({testOrders.length})
                                </button>
                            </nav>
                        </div>
                    </div>

                    {/* Appointments Tab */}
                    {activeTab === 'appointments' && (
                        <div className="bg-white rounded-lg shadow overflow-hidden">
                            {appointments.length === 0 ? (
                                <div className="text-center py-12">
                                    <FontAwesomeIcon icon={faCalendarAlt} className="text-4xl text-gray-400 mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                                        Chưa có lịch hẹn nào
                                    </h3>
                                    <p className="text-gray-500 mb-4">
                                        Bạn chưa đặt lịch hẹn tư vấn nào. Hãy đặt lịch ngay!
                                    </p>
                                    <button
                                        onClick={() => navigate('/appointment')}
                                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                                    >
                                        Đặt lịch hẹn
                                    </button>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Thông tin
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Loại tư vấn
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Ngày đặt
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Trạng thái
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Hành động
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {appointments.map((appointment) => (
                                                <tr key={appointment.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div>
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {appointment.fullName}
                                                            </div>
                                                            <div className="text-sm text-gray-500">
                                                                {appointment.phone}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {appointment.consultationType}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {formatDate(appointment.timestamp)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(appointment.status)}`}>
                                                            {getStatusText(appointment.status, 'appointment')}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                                        <button
                                                            onClick={() => handleViewDetails(appointment, 'appointment')}
                                                            className="text-blue-600 hover:text-blue-900"
                                                        >
                                                            <FontAwesomeIcon icon={faEye} /> Xem
                                                        </button>
                                                        
                                                        {appointment.status === 2 && (
                                                            <button
                                                                onClick={() => handlePayment(appointment.id)}
                                                                className="text-green-600 hover:text-green-900"
                                                            >
                                                                <FontAwesomeIcon icon={faCreditCard} /> Thanh toán
                                                            </button>
                                                        )}
                                                        
                                                        {appointment.status === 3 && (
                                                            <button
                                                                onClick={handleJoinMeet}
                                                                className="text-purple-600 hover:text-purple-900"
                                                            >
                                                                <FontAwesomeIcon icon={faVideo} /> Tham gia Meet
                                                            </button>
                                                        )}
                                                        
                                                        {appointment.status === 4 && !appointment.rated && (
                                                            <button
                                                                onClick={() => handleOpenRating(appointment, 'appointment')}
                                                                className="text-yellow-600 hover:text-yellow-900"
                                                            >
                                                                <FontAwesomeIcon icon={faStar} /> Đánh giá
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Test Orders Tab */}
                    {activeTab === 'tests' && (
                        <div className="bg-white rounded-lg shadow overflow-hidden">
                            {testOrders.length === 0 ? (
                                <div className="text-center py-12">
                                    <FontAwesomeIcon icon={faFlask} className="text-4xl text-gray-400 mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                                        Chưa có lịch xét nghiệm nào
                                    </h3>
                                    <p className="text-gray-500 mb-4">
                                        Bạn chưa đặt lịch xét nghiệm nào. Hãy đặt lịch ngay!
                                    </p>
                                    <button
                                        onClick={() => navigate('/test-order')}
                                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                                    >
                                        Đặt lịch xét nghiệm
                                    </button>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Thông tin
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Loại xét nghiệm
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Ngày đặt
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Trạng thái
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Hành động
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {testOrders.map((test) => (
                                                <tr key={test.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div>
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {test.fullName}
                                                            </div>
                                                            <div className="text-sm text-gray-500">
                                                                {test.phone}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {getTestTypeName(test.testType)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {formatDate(test.timestamp)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(test.status)}`}>
                                                            {getStatusText(test.status, 'test')}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                                        <button
                                                            onClick={() => handleViewDetails(test, 'test')}
                                                            className="text-blue-600 hover:text-blue-900"
                                                        >
                                                            <FontAwesomeIcon icon={faEye} /> Xem
                                                        </button>
                                                        
                                                        {test.status === 2 && (
                                                            <button
                                                                onClick={() => handlePayment(test.id)}
                                                                className="text-green-600 hover:text-green-900"
                                                            >
                                                                <FontAwesomeIcon icon={faCreditCard} /> Thanh toán
                                                            </button>
                                                        )}
                                                                          {(test.status === 4 || test.status === 5) && test.testResultData && (
                                            <button
                                                onClick={() => window.open(test.testResult || '#', '_blank')}
                                                className="text-purple-600 hover:text-purple-900"
                                            >
                                                <FontAwesomeIcon icon={faDownload} /> Tải kết quả
                                            </button>
                                        )}

                                                        {test.status === 5 && !test.rated && (
                                                            <button
                                                                onClick={() => handleOpenRating(test, 'test')}
                                                                className="text-yellow-600 hover:text-yellow-900"
                                                            >
                                                                <FontAwesomeIcon icon={faStar} /> Đánh giá
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
            
            <Footer />

            {/* Modal for Appointment/Test Details */}
            {showModal && (
                <AppointmentDetailModal 
                    isOpen={showModal}
                    onClose={closeModal}
                    item={selectedItem}
                    type={selectedType}
                    onOpenRating={handleOpenRating}
                />
            )}

            {/* Rating Modal */}
            {showRatingModal && (
                <RatingModal
                    isOpen={showRatingModal}
                    onClose={handleCloseRating}
                    item={selectedRatingItem}
                    type={selectedRatingType}
                />
            )}
        </div>
    );
};

export default MyAppointments;
