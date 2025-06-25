import React from 'react';
import PropTypes from 'prop-types';

function CurrentStatus({ predictions, currentPhase }) {
    const formatDate = (date) => {
        if (!date) return '';
        return date.toLocaleDateString('vi-VN');
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
        })
    }),
    currentPhase: PropTypes.string.isRequired
};

export default CurrentStatus;