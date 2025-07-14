import React, { useState, useRef } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    LineElement,
    PointElement,
    ArcElement,
} from 'chart.js';
import { Bar, Line, Pie } from 'react-chartjs-2';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';
import { saveAs } from 'file-saver';
import ActivityHeatmap from './ActivityHeatmap';
import ExportReports from './ExportReports';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    LineElement,
    PointElement,
    ArcElement
);

const StatisticsCharts = () => {
    const [timeRange, setTimeRange] = useState('month');
    const [isExporting, setIsExporting] = useState(false);
    const chartRefs = {
        revenue: useRef(null),
        users: useRef(null),
        services: useRef(null),
        appointments: useRef(null)
    };

    const generateRevenueData = () => {
        const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
        const testOrders = JSON.parse(localStorage.getItem('testOrders') || '[]');
        
        const appointmentPrice = 500000;
        const testPrice = 300000;
        
        const currentDate = new Date();
        const data = {};
        
        if (timeRange === 'month') {
            for (let i = 11; i >= 0; i--) {
                const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
                const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                data[monthKey] = 0;
            }
            
            [...appointments, ...testOrders].forEach(item => {
                if (item.status >= 3) {
                    const itemDate = new Date(item.timestamp);
                    const monthKey = `${itemDate.getFullYear()}-${String(itemDate.getMonth() + 1).padStart(2, '0')}`;
                    if (Object.hasOwn(data, monthKey)) {
                        const price = item.testType ? testPrice : appointmentPrice;
                        data[monthKey] += price;
                    }
                }
            });
        } else if (timeRange === 'week') {
            for (let i = 11; i >= 0; i--) {
                const date = new Date(currentDate);
                date.setDate(date.getDate() - (i * 7));
                const weekKey = `Tuần ${12 - i}`;
                data[weekKey] = 0;
            }
            
            [...appointments, ...testOrders].forEach(item => {
                if (item.status >= 3) {
                    const itemDate = new Date(item.timestamp);
                    const diffTime = currentDate - itemDate;
                    const diffWeeks = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7));
                    if (diffWeeks >= 0 && diffWeeks < 12) {
                        const weekKey = `Tuần ${12 - diffWeeks}`;
                        const price = item.testType ? testPrice : appointmentPrice;
                        data[weekKey] += price;
                    }
                }
            });
        }
        
        return {
            labels: Object.keys(data),
            datasets: [{
                label: 'Doanh thu (VNĐ)',
                data: Object.values(data),
                backgroundColor: 'rgba(59, 130, 246, 0.8)',
                borderColor: 'rgb(59, 130, 246)',
                borderWidth: 1
            }]
        };
    };

    const generateUserGrowthData = () => {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const currentDate = new Date();
        const data = {};
        
        if (timeRange === 'month') {
            for (let i = 11; i >= 0; i--) {
                const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
                const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                data[monthKey] = 0;
            }
            
            users.forEach(user => {
                if (user.createdAt) {
                    const userDate = new Date(user.createdAt);
                    const monthKey = `${userDate.getFullYear()}-${String(userDate.getMonth() + 1).padStart(2, '0')}`;
                    if (Object.hasOwn(data, monthKey)) {
                        data[monthKey]++;
                    }
                }
            });
        }
        
        const cumulativeData = [];
        let total = 0;
        Object.values(data).forEach(value => {
            total += value;
            cumulativeData.push(total);
        });
        
        return {
            labels: Object.keys(data),
            datasets: [{
                label: 'Tổng số người dùng',
                data: cumulativeData,
                borderColor: 'rgb(16, 185, 129)',
                backgroundColor: 'rgba(16, 185, 129, 0.2)',
                tension: 0.1,
                fill: true
            }, {
                label: 'Người dùng mới',
                data: Object.values(data),
                borderColor: 'rgb(239, 68, 68)',
                backgroundColor: 'rgba(239, 68, 68, 0.2)',
                tension: 0.1
            }]
        };
    };

    const generateServiceDistribution = () => {
        const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
        const testOrders = JSON.parse(localStorage.getItem('testOrders') || '[]');
        
        const appointmentCount = appointments.filter(a => a.status >= 3).length;
        const testCount = testOrders.filter(t => t.status >= 3).length;
        
        return {
            labels: ['Tư vấn trực tuyến', 'Xét nghiệm'],
            datasets: [{
                data: [appointmentCount, testCount],
                backgroundColor: [
                    'rgba(147, 51, 234, 0.8)',
                    'rgba(245, 158, 11, 0.8)'
                ],
                borderColor: [
                    'rgb(147, 51, 234)',
                    'rgb(245, 158, 11)'
                ],
                borderWidth: 1
            }]
        };
    };

    const generateAppointmentStatusData = () => {
        const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
        const testOrders = JSON.parse(localStorage.getItem('testOrders') || '[]');
        
        const statusCounts = {
            'Chờ duyệt': 0,
            'Đã duyệt': 0,
            'Đã thanh toán': 0,
            'Hoàn thành': 0,
            'Từ chối': 0
        };
        
        [...appointments, ...testOrders].forEach(item => {
            switch (item.status) {
                case 0: statusCounts['Từ chối']++; break;
                case 1: statusCounts['Chờ duyệt']++; break;
                case 2: statusCounts['Đã duyệt']++; break;
                case 3: statusCounts['Đã thanh toán']++; break;
                case 4:
                case 5: statusCounts['Hoàn thành']++; break;
            }
        });
        
        return {
            labels: Object.keys(statusCounts),
            datasets: [{
                label: 'Số lượng',
                data: Object.values(statusCounts),
                backgroundColor: [
                    'rgba(239, 68, 68, 0.8)',
                    'rgba(245, 158, 11, 0.8)',
                    'rgba(59, 130, 246, 0.8)',
                    'rgba(16, 185, 129, 0.8)',
                    'rgba(107, 114, 128, 0.8)'
                ]
            }]
        };
    };

    const exportToPDF = async () => {
        setIsExporting(true);
        const pdf = new jsPDF('p', 'mm', 'a4');
        
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(18);
        pdf.text('BÁO CÁO THỐNG KÊ HỆ THỐNG', 105, 20, { align: 'center' });
        
        pdf.setFontSize(12);
        pdf.text(`Thời gian xuất báo cáo: ${new Date().toLocaleString('vi-VN')}`, 20, 30);
        pdf.text(`Khoảng thời gian: ${timeRange === 'month' ? '12 tháng gần nhất' : '12 tuần gần nhất'}`, 20, 38);
        
        let yPosition = 50;
        
        for (const [key, ref] of Object.entries(chartRefs)) {
            if (ref.current) {
                try {
                    const canvas = await html2canvas(ref.current, {
                        backgroundColor: '#ffffff',
                        scale: 2
                    });
                    
                    const imgData = canvas.toDataURL('image/jpeg', 0.8);
                    const imgWidth = 170;
                    const imgHeight = (canvas.height * imgWidth) / canvas.width;
                    
                    if (yPosition + imgHeight > 280) {
                        pdf.addPage();
                        yPosition = 20;
                    }
                    
                    pdf.addImage(imgData, 'JPEG', 20, yPosition, imgWidth, imgHeight);
                    yPosition += imgHeight + 10;
                    
                } catch (error) {
                    console.error(`Error capturing ${key} chart:`, error);
                }
            }
        }
        
        const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
        const testOrders = JSON.parse(localStorage.getItem('testOrders') || '[]');
        const totalRevenue = [...appointments, ...testOrders]
            .filter(item => item.status >= 3)
            .reduce((sum, item) => sum + (item.testType ? 300000 : 500000), 0);
        
        pdf.addPage();
        pdf.setFontSize(16);
        pdf.text('TỔNG KẾT', 105, 30, { align: 'center' });
        
        pdf.setFontSize(12);
        const summary = [
            `• Tổng doanh thu: ${totalRevenue.toLocaleString('vi-VN')} VNĐ`,
            `• Tổng số lịch hẹn: ${appointments.length}`,
            `• Tổng số xét nghiệm: ${testOrders.length}`,
            `• Lịch hẹn hoàn thành: ${appointments.filter(a => a.status >= 4).length}`,
            `• Xét nghiệm hoàn thành: ${testOrders.filter(t => t.status >= 4).length}`,
            `• Tỷ lệ hoàn thành: ${(([...appointments, ...testOrders].filter(i => i.status >= 4).length / [...appointments, ...testOrders].length) * 100).toFixed(1)}%`
        ];
        
        summary.forEach((line, index) => {
            pdf.text(line, 20, 50 + (index * 8));
        });
        
        pdf.save(`bao-cao-thong-ke-${new Date().toISOString().split('T')[0]}.pdf`);
        setIsExporting(false);
    };

    const exportToWord = async () => {
        setIsExporting(true);
        
        const doc = new Document({
            sections: [{
                properties: {},
                children: [
                    new Paragraph({
                        text: "BÁO CÁO THỐNG KÊ HỆ THỐNG",
                        heading: HeadingLevel.HEADING_1,
                        alignment: 'center'
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: `Thời gian xuất báo cáo: ${new Date().toLocaleString('vi-VN')}`,
                                break: 1
                            }),
                            new TextRun({
                                text: `Khoảng thời gian: ${timeRange === 'month' ? '12 tháng gần nhất' : '12 tuần gần nhất'}`,
                                break: 1
                            })
                        ]
                    }),
                    new Paragraph({
                        text: "TỔNG KẾT",
                        heading: HeadingLevel.HEADING_2
                    })
                ]
            }]
        });

        const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
        const testOrders = JSON.parse(localStorage.getItem('testOrders') || '[]');
        const totalRevenue = [...appointments, ...testOrders]
            .filter(item => item.status >= 3)
            .reduce((sum, item) => sum + (item.testType ? 300000 : 500000), 0);

        const summary = [
            `Tổng doanh thu: ${totalRevenue.toLocaleString('vi-VN')} VNĐ`,
            `Tổng số lịch hẹn: ${appointments.length}`,
            `Tổng số xét nghiệm: ${testOrders.length}`,
            `Lịch hẹn hoàn thành: ${appointments.filter(a => a.status >= 4).length}`,
            `Xét nghiệm hoàn thành: ${testOrders.filter(t => t.status >= 4).length}`,
            `Tỷ lệ hoàn thành: ${(([...appointments, ...testOrders].filter(i => i.status >= 4).length / [...appointments, ...testOrders].length) * 100).toFixed(1)}%`
        ];

        summary.forEach(line => {
            doc.sections[0].children.push(
                new Paragraph({
                    children: [new TextRun(`• ${line}`)]
                })
            );
        });

        const buffer = await Packer.toBuffer(doc);
        saveAs(new Blob([buffer]), `bao-cao-thong-ke-${new Date().toISOString().split('T')[0]}.docx`);
        setIsExporting(false);
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top'
            },
            title: {
                display: true
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: function(value) {
                        const chart = this.chart;
                        if (chart.canvas.id.includes('revenue')) {
                            return new Intl.NumberFormat('vi-VN').format(value) + ' đ';
                        }
                        return value;
                    }
                }
            }
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Thống kê & Báo cáo</h2>
                <div className="flex gap-4">
                    <select
                        value={timeRange}
                        onChange={(e) => setTimeRange(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg"
                    >
                        <option value="month">Theo tháng</option>
                        <option value="week">Theo tuần</option>
                    </select>
                    <button
                        onClick={exportToPDF}
                        disabled={isExporting}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                    >
                        {isExporting ? 'Đang xuất...' : 'Xuất PDF'}
                    </button>
                    <button
                        onClick={exportToWord}
                        disabled={isExporting}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                        {isExporting ? 'Đang xuất...' : 'Xuất Word'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow" ref={chartRefs.revenue}>
                    <Bar
                        data={generateRevenueData()}
                        options={{
                            ...chartOptions,
                            plugins: {
                                ...chartOptions.plugins,
                                title: {
                                    display: true,
                                    text: 'Biểu đồ doanh thu'
                                }
                            }
                        }}
                    />
                </div>

                <div className="bg-white p-6 rounded-lg shadow" ref={chartRefs.users}>
                    <Line
                        data={generateUserGrowthData()}
                        options={{
                            ...chartOptions,
                            plugins: {
                                ...chartOptions.plugins,
                                title: {
                                    display: true,
                                    text: 'Biểu đồ tăng trưởng người dùng'
                                }
                            }
                        }}
                    />
                </div>

                <div className="bg-white p-6 rounded-lg shadow" ref={chartRefs.services}>
                    <Pie
                        data={generateServiceDistribution()}
                        options={{
                            responsive: true,
                            plugins: {
                                legend: {
                                    position: 'top'
                                },
                                title: {
                                    display: true,
                                    text: 'Phân bố dịch vụ'
                                }
                            }
                        }}
                    />
                </div>

                <div className="bg-white p-6 rounded-lg shadow" ref={chartRefs.appointments}>
                    <Bar
                        data={generateAppointmentStatusData()}
                        options={{
                            ...chartOptions,
                            plugins: {
                                ...chartOptions.plugins,
                                title: {
                                    display: true,
                                    text: 'Trạng thái đặt lịch'
                                }
                            }
                        }}
                    />
                </div>
            </div>

            <ActivityHeatmap />
            
            <ExportReports />
        </div>
    );
};

export default StatisticsCharts;
