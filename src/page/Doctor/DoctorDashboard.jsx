import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faCalendarAlt, 
    faFlask, 
    faUser, 
    faUpload,
    faEye,
    faCheck,
    faTimes,
    faSearch,
    faVideo
} from '@fortawesome/free-solid-svg-icons';
import Navbar from '../../Layouts/LayoutHomePage/Navbar';
import { Footer } from '../../Layouts/LayoutHomePage/Footer';

function DoctorDashboard() {
    const [activeTab, setActiveTab] = useState('appointments');
    const [appointments, setAppointments] = useState([]);
    const [testOrders, setTestOrders] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = () => {
        // Load appointments and test orders from localStorage
        const storedAppointments = JSON.parse(localStorage.getItem('appointments') || '[]');
        const storedTestOrders = JSON.parse(localStorage.getItem('testOrders') || '[]');
        
        setAppointments(storedAppointments);
        setTestOrders(storedTestOrders);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 0: return 'text-red-600 bg-red-100';        // Rejected
            case 1: return 'text-yellow-600 bg-yellow-100';  // Pending
            case 2: return 'text-blue-600 bg-blue-100';      // Confirmed
            case 3: return 'text-green-600 bg-green-100';    // Confirmed & Paid
            case 4: return 'text-purple-600 bg-purple-100';  // Completed
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 0: return 'Đã từ chối';
            case 1: return 'Chờ duyệt';
            case 2: return 'Đã duyệt';
            case 3: return 'Đã thanh toán';
            case 4: return 'Hoàn thành';
            default: return 'Không xác định';
        }
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

    const updateStatus = (id, newStatus, type) => {
        if (type === 'appointment') {
            const updatedAppointments = appointments.map(apt => 
                apt.id === id ? { ...apt, status: newStatus } : apt
            );
            setAppointments(updatedAppointments);
            localStorage.setItem('appointments', JSON.stringify(updatedAppointments));
        } else {
            const updatedTestOrders = testOrders.map(test => 
                test.id === id ? { ...test, status: newStatus } : test
            );
            setTestOrders(updatedTestOrders);
            localStorage.setItem('testOrders', JSON.stringify(updatedTestOrders));
        }
    };

    const uploadTestResult = (testId) => {
        const result = prompt('Nhập kết quả xét nghiệm:');
        if (result) {
            const updatedTestOrders = testOrders.map(test => 
                test.id === testId 
                    ? { ...test, result: result, resultDate: new Date().toISOString() }
                    : test
            );
            setTestOrders(updatedTestOrders);
            localStorage.setItem('testOrders', JSON.stringify(updatedTestOrders));
            alert('Đã tải lên kết quả xét nghiệm thành công!');
        }
    };

    const viewPatientProfile = (patientData) => {
        setSelectedPatient(patientData);
    };

    const filteredAppointments = appointments.filter(apt => {
        const matchesSearch = apt.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            apt.phone?.includes(searchTerm);
        const matchesStatus = statusFilter === 'all' || apt.status.toString() === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const filteredTestOrders = testOrders.filter(test => {
        const matchesSearch = test.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            test.phone?.includes(searchTerm);
        const matchesStatus = statusFilter === 'all' || test.status.toString() === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const tabs = [
        { id: 'appointments', label: 'Lịch hẹn khám', icon: faCalendarAlt },
        { id: 'tests', label: 'Lịch xét nghiệm', icon: faFlask },
        { id: 'patients', label: 'Hồ sơ bệnh nhân', icon: faUser },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Bảng điều khiển Bác sĩ
                    </h1>
                    <p className="text-gray-600">
                        Quản lý lịch hẹn, xét nghiệm và hồ sơ bệnh nhân
                    </p>
                </div>

                {/* Tabs */}
                <div className="mb-6">
                    <div className="border-b border-gray-200">
                        <nav className="-mb-px flex space-x-8">
                            {tabs.map(tab => (
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
                            ))}
                        </nav>
                    </div>
                </div>

                {/* Search and Filter */}
                <div className="mb-6 flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
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
                    <div className="sm:w-48">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">Tất cả trạng thái</option>
                            <option value="1">Chờ xét duyệt</option>
                            <option value="2">Đã duyệt</option>
                            <option value="3">Đã hủy</option>
                        </select>
                    </div>
                </div>

                {/* Content */}
                {activeTab === 'appointments' && (
                    <div className="bg-white rounded-lg shadow">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-900">
                                Danh sách lịch hẹn khám ({filteredAppointments.length})
                            </h2>
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
                                            Ngày hẹn
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Trạng thái
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Thao tác
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredAppointments.map((appointment) => (
                                        <tr key={appointment.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {appointment.fullName}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {appointment.phone} • {appointment.email}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {appointment.consultationType}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {appointment.preferredDate} {appointment.preferredTime}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(appointment.status)}`}>
                                                    {getStatusText(appointment.status)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                                <button
                                                    onClick={() => viewPatientProfile(appointment)}
                                                    className="text-blue-600 hover:text-blue-900"
                                                >
                                                    <FontAwesomeIcon icon={faEye} /> Xem
                                                </button>
                                                {appointment.status === 3 && (
                                                    <>
                                                        <button
                                                            onClick={() => updateStatus(appointment.id, 4, 'appointment')}
                                                            className="text-purple-600 hover:text-purple-900"
                                                        >
                                                            <FontAwesomeIcon icon={faCheck} /> Hoàn thành
                                                        </button>
                                                        <a
                                                            href="https://meet.google.com/sqm-jpse-ovb"
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-blue-600 hover:text-blue-900 underline"
                                                        >
                                                            <FontAwesomeIcon icon={faVideo} /> Tham gia Meet
                                                        </a>
                                                    </>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'tests' && (
                    <div className="bg-white rounded-lg shadow">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-900">
                                Danh sách lịch xét nghiệm ({filteredTestOrders.length})
                            </h2>
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
                                            Ngày xét nghiệm
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Trạng thái
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Thao tác
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredTestOrders.map((test) => (
                                        <tr key={test.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {test.fullName}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {test.phone} • {test.email}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {test.testType}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {test.preferredDate} {test.preferredTime}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(test.status)}`}>
                                                    {getStatusText(test.status)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                                <button
                                                    onClick={() => viewPatientProfile(test)}
                                                    className="text-blue-600 hover:text-blue-900"
                                                >
                                                    <FontAwesomeIcon icon={faEye} /> Xem
                                                </button>
                                                {test.status === 3 && (
                                                    <button
                                                        onClick={() => uploadTestResult(test.id)}
                                                        className="text-purple-600 hover:text-purple-900"
                                                    >
                                                        <FontAwesomeIcon icon={faUpload} /> Tải kết quả
                                                    </button>
                                                )}
                                                {test.status === 3 && (
                                                    <button
                                                        onClick={() => updateStatus(test.id, 4, 'test')}
                                                        className="text-green-600 hover:text-green-900"
                                                    >
                                                        <FontAwesomeIcon icon={faCheck} /> Hoàn thành
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Patient Profile Modal */}
                {selectedPatient && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        Hồ sơ bệnh nhân
                                    </h3>
                                    <button
                                        onClick={() => setSelectedPatient(null)}
                                        className="text-gray-400 hover:text-gray-600"
                                    >
                                        <FontAwesomeIcon icon={faTimes} />
                                    </button>
                                </div>
                            </div>
                            <div className="px-6 py-4 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Họ tên</label>
                                        <p className="mt-1 text-sm text-gray-900">{selectedPatient.fullName}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Ngày sinh</label>
                                        <p className="mt-1 text-sm text-gray-900">{selectedPatient.birthDate}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Giới tính</label>
                                        <p className="mt-1 text-sm text-gray-900">{selectedPatient.gender}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Số điện thoại</label>
                                        <p className="mt-1 text-sm text-gray-900">{selectedPatient.phone}</p>
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium text-gray-700">Email</label>
                                        <p className="mt-1 text-sm text-gray-900">{selectedPatient.email}</p>
                                    </div>
                                </div>
                                
                                {selectedPatient.symptoms && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Triệu chứng</label>
                                        <p className="mt-1 text-sm text-gray-900">{selectedPatient.symptoms}</p>
                                    </div>
                                )}
                                
                                {selectedPatient.medicalHistory && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Tiền sử bệnh</label>
                                        <p className="mt-1 text-sm text-gray-900">{selectedPatient.medicalHistory}</p>
                                    </div>
                                )}
                                
                                {selectedPatient.currentMedications && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Thuốc đang dùng</label>
                                        <p className="mt-1 text-sm text-gray-900">{selectedPatient.currentMedications}</p>
                                    </div>
                                )}
                                
                                {selectedPatient.note && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Ghi chú</label>
                                        <p className="mt-1 text-sm text-gray-900">{selectedPatient.note}</p>
                                    </div>
                                )}
                                
                                {selectedPatient.result && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Kết quả xét nghiệm</label>
                                        <p className="mt-1 text-sm text-gray-900">{selectedPatient.result}</p>
                                        <p className="text-xs text-gray-500">
                                            Cập nhật: {formatDate(selectedPatient.resultDate)}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
            
            <Footer />
        </div>
    );
}

export default DoctorDashboard;
