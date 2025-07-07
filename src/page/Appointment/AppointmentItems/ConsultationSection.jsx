import React from 'react'

function ConsultationSection({ formData, errors, onChange }) {
    const consultationTypes = [
        { value: 'Khám phụ khoa', label: 'Khám phụ khoa', icon: '🩺' },
        { value: 'Tư vấn chu kỳ kinh nguyệt', label: 'Tư vấn chu kỳ kinh nguyệt', icon: '📅' },
        { value: 'Tư vấn tránh thai', label: 'Tư vấn tránh thai', icon: '💊' },
        { value: 'Tư vấn thai kỳ', label: 'Tư vấn thai kỳ', icon: '🤰' },
        { value: 'Tư vấn sinh sản', label: 'Tư vấn sinh sản', icon: '👨‍👩‍👧‍👦' },
        { value: 'Tư vấn chung', label: 'Tư vấn chung', icon: '💭' }
    ];

    return (  
        <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
                🩺 Loại tư vấn <span className="text-red-500">*</span>
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {consultationTypes.map(type => (
                    <label
                        key={type.value}
                        className={`relative rounded-lg border p-4 cursor-pointer focus:outline-none transition-all duration-200 ${
                            formData.consultationType === type.value
                                ? 'border-blue-500 ring-2 ring-blue-500 bg-blue-50'
                                : 'border-gray-300 hover:border-gray-400'
                        }`}
                    >
                        <input
                            type="radio"
                            name="consultationType"
                            value={type.value}
                            checked={formData.consultationType === type.value}
                            onChange={onChange}
                            className="sr-only"
                        />
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <span className="text-2xl">{type.icon}</span>
                            </div>
                            <div className="ml-3">
                                <span className={`block text-sm font-medium ${
                                    formData.consultationType === type.value ? 'text-blue-900' : 'text-gray-900'
                                }`}>
                                    {type.label}
                                </span>
                            </div>
                        </div>
                    </label>
                ))}
            </div>
            {errors.consultationType && (
                <p className="mt-2 text-sm text-red-600">{errors.consultationType}</p>
            )}
        </div>
    );
}

export default ConsultationSection;
