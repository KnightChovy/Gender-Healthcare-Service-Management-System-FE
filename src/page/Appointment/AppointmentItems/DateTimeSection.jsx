import React, { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from '../Appointment.module.scss';

const cx = classNames.bind(styles);

function DateTimeSection({ formData, errors, onChange }) {
    const [availableTimes, setAvailableTimes] = useState([]);
    const [isLoadingTimes, setIsLoadingTimes] = useState(false);

    // Function to check if a time slot has passed
    const isTimeSlotPassed = (dateString, timeString) => {
        const now = new Date();
        const slotDate = new Date(dateString + 'T' + timeString);
        return slotDate <= now;
    };

    // Function to check if it's today
    const isToday = (dateString) => {
        const today = new Date();
        const selectedDate = new Date(dateString + 'T00:00:00');
        return selectedDate.toDateString() === today.toDateString();
    };

    useEffect(() => {
        if (!formData.appointmentDate) {
            setAvailableTimes([]);
            return;
        }

        // If it's Sunday, don't show any slots
        if (isSunday(formData.appointmentDate)) {
            setAvailableTimes({ morning: [], afternoon: [] });
            return;
        }

        setIsLoadingTimes(true);

        setTimeout(() => {
            const availableTimeslots = JSON.parse(localStorage.getItem('doctorAvailableTimeslots')) || [];
            const schedule = availableTimeslots.find(sch => sch.date === formData.appointmentDate);
            
            const createAllTimeSlots = () => {
                const morningSlots = [];
                const afternoonSlots = [];
                const isSelectedDateToday = isToday(formData.appointmentDate);
                const isSelectedDateSaturday = isSaturday(formData.appointmentDate);
                
                // Morning slots (8:00 - 11:30) - Available all days except Sunday
                for (let hour = 8; hour <= 11; hour++) {
                    for (let minute = 0; minute < 60; minute += 30) {
                        if (hour === 11 && minute > 0) break;
                        
                        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:00`;
                        const displayTime = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                        
                        let isAvailable = false;
                        let timeslotId = null;
                        let reason = 'Không có lịch';
                        
                        // Check if time has passed (only for today)
                        if (isSelectedDateToday && isTimeSlotPassed(formData.appointmentDate, timeString)) {
                            reason = 'Đã qua giờ';
                            isAvailable = false;
                        } else if (schedule && schedule.timeslots) {
                            const matchingSlot = schedule.timeslots.find(slot => {
                                const slotStart = new Date(`2000-01-01T${slot.time_start}`);
                                const slotEnd = new Date(`2000-01-01T${slot.time_end}`);
                                const currentSlotTime = new Date(`2000-01-01T${timeString}`);
                                
                                return currentSlotTime >= slotStart && currentSlotTime < slotEnd;
                            });
                            
                            if (matchingSlot) {
                                timeslotId = matchingSlot.timeslot_id;
                                if (matchingSlot.appointment_times.includes(timeString)) {
                                    isAvailable = false;
                                    reason = 'Đã đặt';
                                } else {
                                    isAvailable = true;
                                    reason = '';
                                }
                            }
                        }
                        
                        morningSlots.push({
                            value: timeString,
                            label: displayTime,
                            time_start: timeString,
                            timeslot_id: timeslotId,
                            isAvailable: isAvailable,
                            reason: reason
                        });
                    }
                }
                
                // Afternoon slots (13:30 - 16:30) - Only available Monday to Friday
                if (!isSelectedDateSaturday) {
                    for (let hour = 13; hour <= 16; hour++) {
                        let startMinute, endMinute;
                        
                        if (hour === 13) {
                            startMinute = 30;
                            endMinute = 60;
                        } else if (hour === 16) {
                            startMinute = 0;
                            endMinute = 30;
                        } else {
                            startMinute = 0;
                            endMinute = 60;
                        }
                        
                        for (let minute = startMinute; minute < endMinute; minute += 30) { 
                            if (hour === 16 && minute >= 30) {
                                const timeString = `16:30:00`;
                                const displayTime = `16:30`;
                                
                                let isAvailable = false;
                                let timeslotId = null;
                                let reason = 'Không có lịch';
                                
                                // Check if time has passed (only for today)
                                if (isSelectedDateToday && isTimeSlotPassed(formData.appointmentDate, timeString)) {
                                    reason = 'Đã qua giờ';
                                    isAvailable = false;
                                } else if (schedule && schedule.timeslots) {
                                    const matchingSlot = schedule.timeslots.find(slot => {
                                        const slotStart = new Date(`2000-01-01T${slot.time_start}`);
                                        const slotEnd = new Date(`2000-01-01T${slot.time_end}`);
                                        const currentSlotTime = new Date(`2000-01-01T${timeString}`);
                                        
                                        return currentSlotTime >= slotStart && currentSlotTime < slotEnd;
                                    });
                                    
                                    if (matchingSlot) {
                                        timeslotId = matchingSlot.timeslot_id;
                                        if (matchingSlot.appointment_times.includes(timeString)) {
                                            isAvailable = false;
                                            reason = 'Đã đặt';
                                        } else {
                                            isAvailable = true;
                                            reason = '';
                                        }
                                    }
                                }
                                
                                afternoonSlots.push({
                                    value: timeString,
                                    label: displayTime,
                                    time_start: timeString,
                                    timeslot_id: timeslotId,
                                    isAvailable: isAvailable,
                                    reason: reason
                                });
                                break;
                            }
                            
                            const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:00`;
                            const displayTime = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                            
                            let isAvailable = false;
                            let timeslotId = null;
                            let reason = 'Không có lịch';
                            
                            // Check if time has passed (only for today)
                            if (isSelectedDateToday && isTimeSlotPassed(formData.appointmentDate, timeString)) {
                                reason = 'Đã qua giờ';
                                isAvailable = false;
                            } else if (schedule && schedule.timeslots) {
                                const matchingSlot = schedule.timeslots.find(slot => {
                                    const slotStart = new Date(`2000-01-01T${slot.time_start}`);
                                    const slotEnd = new Date(`2000-01-01T${slot.time_end}`);
                                    const currentSlotTime = new Date(`2000-01-01T${timeString}`);
                                    
                                    return currentSlotTime >= slotStart && currentSlotTime < slotEnd;
                                });
                                
                                if (matchingSlot) {
                                    timeslotId = matchingSlot.timeslot_id;
                                    if (matchingSlot.appointment_times.includes(timeString)) {
                                        isAvailable = false;
                                        reason = 'Đã đặt';
                                    } else {
                                        isAvailable = true;
                                        reason = '';
                                    }
                                }
                            }
                            
                            afternoonSlots.push({
                                value: timeString,
                                label: displayTime,
                                time_start: timeString,
                                timeslot_id: timeslotId,
                                isAvailable: isAvailable,
                                reason: reason
                            });
                        }
                    }
                }
                
                return {
                    morning: morningSlots,
                    afternoon: afternoonSlots
                };
            };
            
            const timeSlots = createAllTimeSlots();
            setAvailableTimes(timeSlots);
            setIsLoadingTimes(false);
        }, 300);
    }, [formData.appointmentDate]);

    const getMinDate = () => {
        // Allow today
        const today = new Date();
        return today.toISOString().split('T')[0];
    };

    const getMaxDate = () => {
        const maxDate = new Date();
        maxDate.setMonth(maxDate.getMonth() + 6);
        return maxDate.toISOString().split('T')[0];
    };

    const isSunday = (dateString) => {
        const date = new Date(dateString + 'T00:00:00');
        return date.getDay() === 0;
    };

    const isSaturday = (dateString) => {
        const date = new Date(dateString + 'T00:00:00');
        return date.getDay() === 6;
    };

    const isPastDate = (dateString) => {
        const selectedDate = new Date(dateString + 'T00:00:00');
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return selectedDate < today;
    };

    const validateDate = (dateString) => {
        if (!dateString) return true;

        if (isPastDate(dateString)) {
            return 'Không thể đặt lịch trong quá khứ. Vui lòng chọn từ hôm nay trở đi.';
        }

        if (isSunday(dateString)) {
            return 'Chúng tôi không làm việc vào Chủ nhật. Vui lòng chọn ngày khác.';
        }

        return null;
    };

    const handleDateChange = (e) => {
        const { name, value } = e.target;
        if (name === 'appointmentDate' && value) {
            const dateError = validateDate(value);
            if (dateError) {
                const errorEvent = {
                    target: {
                        name: 'appointmentDate',
                        value: value
                    }
                };
                onChange(errorEvent);
                return;
            }
        }

        onChange(e);
        
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

    const hasDateIssues = formData.appointmentDate && (
        isPastDate(formData.appointmentDate) || 
        isSunday(formData.appointmentDate)
    );

    return (
        <div className={cx('form-section', 'datetime-section')}>
            <div className={cx('section-header')}>
                <h3 className={cx('section-title')}>
                    📅 Chọn ngày và giờ tư vấn
                </h3>
                <p className={cx('section-subtitle')}>
                    Vui lòng chọn ngày và giờ phù hợp cho buổi tư vấn (từ hôm nay, trừ Chủ nhật)
                </p>
            </div>

            <div className={cx('datetime-content')}>
                {/* Date Selection */}
                <div className={cx('date-selection')}>
                    <div className={cx('form-group')}>
                        <label className={cx('form-label', 'required')}>
                            Ngày tư vấn
                        </label>
                        <input
                            type="date"
                            name="appointmentDate"
                            value={formData.appointmentDate}
                            onChange={handleDateChange}
                            min={getMinDate()}
                            max={getMaxDate()}
                            className={cx('form-input', 'date-input', {
                                'error': errors.appointmentDate || hasDateIssues
                            })}
                            required
                        />
                        
                        {/* Date validation errors */}
                        {formData.appointmentDate && isPastDate(formData.appointmentDate) && (
                            <span className={cx('error-message')}>
                                ❌ Không thể đặt lịch trong quá khứ. Vui lòng chọn từ hôm nay trở đi.
                            </span>
                        )}
                        
                        {formData.appointmentDate && isSunday(formData.appointmentDate) && (
                            <span className={cx('error-message')}>
                                ❌ Chúng tôi không làm việc vào Chủ nhật. Vui lòng chọn ngày khác.
                            </span>
                        )}

                        {errors.appointmentDate && !hasDateIssues && (
                            <span className={cx('error-message')}>
                                {errors.appointmentDate}
                            </span>
                        )}
                        
                        {/* Date info */}
                        {formData.appointmentDate && !hasDateIssues && (
                            <div className={cx('date-info')}>
                                {/* Today notice */}
                                {isToday(formData.appointmentDate) && (
                                    <div className={cx('weekend-notice')}>
                                        🕐 Lưu ý: Bạn đang chọn ngày hôm nay. Chỉ có thể đặt các khung giờ chưa qua.
                                    </div>
                                )}
                                
                                {/* Saturday notice */}
                                {isSaturday(formData.appointmentDate) && (
                                    <div className={cx('weekend-notice')}>
                                        ⚠️ Lưu ý: Thứ Bảy chỉ làm việc buổi sáng (8:00 - 11:30).
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
                            Giờ tư vấn
                        </label>
                        
                        {(() => {
                            if (!formData.appointmentDate) {
                                return (
                                    <div className={cx('time-placeholder')}>
                                        <div className={cx('placeholder-content')}>
                                            <span className={cx('placeholder-icon')}>📅</span>
                                            <p>Vui lòng chọn ngày trước để xem các khung giờ có sẵn</p>
                                        </div>
                                    </div>
                                );
                            } else if (isSunday(formData.appointmentDate)) {
                                return (
                                    <div className={cx('no-times')}>
                                        <span className={cx('no-times-icon')}>🚫</span>
                                        <p>Chúng tôi không làm việc vào Chủ nhật</p>
                                        <small>Vui lòng chọn ngày khác (Thứ 2 - Thứ 7)</small>
                                    </div>
                                );
                            } else if (isLoadingTimes) {
                                return (
                                    <div className={cx('time-loading')}>
                                        <div className={cx('loading-spinner')}></div>
                                        <p>Đang tải khung giờ có sẵn...</p>
                                    </div>
                                );
                            } else if (availableTimes.morning?.length === 0 && availableTimes.afternoon?.length === 0) {
                                return (
                                    <div className={cx('no-times')}>
                                        <span className={cx('no-times-icon')}>❌</span>
                                        <p>Không có khung giờ nào có sẵn cho ngày này</p>
                                        <small>Vui lòng chọn ngày khác</small>
                                    </div>
                                );
                            } else {
                                return (
                                    <div className={cx('time-periods')}>
                                        {/* Morning Slots */}
                                        {availableTimes.morning?.length > 0 && (
                                            <div className={cx('time-period')}>
                                                <h4 className={cx('period-title')}>
                                                    Buổi sáng (8:00 - 11:30)
                                                </h4>
                                                <div className={cx('time-slots')}>
                                                    {availableTimes.morning?.map(slot => (
                                                        <label
                                                            key={slot.value}
                                                            className={cx('time-slot', {
                                                                'selected': formData.appointmentTime === slot.value,
                                                                'available': slot.isAvailable,
                                                                'unavailable': !slot.isAvailable,
                                                                'no-schedule': slot.reason === 'Không có lịch',
                                                                'booked': slot.reason === 'Đã đặt',
                                                                'passed': slot.reason === 'Đã qua giờ'
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
                                                                    <span className={cx('unavailable-badge', {
                                                                        'no-schedule-badge': slot.reason === 'Không có lịch',
                                                                        'booked-badge': slot.reason === 'Đã đặt',
                                                                        'passed-badge': slot.reason === 'Đã qua giờ'
                                                                    })}>
                                                                        {slot.reason}
                                                                    </span>
                                                                )}
                                                            </span>
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Afternoon Slots - Only show if not Saturday */}
                                        {availableTimes.afternoon?.length > 0 && !isSaturday(formData.appointmentDate) && (
                                            <div className={cx('time-period')}>
                                                <h4 className={cx('period-title')}>
                                                    Buổi chiều (13:30 - 16:30)
                                                </h4>
                                                <div className={cx('time-slots')}>
                                                    {availableTimes.afternoon?.map(slot => (
                                                        <label
                                                            key={slot.value}
                                                            className={cx('time-slot', {
                                                                'selected': formData.appointmentTime === slot.value,
                                                                'available': slot.isAvailable,
                                                                'unavailable': !slot.isAvailable,
                                                                'no-schedule': slot.reason === 'Không có lịch',
                                                                'booked': slot.reason === 'Đã đặt',
                                                                'passed': slot.reason === 'Đã qua giờ'
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
                                                                    <span className={cx('unavailable-badge', {
                                                                        'no-schedule-badge': slot.reason === 'Không có lịch',
                                                                        'booked-badge': slot.reason === 'Đã đặt',
                                                                        'passed-badge': slot.reason === 'Đã qua giờ'
                                                                    })}>
                                                                        {slot.reason}
                                                                    </span>
                                                                )}
                                                            </span>
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Saturday afternoon notice */}
                                        {isSaturday(formData.appointmentDate) && (
                                            <div className={cx('time-period')}>
                                                <div className={cx('no-times')}>
                                                    <p>Thứ Bảy chúng tôi chỉ làm việc buổi sáng</p>
                                                    <small>Buổi chiều: Nghỉ</small>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            }
                        })()}
                        
                        {errors.appointmentTime && (
                            <span className={cx('error-message')}>
                                {errors.appointmentTime}
                            </span>
                        )}
                    </div>
                </div>

                {/* Selected Summary */}
                {formData.appointmentDate && formData.appointmentTime && !hasDateIssues && (
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
                                            {isToday(formData.appointmentDate) && ' (Hôm nay)'}
                                        </span>
                                    </div>
                                </div>
                                <div className={cx('summary-item')}>
                                    <span className={cx('summary-icon')}>🕐</span>
                                    <div className={cx('summary-content')}>
                                        <strong>Giờ tư vấn:</strong>
                                        <span>
                                            {formData.appointmentTime.substring(0, 5)}
                                            {isSaturday(formData.appointmentDate) && ' (Buổi sáng)'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Time Selection Notes */}
                <div className={cx('time-notes')}>
                    <div className={cx('note-item')}>
                        <span className={cx('note-icon')}>📅</span>
                        <p><strong>Quy định:</strong> Có thể đặt lịch từ hôm nay (không bao gồm Chủ nhật)</p>
                    </div>
                    <div className={cx('note-item')}>
                        <span className={cx('note-icon')}>🕐</span>
                        <p><strong>Khung giờ:</strong> Chỉ có thể chọn các khung giờ chưa qua (nếu chọn ngày hôm nay)</p>
                    </div>
                    <div className={cx('note-item')}>
                        <span className={cx('note-icon')}>🚫</span>
                        <p><strong>Nghỉ:</strong> Chủ nhật và buổi chiều thứ Bảy</p>
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