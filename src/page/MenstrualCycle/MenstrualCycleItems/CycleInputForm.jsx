import React from 'react'
import { useState } from 'react';

function CycleInputForm({ cycleData, onDataChange }) {
    const [timer, setTimer] = useState(null);
    const [isTimerActive, setIsTimerActive] = useState(false);


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

    const setReminder = () => {
        if (!cycleData.birthControlTime) {
            alert('Vui lòng chọn thời gian uống thuốc trước!');
            return;
        }

        if (isTimerActive) {
            clearTimeout(timer);
            setIsTimerActive(false);
            setTimer(null);
            alert('Đã hủy hẹn giờ!');
            return;
        }

        const [hours, minutes] = cycleData.birthControlTime.split(':');
        const now = new Date();
        const reminderTime = new Date();
        reminderTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

        // Nếu thời gian đã qua trong ngày, đặt cho ngày mai
        if (reminderTime <= now) {
            reminderTime.setDate(reminderTime.getDate() + 1);
        }

        const timeUntilReminder = reminderTime.getTime() - now.getTime();

        const newTimer = setTimeout(() => {
            alert('⏰ Đến giờ uống thuốc tránh thai rồi!');
            setIsTimerActive(false);
            setTimer(null);
        }, timeUntilReminder);

        setTimer(newTimer);
        setIsTimerActive(true);

        const timeString = reminderTime.toLocaleString('vi-VN');
        alert(`✅ Đã đặt hẹn giờ lúc ${timeString}`);
    }

    return (
        <div className='input-section'>
            <h2>Thông tin chu kì</h2>

            <div className="form-group">
                <span>Ngày đầu kì kinh nguyệt gần nhất:</span>
                <input
                    type='date'
                    name="lastPeriodDate"
                    value={cycleData.lastPeriodDate}
                    onChange={handleInputChange}
                />
            </div>

            <div className="form-group">
                <span>Độ dài chu kì (ngày):</span>
                <input
                    type='number'
                    name="cycleLength"
                    value={cycleData.cycleLength}
                    onChange={handleInputChange}
                    min="21"
                    max="35"
                />
            </div>

            <div className="form-group">
                <span>Số ngày kinh nguyệt:</span>
                <input
                    type='number'
                    name="periodLength"
                    value={cycleData.periodLength}
                    onChange={handleInputChange}
                    min="3"
                    max="8"
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

                <button
                    type='button'
                    className={`reminder-btn ${isTimerActive ? 'active' : ''}`}
                    onClick={setReminder}
                    title={isTimerActive ? 'Hủy hẹn giờ' : 'Đặt hẹn giờ'}
                >
                    {isTimerActive ? '🔕 Hủy' : '⏰ Hẹn giờ'}
                </button>

                <small style={{ color: '#7f8c8d', fontSize: '0.85rem', marginTop: '5px', display: 'block' }}>
                    Thời gian nên đặt hẹn từ 6:00 sáng đến 11:00 tối
                </small>
            </div>
        </div>
    );
}

export default CycleInputForm;