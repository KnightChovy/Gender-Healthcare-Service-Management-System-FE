import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faPlus, faMinus, faSave, faSearch } from '@fortawesome/free-solid-svg-icons';
import { medicines, prescriptionTemplates } from '../data/medicines';

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

    const handleSave = () => {
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

        onSavePrescription(prescription);
        onClose();
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
                                Đơn thuốc mẫu
                            </label>
                            <select
                                value={selectedTemplate}
                                onChange={(e) => {
                                    setSelectedTemplate(e.target.value);
                                    if (e.target.value) applyTemplate(e.target.value);
                                }}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Chọn đơn thuốc mẫu</option>
                                {Object.entries(prescriptionTemplates).map(([key, template]) => (
                                    <option key={key} value={key}>
                                        {template.condition}
                                    </option>
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
                                <FontAwesomeIcon icon={faSave} />
                                Lưu đơn thuốc
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrescriptionModal;
