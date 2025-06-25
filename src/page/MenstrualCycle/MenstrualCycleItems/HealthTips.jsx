import React from 'react';
import PropTypes from 'prop-types';

function HealthTips({ currentPhase }) {
    const getPhaseTips = (phase) => {
        switch (phase) {
            case 'Kì kinh nguyệt':
                return {
                    title: 'Trong kì kinh nguyệt:',
                    tips: [
                        'Uống nhiều nước',
                        'Nghỉ ngơi đầy đủ',
                        'Tránh thực phẩm có caffeine cao',
                        'Tập thể dục nhẹ nhàng'
                    ]
                };
            case 'Kì rụng trứng':
                return {
                    title: 'Trong kì rụng trứng:',
                    tips: [
                        'Thời điểm thụ thai cao nhất',
                        'Chú ý vệ sinh cá nhân',
                        'Tăng cường dinh dưỡng',
                        'Theo dõi nhiệt độ cơ thể'
                    ]
                };
            case 'Kì hoàng thể':
                return {
                    title: 'Trong kì hoàng thể:',
                    tips: [
                        'Có thể xuất hiện triệu chứng PMS',
                        'Tăng cường vitamin B6',
                        'Giảm stress',
                        'Ăn nhiều thực phẩm giàu magie'
                    ]
                };
            default:
                return {
                    title: 'Trong kì nang trứng:',
                    tips: [
                        'Cơ thể chuẩn bị cho chu kì mới',
                        'Tăng cường protein',
                        'Tập thể dục điều độ',
                        'Bổ sung acid folic'
                    ]
                };
        }
    };

    const phaseTips = getPhaseTips(currentPhase);

    return ( 
        <div className="bg-white rounded-xl shadow-lg p-6 border border-pink-100">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <span className="text-2xl mr-2">💡</span>
                Lời khuyên sức khỏe
            </h2>
            <div className="space-y-4">
                {currentPhase && (
                    <div className="bg-pink-50 rounded-lg p-4 border-l-4 border-pink-400">
                        <h4 className="font-semibold text-pink-800 mb-2">{phaseTips.title}</h4>
                        <ul className="space-y-1">
                            {phaseTips.tips.map((tip) => (
                                <li key={tip} className="flex items-start text-pink-700">
                                    <span className="text-pink-400 mr-2 mt-1">•</span>
                                    {tip}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-400">
                    <h4 className="font-semibold text-blue-800 mb-2">Lưu ý chung:</h4>
                    <p className="text-blue-700 text-sm leading-relaxed">
                        Hãy theo dõi thường xuyên và ghi chép các triệu chứng để có 
                        thông tin chính xác nhất về chu kì của bạn. Nếu có bất thường, 
                        hãy tham khảo ý kiến bác sĩ.
                    </p>
                </div>
            </div>
        </div>
    );
};

HealthTips.propTypes = {
    currentPhase: PropTypes.string,
};

HealthTips.defaultProps = {
    currentPhase: '',
};

export default HealthTips;