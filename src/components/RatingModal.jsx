import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faStar } from '@fortawesome/free-solid-svg-icons';

const RatingModal = ({ isOpen, onClose, item, type }) => {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [doctorRating, setDoctorRating] = useState(0);
    const [doctorHoverRating, setDoctorHoverRating] = useState(0);
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen || !item) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Tạo đánh giá
            const ratingData = {
                id: `RATING_${Date.now()}`,
                requestId: item.id,
                requestType: type,
                serviceRating: rating,
                doctorRating: doctorRating,
                comment: comment,
                timestamp: new Date().toISOString(),
                patientName: item.fullName
            };

            // Lưu đánh giá vào localStorage
            const existingRatings = JSON.parse(localStorage.getItem('ratings') || '[]');
            existingRatings.push(ratingData);
            localStorage.setItem('ratings', JSON.stringify(existingRatings));

            // Cập nhật item để đánh dấu đã được đánh giá
            if (type === 'appointment') {
                const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
                const updatedAppointments = appointments.map(apt =>
                    apt.id === item.id ? { ...apt, rated: true, ratingId: ratingData.id } : apt
                );
                localStorage.setItem('appointments', JSON.stringify(updatedAppointments));
            } else {
                const testOrders = JSON.parse(localStorage.getItem('testOrders') || '[]');
                const updatedTestOrders = testOrders.map(test =>
                    test.id === item.id ? { ...test, rated: true, ratingId: ratingData.id } : test
                );
                localStorage.setItem('testOrders', JSON.stringify(updatedTestOrders));
            }

            // Xóa thông báo cần đánh giá
            const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
            const updatedNotifications = notifications.filter(notif => 
                !(notif.requestId === item.id && notif.needsRating)
            );
            localStorage.setItem('notifications', JSON.stringify(updatedNotifications));

            // Tạo thông báo cảm ơn
            const thankYouNotification = {
                id: `THANK_YOU_${Date.now()}`,
                type: 'rating-thanks',
                title: 'Cảm ơn đánh giá của bạn',
                message: 'Cảm ơn bạn đã dành thời gian đánh giá dịch vụ. Phản hồi của bạn giúp chúng tôi cải thiện chất lượng phục vụ.',
                timestamp: new Date().toISOString(),
                read: false
            };

            updatedNotifications.unshift(thankYouNotification);
            localStorage.setItem('notifications', JSON.stringify(updatedNotifications));

            alert('Cảm ơn bạn đã đánh giá dịch vụ!');
            onClose();
        } catch (error) {
            console.error('Error submitting rating:', error);
            alert('Có lỗi xảy ra khi gửi đánh giá!');
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderStars = (currentRating, hoverRating, onRate, onHover, onLeave) => {
        return (
            <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type="button"
                        onClick={() => onRate(star)}
                        onMouseEnter={() => onHover(star)}
                        onMouseLeave={onLeave}
                        className="focus:outline-none"
                    >
                        <FontAwesomeIcon
                            icon={faStar}
                            className={`w-6 h-6 ${
                                star <= (hoverRating || currentRating)
                                    ? 'text-yellow-400'
                                    : 'text-gray-300'
                            } hover:text-yellow-400 transition-colors`}
                        />
                    </button>
                ))}
            </div>
        );
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">
                        Đánh giá dịch vụ
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <FontAwesomeIcon icon={faTimes} className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Service Info */}
                    <div className="text-center">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            {type === 'appointment' ? 'Tư vấn khám bệnh' : 'Xét nghiệm'}
                        </h3>
                        <p className="text-sm text-gray-600">
                            Hoàn thành lúc: {new Date(item.completedAt).toLocaleString('vi-VN')}
                        </p>
                    </div>

                    {/* Service Rating */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Đánh giá chất lượng dịch vụ *
                        </label>
                        {renderStars(
                            rating,
                            hoverRating,
                            setRating,
                            setHoverRating,
                            () => setHoverRating(0)
                        )}
                        <p className="text-xs text-gray-500 mt-1">
                            {rating === 0 && 'Chọn số sao để đánh giá'}
                            {rating === 1 && 'Rất không hài lòng'}
                            {rating === 2 && 'Không hài lòng'}
                            {rating === 3 && 'Bình thường'}
                            {rating === 4 && 'Hài lòng'}
                            {rating === 5 && 'Rất hài lòng'}
                        </p>
                    </div>

                    {/* Doctor Rating */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Đánh giá bác sĩ *
                        </label>
                        {renderStars(
                            doctorRating,
                            doctorHoverRating,
                            setDoctorRating,
                            setDoctorHoverRating,
                            () => setDoctorHoverRating(0)
                        )}
                        <p className="text-xs text-gray-500 mt-1">
                            {doctorRating === 0 && 'Chọn số sao để đánh giá bác sĩ'}
                            {doctorRating === 1 && 'Rất không hài lòng'}
                            {doctorRating === 2 && 'Không hài lòng'}
                            {doctorRating === 3 && 'Bình thường'}
                            {doctorRating === 4 && 'Hài lòng'}
                            {doctorRating === 5 && 'Rất hài lòng'}
                        </p>
                    </div>

                    {/* Comment */}
                    <div>
                        <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
                            Ghi chú (tùy chọn)
                        </label>
                        <textarea
                            id="comment"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Chia sẻ trải nghiệm của bạn..."
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors"
                        >
                            Để sau
                        </button>
                        <button
                            type="submit"
                            disabled={rating === 0 || doctorRating === 0 || isSubmitting}
                            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                        >
                            {isSubmitting ? 'Đang gửi...' : 'Gửi đánh giá'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RatingModal;
