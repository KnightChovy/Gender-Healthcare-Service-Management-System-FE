import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCalendarAlt, 
  faClock,
  faCheckCircle,
  faExclamationTriangle,
  faBan
} from '@fortawesome/free-solid-svg-icons';
import { doctorsData } from '../../../components/Data/Doctor';
import classNames from 'classnames/bind';
import styles from '../Appointment.module.scss';

const cx = classNames.bind(styles);

// Cập nhật busySchedule với ngày hiện tại
const updateBusySchedule = () => {
  const today = new Date();
  const schedule = {};
  
  // Tạo lịch bận cho 30 ngày tiếp theo
  ['dr001', 'dr002', 'dr003', 'dr004', 'dr005', 'dr006'].forEach(doctorId => {
    schedule[doctorId] = {};
    
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      
      // Tăng số slot bận lên nhiều hơn (50-70% slots bận)
      const possibleBusySlots = [
        '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00',
        '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
      ];
      
      // Random 50-70% slots bận
      const busyCount = Math.floor(possibleBusySlots.length * (0.4 + Math.random() * 0.2));
      const randomBusySlots = [];
      
      // Shuffle và chọn random slots
      const shuffled = [...possibleBusySlots].sort(() => 0.5 - Math.random());
      for (let j = 0; j < busyCount; j++) {
        randomBusySlots.push(shuffled[j]);
      }
      
      schedule[doctorId][dateStr] = randomBusySlots;
    }
  });
  
  return schedule;
};

const busySchedule = updateBusySchedule();

