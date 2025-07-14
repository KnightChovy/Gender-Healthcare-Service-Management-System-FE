import React, { useState, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faCalendarAlt, 
    faFlask, 
    faChartBar,
    faCheck,
    faTimes,
    faSearch,
    faDownload,
    faStar,
    faNewspaper,
    faChartLine
} from '@fortawesome/free-solid-svg-icons';
import Navbar from '../../Layouts/LayoutHomePage/Navbar';
import { Footer } from '../../Layouts/LayoutHomePage/Footer';
import { testResults } from '../../data/testResults';
import BlogManagement from './BlogManagement';
import StatisticsCharts from '../../components/StatisticsCharts';
import DashboardOverview from '../../components/DashboardOverview';

function ManagerDashboard() {
    const [activeTab, setActiveTab] = useState('overview');
    const [appointments, setAppointments] = useState([]);
    const [testOrders, setTestOrders] = useState([]);
    const [stats, setStats] = useState({
        totalAppointments: 0,
        totalTests: 0,
        pendingApprovals: 0
    });
    const [searchTerm, setSearchTerm] = useState('');

    const loadData = () => {
        const storedAppointments = JSON.parse(localStorage.getItem('appointments') || '[]');
        const storedTestOrders = JSON.parse(localStorage.getItem('testOrders') || '[]');
        
        setAppointments(storedAppointments);
        setTestOrders(storedTestOrders);
    };

    const calculateStats = useCallback(() => {
        const storedAppointments = JSON.parse(localStorage.getItem('appointments') || '[]');
        const storedTestOrders = JSON.parse(localStorage.getItem('testOrders') || '[]');
        
        const pendingAppointments = storedAppointments.filter(apt => apt.status === 1);
        const pendingTests = storedTestOrders.filter(test => test.status === 1);

        setStats({
            totalAppointments: storedAppointments.length,
            totalTests: storedTestOrders.length,
            pendingApprovals: pendingAppointments.length + pendingTests.length
        });
    }, []);

    useEffect(() => {
        loadData();
        calculateStats();
    }, [calculateStats]);

    useEffect(() => {
        calculateStats();
    }, [appointments, testOrders, calculateStats]);

    const updateStatus = (id, newStatus, type) => {
        if (type === 'appointment') {
            const updatedAppointments = appointments.map(apt => 
                apt.id === id ? { ...apt, status: newStatus, approvedBy: 'Manager', approvedAt: new Date().toISOString() } : apt
            );
            setAppointments(updatedAppointments);
            localStorage.setItem('appointments', JSON.stringify(updatedAppointments));
            
            // Tạo thông báo cho user
            createNotificationForUser(id, newStatus, 'appointment');
        } else {
            const updatedTestOrders = testOrders.map(test => 
                test.id === id ? { ...test, status: newStatus, approvedBy: 'Manager', approvedAt: new Date().toISOString() } : test
            );
            setTestOrders(updatedTestOrders);
            localStorage.setItem('testOrders', JSON.stringify(updatedTestOrders));
            
            // Tạo thông báo cho user
            createNotificationForUser(id, newStatus, 'test');
        }
        
        // Cập nhật lại thống kê
        calculateStats();
    };

    const getTestPrice = (testId) => {
        const testPrices = {
            'blood-test': 300000,
            'urine-test': 200000,
            'hormone-test': 800000,
            'std-test': 1200000,
            'general-checkup': 1500000
        };
        
        const test = testOrders.find(t => t.id === testId);
        return test ? testPrices[test.testType] || 500000 : 500000;
    };

    const createNotificationForUser = (requestId, status, type) => {
        let title, message, notification;
        
        if (type === 'appointment') {
            // For consultation appointments
            title = status === 2 ? 'Lịch hẹn khám được duyệt' : 'Lịch hẹn khám bị từ chối';
            message = status === 2 
                ? 'Lịch hẹn khám của bạn đã được duyệt. Vui lòng thanh toán để nhận link tư vấn trực tuyến.'
                : 'Lịch hẹn khám của bạn đã bị từ chối. Vui lòng liên hệ để biết thêm chi tiết.';
        } else {
            // For test orders
            title = status === 2 ? 'Lịch xét nghiệm được duyệt' : 'Lịch xét nghiệm bị từ chối';
            message = status === 2 
                ? 'Lịch xét nghiệm của bạn đã được duyệt. Vui lòng thanh toán và đến cơ sở y tế đúng giờ hẹn.'
                : 'Lịch xét nghiệm của bạn đã bị từ chối. Vui lòng liên hệ để biết thêm chi tiết.';
        }
        
        notification = {
            id: `NOTIF_MGR_${Date.now()}`,
            type: `${type}-update`,
            title: title,
            message: message,
            timestamp: new Date().toISOString(),
            read: false,
            requestId: requestId,
            requiresPayment: status === 2,
            amount: type === 'appointment' ? 500000 : getTestPrice(requestId)
        };
        
        const existingNotifications = JSON.parse(localStorage.getItem('notifications') || '[]');
        existingNotifications.unshift(notification);
        localStorage.setItem('notifications', JSON.stringify(existingNotifications));
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const exportReport = () => {
        const reportData = {
            overview: stats,
            appointments: appointments,
            testOrders: testOrders,
            exportDate: new Date().toISOString()
        };
        
        const dataStr = JSON.stringify(reportData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `healthcare-report-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);
    };

    const completeTestOrder = (testId) => {
        const test = testOrders.find(t => t.id === testId);
        if (!test) return;

        // Random kết quả (70% tốt, 30% xấu)
        const isGoodResult = Math.random() < 0.7;
        const resultType = isGoodResult ? 'good' : 'bad';
        const testResultData = testResults[test.testType] || testResults['blood-test'];
        const selectedResult = testResultData[resultType];

        // Tạo URL kết quả giả lập
        const resultUrl = `https://hospital-results.com/test/${test.id}/result.pdf`;

        const updatedTestOrders = testOrders.map(t => 
            t.id === testId 
                ? { 
                    ...t, 
                    status: 4, // Chờ bác sĩ xem xét
                    testResult: resultUrl,
                    testResultData: selectedResult,
                    testCompletedAt: new Date().toISOString(),
                    resultType: resultType
                }
                : t
        );
        setTestOrders(updatedTestOrders);
        localStorage.setItem('testOrders', JSON.stringify(updatedTestOrders));
        
        const resultStatus = isGoodResult ? 'tốt' : 'cần chú ý';
        alert(`Đã hoàn thành xét nghiệm! Kết quả ${resultStatus}. Chờ bác sĩ xem xét chi tiết.`);
    };

    const filteredAppointments = appointments.filter(apt => 
        apt.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.phone?.includes(searchTerm)
    );

    const filteredTestOrders = testOrders.filter(test => 
        test.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        test.phone?.includes(searchTerm)
    );

    const tabs = [
        { id: 'overview', label: 'Tổng quan', icon: faChartBar },
        { id: 'statistics', label: 'Thống kê & Báo cáo', icon: faChartLine },
        { id: 'approvals', label: 'Xét duyệt yêu cầu', icon: faCheck },
        { id: 'blogs', label: 'Quản lý Blog', icon: faNewspaper },
        { id: 'ratings', label: 'Xem đánh giá', icon: faStar, isLink: true, href: '/ratings' },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            Bảng điều khiển Quản lý
                        </h1>
                        <p className="text-gray-600">
                            Quản lý hệ thống, xét duyệt yêu cầu và theo dõi doanh thu
                        </p>
                    </div>
                    <button
                        onClick={exportReport}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                    >
                        <FontAwesomeIcon icon={faDownload} />
                        Xuất báo cáo
                    </button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-lg shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Tổng lịch hẹn</p>
                                <p className="text-2xl font-bold text-blue-600">{stats.totalAppointments}</p>
                            </div>
                            <FontAwesomeIcon icon={faCalendarAlt} className="text-3xl text-blue-500" />
                        </div>
                    </div>
                    
                    <div className="bg-white p-6 rounded-lg shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Tổng xét nghiệm</p>
                                <p className="text-2xl font-bold text-purple-600">{stats.totalTests}</p>
                            </div>
                            <FontAwesomeIcon icon={faFlask} className="text-3xl text-purple-500" />
                        </div>
                    </div>
                    
                    <div className="bg-white p-6 rounded-lg shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Chờ duyệt</p>
                                <p className="text-2xl font-bold text-yellow-600">{stats.pendingApprovals}</p>
                            </div>
                            <FontAwesomeIcon icon={faCheck} className="text-3xl text-yellow-500" />
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="mb-6">
                    <div className="border-b border-gray-200">
                        <nav className="-mb-px flex space-x-8">
                            {tabs.map(tab => 
                                tab.isLink ? (
                                    <a
                                        key={tab.id}
                                        href={tab.href}
                                        className="py-2 px-1 border-b-2 font-medium text-sm border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                    >
                                        <FontAwesomeIcon icon={tab.icon} className="mr-2" />
                                        {tab.label}
                                    </a>
                                ) : (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`py-2 px-1 border-b-2 font-medium text-sm ${
                                            activeTab === tab.id
                                                ? 'border-blue-500 text-blue-600'
                                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }`}
                                    >
                                        <FontAwesomeIcon icon={tab.icon} className="mr-2" />
                                        {tab.label}
                                    </button>
                                )
                            )}
                        </nav>
                    </div>
                </div>

                {/* Content */}
                {activeTab === 'overview' && (
                    <DashboardOverview />
                )}

                {activeTab === 'approvals' && (
                    <div className="space-y-6">
                        {/* Search */}
                        <div className="bg-white p-4 rounded-lg shadow">
                            <div className="relative">
                                <FontAwesomeIcon 
                                    icon={faSearch} 
                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
                                />
                                <input
                                    type="text"
                                    placeholder="Tìm kiếm theo tên hoặc số điện thoại..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        {/* Pending Appointments */}
                        <div className="bg-white rounded-lg shadow">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Lịch hẹn chờ duyệt ({filteredAppointments.filter(apt => apt.status === 1).length})
                                </h3>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Bệnh nhân
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Loại tư vấn
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Ngày đặt
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Thao tác
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {filteredAppointments
                                            .filter(apt => apt.status === 1)
                                            .map((appointment) => (
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
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                                        <button
                                                            onClick={() => updateStatus(appointment.id, 2, 'appointment')}
                                                            className="text-green-600 hover:text-green-900"
                                                        >
                                                            <FontAwesomeIcon icon={faCheck} /> Duyệt
                                                        </button>
                                                        <button
                                                            onClick={() => updateStatus(appointment.id, 0, 'appointment')}
                                                            className="text-red-600 hover:text-red-900"
                                                        >
                                                            <FontAwesomeIcon icon={faTimes} /> Từ chối
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Pending Test Orders */}
                        <div className="bg-white rounded-lg shadow">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Lịch xét nghiệm chờ duyệt ({filteredTestOrders.filter(test => test.status === 1).length})
                                </h3>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Bệnh nhân
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Loại xét nghiệm
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Ngày đặt
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Thao tác
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {filteredTestOrders
                                            .filter(test => test.status === 1)
                                            .map((test) => (
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
                                                        {test.testType}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {formatDate(test.timestamp)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                                        <button
                                                            onClick={() => updateStatus(test.id, 2, 'test')}
                                                            className="text-green-600 hover:text-green-900"
                                                        >
                                                            <FontAwesomeIcon icon={faCheck} /> Duyệt
                                                        </button>
                                                        <button
                                                            onClick={() => updateStatus(test.id, 0, 'test')}
                                                            className="text-red-600 hover:text-red-900"
                                                        >
                                                            <FontAwesomeIcon icon={faTimes} /> Từ chối
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Test Orders in Progress */}
                        <div className="bg-white rounded-lg shadow">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Xét nghiệm đang thực hiện ({filteredTestOrders.filter(test => test.status === 3).length})
                                </h3>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Bệnh nhân
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Loại xét nghiệm
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Ngày đặt
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Kết quả
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Thao tác
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {filteredTestOrders
                                            .filter(test => test.status === 3)
                                            .map((test) => (
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
                                                        {test.testType}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {formatDate(test.timestamp)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {test.testResultData ? (
                                                            <span className={`text-sm ${test.resultType === 'good' ? 'text-green-600' : 'text-orange-600'}`}>
                                                                ✓ {test.resultType === 'good' ? 'Kết quả tốt' : 'Cần chú ý'}
                                                            </span>
                                                        ) : (
                                                            <span className="text-gray-500">Chưa có</span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                                        {!test.testResultData && (
                                                            <button
                                                                onClick={() => completeTestOrder(test.id)}
                                                                className="text-green-600 hover:text-green-900"
                                                            >
                                                                <FontAwesomeIcon icon={faCheck} /> Hoàn thành XN
                                                            </button>
                                                        )}
                                                        {test.testResultData && (
                                                            <span className="text-green-600">
                                                                <FontAwesomeIcon icon={faCheck} /> Đã hoàn thành
                                                            </span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'blogs' && (
                    <BlogManagement />
                )}

                {activeTab === 'statistics' && (
                    <StatisticsCharts />
                )}
            </div>
            
            <Footer />
        </div>
    );
}

export default ManagerDashboard;
