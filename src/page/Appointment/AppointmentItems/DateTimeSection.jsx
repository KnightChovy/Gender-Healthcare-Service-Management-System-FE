import React, { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from '../Appointment.module.scss';

const cx = classNames.bind(styles);

function DateTimeSection({ formData, errors, onChange }) {
    const [availableTimes, setAvailableTimes] = useState([]);
    const [isLoadingTimes, setIsLoadingTimes] = useState(false);

    // Generate available time slots
    const generateTimeSlots = () => {
        const slots = [];
        const startHour = 8; // 8:00 AM
        const endHour = 17; // 5:00 PM
        const interval = 30; // 30 minutes

        for (let hour = startHour; hour < endHour; hour++) {
            for (let minute = 0; minute < 60; minute += interval) {
                const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                
                // Skip lunch break from 11:30 to 12:30
                if (timeString === '11:30' || timeString === '12:00' || timeString === '12:30') {
                    continue;
                }
                
                slots.push({
                    value: timeString,
                    label: timeString,
                    period: hour < 11 || (hour === 11 && minute < 30) ? 'Sáng' : 'Chiều'
                });
            }
        }
        return slots;
    };

    // Get today's date in YYYY-MM-DD format
    const getTodayDate = () => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    };

    // Get max date (6 months from now)
    const getMaxDate = () => {
        const maxDate = new Date();
        maxDate.setMonth(maxDate.getMonth() + 6);
        return maxDate.toISOString().split('T')[0];
    };

    // Check if selected date is weekend
    const isWeekend = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDay();
        return day === 0 || day === 6; // Sunday = 0, Saturday = 6
    };

    // Load available times when date changes
    useEffect(() => {
        if (formData.appointmentDate) {
            setIsLoadingTimes(true);
            
            // Simulate API call to get available times
            setTimeout(() => {
                const allSlots = generateTimeSlots();
                
                // Random unavailable slots (2-4 slots ngẫu nhiên)
                const numUnavailable = Math.floor(Math.random() * 3) + 2; // 2-4 slots
                const shuffledSlots = [...allSlots].sort(() => 0.5 - Math.random());
                const unavailableSlots = shuffledSlots.slice(0, numUnavailable).map(slot => slot.value);
                
                // Mark slots as available/unavailable
                const slotsWithStatus = allSlots.map(slot => ({
                    ...slot,
                    isAvailable: !unavailableSlots.includes(slot.value)
                }));
                
                setAvailableTimes(slotsWithStatus);
                setIsLoadingTimes(false);
            }, 500);
        } else {
            setAvailableTimes([]);
        }
    }, [formData.appointmentDate]);

    const handleDateChange = (e) => {
        const { name, value } = e.target;
        onChange(e);
        
        // Reset selected time when date changes
        if (name === 'appointmentDate' && formData.appointmentTime) {
            const timeResetEvent = {
                target: {
                    name: 'appointmentTime',
                    value: ''
                }
            };
            onChange(timeResetEvent);
        }
    };

    // Group time slots by period
    const groupedTimes = availableTimes.reduce((groups, slot) => {
        const period = slot.period;
        if (!groups[period]) {
            groups[period] = [];
        }
        groups[period].push(slot);
        return groups;
    }, {});

    return (
        <div className={cx('form-section', 'datetime-section')}>
            <div className={cx('section-header')}>
                <h3 className={cx('section-title')}>
                    📅 Chọn ngày và giờ tư vấn
                </h3>
                <p className={cx('section-subtitle')}>
                    Vui lòng chọn ngày và giờ phù hợp cho buổi tư vấn
                </p>
            </div>

            <div className={cx('datetime-content')}>
                {/* Date Selection */}
                <div className={cx('date-selection')}>
                    <div className={cx('form-group')}>
                        <label className={cx('form-label', 'required')}>
                            📅 Ngày tư vấn
                        </label>
                        <input
                            type="date"
                            name="appointmentDate"
                            value={formData.appointmentDate}
                            onChange={handleDateChange}
                            min={getTodayDate()}
                            max={getMaxDate()}
                            className={cx('form-input', 'date-input', {
                                'error': errors.appointmentDate
                            })}
                            required
                        />
                        {errors.appointmentDate && (
                            <span className={cx('error-message')}>
                                {errors.appointmentDate}
                            </span>
                        )}
                        
                        {/* Date info */}
                        {formData.appointmentDate && (
                            <div className={cx('date-info')}>
                                {isWeekend(formData.appointmentDate) && (
                                    <div className={cx('weekend-notice')}>
                                        ⚠️ Lưu ý: Ngày bạn chọn là cuối tuần. Một số dịch vụ có thể bị hạn chế.
                                    </div>
                                )}
                                <div className={cx('date-display')}>
                                    <span>Ngày đã chọn: </span>
                                    <strong>
                                        {new Date(formData.appointmentDate + 'T00:00:00').toLocaleDateString('vi-VN', {
                                            weekday: 'long',
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </strong>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Time Selection */}
                <div className={cx('time-selection')}>
                    <div className={cx('form-group')}>
                        <label className={cx('form-label', 'required')}>
                            🕐 Giờ tư vấn
                        </label>
                        
                        {!formData.appointmentDate ? (
                            <div className={cx('time-placeholder')}>
                                <div className={cx('placeholder-content')}>
                                    <span className={cx('placeholder-icon')}>📅</span>
                                    <p>Vui lòng chọn ngày trước để xem các khung giờ có sẵn</p>
                                </div>
                            </div>
                        ) : isLoadingTimes ? (
                            <div className={cx('time-loading')}>
                                <div className={cx('loading-spinner')}></div>
                                <p>Đang tải khung giờ có sẵn...</p>
                            </div>
                        ) : availableTimes.length === 0 ? (
                            <div className={cx('no-times')}>
                                <span className={cx('no-times-icon')}>❌</span>
                                <p>Không có khung giờ nào có sẵn cho ngày này</p>
                                <small>Vui lòng chọn ngày khác</small>
                            </div>
                        ) : (
                            <div className={cx('time-slots')}>
                                {Object.entries(groupedTimes).map(([period, slots]) => (
                                    <div key={period} className={cx('time-period')}>
                                        <h4 className={cx('period-title')}>
                                            {period === 'Sáng' && '🌅'} 
                                            {period === 'Chiều' && '☀️'}
                                            {period}
                                        </h4>
                                        <div className={cx('time-grid')}>
                                            {slots.map((slot) => (
                                                <label
                                                    key={slot.value}
                                                    className={cx('time-slot', {
                                                        'selected': formData.appointmentTime === slot.value,
                                                        'available': slot.isAvailable,
                                                        'unavailable': !slot.isAvailable
                                                    })}
                                                    style={{
                                                        cursor: slot.isAvailable ? 'pointer' : 'not-allowed'
                                                    }}
                                                >
                                                    <input
                                                        type="radio"
                                                        name="appointmentTime"
                                                        value={slot.value}
                                                        checked={formData.appointmentTime === slot.value}
                                                        onChange={slot.isAvailable ? onChange : undefined}
                                                        disabled={!slot.isAvailable}
                                                        className={cx('time-radio')}
                                                    />
                                                    <span className={cx('time-label')}>
                                                        {slot.label}
                                                        {!slot.isAvailable && (
                                                            <span className={cx('unavailable-badge')}>
                                                                Đã đặt
                                                            </span>
                                                        )}
                                                    </span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        
                        {errors.appointmentTime && (
                            <span className={cx('error-message')}>
                                {errors.appointmentTime}
                            </span>
                        )}
                    </div>
                </div>

                {/* Selected Summary */}
                {formData.appointmentDate && formData.appointmentTime && (
                    <div className={cx('selection-summary')}>
                        <div className={cx('summary-card')}>
                            <h4 className={cx('summary-title')}>
                                ✅ Thông tin đã chọn
                            </h4>
                            <div className={cx('summary-details')}>
                                <div className={cx('summary-item')}>
                                    <span className={cx('summary-icon')}>📅</span>
                                    <div className={cx('summary-content')}>
                                        <strong>Ngày tư vấn:</strong>
                                        <span>
                                            {new Date(formData.appointmentDate + 'T00:00:00').toLocaleDateString('vi-VN', {
                                                weekday: 'long',
                                                day: '2-digit',
                                                month: '2-digit',
                                                year: 'numeric'
                                            })}
                                        </span>
                                    </div>
                                </div>
                                <div className={cx('summary-item')}>
                                    <span className={cx('summary-icon')}>🕐</span>
                                    <div className={cx('summary-content')}>
                                        <strong>Giờ tư vấn:</strong>
                                        <span>{formData.appointmentTime}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Time Selection Notes */}
                <div className={cx('time-notes')}>
                    <div className={cx('note-item')}>
                        <span className={cx('note-icon')}>💡</span>
                        <p><strong>Lưu ý:</strong> Thời gian tư vấn có thể thay đổi tùy theo tình hình thực tế</p>
                    </div>
                    <div className={cx('note-item')}>
                        <span className={cx('note-icon')}>⏰</span>
                        <p><strong>Thời gian:</strong> Mỗi buổi tư vấn kéo dài khoảng 30-45 phút</p>
                    </div>
                    <div className={cx('note-item')}>
                        <span className={cx('note-icon')}>📞</span>
                        <p><strong>Liên hệ:</strong> Gọi 1900-1133 nếu cần thay đổi lịch hẹn</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DateTimeSection;