function DateTimeSection({ formData, errors, onChange }) {
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    // const [loading, setLoading] = useState(false);

    const timeSlots = [
        '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00',
        '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
    ];

    // Load doctor data when selectedDoctor changes
    useEffect(() => {
        if (formData.selectedDoctor) {
            const doctor = doctorsData.find(d => d.id === formData.selectedDoctor);
            setSelectedDoctor(doctor);
        } else {
            setSelectedDoctor(null);
        }
    }, [formData.selectedDoctor]);

    const getMinDate = () => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow.toISOString().split('T')[0];
    };

    const getMaxDate = () => {
        const maxDate = new Date();
        maxDate.setMonth(maxDate.getMonth() + 2);
        return maxDate.toISOString().split('T')[0];
    };

    const getDayName = (date) => {
        return new Date(date).toLocaleDateString('vi-VN', { weekday: 'long' });
    };

    // Check if doctor works on selected date
    const isDoctorWorking = () => {
    if (!selectedDoctor || !formData.preferredDate) return false;
    
    const selectedDate = new Date(formData.preferredDate);
    const dayOfWeek = selectedDate.getDay();

    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const dayName = dayNames[dayOfWeek];
    
    return selectedDoctor.workingDays && selectedDoctor.workingDays.includes(dayName);
};

    // Check if a time slot is available
    const isSlotAvailable = (timeSlot) => {
        if (!formData.selectedDoctor || !formData.preferredDate) return false;
        
        const busySlots = busySchedule[formData.selectedDoctor]?.[formData.preferredDate] || [];
        return !busySlots.includes(timeSlot);
    };

    const handleTimeSlotChange = (e) => {
        const timeSlot = e.target.value;
        if (isSlotAvailable(timeSlot)) {
            onChange(e);
        }
    };

    const handleTimeSlotClick = (timeSlot) => {
        if (isSlotAvailable(timeSlot)) {
            onChange({ target: { name: 'preferredTime', value: timeSlot } });
        }
    };

    return (
        <div className={cx('form-section')}>
            <h3>
                <FontAwesomeIcon icon={faCalendarAlt} />
                Thời gian hẹn
            </h3>
            
            <div className={cx('datetime-row')}>
                <div className={cx('form-group')} style={{ display: 'block' }}>
                    <label htmlFor="preferredDate" className={cx('required')}>Ngày hẹn</label>
                    <input
                        type="date"
                        id="preferredDate"
                        name="preferredDate"
                        value={formData.preferredDate}
                        onChange={onChange}
                        min={getMinDate()}
                        max={getMaxDate()}
                        className={cx({ error: errors.preferredDate })}
                    />
                    {errors.preferredDate && (
                        <span className={cx('error-message')}>{errors.preferredDate}</span>
                    )}
                </div>

                <div className={cx('form-group')} style={{ display: 'block' }}>
                    <label htmlFor="priority">Mức độ ưu tiên</label>
                    <select
                        id="priority"
                        name="priority"
                        value={formData.priority}
                        onChange={onChange}
                    >
                        <option value="normal">Bình thường</option>
                        <option value="urgent">Khẩn cấp</option>
                    </select>
                </div>
            </div>

            {/* Warning messages */}
            {!formData.selectedDoctor && (
                <div className={cx('warning-message')}>
                    <FontAwesomeIcon icon={faExclamationTriangle} />
                    <span>Vui lòng chọn bác sĩ tư vấn trước khi chọn giờ hẹn</span>
                </div>
            )}

            {formData.selectedDoctor && formData.preferredDate && !isDoctorWorking() && (
                <div className={cx('warning-message')}>
                    <FontAwesomeIcon icon={faExclamationTriangle} />
                    <span>Bác sĩ không làm việc trong ngày này. Vui lòng chọn ngày khác.</span>
                </div>
            )}

            {/* Time slots */}
            {formData.selectedDoctor && formData.preferredDate && isDoctorWorking() && (
                <div className={cx('time-selection')}>
                    <div className={cx('time-header')}>
                        <h4>
                            <FontAwesomeIcon icon={faClock} />
                            Lịch rảnh - {selectedDoctor?.name}
                        </h4>
                        <p>
                            {getDayName(formData.preferredDate)}, {new Date(formData.preferredDate).toLocaleDateString('vi-VN')}
                        </p>
                    </div>

                    <div className={cx('form-group')} style={{ display: 'block' }}>
                        <label htmlFor='preferredTime' className={cx('required')}>Giờ hẹn</label>
                        <div className={cx('time-grid')}>
                            {timeSlots.map(time => {
                                const available = isSlotAvailable(time);
                                const selected = formData.preferredTime === time;
                                
                                return (
                                    <div
                                        key={time}
                                        className={cx('time-slot', { 
                                            selected,
                                            available,
                                            disabled: !available
                                        })}
                                        onClick={() => handleTimeSlotClick(time)}
                                        title={available ? 'Khung giờ trống' : 'Bác sĩ đã có lịch hẹn'}
                                    >
                                        <input
                                            type="radio"
                                            name="preferredTime"
                                            value={time}
                                            checked={selected}
                                            onChange={handleTimeSlotChange}
                                            disabled={!available}
                                            style={{ display: 'none' }}
                                        />
                                        <div className={cx('slot-content')}>
                                            <FontAwesomeIcon 
                                                icon={available ? faClock : faBan} 
                                                className={cx('slot-icon')}
                                            />
                                            <span className={cx('slot-time')}>{time}</span>
                                            <span className={cx('slot-status')}>
                                                {available ? 'Trống' : 'Bận'}
                                            </span>
                                        </div>
                                        {selected && (
                                            <div className={cx('selected-indicator')}>
                                                <FontAwesomeIcon icon={faCheckCircle} />
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                        {errors.preferredTime && (
                            <span className={cx('error-message')}>{errors.preferredTime}</span>
                        )}
                        
                        {/* Legend */}
                        <div className={cx('schedule-legend')}>
                            <div className={cx('legend-item')}>
                                <FontAwesomeIcon icon={faClock} className={cx('legend-icon', 'available')} />
                                <span>Trống - Có thể đặt lịch</span>
                            </div>
                            <div className={cx('legend-item')}>
                                <FontAwesomeIcon icon={faBan} className={cx('legend-icon', 'busy')} />
                                <span>Bận - Đã có lịch hẹn</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Summary */}
            {formData.selectedDoctor && formData.preferredDate && formData.preferredTime && (
                <div className={cx('appointment-summary')}>
                    <h4>
                        <FontAwesomeIcon icon={faCheckCircle} />
                        Thông tin đã chọn
                    </h4>
                    <div className={cx('summary-content')}>
                        <p><strong>Bác sĩ:</strong> {selectedDoctor?.name}</p>
                        <p><strong>Ngày:</strong> {getDayName(formData.preferredDate)}, {new Date(formData.preferredDate).toLocaleDateString('vi-VN')}</p>
                        <p><strong>Giờ:</strong> {formData.preferredTime}</p>
                        <p><strong>Ưu tiên:</strong> {formData.priority === 'urgent' ? 'Khẩn cấp' : 'Bình thường'}</p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default DateTimeSection;