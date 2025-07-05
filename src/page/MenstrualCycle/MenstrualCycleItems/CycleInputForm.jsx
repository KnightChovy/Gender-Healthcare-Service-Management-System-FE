import React, { useState } from 'react';
import PropTypes from 'prop-types';

function CycleInputForm({ cycleData, onDataChange, onSave }) {
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
        <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Thông tin chu kì</h2>

            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ngày đầu kì kinh nguyệt gần nhất:
                </label>
                <input
                    type='date'
                    name="lastPeriodDate"
                    value={cycleData.lastPeriodDate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
            </div>

            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Độ dài chu kì (ngày):
                </label>
                <input
                    type='number'
                    name="cycleLength"
                    value={cycleData.cycleLength}
                    onChange={handleInputChange}
                    min="21"
                    max="35"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
            </div>

            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Số ngày kinh nguyệt:
                </label>
                <input
                    type='number'
                    name="periodLength"
                    value={cycleData.periodLength}
                    onChange={handleInputChange}
                    min="3"
                    max="8"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
            </div>

            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Thời gian uống thuốc tránh thai:
                </label>
                <div className="flex gap-2 mb-4">
                    <input
                        type='time'
                        name="birthControlTime"
                        value={cycleData.birthControlTime}
                        onChange={handleInputChange}
                        min="06:00"
                        max="23:00"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />

                    <button
                        type='button'
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm"
                        onClick={() => setQuickTime(getCurrentTime())}
                        title='Đặt thời gian hiện tại'
                    >
                        🕐 Bây giờ
                    </button>
                </div>

                <div className="mb-4">
                    <span className="text-sm font-medium text-gray-700 mb-2 block">Thời gian phổ biến:</span>
                    <div className="grid grid-cols-3 gap-2">
                        <button
                            type="button"
                            className="px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm"
                            onClick={() => setQuickTime('07:00')}
                        >
                            7:00 AM
                        </button>
                        <button
                            type="button"
                            className="px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm"
                            onClick={() => setQuickTime('08:00')}
                        >
                            8:00 AM
                        </button>
                        <button
                            type="button"
                            className="px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm"
                            onClick={() => setQuickTime('12:00')}
                        >
                            12:00 CH
                        </button>
                        <button
                            type="button"
                            className="px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm"
                            onClick={() => setQuickTime('18:00')}
                        >
                            6:00 CH
                        </button>
                        <button
                            type="button"
                            className="px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm"
                            onClick={() => setQuickTime('20:00')}
                        >
                            8:00 CH
                        </button>
                        <button
                            type="button"
                            className="px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm"
                            onClick={() => setQuickTime('22:00')}
                        >
                            10:00 CH
                        </button>
                    </div>
                </div>

                <div className="mb-4">
                    <div className="flex justify-between items-center mb-3">
                        <span className="text-sm font-medium text-gray-700">Chọn ngày trong tuần:</span>
                        <div className="flex gap-2">
                            <button 
                                type="button" 
                                className="px-3 py-1 bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors text-sm"
                                onClick={selectAllDays}
                                title="Chọn tất cả ngày"
                            >
                                Cả tuần
                            </button>
                            <button 
                                type="button" 
                                className="px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors text-sm"
                                onClick={clearAllDays}
                                title="Bỏ chọn tất cả"
                            >
                                Xóa hết
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-7 gap-2">
                        {daysOfWeek.map(day => (
                            <label 
                                key={day.value}
                                className={`flex flex-col items-center p-3 border rounded-md cursor-pointer transition-colors ${
                                    selectedDays.includes(day.value) 
                                        ? 'bg-pink-100 border-pink-500 text-pink-700' 
                                        : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
                                }`}
                            >
                                <input
                                    type="checkbox"
                                    checked={selectedDays.includes(day.value)}
                                    onChange={() => handleDaySelection(day.value)}
                                    className="sr-only"
                                />
                                <span className="font-bold text-lg">{day.short}</span>
                                <span className="text-xs mt-1">{day.label}</span>
                            </label>
                        ))}
                    </div>
                    
                    {selectedDays.length > 0 && (
                        <div className="mt-3 p-2 bg-green-100 text-green-700 rounded-md text-sm">
                            <span>✅ Đã chọn: {selectedDays.length} ngày</span>
                        </div>
                    )}
                </div>

                <div className="mb-4">
                    <button
                        type='button'
                        className={`w-full py-3 px-4 rounded-md font-medium transition-colors ${
                            isTimerActive 
                                ? 'bg-red-500 text-white hover:bg-red-600' 
                                : 'bg-pink-500 text-white hover:bg-pink-600'
                        } disabled:bg-gray-300 disabled:cursor-not-allowed`}
                        onClick={setReminder}
                        title={isTimerActive ? 'Hủy hẹn giờ' : 'Đặt hẹn giờ'}
                        disabled={!cycleData.birthControlTime || selectedDays.length === 0}
                    >
                        {isTimerActive ? '🔕 Hủy hẹn giờ' : '⏰ Đặt hẹn giờ'}
                    </button>

                    {isTimerActive && (
                        <div className="mt-3 p-3 bg-blue-100 text-blue-700 rounded-md text-sm">
                            <span className="font-medium">
                                🔔 Đang hoạt động cho {selectedDays.length} ngày/tuần
                            </span>
                        </div>
                    )}
                </div>

                <small className="text-gray-500 text-sm block mt-2">
                    Thời gian nên đặt hẹn từ 6:00 sáng đến 11:00 tối
                </small>

                {/* Email Input for Notifications */}
                <div className="mt-6 mb-4">
                    <label htmlFor="email-input" className="block text-sm font-medium text-gray-700 mb-2">
                        📧 Email nhận thông báo chu kỳ
                    </label>
                    <input
                        id="email-input"
                        type="email"
                        name="email"
                        value={cycleData.email || ''}
                        onChange={handleInputChange}
                        placeholder="Nhập địa chỉ email của bạn"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                    <small className="text-gray-500 text-sm block mt-1">
                        Chúng tôi sẽ gửi thông báo nhắc nhở về chu kỳ kinh nguyệt và thời gian rụng trứng qua email này
                    </small>
                </div>

                {/* Save Button */}
                <div className="mt-6">
                    <button
                        type="button"
                        onClick={onSave}
                        className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 px-4 rounded-md font-medium hover:from-pink-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                        disabled={!cycleData.lastPeriodDate || !cycleData.email}
                    >
                        💾 Lưu & Thiết lập thông báo
                    </button>
                    <small className="text-gray-500 text-sm block mt-2 text-center">
                        Lưu thông tin để nhận thông báo về chu kỳ kinh nguyệt qua email
                    </small>
                </div>
            </div>
        </div>
    );
}

CycleInputForm.propTypes = {
    cycleData: PropTypes.shape({
        lastPeriodDate: PropTypes.string,
        cycleLength: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        periodLength: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        birthControlTime: PropTypes.string,
        email: PropTypes.string
    }).isRequired,
    onDataChange: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired
};

export default CycleInputForm;