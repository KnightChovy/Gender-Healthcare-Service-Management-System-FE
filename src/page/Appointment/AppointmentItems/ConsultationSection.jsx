import React from 'react'

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
        <div className="form-section">
            <h3>🩺 Loại tư vấn</h3>
            <div className="consultation-grid">
                {consultationTypes.map(type => (
                    <label 
                        key={type.value} 
                        className={`consultation-card ${formData.consultationType === type.value ? 'selected' : ''}`}
                        aria-label={type.label}
                    >
                        <input
                            type="radio"
                            name="consultationType"
                            value={type.value}
                            checked={formData.consultationType === type.value}
                            onChange={onChange}
                        />
                        <div className="card-content">
                            <span className="card-icon">{type.icon}</span>
                            <span className="card-label">{type.label}</span>
                        </div>
                    </label>
                ))}
            </div>
            {errors.consultationType && <span className="error-message">{errors.consultationType}</span>}
        </div>
    );
}

export default ConsultationSection;