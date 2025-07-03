import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faPlus, faMinus, faPrint, faSearch } from '@fortawesome/free-solid-svg-icons';
import { medicines, prescriptionTemplates } from '../data/medicines';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const PrescriptionModal = ({ isOpen, onClose, patient, onSavePrescription }) => {
    const [selectedMedicines, setSelectedMedicines] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [customMedicine, setCustomMedicine] = useState({
        name: '',
        dosage: '',
        duration: '',
        notes: ''
    });
    const [generalAdvice, setGeneralAdvice] = useState('');
    const [selectedTemplate, setSelectedTemplate] = useState('');

    if (!isOpen || !patient) return null;

    const filteredMedicines = Object.values(medicines).filter(medicine =>
        medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        medicine.genericName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const addMedicine = (medicine) => {
        if (!selectedMedicines.find(m => m.id === medicine.id)) {
            setSelectedMedicines([...selectedMedicines, {
                ...medicine,
                prescriptionId: Date.now(),
                dosage: medicine.dosage?.adult || '1 viên x 2 lần/ngày',
                duration: '5-7 ngày',
                notes: ''
            }]);
        }
    };

    const addCustomMedicine = () => {
        if (customMedicine.name.trim()) {
            setSelectedMedicines([...selectedMedicines, {
                id: `custom_${Date.now()}`,
                prescriptionId: Date.now(),
                name: customMedicine.name,
                dosage: customMedicine.dosage,
                duration: customMedicine.duration,
                notes: customMedicine.notes,
                isCustom: true
            }]);
            setCustomMedicine({ name: '', dosage: '', duration: '', notes: '' });
        }
    };

    const removeMedicine = (prescriptionId) => {
        setSelectedMedicines(selectedMedicines.filter(m => m.prescriptionId !== prescriptionId));
    };

    const updateMedicineField = (prescriptionId, field, value) => {
        setSelectedMedicines(selectedMedicines.map(medicine =>
            medicine.prescriptionId === prescriptionId
                ? { ...medicine, [field]: value }
                : medicine
        ));
    };

    const getRelevantTemplates = () => {
        if (!patient || !patient.testType) return [];
        
        const testType = patient.testType;
        const relevantTemplates = [];
        
        // Đơn thuốc theo loại xét nghiệm
        switch (testType) {
            case 'blood-test':
                relevantTemplates.push(
                    { key: 'blood-test-anemia', label: '🩸 Thiếu máu' },
                    { key: 'blood-test-infection', label: '🩸 Nhiễm khuẩn' },
                    { key: 'blood-test-diabetes', label: '🩸 Đái tháo đường' },
                    { key: 'blood-test-thyroid', label: '🩸 Rối loạn tuyến giáp' }
                );
                break;
            case 'urine-test':
                relevantTemplates.push(
                    { key: 'urine-test-uti', label: '💧 Nhiễm khuẩn đường tiết niệu' },
                    { key: 'urine-test-kidney', label: '💧 Rối loạn chức năng thận' }
                );
                break;
            case 'hormone-test':
                relevantTemplates.push(
                    { key: 'hormone-test-thyroid', label: '🔬 Rối loạn tuyến giáp' },
                    { key: 'hormone-test-menopause', label: '🔬 Tiền mãn kinh/Mãn kinh' }
                );
                break;
            case 'pregnancy-test':
                relevantTemplates.push(
                    { key: 'pregnancy-test-prenatal', label: '🤱 Hỗ trợ thai kỳ' }
                );
                break;
            case 'std-test':
                relevantTemplates.push(
                    { key: 'std-test-chlamydia', label: '🔬 Nhiễm Chlamydia' },
                    { key: 'std-test-trichomoniasis', label: '🔬 Nhiễm Trichomonas' },
                    { key: 'std-test-candida', label: '🔬 Nhiễm nấm Candida' }
                );
                break;
            case 'fertility-test':
                relevantTemplates.push(
                    { key: 'fertility-test-low-hormone', label: '🌸 Rối loạn hormone sinh sản' },
                    { key: 'fertility-test-pcos', label: '🌸 Hội chứng buồng trứng đa nang' }
                );
                break;
            case 'cancer-screening':
                relevantTemplates.push(
                    { key: 'cancer-screening-support', label: '🎗️ Hỗ trợ sau tầm soát' }
                );
                break;
            case 'genetic-test':
                relevantTemplates.push(
                    { key: 'genetic-test-counseling', label: '🧬 Tư vấn di truyền' }
                );
                break;
            default:
                // Các template chung
                break;
        }
        
        // Thêm divider nếu có template chuyên khoa
        if (relevantTemplates.length > 0) {
            relevantTemplates.push({ key: 'divider', label: '─────────────────' });
        }
        
        // Thêm các template chung
        relevantTemplates.push(
            { key: 'common-cold', label: '😷 Cảm lạnh thông thường' },
            { key: 'bacterial-infection', label: '🦠 Nhiễm khuẩn chung' },
            { key: 'anemia', label: '🩸 Thiếu máu chung' },
            { key: 'gastritis', label: '🔥 Viêm dạ dày' }
        );
        
        return relevantTemplates;
    };

    const applyTemplate = (templateKey) => {
        const template = prescriptionTemplates[templateKey];
        if (template) {
            const templateMedicines = template.medicines.map(item => ({
                ...item.medicine,
                prescriptionId: Date.now() + Math.random(),
                dosage: item.dosage,
                duration: item.duration,
                notes: item.notes
            }));
            setSelectedMedicines(templateMedicines);
            setGeneralAdvice(template.advice);
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

    const generatePrescriptionPDF = async (prescription) => {
        try {
            console.log('Starting HTML-to-PDF generation...');
            
            // Tạo HTML content cho PDF
            const htmlContent = `
                <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 800px; margin: 0 auto;">
                    <!-- Header -->
                    <div style="text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 20px;">
                        <h1 style="margin: 0; font-size: 24px; color: #333;">PHÒNG KHÁM ĐA KHOA ABC</h1>
                        <p style="margin: 5px 0; font-size: 14px;">Địa chỉ: 123 Đường ABC, Quận XYZ, TP. Hồ Chí Minh</p>
                        <p style="margin: 5px 0; font-size: 14px;">Điện thoại: (028) 1234-5678 | Email: info@phongkhamabc.vn</p>
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
                        <p style="margin: 5px 0;">Hotline tư vấn: (028) 1234-5678 | Website: www.phongkhamabc.vn</p>
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
            return fileName;
            
        } catch (error) {
            console.error('Error generating PDF:', error);
            
            let errorMessage = 'Có lỗi xảy ra khi tạo file PDF. ';
            if (error.message) {
                errorMessage += error.message;
            } else {
                errorMessage += 'Vui lòng thử lại.';
            }
            
            alert(errorMessage);
            return null;
        }
    };

    const handleSave = async () => {
        if (selectedMedicines.length === 0) {
            alert('Vui lòng thêm ít nhất một loại thuốc');
            return;
        }

        const prescription = {
            id: `PRESC_${Date.now()}`,
            patientId: patient.id,
            patientName: patient.fullName,
            doctorId: 'DOCTOR_001', // In real app, get from auth
            doctorName: 'BS. Nguyễn Văn A',
            createdAt: new Date().toISOString(),
            medicines: selectedMedicines,
            generalAdvice: generalAdvice,
            status: 'active'
        };

        // Tạo và tải xuống file PDF
        const fileName = await generatePrescriptionPDF(prescription);
        
        if (fileName) {
            // Lưu thông tin đơn thuốc vào localStorage để user có thể xem
            onSavePrescription(prescription);
            
            alert(`Đã tạo và tải xuống đơn thuốc: ${fileName}\nBạn có thể upload file này lên hệ thống.`);
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">
                            Kê đơn thuốc
                        </h2>
                        <p className="text-sm text-gray-600 mt-1">
                            Bệnh nhân: {patient.fullName} - SĐT: {patient.phone}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <FontAwesomeIcon icon={faTimes} className="w-6 h-6" />
                    </button>
                </div>

                <div className="flex h-[calc(90vh-80px)]">
                    {/* Left Panel - Medicine Library */}
                    <div className="w-1/2 border-r border-gray-200 p-6 overflow-y-auto">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Thư viện thuốc</h3>
                        
                        {/* Templates */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Đơn thuốc mẫu {patient?.testType && `(Phù hợp với ${patient.testType})`}
                            </label>
                            <select
                                value={selectedTemplate}
                                onChange={(e) => {
                                    if (e.target.value === 'divider') return; // Ignore divider
                                    setSelectedTemplate(e.target.value);
                                    if (e.target.value) applyTemplate(e.target.value);
                                }}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Chọn đơn thuốc mẫu</option>
                                {/* Hiển thị template phù hợp với loại xét nghiệm trước */}
                                {getRelevantTemplates().map(({ key, label }) => (
                                    key === 'divider' ? (
                                        <option key={key} disabled style={{ color: '#9CA3AF', fontSize: '12px' }}>
                                            {label}
                                        </option>
                                    ) : (
                                        <option key={key} value={key}>
                                            {label}
                                        </option>
                                    )
                                ))}
                            </select>
                        </div>

                        {/* Search */}
                        <div className="mb-4">
                            <div className="relative">
                                <FontAwesomeIcon 
                                    icon={faSearch} 
                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
                                />
                                <input
                                    type="text"
                                    placeholder="Tìm thuốc..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        {/* Medicine List */}
                        <div className="space-y-2 mb-6">
                            {filteredMedicines.map((medicine) => (
                                <div key={medicine.id} className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50">
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <h4 className="font-medium text-gray-900">{medicine.name}</h4>
                                            <p className="text-sm text-gray-600">{medicine.genericName} - {medicine.strength}</p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {medicine.indications.join(', ')}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => addMedicine(medicine)}
                                            className="ml-3 text-blue-600 hover:text-blue-800"
                                        >
                                            <FontAwesomeIcon icon={faPlus} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Custom Medicine */}
                        <div className="border-t pt-4">
                            <h4 className="font-medium text-gray-900 mb-3">Thêm thuốc tùy chỉnh</h4>
                            <div className="space-y-3">
                                <input
                                    type="text"
                                    placeholder="Tên thuốc"
                                    value={customMedicine.name}
                                    onChange={(e) => setCustomMedicine({...customMedicine, name: e.target.value})}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <input
                                    type="text"
                                    placeholder="Liều dùng (VD: 1 viên x 2 lần/ngày)"
                                    value={customMedicine.dosage}
                                    onChange={(e) => setCustomMedicine({...customMedicine, dosage: e.target.value})}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <input
                                    type="text"
                                    placeholder="Thời gian (VD: 5-7 ngày)"
                                    value={customMedicine.duration}
                                    onChange={(e) => setCustomMedicine({...customMedicine, duration: e.target.value})}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <input
                                    type="text"
                                    placeholder="Ghi chú"
                                    value={customMedicine.notes}
                                    onChange={(e) => setCustomMedicine({...customMedicine, notes: e.target.value})}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <button
                                    onClick={addCustomMedicine}
                                    className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 flex items-center justify-center gap-2"
                                >
                                    <FontAwesomeIcon icon={faPlus} />
                                    Thêm thuốc
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Panel - Prescription */}
                    <div className="w-1/2 p-6 overflow-y-auto">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Đơn thuốc</h3>
                        
                        {/* Selected Medicines */}
                        <div className="space-y-4 mb-6">
                            {selectedMedicines.map((medicine) => (
                                <div key={medicine.prescriptionId} className="border border-gray-200 rounded-lg p-4">
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <h4 className="font-medium text-gray-900">{medicine.name}</h4>
                                            {!medicine.isCustom && (
                                                <p className="text-sm text-gray-600">{medicine.genericName} - {medicine.strength}</p>
                                            )}
                                        </div>
                                        <button
                                            onClick={() => removeMedicine(medicine.prescriptionId)}
                                            className="text-red-600 hover:text-red-800"
                                        >
                                            <FontAwesomeIcon icon={faMinus} />
                                        </button>
                                    </div>
                                    
                                    <div className="space-y-3">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Liều dùng
                                            </label>
                                            <input
                                                type="text"
                                                value={medicine.dosage}
                                                onChange={(e) => updateMedicineField(medicine.prescriptionId, 'dosage', e.target.value)}
                                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="VD: 1 viên x 2 lần/ngày"
                                            />
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Thời gian
                                            </label>
                                            <input
                                                type="text"
                                                value={medicine.duration}
                                                onChange={(e) => updateMedicineField(medicine.prescriptionId, 'duration', e.target.value)}
                                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="VD: 5-7 ngày"
                                            />
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Ghi chú
                                            </label>
                                            <input
                                                type="text"
                                                value={medicine.notes}
                                                onChange={(e) => updateMedicineField(medicine.prescriptionId, 'notes', e.target.value)}
                                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="VD: Uống sau ăn"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                            
                            {selectedMedicines.length === 0 && (
                                <div className="text-center py-8 text-gray-500">
                                    Chưa có thuốc nào được chọn
                                </div>
                            )}
                        </div>

                        {/* General Advice */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Lời khuyên chung
                            </label>
                            <textarea
                                value={generalAdvice}
                                onChange={(e) => setGeneralAdvice(e.target.value)}
                                rows={4}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Nhập lời khuyên và hướng dẫn cho bệnh nhân..."
                            />
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end space-x-3 pt-4 border-t">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleSave}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
                            >
                                <FontAwesomeIcon icon={faPrint} />
                                In đơn thuốc
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrescriptionModal;
