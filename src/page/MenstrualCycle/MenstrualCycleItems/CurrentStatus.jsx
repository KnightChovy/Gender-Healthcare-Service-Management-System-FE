import React from 'react';
import PropTypes from 'prop-types';

function CurrentStatus({ predictions, currentPhase }) {
    const formatDate = (date) => {
        if (!date) return '';
        return date.toLocaleDateString('vi-VN', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getDaysUntil = (targetDate) => {
        if (!targetDate) return 0;
        const today = new Date();
        const diffTime = targetDate - today;
        const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if(days < 0) {
            return `${Math.abs(days)} ngày trước`;
        }
        else if (days === 0) {
            return 'Hôm nay';
        } 
        else {
            return `Còn ${days} ngày`;
        }
    };

    const getPhaseColor = (phase) => {
        switch (phase) {
            case 'Kì kinh nguyệt':
                return 'bg-red-400';
            case 'Kì rụng trứng':
                return 'bg-teal-400';
            case 'Kì hoàng thể':
                return 'bg-blue-400';
            default:
                return 'bg-green-300';
        }
    };

    return ( 
        <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Trạng thái hiện tại</h2>

            <div className={`${getPhaseColor(currentPhase)} text-white p-4 rounded-lg mb-6 text-center`}>
                <h3 className="text-xl font-semibold">{currentPhase}</h3>
            </div>

            {predictions.nextPeriod && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-pink-50 p-4 rounded-lg border border-pink-200">
                        <h4 className="font-semibold text-pink-800 mb-2">Kì kinh nguyệt tiếp theo</h4>
                        <p className="text-lg font-bold text-pink-600">{formatDate(predictions.nextPeriod)}</p>
                        <p className="text-sm text-pink-500">{getDaysUntil(predictions.nextPeriod)}</p>
                    </div>

                    <div className="bg-teal-50 p-4 rounded-lg border border-teal-200">
                        <h4 className="font-semibold text-teal-800 mb-2">Ngày rụng trứng dự kiến</h4>
                        <p className="text-lg font-bold text-teal-600">{formatDate(predictions.ovulationDate)}</p>
                        <p className="text-sm text-teal-500">{getDaysUntil(predictions.ovulationDate)}</p>
                    </div>

                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                        <h4 className="font-semibold text-purple-800 mb-2">Cửa sổ thụ thai</h4>
                        <p className="text-sm font-medium text-purple-600">
                            {formatDate(predictions.fertilityWindow.start)} - {formatDate(predictions.fertilityWindow.end)}
                        </p>
                        <p className="text-sm text-red-500 font-semibold mt-1">Khả năng mang thai cao</p>
                    </div>
                </div>
            )}

            {/* Detailed Cycle Information */}
            {predictions.detailedInfo && predictions.detailedInfo.length > 0 && (
                <div className="mt-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">📅 Lịch chu kỳ 6 tháng tới</h3>
                    <div className="space-y-4">
                        {predictions.detailedInfo.map((cycle) => (
                            <div key={`cycle-${cycle.cycleNumber}-${cycle.periodStart.getTime()}`} className="bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-200 rounded-lg p-4">
                                <div className="flex justify-between items-center mb-3">
                                    <h4 className="font-semibold text-lg text-gray-800">
                                        Chu kỳ {cycle.cycleNumber}
                                    </h4>
                                    <span className="text-sm text-gray-600">
                                        {cycle.periodStart.toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' })}
                                    </span>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    <div className="bg-red-100 p-3 rounded-lg">
                                        <h5 className="font-medium text-red-800 text-sm mb-1">🩸 Kỳ kinh nguyệt</h5>
                                        <p className="text-sm text-red-700 font-semibold">
                                            {cycle.periodStart.toLocaleDateString('vi-VN')}
                                        </p>
                                        <p className="text-xs text-red-600">
                                            {getDaysUntil(cycle.periodStart)}
                                        </p>
                                    </div>
                                    
                                    <div className="bg-green-100 p-3 rounded-lg">
                                        <h5 className="font-medium text-green-800 text-sm mb-1">🥚 Ngày rụng trứng</h5>
                                        <p className="text-sm text-green-700 font-semibold">
                                            {cycle.ovulation.toLocaleDateString('vi-VN')}
                                        </p>
                                        <p className="text-xs text-green-600">
                                            {getDaysUntil(cycle.ovulation)}
                                        </p>
                                    </div>
                                    
                                    <div className="bg-purple-100 p-3 rounded-lg">
                                        <h5 className="font-medium text-purple-800 text-sm mb-1">⏱️ Thời gian</h5>
                                        <p className="text-sm text-purple-700">
                                            {Math.ceil((cycle.periodEnd - cycle.periodStart) / (1000 * 60 * 60 * 24)) + 1} ngày
                                        </p>
                                        <p className="text-xs text-purple-600">
                                            Chu kỳ dài
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <h4 className="font-semibold text-blue-800 mb-2">💡 Lưu ý quan trọng</h4>
                        <ul className="text-sm text-blue-700 space-y-1">
                            <li>• Chu kỳ kinh nguyệt có thể thay đổi do căng thẳng, thay đổi cân nặng hoặc tình trạng sức khỏe</li>
                            <li>• Thời gian rụng trứng có thể dao động ±2 ngày so với dự đoán</li>
                            <li>• Nếu chu kỳ không đều hoặc có triệu chứng bất thường, hãy tham khảo ý kiến bác sĩ</li>
                            <li>• Ghi chép chu kỳ hàng ngày sẽ giúp dự đoán chính xác hơn</li>
                        </ul>
                    </div>
                </div>
            )}
        </div>
     );
}

CurrentStatus.propTypes = {
    predictions: PropTypes.shape({
        nextPeriod: PropTypes.instanceOf(Date),
        ovulationDate: PropTypes.instanceOf(Date),
        fertilityWindow: PropTypes.shape({
            start: PropTypes.instanceOf(Date),
            end: PropTypes.instanceOf(Date)
        }),
        detailedInfo: PropTypes.arrayOf(PropTypes.shape({
            month: PropTypes.number,
            periodStart: PropTypes.instanceOf(Date),
            periodEnd: PropTypes.instanceOf(Date),
            ovulation: PropTypes.instanceOf(Date),
            cycleNumber: PropTypes.number
        }))
    }),
    currentPhase: PropTypes.string.isRequired
};

export default CurrentStatus;