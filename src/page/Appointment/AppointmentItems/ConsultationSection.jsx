import React from 'react';
import PropTypes from 'prop-types';

function ConsultationSection({ formData, errors, onChange }) {
    const consultationTypes = [
        { value: 'gynecology', label: 'Khám phụ khoa', icon: '🩺' },
        { value: 'menstrual', label: 'Tư vấn chu kỳ kinh nguyệt', icon: '📅' },
        { value: 'contraception', label: 'Tư vấn tránh thai', icon: '💊' },
        { value: 'pregnancy', label: 'Tư vấn thai kỳ', icon: '🤱' },
        { value: 'fertility', label: 'Tư vấn sinh sản', icon: '👶' },
        { value: 'general', label: 'Tư vấn chung', icon: '💬' }
    ];

    return (  
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h3 className="text-xl font-bold text-blue-600 mb-6 flex items-center gap-2">
                🩺 Loại tư vấn
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {consultationTypes.map(type => (
                    <label
                        key={type.value}
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:border-blue-500 hover:shadow-md ${
                            formData.consultationType === type.value 
                                ? 'border-blue-500 bg-blue-50 shadow-md' 
                                : 'border-gray-300 bg-white'
                        }`}
                        aria-label={type.label}
                    >
                        <input
                            type="radio"
                            name="consultationType"
                            value={type.value}
                            checked={formData.consultationType === type.value}
                            onChange={onChange}
                            className="sr-only"
                        />
                        <div className="flex flex-col items-center text-center space-y-2">
                            <span className="text-2xl">{type.icon}</span>
                            <span className="text-sm font-medium text-gray-700">{type.label}</span>
                        </div>
                    </label>
                ))}
            </div>
            {errors.consultationType && <span className="text-red-500 text-sm font-medium mt-2 block">{errors.consultationType}</span>}
        </div>
    );
}

ConsultationSection.propTypes = {
    formData: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
};

export default ConsultationSection;