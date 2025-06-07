import React from 'react'
import classNames from 'classnames/bind';
import styles from '../Appointment.module.scss';

const cx = classNames.bind(styles);

function DateTimeSection({ formData, errors, onChange }) {
    const timeSlots = [
        '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00',
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
        <div className={cx('form-section')}>
            <h3>📆 Thời gian hẹn</h3>
            <div className={cx('datetime-row')}>
                <div className={cx('form-group')} style={{ display: 'block' }}>
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
                    {errors.preferredDate && <span className={cx('error-message')}>{errors.preferredDate}</span>}
                </div>

                <div className={cx('form-group')} style={{ display: 'block' }}>
                    <label htmlFor='preferredTime'>Giờ hẹn *</label>
                    <div className={cx('time-grid')}>
                        {timeSlots.map(time => (
                            <label
                                key={time}
                                className={cx('time-slot', { selected: formData.preferredTime === time })}
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
                    {errors.preferredTime && <span className={cx('error-message')}>{errors.preferredTime}</span>}
                </div>
            </div>
        </div>
    );
}

export default DateTimeSection;