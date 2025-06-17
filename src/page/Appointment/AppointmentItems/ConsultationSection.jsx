import React from 'react'
import classNames from 'classnames/bind';
import styles from '../Appointment.module.scss';

const cx = classNames.bind(styles);

function ConsultationSection({ formData, errors, onChange }) {
    const consultationTypes = [
        { value: 'Khám phụ khoa', label: 'Khám phụ khoa', icon: '🩺' },
        { value: 'Tư vấn chu kỳ kinh nguyệt', label: 'Tư vấn chu kỳ kinh nguyệt', icon: '📅' },
        { value: 'Tư vấn tránh thai', label: 'Tư vấn tránh thai', icon: '💊' },
        { value: 'Tư vấn thai kỳ', label: 'Tư vấn thai kỳ', icon: '🤱' },
        { value: 'Tư vấn sinh sản', label: 'Tư vấn sinh sản', icon: '👶' },
        { value: 'Tư vấn chung', label: 'Tư vấn chung', icon: '💬' }
    ];

    return (  
        <div className={cx('form-section')}>
            <h3>🩺 Loại tư vấn</h3>
            <div className={cx('consultation-grid')}>
                {consultationTypes.map(type => (
                    <label
                        key={type.value}
                        className={cx('consultation-card', { selected: formData.consultationType === type.value })}
                        aria-label={type.label}
                    >
                        <input
                            type="radio"
                            name="consultationType"
                            value={type.value}
                            checked={formData.consultationType === type.value}
                            onChange={onChange}
                        />
                        <div className={cx('card-content')}>
                            <span className={cx('card-icon')}>{type.icon}</span>
                            <span className={cx('card-label')}>{type.label}</span>
                        </div>
                    </label>
                ))}
            </div>
            {errors.consultationType && <span className={cx('error-message')}>{errors.consultationType}</span>}
        </div>
    );
}

export default ConsultationSection;