import React from 'react'

function AdditionalInfoSection({ formData, onChange }) {
    return (  
        <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
                📝 Thông tin bổ sung
            </h3>
            
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-3">
                    <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
                        Mức độ ưu tiên
                    </label>
                    <select
                        id="priority"
                        name="priority"
                        value={formData.priority}
                        onChange={onChange}
                        className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                        <option value="normal">Bình thường</option>
                        <option value="urgent">Khẩn cấp</option>
                    </select>
                </div>

                <div className="sm:col-span-6">
                    <label htmlFor="symptoms" className="block text-sm font-medium text-gray-700">
                        Triệu chứng/Lý do khám
                    </label>
                    <textarea
                        id="symptoms"
                        name="symptoms"
                        value={formData.symptoms}
                        onChange={onChange}
                        placeholder="Mô tả các triệu chứng hoặc lý do bạn muốn tư vấn..."
                        rows="4"
                        className="mt-1 p-2 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                </div>

                <div className="sm:col-span-6">
                    <label htmlFor="medicalHistory" className="block text-sm font-medium text-gray-700">
                        Tiền sử bệnh (nếu có)
                    </label>
                    <textarea
                        id="medicalHistory"
                        name="medicalHistory"
                        value={formData.medicalHistory}
                        onChange={onChange}
                        placeholder="Vui lòng liệt kê các bệnh lý, tiền sử dị ứng, thông tin thuốc đang sử dụng hoặc các vấn đề sức khỏe khác mà bạn nghĩ rằng chúng tôi nên biết."
                        rows="3"
                        className="mt-1 p-2 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                </div>

                <div className="sm:col-span-6">
                    <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                        Ghi chú thêm
                    </label>
                    <textarea
                        id="notes"
                        name="notes"
                        value={formData.notes}
                        onChange={onChange}
                        placeholder="Yêu cầu đặc biệt hoặc thông tin bổ sung..."
                        rows="3"
                        className="mt-1 p-2 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                </div>
            </div>
        </div>
    );
}

export default AdditionalInfoSection;
