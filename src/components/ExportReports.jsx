import React from 'react';
import * as XLSX from 'xlsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileExcel, faFileDownload } from '@fortawesome/free-solid-svg-icons';

const ExportReports = () => {
    const exportToExcel = () => {
        const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
        const testOrders = JSON.parse(localStorage.getItem('testOrders') || '[]');
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const ratings = JSON.parse(localStorage.getItem('ratings') || '[]');
        
        // Create workbook
        const wb = XLSX.utils.book_new();
        
        // Sheet 1: Overview Summary
        const summaryData = [
            ['BÁO CÁO TỔNG QUAN HỆ THỐNG'],
            [''],
            ['Thời gian xuất báo cáo:', new Date().toLocaleString('vi-VN')],
            [''],
            ['THỐNG KÊ TỔNG QUAN'],
            ['Tổng số lịch hẹn:', appointments.length],
            ['Tổng số xét nghiệm:', testOrders.length],
            ['Tổng số người dùng:', users.length],
            ['Tổng số đánh giá:', ratings.length],
            [''],
            ['DOANH THU'],
            ['Doanh thu từ lịch hẹn:', appointments.filter(a => a.status >= 3).length * 500000],
            ['Doanh thu từ xét nghiệm:', testOrders.filter(t => t.status >= 3).length * 300000],
            ['Tổng doanh thu:', (appointments.filter(a => a.status >= 3).length * 500000) + (testOrders.filter(t => t.status >= 3).length * 300000)],
            [''],
            ['TỶ LỆ HOÀN THÀNH'],
            ['Lịch hẹn hoàn thành:', `${appointments.filter(a => a.status >= 4).length}/${appointments.length}`],
            ['Xét nghiệm hoàn thành:', `${testOrders.filter(t => t.status >= 4).length}/${testOrders.length}`],
        ];
        
        const summaryWS = XLSX.utils.aoa_to_sheet(summaryData);
        XLSX.utils.book_append_sheet(wb, summaryWS, 'Tổng quan');
        
        // Sheet 2: Appointments Details
        const appointmentData = [
            ['ID', 'Họ tên', 'Số điện thoại', 'Email', 'Loại tư vấn', 'Ngày hẹn', 'Giờ hẹn', 'Trạng thái', 'Ngày tạo']
        ];
        
        appointments.forEach(apt => {
            appointmentData.push([
                apt.id,
                apt.fullName,
                apt.phone,
                apt.email,
                apt.consultationType,
                apt.appointmentDate,
                apt.appointmentTime,
                getStatusText(apt.status, 'appointment'),
                new Date(apt.timestamp).toLocaleString('vi-VN')
            ]);
        });
        
        const appointmentWS = XLSX.utils.aoa_to_sheet(appointmentData);
        XLSX.utils.book_append_sheet(wb, appointmentWS, 'Lịch hẹn');
        
        // Sheet 3: Test Orders Details
        const testData = [
            ['ID', 'Họ tên', 'Số điện thoại', 'Email', 'Loại xét nghiệm', 'Ngày hẹn', 'Giờ hẹn', 'Trạng thái', 'Ngày tạo']
        ];
        
        testOrders.forEach(test => {
            testData.push([
                test.id,
                test.fullName,
                test.phone,
                test.email,
                test.testType,
                test.appointmentDate,
                test.appointmentTime,
                getStatusText(test.status, 'test'),
                new Date(test.timestamp).toLocaleString('vi-VN')
            ]);
        });
        
        const testWS = XLSX.utils.aoa_to_sheet(testData);
        XLSX.utils.book_append_sheet(wb, testWS, 'Xét nghiệm');
        
        // Sheet 4: Revenue by Month
        const revenueByMonth = {};
        [...appointments, ...testOrders].forEach(item => {
            if (item.status >= 3) {
                const date = new Date(item.timestamp);
                const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                if (!revenueByMonth[monthKey]) {
                    revenueByMonth[monthKey] = { appointments: 0, tests: 0, total: 0 };
                }
                
                if (item.testType) {
                    revenueByMonth[monthKey].tests += 300000;
                } else {
                    revenueByMonth[monthKey].appointments += 500000;
                }
                revenueByMonth[monthKey].total = revenueByMonth[monthKey].appointments + revenueByMonth[monthKey].tests;
            }
        });
        
        const revenueData = [
            ['Tháng', 'Doanh thu lịch hẹn', 'Doanh thu xét nghiệm', 'Tổng doanh thu']
        ];
        
        Object.entries(revenueByMonth).forEach(([month, data]) => {
            revenueData.push([
                month,
                data.appointments,
                data.tests,
                data.total
            ]);
        });
        
        const revenueWS = XLSX.utils.aoa_to_sheet(revenueData);
        XLSX.utils.book_append_sheet(wb, revenueWS, 'Doanh thu theo tháng');
        
        // Sheet 5: Ratings Summary
        const ratingsData = [
            ['ID', 'Tên khách hàng', 'Loại dịch vụ', 'Điểm đánh giá', 'Bình luận', 'Ngày đánh giá']
        ];
        
        ratings.forEach(rating => {
            ratingsData.push([
                rating.id,
                rating.customerName,
                rating.serviceType === 'appointment' ? 'Lịch hẹn' : 'Xét nghiệm',
                rating.rating,
                rating.comment,
                new Date(rating.timestamp).toLocaleString('vi-VN')
            ]);
        });
        
        const ratingsWS = XLSX.utils.aoa_to_sheet(ratingsData);
        XLSX.utils.book_append_sheet(wb, ratingsWS, 'Đánh giá');
        
        // Export file
        XLSX.writeFile(wb, `bao-cao-chi-tiet-${new Date().toISOString().split('T')[0]}.xlsx`);
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

    const exportQuickSummary = () => {
        const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
        const testOrders = JSON.parse(localStorage.getItem('testOrders') || '[]');
        
        const summary = {
            exportDate: new Date().toLocaleString('vi-VN'),
            totalAppointments: appointments.length,
            totalTests: testOrders.length,
            completedAppointments: appointments.filter(a => a.status >= 4).length,
            completedTests: testOrders.filter(t => t.status >= 4).length,
            totalRevenue: (appointments.filter(a => a.status >= 3).length * 500000) + (testOrders.filter(t => t.status >= 3).length * 300000),
            pendingApprovals: appointments.filter(a => a.status === 1).length + testOrders.filter(t => t.status === 1).length
        };
        
        const dataStr = JSON.stringify(summary, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `tom-tat-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Xuất báo cáo
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                    onClick={exportToExcel}
                    className="flex items-center justify-center gap-3 p-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                    <FontAwesomeIcon icon={faFileExcel} className="text-2xl" />
                    <div className="text-left">
                        <div className="font-medium">Xuất Excel chi tiết</div>
                        <div className="text-sm opacity-90">Tất cả dữ liệu trong nhiều sheet</div>
                    </div>
                </button>
                
                <button
                    onClick={exportQuickSummary}
                    className="flex items-center justify-center gap-3 p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <FontAwesomeIcon icon={faFileDownload} className="text-2xl" />
                    <div className="text-left">
                        <div className="font-medium">Xuất tóm tắt JSON</div>
                        <div className="text-sm opacity-90">Thống kê nhanh định dạng JSON</div>
                    </div>
                </button>
            </div>
            
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Nội dung báo cáo Excel bao gồm:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Tổng quan hệ thống và thống kê chính</li>
                    <li>• Chi tiết danh sách lịch hẹn</li>
                    <li>• Chi tiết danh sách xét nghiệm</li>
                    <li>• Doanh thu phân tích theo tháng</li>
                    <li>• Tổng hợp đánh giá của khách hàng</li>
                </ul>
            </div>
        </div>
    );
};

export default ExportReports;
