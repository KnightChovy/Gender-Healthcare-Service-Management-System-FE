import React from 'react'
import { useState } from 'react';

function CycleInputForm({ cycleData, onDataChange }) {
    const [timer, setTimer] = useState(null);
    const [isTimerActive, setIsTimerActive] = useState(false);
    const [selectedDays, setSelectedDays] = useState([]);

    const daysOfWeek = [
        { value: 'monday', label: 'Thứ 2', short: 'T2' },
        { value: 'tuesday', label: 'Thứ 3', short: 'T3' },
        { value: 'wednesday', label: 'Thứ 4', short: 'T4' },
        { value: 'thursday', label: 'Thứ 5', short: 'T5' },
        { value: 'friday', label: 'Thứ 6', short: 'T6' },
        { value: 'saturday', label: 'Thứ 7', short: 'T7' },
        { value: 'sunday', label: 'Chủ nhật', short: 'CN' }
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        onDataChange({ [name]: value });
    }

    const setQuickTime = (time) => {
        onDataChange({ birthControlTime: time });
    }

    const getCurrentTime = () => {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        return `${hours}:${minutes}`;
    }

    const handleDaySelection = (dayValue) => {
        setSelectedDays(prev => {
            if (prev.includes(dayValue)) {
                return prev.filter(day => day !== dayValue);
            } else {
                return [...prev, dayValue];
            }
        });
    }

    const selectAllDays = () => {
        const allDays = daysOfWeek.map(day => day.value);
        setSelectedDays(allDays);
    }

    const clearAllDays = () => {
        setSelectedDays([]);
    }

    const setReminder = () => {
        if (!cycleData.birthControlTime) {
            alert('⚠️ Vui lòng chọn thời gian uống thuốc trước!');
            return;
        }

        if (selectedDays.length === 0) {
            alert('⚠️ Vui lòng chọn ít nhất một ngày trong tuần!');
            return;
        }

        if (isTimerActive) {
            clearTimeout(timer);
            setIsTimerActive(false);
            setTimer(null);
            alert('✅ Đã hủy tất cả hẹn giờ!');
            return;
        }

        // Thiết lập nhiều hẹn giờ cho các ngày đã chọn
        setupMultipleReminders();
    }

    const setupMultipleReminders = () => {
        const [hours, minutes] = cycleData.birthControlTime.split(':');
        const now = new Date();
        let nextReminderTime = null;

        for (let i = 0; i < 7; i++) {
            const checkDate = new Date(now);
            checkDate.setDate(now.getDate() + i);
            checkDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);

            const dayOfWeek = getDayValue(checkDate.getDay());
            
            if (selectedDays.includes(dayOfWeek) && checkDate > now) {
                nextReminderTime = checkDate;
                break;
            }
        }

        if (!nextReminderTime) {
            alert('❌ Không thể tìm thấy thời gian hẹn giờ tiếp theo!');
            return;
        }

        const timeUntilReminder = nextReminderTime.getTime() - now.getTime();

        const newTimer = setTimeout(() => {
            const dayName = daysOfWeek.find(day => day.value === getDayValue(nextReminderTime.getDay()))?.label;
            alert(`⏰ Đến giờ uống thuốc tránh thai rồi! (${dayName})`);
            
            // Tự động đặt hẹn giờ tiếp theo
            setIsTimerActive(false);
            setTimer(null);
            setTimeout(() => setupMultipleReminders(), 1000);
        }, timeUntilReminder);

        setTimer(newTimer);
        setIsTimerActive(true);

        const dayName = daysOfWeek.find(day => day.value === getDayValue(nextReminderTime.getDay()))?.label;
        const timeString = nextReminderTime.toLocaleString('vi-VN');
        const selectedDayNames = selectedDays.map(day => 
            daysOfWeek.find(d => d.value === day)?.short
        ).join(', ');
        
        alert(`✅ Đã đặt hẹn giờ!\n📅 Ngày: ${selectedDayNames}\n⏰ Hẹn giờ tiếp theo: ${dayName}, ${timeString}`);
    }

    const getDayValue = (dayIndex) => {
        const dayMap = {
            0: 'sunday',
            1: 'monday', 
            2: 'tuesday',
            3: 'wednesday',
            4: 'thursday',
            5: 'friday',
            6: 'saturday'
        };
        return dayMap[dayIndex];
    }

    return (
        <div className='input-section'>
            <h2>Thông tin chu kì</h2>

            <div className="form-group" style={{ display: 'block' }}>
                <span>Ngày đầu kì kinh nguyệt gần nhất:</span>
                <input
                    type='date'
                    name="lastPeriodDate"
                    value={cycleData.lastPeriodDate}
                    onChange={handleInputChange}
                    style={{ width: '100%' }}
                />
            </div>

            <div className="form-group" style={{ display: 'block' }}>
                <span>Độ dài chu kì (ngày):</span>
                <input
                    type='number'
                    name="cycleLength"
                    value={cycleData.cycleLength}
                    onChange={handleInputChange}
                    min="21"
                    max="35"
                    style={{ width: '100%' }}
                />
            </div>

            <div className="form-group" style={{ display: 'block' }}>
                <span>Số ngày kinh nguyệt:</span>
                <input
                    type='number'
                    name="periodLength"
                    value={cycleData.periodLength}
                    onChange={handleInputChange}
                    min="3"
                    max="8"
                    style={{ width: '100%' }}
                />
            </div>

            <div className="form-group">
                <span>Thời gian uống thuốc tránh thai:</span>
                <div className="time-input-container">
                    <input
                        type='time'
                        name="birthControlTime"
                        value={cycleData.birthControlTime}
                        onChange={handleInputChange}
                        min="06:00"
                        max="23:00"
                        className='time-input'
                    />

                    <button
                        type='button'
                        className='current-time-btn'
                        onClick={() => setQuickTime(getCurrentTime())}
                        title='Đặt thời gian hiện tại'
                    >
                        🕐 Bây giờ
                    </button>
                </div>

                <div className="quick-time-buttons">
                    <span className="quick-time-label">Thời gian phổ biến:</span>
                    <div className="time-buttons-grid">
                        <button
                            type="button"
                            className="quick-time-btn"
                            onClick={() => setQuickTime('07:00')}
                        >
                            7:00 AM
                        </button>
                        <button
                            type="button"
                            className="quick-time-btn"
                            onClick={() => setQuickTime('08:00')}
                        >
                            8:00 AM
                        </button>
                        <button
                            type="button"
                            className="quick-time-btn"
                            onClick={() => setQuickTime('12:00')}
                        >
                            12:00 CH
                        </button>
                        <button
                            type="button"
                            className="quick-time-btn"
                            onClick={() => setQuickTime('18:00')}
                        >
                            6:00 CH
                        </button>
                        <button
                            type="button"
                            className="quick-time-btn"
                            onClick={() => setQuickTime('20:00')}
                        >
                            8:00 CH
                        </button>
                        <button
                            type="button"
                            className="quick-time-btn"
                            onClick={() => setQuickTime('22:00')}
                        >
                            10:00 CH
                        </button>
                    </div>
                </div>

                <div className="day-selection-container">
                    <div className="day-selection-header">
                        <span className="day-selection-label">Chọn ngày trong tuần:</span>
                        <div className="day-selection-actions">
                            <button 
                                type="button" 
                                className="select-all-btn"
                                onClick={selectAllDays}
                                title="Chọn tất cả ngày"
                            >
                                Cả tuần
                            </button>
                            <button 
                                type="button" 
                                className="clear-all-btn"
                                onClick={clearAllDays}
                                title="Bỏ chọn tất cả"
                            >
                                Xóa hết
                            </button>
                        </div>
                    </div>

                    <div className="days-grid">
                        {daysOfWeek.map(day => (
                            <label 
                                key={day.value}
                                className={`day-checkbox ${selectedDays.includes(day.value) ? 'selected' : ''}`}
                            >
                                <input
                                    type="checkbox"
                                    checked={selectedDays.includes(day.value)}
                                    onChange={() => handleDaySelection(day.value)}
                                />
                                <span className="day-short">{day.short}</span>
                                <span className="day-full">{day.label}</span>
                            </label>
                        ))}
                    </div>
                    
                    {selectedDays.length > 0 && (
                        <div className="selected-days-info">
                            <span>✅ Đã chọn: {selectedDays.length} ngày</span>
                        </div>
                    )}
                </div>

                <div className="reminder-section">
                    <button
                        type='button'
                        className={`reminder-btn ${isTimerActive ? 'active' : ''}`}
                        onClick={setReminder}
                        title={isTimerActive ? 'Hủy hẹn giờ' : 'Đặt hẹn giờ'}
                        disabled={!cycleData.birthControlTime || selectedDays.length === 0}
                    >
                        {isTimerActive ? '🔕 Hủy hẹn giờ' : '⏰ Đặt hẹn giờ'}
                    </button>

                    {isTimerActive && (
                        <div className="reminder-status">
                            <span className="status-text">
                                🔔 Đang hoạt động cho {selectedDays.length} ngày/tuần
                            </span>
                        </div>
                    )}
                </div>

                <small style={{ color: '#7f8c8d', fontSize: '0.85rem', marginTop: '5px', display: 'block' }}>
                    Thời gian nên đặt hẹn từ 6:00 sáng đến 11:00 tối
                </small>
            </div>
        </div>
    );
}

export default CycleInputForm;