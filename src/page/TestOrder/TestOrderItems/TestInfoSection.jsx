import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons';

function TestInfoSection({ formData, errors, onChange, testTypes }) {
    return (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-100">
            <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mr-3">
                    <FontAwesomeIcon icon={faCalendarAlt} className="text-white text-lg" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Thông Tin Xét Nghiệm</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 md:col-span-2">
                    <label htmlFor="testType" className="block text-sm font-medium text-gray-700">Loại xét nghiệm *</label>
                    <select
                        id="testType"
                        name="testType"
                        value={formData.testType}
                        onChange={(e) => onChange(e.target.name, e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    >
                        <option value="">Chọn loại xét nghiệm</option>
                        {testTypes.map(test => (
                            <option key={test.value} value={test.value}>
                                {test.label}
                            </option>
                        ))}
                    </select>
                    {errors.testType && <span className="text-red-500 text-sm">{errors.testType}</span>}
                </div>

                <div className="space-y-2">
                    <label htmlFor="preferredDate" className="block text-sm font-medium text-gray-700">Ngày mong muốn *</label>
                    <input
                        id="preferredDate"
                        type="date"
                        name="preferredDate"
                        value={formData.preferredDate}
                        onChange={(e) => onChange(e.target.name, e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        min={new Date().toISOString().split('T')[0]}
                    />
                    {errors.preferredDate && <span className="text-red-500 text-sm">{errors.preferredDate}</span>}
                </div>

                <div className="space-y-2">
                    <label htmlFor="preferredTime" className="block text-sm font-medium text-gray-700">Giờ mong muốn *</label>
                    <select
                        id="preferredTime"
                        name="preferredTime"
                        value={formData.preferredTime}
                        onChange={(e) => onChange(e.target.name, e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    >
                        <option value="">Chọn giờ</option>
                        <option value="08:00">08:00</option>
                        <option value="08:30">08:30</option>
                        <option value="09:00">09:00</option>
                        <option value="09:30">09:30</option>
                        <option value="10:00">10:00</option>
                        <option value="10:30">10:30</option>
                        <option value="11:00">11:00</option>
                        <option value="11:30">11:30</option>
                        <option value="14:00">14:00</option>
                        <option value="14:30">14:30</option>
                        <option value="15:00">15:00</option>
                        <option value="15:30">15:30</option>
                        <option value="16:00">16:00</option>
                        <option value="16:30">16:30</option>
                    </select>
                    {errors.preferredTime && <span className="text-red-500 text-sm">{errors.preferredTime}</span>}
                </div>

                <div className="space-y-2">
                    <label htmlFor="healthInsurance" className="block text-sm font-medium text-gray-700">Bảo hiểm y tế</label>
                    <input
                        id="healthInsurance"
                        type="text"
                        name="healthInsurance"
                        value={formData.healthInsurance}
                        onChange={(e) => onChange(e.target.name, e.target.value)}
                        placeholder="Nhập số thẻ bảo hiểm y tế (nếu có)"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="priority" className="block text-sm font-medium text-gray-700">Độ ưu tiên</label>
                    <select
                        id="priority"
                        name="priority"
                        value={formData.priority}
                        onChange={(e) => onChange(e.target.name, e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    >
                        <option value="normal">🟢 Bình thường</option>
                        <option value="urgent">🟡 Khẩn cấp</option>
                        <option value="very-urgent">🔴 Rất khẩn cấp</option>
                    </select>
                </div>
            </div>

            {/* Helper Text */}
            <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                <div className="flex items-start space-x-2">
                    <svg className="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <div className="text-sm text-gray-700">
                        <p className="font-medium text-purple-700 mb-1">Lưu ý quan trọng:</p>
                        <ul className="space-y-1 text-gray-600">
                            <li>• Vui lòng nhịn ăn 8-12 tiếng trước khi làm xét nghiệm máu</li>
                            <li>• Mang theo thẻ bảo hiểm y tế (nếu có) khi đến làm xét nghiệm</li>
                            <li>• Đến trước 15 phút so với giờ hẹn để làm thủ tục</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

TestInfoSection.propTypes = {
    formData: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    testTypes: PropTypes.array.isRequired,
};

export default TestInfoSection;
