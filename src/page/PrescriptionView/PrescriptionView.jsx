import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faPrescriptionBottle, 
    faCalendarAlt, 
    faUser,
    faSpinner,
    faTimes,
    faFilePdf,
    faPrint
} from '@fortawesome/free-solid-svg-icons';
import Navbar from '../../Layouts/LayoutHomePage/Navbar';
import { Footer } from '../../Layouts/LayoutHomePage/Footer';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const PrescriptionView = () => {
    const [prescriptions, setPrescriptions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedPrescription, setSelectedPrescription] = useState(null);
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
                JSON.parse(storedUserData); // Validate user data
                loadUserPrescriptions();
            } catch (error) {
                console.error('Error parsing user data:', error);
                navigate('/login');
            }
        };

        checkAuthAndLoadData();
    }, [navigate]);

    const loadUserPrescriptions = () => {
        try {
            const allPrescriptions = JSON.parse(localStorage.getItem('prescriptions') || '[]');
            // In real app, filter by userId. For demo, show all for current user
            setPrescriptions(allPrescriptions);
        } catch (error) {
            console.error('Error loading prescriptions:', error);
        } finally {
            setIsLoading(false);
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

    const handleCloseDetails = () => {
        setSelectedPrescription(null);
    };

    const printPrescription = (prescription) => {
        const printWindow = window.open('', '_blank');
        const printContent = `
            <html>
                <head>
                    <title>Đơn thuốc - ${prescription.patientName}</title>
                    <style>
                        body { font-family: Arial, sans-serif; margin: 20px; }
                        .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 20px; }
                        .patient-info { margin-bottom: 20px; }
                        .medicine-list { margin-bottom: 20px; }
                        .medicine-item { border: 1px solid #ddd; margin: 10px 0; padding: 10px; }
                        .footer { margin-top: 30px; text-align: right; }
                        @media print { body { margin: 0; } }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <h1>PHÒNG KHÁM CHUYÊN KHOA PHỤ NỮ MEDICARE</h1>
                        <p>Địa chỉ: 456 Nguyễn Thị Minh Khai, Quận 1, TP. Hồ Chí Minh</p>
                        <p>Điện thoại: (028) 3925-7890 | Email: info@medicarewomen.vn</p>
                        <h2>ĐƠN THUỐC</h2>
                    </div>
                    
                    <div class="patient-info">
                        <p><strong>Bệnh nhân:</strong> ${prescription.patientName}</p>
                        <p><strong>Bác sĩ kê đơn:</strong> ${prescription.doctorName}</p>
                        <p><strong>Ngày kê đơn:</strong> ${formatDate(prescription.createdAt)}</p>
                        <p><strong>Mã đơn thuốc:</strong> #${prescription.id?.slice(-8) || 'N/A'}</p>
                    </div>
                    
                    <div class="medicine-list">
                        <h3>Danh sách thuốc:</h3>
                        ${prescription.medicines.map((medicine, index) => `
                            <div class="medicine-item">
                                <h4>${index + 1}. ${medicine.name}</h4>
                                ${medicine.genericName ? `<p><em>Hoạt chất: ${medicine.genericName}</em></p>` : ''}
                                <p><strong>Liều dùng:</strong> ${medicine.dosage}</p>
                                <p><strong>Thời gian:</strong> ${medicine.duration}</p>
                                ${medicine.notes ? `<p><strong>Ghi chú:</strong> ${medicine.notes}</p>` : ''}
                            </div>
                        `).join('')}
                    </div>
                    
                    ${prescription.generalAdvice ? `
                        <div class="advice">
                            <h3>Lời khuyên:</h3>
                            <p>${prescription.generalAdvice}</p>
                        </div>
                    ` : ''}
                    
                    <div class="footer">
                        <p><strong>Bác sĩ kê đơn</strong></p>
                        <br><br>
                        <p>${prescription.doctorName}</p>
                    </div>
                </body>
            </html>
        `;
        
        printWindow.document.open();
        printWindow.document.body.innerHTML = printContent;
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
    };

    const downloadPrescriptionPDF = async (prescription) => {
        try {
            console.log('Starting HTML-to-PDF generation for:', prescription);
            
            // Validate prescription data
            if (!prescription?.medicines?.length) {
                throw new Error('Dữ liệu đơn thuốc không hợp lệ');
            }
            
            // Tạo HTML content cho PDF (giống như trong PrescriptionModal)
            const htmlContent = `
                <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 800px; margin: 0 auto;">
                    <!-- Header -->
                    <div style="text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 20px;">
                        <h1 style="margin: 0; font-size: 24px; color: #333;">PHÒNG KHÁM CHUYÊN KHOA PHỤ NỮ MEDICARE</h1>
                        <p style="margin: 5px 0; font-size: 14px;">Địa chỉ: 456 Nguyễn Thị Minh Khai, Quận 1, TP. Hồ Chí Minh</p>
                        <p style="margin: 5px 0; font-size: 14px;">Điện thoại: (028) 3925-7890 | Email: info@medicarewomen.vn</p>
                        <h2 style="margin: 15px 0 0 0; font-size: 20px; color: #2563eb;">ĐƠN THUỐC</h2>
                    </div>
                    
                    <!-- Patient Info -->
                    <div style="margin-bottom: 20px;">
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr>
                                <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold; background-color: #f9fafb; width: 30%;">Bệnh nhân:</td>
                                <td style="padding: 8px; border: 1px solid #ddd;">${prescription.patientName || 'N/A'}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold; background-color: #f9fafb;">Bác sĩ kê đơn:</td>
                                <td style="padding: 8px; border: 1px solid #ddd;">${prescription.doctorName || 'N/A'}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold; background-color: #f9fafb;">Ngày kê đơn:</td>
                                <td style="padding: 8px; border: 1px solid #ddd;">${formatDate(prescription.createdAt)}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold; background-color: #f9fafb;">Mã đơn thuốc:</td>
                                <td style="padding: 8px; border: 1px solid #ddd;">#${prescription.id?.slice(-8) || 'N/A'}</td>
                            </tr>
                        </table>
                    </div>
                    
                    <!-- Medicines -->
                    <div style="margin-bottom: 20px;">
                        <h3 style="color: #333; margin-bottom: 15px;">DANH SÁCH THUỐC:</h3>
                        <table style="width: 100%; border-collapse: collapse;">
                            <thead>
                                <tr style="background-color: #2563eb; color: white;">
                                    <th style="padding: 12px; border: 1px solid #ddd; text-align: center; width: 8%;">STT</th>
                                    <th style="padding: 12px; border: 1px solid #ddd; text-align: left; width: 30%;">Tên thuốc</th>
                                    <th style="padding: 12px; border: 1px solid #ddd; text-align: left; width: 25%;">Liều dùng</th>
                                    <th style="padding: 12px; border: 1px solid #ddd; text-align: left; width: 20%;">Thời gian</th>
                                    <th style="padding: 12px; border: 1px solid #ddd; text-align: left; width: 17%;">Ghi chú</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${prescription.medicines.map((medicine, index) => `
                                    <tr style="background-color: ${index % 2 === 0 ? '#f9fafb' : 'white'};">
                                        <td style="padding: 10px; border: 1px solid #ddd; text-align: center;">${index + 1}</td>
                                        <td style="padding: 10px; border: 1px solid #ddd;">
                                            <strong>${medicine.name || 'N/A'}</strong>
                                            ${medicine.genericName ? `<br><em style="color: #666; font-size: 12px;">(${medicine.genericName})</em>` : ''}
                                        </td>
                                        <td style="padding: 10px; border: 1px solid #ddd;">${medicine.dosage || ''}</td>
                                        <td style="padding: 10px; border: 1px solid #ddd;">${medicine.duration || ''}</td>
                                        <td style="padding: 10px; border: 1px solid #ddd;">${medicine.notes || ''}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                    
                    ${prescription.generalAdvice ? `
                        <!-- General Advice -->
                        <div style="margin-bottom: 30px;">
                            <h3 style="color: #333; margin-bottom: 10px;">LỜI KHUYÊN TỪ BÁC SĨ:</h3>
                            <div style="background-color: #dbeafe; padding: 15px; border-radius: 8px; border-left: 4px solid #2563eb;">
                                <p style="margin: 0; line-height: 1.6;">${prescription.generalAdvice}</p>
                            </div>
                        </div>
                    ` : ''}
                    
                    <!-- Doctor Signature -->
                    <div style="display: flex; justify-content: space-between; margin-top: 40px;">
                        <div style="flex: 1;"></div>
                        <div style="text-align: center; flex: 1;">
                            <p style="margin: 0; font-weight: bold;">Bác sĩ kê đơn</p>
                            <div style="height: 60px;"></div>
                            <p style="margin: 0; font-weight: bold;">${prescription.doctorName || 'N/A'}</p>
                            <p style="margin: 5px 0 0 0; font-size: 12px; font-style: italic;">(Chữ ký và đóng dấu)</p>
                        </div>
                    </div>
                    
                    <!-- Footer -->
                    <div style="margin-top: 40px; text-align: center; font-size: 12px; color: #666; font-style: italic;">
                        <p style="margin: 5px 0;">Lưu ý: Đơn thuốc này chỉ có giá trị khi có chữ ký và con dấu của bác sĩ</p>
                        <p style="margin: 5px 0;">Hotline tư vấn: (028) 3925-7890 | Website: www.medicarewomen.vn</p>
                    </div>
                </div>
            `;
            
            // Tạo temporary element để render HTML
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = htmlContent;
            tempDiv.style.position = 'absolute';
            tempDiv.style.left = '-9999px';
            tempDiv.style.top = '-9999px';
            tempDiv.style.width = '800px';
            document.body.appendChild(tempDiv);
            
            console.log('HTML content created and appended');
            
            // Convert HTML to canvas
            const canvas = await html2canvas(tempDiv, {
                scale: 2,
                useCORS: true,
                allowTaint: true,
                backgroundColor: '#ffffff',
                width: 800,
                height: tempDiv.scrollHeight
            });
            
            console.log('Canvas created');
            
            // Remove temporary element
            document.body.removeChild(tempDiv);
            
            // Create PDF
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            
            const imgWidth = 210; // A4 width in mm
            const pageHeight = 295; // A4 height in mm
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            let heightLeft = imgHeight;
            let position = 0;
            
            // Add first page
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
            
            // Add additional pages if needed
            while (heightLeft >= 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }
            
            // Save PDF
            const safeName = (prescription.patientName || 'Unknown').replace(/[^a-zA-Z0-9_]/g, '_');
            const fileName = `Don_thuoc_${safeName}_${new Date().toISOString().slice(0, 10)}.pdf`;
            pdf.save(fileName);
            
            console.log('PDF saved successfully');
            
        } catch (error) {
            console.error('Error generating PDF:', error);
            
            let errorMessage = 'Có lỗi xảy ra khi tạo file PDF. ';
            if (error.message) {
                errorMessage += error.message;
            } else {
                errorMessage += 'Vui lòng thử lại.';
            }
            
            alert(errorMessage);
        }
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
                        <div className="flex justify-between items-center">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                    Đơn thuốc của tôi
                                </h1>
                                <p className="text-gray-600">
                                    Xem và quản lý tất cả các đơn thuốc được kê bởi bác sĩ
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Prescription List */}
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        {prescriptions.length === 0 ? (
                            <div className="text-center py-12">
                                <FontAwesomeIcon icon={faPrescriptionBottle} className="text-4xl text-gray-400 mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    Chưa có đơn thuốc nào
                                </h3>
                                <p className="text-gray-500 mb-4">
                                    Bạn chưa có đơn thuốc nào được kê bởi bác sĩ.
                                </p>
                                <button
                                    onClick={() => navigate('/appointment')}
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                                >
                                    Đặt lịch tư vấn
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
                                                Bác sĩ kê đơn
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Ngày kê đơn
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Số lượng thuốc
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Hành động
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {prescriptions.map((prescription) => (
                                            <tr key={prescription.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 h-10 w-10">
                                                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                                                <FontAwesomeIcon icon={faPrescriptionBottle} className="text-blue-600" />
                                                            </div>
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900">
                                                                Đơn thuốc #{prescription.id.slice(-6)}
                                                            </div>
                                                            <div className="text-sm text-gray-500">
                                                                {prescription.patientName}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <FontAwesomeIcon icon={faUser} className="text-gray-400 mr-2" />
                                                        <span className="text-sm text-gray-900">{prescription.doctorName}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <FontAwesomeIcon icon={faCalendarAlt} className="text-gray-400 mr-2" />
                                                        <span className="text-sm text-gray-900">{formatDate(prescription.createdAt)}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {prescription.medicines.length} loại thuốc
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                                    <button
                                                        onClick={() => downloadPrescriptionPDF(prescription)}
                                                        className="text-red-600 hover:text-red-900"
                                                    >
                                                        <FontAwesomeIcon icon={faFilePdf} /> PDF
                                                    </button>
                                                    <button
                                                        onClick={() => printPrescription(prescription)}
                                                        className="text-green-600 hover:text-green-900"
                                                    >
                                                        <FontAwesomeIcon icon={faPrint} /> In
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Prescription Details Modal */}
            {selectedPrescription && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <h2 className="text-xl font-semibold text-gray-900">
                                Chi tiết đơn thuốc
                            </h2>
                            <button
                                onClick={handleCloseDetails}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <FontAwesomeIcon icon={faTimes} className="w-6 h-6" />
                            </button>
                        </div>
                        
                        <div className="p-6 overflow-y-auto">
                            {/* Basic Info */}
                            <div className="mb-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-3">Thông tin cơ bản</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Bệnh nhân</label>
                                        <p className="mt-1 text-sm text-gray-900">{selectedPrescription.patientName}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Bác sĩ kê đơn</label>
                                        <p className="mt-1 text-sm text-gray-900">{selectedPrescription.doctorName}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Ngày kê đơn</label>
                                        <p className="mt-1 text-sm text-gray-900">{formatDate(selectedPrescription.createdAt)}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Trạng thái</label>
                                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                            Đang có hiệu lực
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Medicines */}
                            <div className="mb-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-3">Danh sách thuốc</h3>
                                <div className="space-y-4">
                                    {selectedPrescription.medicines.map((medicine, index) => (
                                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                                            <h4 className="font-medium text-gray-900 mb-2">
                                                {index + 1}. {medicine.name}
                                            </h4>
                                            {medicine.genericName && (
                                                <p className="text-sm text-gray-600 mb-1">
                                                    <em>Hoạt chất: {medicine.genericName}</em>
                                                </p>
                                            )}
                                            <div className="grid grid-cols-2 gap-4 mt-3">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">Liều dùng</label>
                                                    <p className="mt-1 text-sm text-gray-900">{medicine.dosage}</p>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">Thời gian</label>
                                                    <p className="mt-1 text-sm text-gray-900">{medicine.duration}</p>
                                                </div>
                                            </div>
                                            {medicine.notes && (
                                                <div className="mt-3">
                                                    <label className="block text-sm font-medium text-gray-700">Ghi chú</label>
                                                    <p className="mt-1 text-sm text-gray-900">{medicine.notes}</p>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* General Advice */}
                            {selectedPrescription.generalAdvice && (
                                <div className="mb-6">
                                    <h3 className="text-lg font-medium text-gray-900 mb-3">Lời khuyên từ bác sĩ</h3>
                                    <div className="bg-blue-50 rounded-lg p-4">
                                        <p className="text-sm text-gray-900">{selectedPrescription.generalAdvice}</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end space-x-3 p-6 border-t bg-gray-50">
                            <button
                                onClick={handleCloseDetails}
                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                            >
                                Đóng
                            </button>
                            <button
                                onClick={() => downloadPrescriptionPDF(selectedPrescription)}
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center gap-2"
                            >
                                <FontAwesomeIcon icon={faFilePdf} />
                                Tải PDF
                            </button>
                            <button
                                onClick={() => printPrescription(selectedPrescription)}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
                            >
                                <FontAwesomeIcon icon={faPrint} />
                                In đơn thuốc
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            <Footer />
        </div>
    );
};

export default PrescriptionView;
