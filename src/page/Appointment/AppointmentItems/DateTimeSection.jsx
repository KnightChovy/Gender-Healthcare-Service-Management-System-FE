import React from 'react'

function DateTimeSection({ formData, errors, onChange }) {
    const timeSlots = [
        '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
        '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
    ];

    const getMinDate = () => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    };

    const getMaxDate = () => {
        const maxDate = new Date();
        maxDate.setMonth(maxDate.getMonth() + 2);
        return maxDate.toISOString().split('T')[0];
    };
    
    return (  
        <div className="form-section">
            <h3>📆 Thời gian hẹn</h3>
            <div className="datetime-row">
                <div className="form-group" style={{ display: 'block' }}>
                    <label htmlFor="preferredDate">Ngày hẹn *</label>
                    <input
                        type="date"
                        id="preferredDate"
                        name="preferredDate"
                        value={formData.preferredDate}
                        onChange={onChange}
                        min={getMinDate()}
                        max={getMaxDate()}
                        className={errors.preferredDate ? 'error' : ''}
                    />
                    {errors.preferredDate && <span className="error-message">{errors.preferredDate}</span>}
                </div>

                <div className="form-group" style={{ display: 'block' }}>
                    <label htmlFor='preferredTime'>Giờ hẹn *</label>
                    <div className="time-grid">
                        {timeSlots.map(time => (
                            <label 
                                key={time} 
                                className={`time-slot ${formData.preferredTime === time ? 'selected' : ''}`}
                            >
                                <input
                                    type="radio"
                                    name="preferredTime"
                                    value={time}
                                    checked={formData.preferredTime === time}
                                    onChange={onChange}
                                />
                                <span>{time}</span>
                            </label>
                        ))}
                    </div>
                    {errors.preferredTime && <span className="error-message">{errors.preferredTime}</span>}
                </div>
            </div>
        </div>
    );
}

export default DateTimeSection;