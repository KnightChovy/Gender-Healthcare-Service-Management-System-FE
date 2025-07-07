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

    // Function to check if time slot is unavailable due to confirmed/completed appointments
    const isTimeSlotUnavailable = (timeString, timeslot) => {
        if (!timeslot || !timeslot.appointment_times) return false;
        
        // Find appointments for this specific time
        const appointmentsAtTime = timeslot.appointments_details?.filter(apt => 
            apt.appointment_time === timeString
        ) || [];
        
        // Check if any appointment at this time has confirmed or completed status
        const hasConfirmedOrCompleted = appointmentsAtTime.some(apt => 
            apt.appointment_time && // Must have appointment_time
            (apt.status === 'confirmed' || apt.status === 'completed')
        );
        
        return hasConfirmedOrCompleted;
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
                                
                                // Updated logic: Check if slot is unavailable due to confirmed/completed appointments
                                if (isTimeSlotUnavailable(timeString, matchingSlot)) {
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
                                        
                                        // Updated logic: Check if slot is unavailable due to confirmed/completed appointments
                                        if (isTimeSlotUnavailable(timeString, matchingSlot)) {
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
                                    
                                    // Updated logic: Check if slot is unavailable due to confirmed/completed appointments
                                    if (isTimeSlotUnavailable(timeString, matchingSlot)) {
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
        const today = new Date();
        const year2025Start = new Date('2025-01-01');
        
        if (today >= year2025Start) {
            return today.toISOString().split('T')[0];
        }
        
        return '2025-01-01';
    };

    const getMaxDate = () => {
        const maxDate = new Date('2025-12-31');
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
        const minDate = new Date(getMinDate() + 'T00:00:00');
        return selectedDate < minDate;
    };

    const validateDate = (dateString) => {
        if (!dateString) return true;

        const selectedDate = new Date(dateString + 'T00:00:00');
        const year = selectedDate.getFullYear();
        
        if (year !== 2025) {
            return 'Chỉ có thể đặt lịch trong năm 2025. Vui lòng chọn ngày khác.';
        }

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
        isSunday(formData.appointmentDate) ||
        new Date(formData.appointmentDate).getFullYear() !== 2025
    );

    const formatDateForDisplay = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString + 'T00:00:00');
        return date.toLocaleDateString('vi-VN', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className={cx('form-section', 'datetime-section')}>
            <div className={cx('section-header')}>
                <h3 className={cx('section-title')}>
                    📅 Chọn ngày và giờ tư vấn
                </h3>
                <p className={cx('section-subtitle')}>
                    Chọn ngày và giờ phù hợp cho buổi tư vấn trong năm 2025
                </p>
            </div>

            <div className={cx('datetime-content')}>
                {/* Date Selection */}
                <div className={cx('date-selection')}>
                    <div className={cx('form-group')}>
                        <label className={cx('form-label', 'required')}>
                            Ngày tư vấn (Năm 2025)
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
                        
                        {/* Display formatted date */}
                        {formData.appointmentDate && !hasDateIssues && (
                            <div className={cx('date-display')}>
                                <span className={cx('date-display-text')}>
                                    📅 {formatDateForDisplay(formData.appointmentDate)}
                                </span>
                            </div>
                        )}
                        
                        {/* Date validation errors */}
                        {formData.appointmentDate && new Date(formData.appointmentDate).getFullYear() !== 2025 && (
                            <span className={cx('error-message')}>
                                ❌ Chỉ có thể đặt lịch trong năm 2025
                            </span>
                        )}
                        
                        {formData.appointmentDate && isPastDate(formData.appointmentDate) && (
                            <span className={cx('error-message')}>
                                ❌ Không thể đặt lịch trong quá khứ
                            </span>
                        )}
                        
                        {formData.appointmentDate && isSunday(formData.appointmentDate) && (
                            <span className={cx('error-message')}>
                                ❌ Chúng tôi không làm việc vào Chủ nhật
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
                                {isToday(formData.appointmentDate) && (
                                    <div className={cx('date-notice')}>
                                        🕐 Hôm nay - chỉ có thể đặt các khung giờ chưa qua
                                    </div>
                                )}
                                
                                {isSaturday(formData.appointmentDate) && (
                                    <div className={cx('date-notice')}>
                                        📅 Thứ Bảy - chỉ làm việc buổi sáng
                                    </div>
                                )}
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
                                        <span className={cx('placeholder-icon')}>📅</span>
                                        <p>Vui lòng chọn ngày trước</p>
                                    </div>
                                );
                            } else if (hasDateIssues) {
                                return (
                                    <div className={cx('time-placeholder')}>
                                        <span className={cx('placeholder-icon')}>⚠️</span>
                                        <p>Vui lòng chọn ngày hợp lệ</p>
                                    </div>
                                );
                            } else if (isSunday(formData.appointmentDate)) {
                                return (
                                    <div className={cx('no-times')}>
                                        <span className={cx('no-times-icon')}>🚫</span>
                                        <p>Chúng tôi không làm việc vào Chủ nhật</p>
                                    </div>
                                );
                            } else if (isLoadingTimes) {
                                return (
                                    <div className={cx('time-loading')}>
                                        <div className={cx('loading-spinner')}></div>
                                        <p>Đang tải khung giờ...</p>
                                    </div>
                                );
                            } else if (availableTimes.morning?.length === 0 && availableTimes.afternoon?.length === 0) {
                                return (
                                    <div className={cx('no-times')}>
                                        <span className={cx('no-times-icon')}>❌</span>
                                        <p>Không có khung giờ nào có sẵn</p>
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
                                                                'unavailable': !slot.isAvailable
                                                            })}
                                                            title={!slot.isAvailable ? slot.reason : ''}
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
                                                            </span>
                                                            {!slot.isAvailable && slot.reason && (
                                                                <span className={cx('unavailable-reason')}>
                                                                    {slot.reason}
                                                                </span>
                                                            )}
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Afternoon Slots */}
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
                                                                'unavailable': !slot.isAvailable
                                                            })}
                                                            title={!slot.isAvailable ? slot.reason : ''}
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
                                                            </span>
                                                            {!slot.isAvailable && slot.reason && (
                                                                <span className={cx('unavailable-reason')}>
                                                                    {slot.reason}
                                                                </span>
                                                            )}
                                                        </label>
                                                    ))}
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

                {/* Quick Notes */}
                <div className={cx('quick-note')}>
                    <span className={cx('note-icon')}>💡</span>
                    <p>Lịch hẹn chỉ có thể đặt trong năm 2025. Thứ Bảy chỉ làm việc buổi sáng, Chủ nhật nghỉ.</p>
                </div>
            </div>
        </div>
    );
}

export default DateTimeSection;