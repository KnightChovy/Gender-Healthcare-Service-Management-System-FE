import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faNotesMedical } from '@fortawesome/free-solid-svg-icons';

function MedicalInfoSection({ formData, onChange }) {
    return (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-100">
            <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center mr-3">
                    <FontAwesomeIcon icon={faNotesMedical} className="text-white text-lg" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Thông Tin Y Tế</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label htmlFor="medicalHistory" className="block text-sm font-medium text-gray-700">Tiền sử bệnh lý</label>
                    <textarea
                        id="medicalHistory"
                        name="medicalHistory"
                        value={formData.medicalHistory}
                        onChange={(e) => onChange(e.target.name, e.target.value)}
                        placeholder="Mô tả các bệnh lý đã từng mắc (nếu có)"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none"
                        rows={3}
                    />
                    <div className="text-xs text-gray-400 text-right">
                        {formData.medicalHistory?.length || 0}/500
                    </div>
                </div>

                <div className="space-y-2">
                    <label htmlFor="currentMedications" className="block text-sm font-medium text-gray-700">Thuốc đang sử dụng</label>
                    <textarea
                        id="currentMedications"
                        name="currentMedications"
                        value={formData.currentMedications}
                        onChange={(e) => onChange(e.target.name, e.target.value)}
                        placeholder="Liệt kê các loại thuốc đang sử dụng (nếu có)"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none"
                        rows={3}
                    />
                    <div className="text-xs text-gray-400 text-right">
                        {formData.currentMedications?.length || 0}/500
                    </div>
                </div>

                <div className="space-y-2 md:col-span-2">
                    <label htmlFor="note" className="block text-sm font-medium text-gray-700">Ghi chú thêm</label>
                    <textarea
                        id="note"
                        name="note"
                        value={formData.note}
                        onChange={(e) => onChange(e.target.name, e.target.value)}
                        placeholder="Ghi chú thêm về yêu cầu xét nghiệm"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none"
                        rows={3}
                    />
                    <div className="text-xs text-gray-400 text-right">
                        {formData.note?.length || 0}/300
                    </div>
                </div>
            </div>

            {/* Helper Text */}
            <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-teal-50 rounded-lg border border-green-200">
                <div className="flex items-start space-x-2">
                    <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <div className="text-sm text-gray-700">
                        <p className="font-medium text-green-700 mb-1">Thông tin y tế:</p>
                        <ul className="space-y-1 text-gray-600">
                            <li>• Thông tin này giúp bác sĩ đưa ra lời khuyên chính xác hơn</li>
                            <li>• Vui lòng cung cấp thông tin đầy đủ và chính xác</li>
                            <li>• Thông tin được bảo mật tuyệt đối theo quy định</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

MedicalInfoSection.propTypes = {
    formData: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
};

export default MedicalInfoSection;
