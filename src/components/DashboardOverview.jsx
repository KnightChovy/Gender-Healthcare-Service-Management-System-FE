import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faCalendarAlt, 
    faFlask, 
    faUsers,
    faDollarSign,
    faChartLine,
    faArrowUp,
    faArrowDown,
    faFileDownload
} from '@fortawesome/free-solid-svg-icons';

const DashboardOverview = () => {
    const [selectedPeriod, setSelectedPeriod] = useState('month');

    const calculateStatistics = () => {
        const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
        const testOrders = JSON.parse(localStorage.getItem('testOrders') || '[]');
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        
        const appointmentPrice = 500000;
        const testPrice = 300000;
        
        const totalRevenue = [...appointments, ...testOrders]
            .filter(item => item.status >= 3)
            .reduce((sum, item) => sum + (item.testType ? testPrice : appointmentPrice), 0);
        
        const completedAppointments = appointments.filter(a => a.status >= 4).length;
        const completedTests = testOrders.filter(t => t.status >= 4).length;
        const totalUsers = users.length;
        
        const currentMonth = new Date().getMonth();
        const lastMonth = currentMonth - 1;
        
        const currentMonthRevenue = [...appointments, ...testOrders]
            .filter(item => {
                const itemDate = new Date(item.timestamp);
                return item.status >= 3 && itemDate.getMonth() === currentMonth;
            })
            .reduce((sum, item) => sum + (item.testType ? testPrice : appointmentPrice), 0);
        
        const lastMonthRevenue = [...appointments, ...testOrders]
            .filter(item => {
                const itemDate = new Date(item.timestamp);
                return item.status >= 3 && itemDate.getMonth() === lastMonth;
            })
            .reduce((sum, item) => sum + (item.testType ? testPrice : appointmentPrice), 0);
        
        const revenueGrowth = lastMonthRevenue > 0 
            ? ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue * 100).toFixed(1)
            : 0;
        
        const completionRate = ([...appointments, ...testOrders].length > 0)
            ? ((completedAppointments + completedTests) / [...appointments, ...testOrders].length * 100).toFixed(1)
            : 0;
        
        return {
            totalRevenue,
            totalUsers,
            completedAppointments,
            completedTests,
            revenueGrowth: parseFloat(revenueGrowth),
            completionRate: parseFloat(completionRate),
            currentMonthRevenue,
            lastMonthRevenue
        };
    };

    const stats = calculateStatistics();

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            minimumFractionDigits: 0
        }).format(amount);
    };

    const exportSummary = () => {
        const data = {
            timestamp: new Date().toLocaleString('vi-VN'),
            statistics: stats,
            period: selectedPeriod
        };
        
        const dataStr = JSON.stringify(data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `dashboard-summary-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Tổng quan Dashboard</h2>
                <div className="flex gap-4">
                    <select
                        value={selectedPeriod}
                        onChange={(e) => setSelectedPeriod(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg"
                    >
                        <option value="week">Tuần này</option>
                        <option value="month">Tháng này</option>
                        <option value="quarter">Quý này</option>
                        <option value="year">Năm này</option>
                    </select>
                    <button
                        onClick={exportSummary}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2"
                    >
                        <FontAwesomeIcon icon={faFileDownload} />
                        Xuất tóm tắt
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-lg text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-blue-100 text-sm">Tổng doanh thu</p>
                            <p className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</p>
                            <div className="flex items-center mt-2">
                                <FontAwesomeIcon 
                                    icon={stats.revenueGrowth >= 0 ? faArrowUp : faArrowDown} 
                                    className="mr-1" 
                                />
                                <span className="text-sm">
                                    {stats.revenueGrowth >= 0 ? '+' : ''}{stats.revenueGrowth}% so với tháng trước
                                </span>
                            </div>
                        </div>
                        <FontAwesomeIcon icon={faDollarSign} className="text-3xl text-blue-200" />
                    </div>
                </div>

                <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-lg text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-green-100 text-sm">Tổng người dùng</p>
                            <p className="text-2xl font-bold">{stats.totalUsers}</p>
                            <p className="text-sm text-green-100 mt-2">Đang hoạt động</p>
                        </div>
                        <FontAwesomeIcon icon={faUsers} className="text-3xl text-green-200" />
                    </div>
                </div>

                <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-lg text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-purple-100 text-sm">Lịch hẹn hoàn thành</p>
                            <p className="text-2xl font-bold">{stats.completedAppointments}</p>
                            <p className="text-sm text-purple-100 mt-2">Tư vấn đã hoàn thành</p>
                        </div>
                        <FontAwesomeIcon icon={faCalendarAlt} className="text-3xl text-purple-200" />
                    </div>
                </div>

                <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 p-6 rounded-lg text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-yellow-100 text-sm">Xét nghiệm hoàn thành</p>
                            <p className="text-2xl font-bold">{stats.completedTests}</p>
                            <p className="text-sm text-yellow-100 mt-2">Đã có kết quả</p>
                        </div>
                        <FontAwesomeIcon icon={faFlask} className="text-3xl text-yellow-200" />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Hiệu suất tháng này</h3>
                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm text-gray-600">Tỷ lệ hoàn thành</span>
                                <span className="text-sm font-medium">{stats.completionRate}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${stats.completionRate}%` }}
                                ></div>
                            </div>
                        </div>
                        
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm text-gray-600">Doanh thu tháng này</span>
                                <span className="text-sm font-medium">{formatCurrency(stats.currentMonthRevenue)}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                                    style={{ 
                                        width: `${Math.min((stats.currentMonthRevenue / (stats.totalRevenue || 1)) * 100, 100)}%` 
                                    }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin nhanh</h3>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <span className="text-sm text-gray-600">Tổng số dịch vụ</span>
                            <span className="font-medium">{stats.completedAppointments + stats.completedTests}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <span className="text-sm text-gray-600">Doanh thu trung bình/dịch vụ</span>
                            <span className="font-medium">
                                {formatCurrency(stats.totalRevenue / (stats.completedAppointments + stats.completedTests || 1))}
                            </span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <span className="text-sm text-gray-600">Tăng trưởng</span>
                            <span className={`font-medium ${stats.revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {stats.revenueGrowth >= 0 ? '+' : ''}{stats.revenueGrowth}%
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Xu hướng doanh thu</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 border rounded-lg">
                        <p className="text-2xl font-bold text-blue-600">{formatCurrency(stats.currentMonthRevenue)}</p>
                        <p className="text-sm text-gray-600">Tháng này</p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                        <p className="text-2xl font-bold text-gray-600">{formatCurrency(stats.lastMonthRevenue)}</p>
                        <p className="text-sm text-gray-600">Tháng trước</p>
                    </div>
                </div>
                <div className="mt-4 flex items-center justify-center">
                    <FontAwesomeIcon 
                        icon={faChartLine} 
                        className="mr-2 text-blue-500" 
                    />
                    <span className="text-sm text-gray-600">
                        {stats.revenueGrowth >= 0 ? 'Tăng' : 'Giảm'} {Math.abs(stats.revenueGrowth)}% so với tháng trước
                    </span>
                </div>
            </div>
        </div>
    );
};

export default DashboardOverview;
