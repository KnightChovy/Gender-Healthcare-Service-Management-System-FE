import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileAlt, faExclamationTriangle, faStethoscope, faStickyNote } from '@fortawesome/free-solid-svg-icons';

function AdditionalInfoSection({ formData, onChange }) {
    return (  
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-100">
            {/* Section Header */}
            <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center mr-3">
                    <FontAwesomeIcon icon={faFileAlt} className="text-white text-lg" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Thông tin bổ sung</h3>
            </div>
            
            <div className="space-y-6">
                {/* Priority Selection */}
                <div className="space-y-2">
                    <label 
                        htmlFor="priority" 
                        className="flex items-center text-sm font-semibold text-gray-700 mb-2"
                    >
                        <FontAwesomeIcon icon={faExclamationTriangle} className="text-amber-500 mr-2" />
                        Mức độ ưu tiên
                    </label>
                    <select
                        id="priority"
                        name="priority"
                        value={formData.priority}
                        onChange={onChange}
                        className="w-full px-4 py-3 border border-gray-300 bg-white rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 hover:border-green-400"
                    >
                        <option value="normal">🟢 Bình thường</option>
                        <option value="urgent">🟡 Khẩn cấp</option>
                        <option value="high">🔴 Cao</option>
                    </select>
                </div>

                {/* Symptoms Section */}
                <div className="space-y-2">
                    <label 
                        htmlFor="symptoms" 
                        className="flex items-center text-sm font-semibold text-gray-700 mb-2"
                    >
                        <FontAwesomeIcon icon={faStethoscope} className="text-blue-500 mr-2" />
                        Triệu chứng/Lý do khám
                    </label>
                    <div className="relative">
                        <textarea
                            id="symptoms"
                            name="symptoms"
                            value={formData.symptoms}
                            onChange={onChange}
                            placeholder="Mô tả các triệu chứng hoặc lý do bạn muốn tư vấn..."
                            rows="4"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-blue-400 resize-none"
                        />
                        <div className="absolute bottom-2 right-2 text-xs text-gray-400">
                            {formData.symptoms?.length || 0}/500
                        </div>
                    </div>
                </div>

                {/* Notes Section */}
                <div className="space-y-2">
                    <label 
                        htmlFor="notes" 
                        className="flex items-center text-sm font-semibold text-gray-700 mb-2"
                    >
                        <FontAwesomeIcon icon={faStickyNote} className="text-purple-500 mr-2" />
                        Ghi chú thêm
                    </label>
                    <div className="relative">
                        <textarea
                            id="notes"
                            name="notes"
                            value={formData.notes}
                            onChange={onChange}
                            placeholder="Yêu cầu đặc biệt hoặc thông tin bổ sung..."
                            rows="3"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 hover:border-purple-400 resize-none"
                        />
                        <div className="absolute bottom-2 right-2 text-xs text-gray-400">
                            {formData.notes?.length || 0}/300
                        </div>
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
                        <p className="font-medium text-green-700 mb-1">Gợi ý:</p>
                        <ul className="space-y-1 text-gray-600">
                            <li>• Mô tả chi tiết triệu chứng để bác sĩ tư vấn chính xác hơn</li>
                            <li>• Ghi rõ thời gian xuất hiện và mức độ nghiêm trọng</li>
                            <li>• Thông tin này sẽ được bảo mật tuyệt đối</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdditionalInfoSection;