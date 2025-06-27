import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faStar, faUserMd, faCalendarAlt,
  faClock, faCheckCircle, faTimesCircle, faSpinner,
  faThumbsUp, faThumbsDown, faPaperPlane, faArrowLeft,
  faStethoscope
} from '@fortawesome/free-solid-svg-icons';
import axiosClient from '../../../services/axiosClient';
import classNames from 'classnames/bind';
import styles from './FeedbackAppointment.module.scss';

const cx = classNames.bind(styles);

function FeedbackAppointment() {
  const navigate = useNavigate();
  const { appointmentId } = useParams();
  const location = useLocation();
  
  // States
  const [appointmentData, setAppointmentData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  
  // Simplified feedback form - chỉ cho tư vấn
  const [hoverRating, setHoverRating] = useState(0);
  const [feedback, setFeedback] = useState({
    overall_rating: 0,           
    doctor_rating: 0,            
    consultation_quality: 0,     
    comment: '',                 
    would_recommend: null,       
    improvement_suggestions: ''  
  });
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (appointmentId) {
      fetchAppointmentDetails();
    } else if (location.state?.appointmentData) {
      setAppointmentData(location.state.appointmentData);
      setIsLoading(false);
    }
  }, [appointmentId, location.state]);

  const fetchAppointmentDetails = async () => {
    try {
      setIsLoading(true);
      const response = await axiosClient.get(`/appointments/${appointmentId}`);
      setAppointmentData(response.data);
    } catch (error) {
      console.error('Error fetching appointment:', error);
      setError('Không thể tải thông tin cuộc hẹn');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRatingChange = (category, value) => {
    setFeedback(prev => ({ ...prev, [category]: value }));
  };

  const handleInputChange = (field, value) => {
    setFeedback(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (feedback.overall_rating === 0) {
      alert('Vui lòng đánh giá tổng quan về buổi tư vấn');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const feedbackData = {
        appointment_id: appointmentId || appointmentData?.appointment_id,
        user_id: JSON.parse(localStorage.getItem('user'))?.user_id,
        ...feedback,
        created_at: new Date().toISOString()
      };

      const response = await axiosClient.post('/feedback', feedbackData);
      
      if (response.status === 200 || response.status === 201) {
        setShowSuccess(true);
        setTimeout(() => {
          navigate('/my-appointments');
        }, 3000);
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Có lỗi xảy ra khi gửi đánh giá. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStarRating = (category, currentRating, size = 'normal') => {
    const stars = [];
    const starSize = size === 'large' ? '2rem' : '1.5rem';
    
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <button
          key={i}
          type="button"
          className={cx('star-btn', {
            'filled': i <= currentRating,
            'large': size === 'large'
          })}
          onClick={() => handleRatingChange(category, i)}
          onMouseEnter={() => size === 'large' && setHoverRating(i)}
          onMouseLeave={() => size === 'large' && setHoverRating(0)}
        >
          <FontAwesomeIcon 
            icon={faStar} 
            style={{ 
              fontSize: starSize,
              color: i <= (size === 'large' ? (hoverRating || currentRating) : currentRating) 
                ? '#fbbf24' : '#e5e7eb'
            }}
          />
        </button>
      );
    }
    return stars;
  };

  const getRatingText = (rating) => {
    if (rating === 0) return 'Chưa đánh giá';
    if (rating <= 1) return 'Rất không hài lòng';
    if (rating <= 2) return 'Không hài lòng';
    if (rating <= 3) return 'Bình thường';
    if (rating <= 4) return 'Hài lòng';
    return 'Rất hài lòng';
  };

  if (isLoading) {
    return (
      <div className={cx('loading-container')}>
        <FontAwesomeIcon icon={faSpinner} spin className={cx('loading-icon')} />
        <p>Đang tải thông tin...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cx('error-container')}>
        <FontAwesomeIcon icon={faTimesCircle} className={cx('error-icon')} />
        <p>{error}</p>
        <button onClick={() => navigate('/my-appointments')} className={cx('back-btn')}>
          Quay lại
        </button>
      </div>
    );
  }

  if (showSuccess) {
    return (
      <div className={cx('success-container')}>
        <div className={cx('success-animation')}>
          <FontAwesomeIcon icon={faCheckCircle} className={cx('success-icon')} />
          <h2>Cảm ơn bạn đã đánh giá!</h2>
          <p>Phản hồi của bạn giúp chúng tôi cải thiện chất lượng tư vấn</p>
          <div className={cx('redirect-info')}>
            <FontAwesomeIcon icon={faSpinner} spin />
            <span>Đang chuyển về trang lịch hẹn...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cx('feedback-page')}>
      <div className={cx('container')}>
        {/* Header */}
        <div className={cx('page-header')}>
          <button 
            onClick={() => navigate('/my-appointments')} 
            className={cx('back-button')}
          >
            <FontAwesomeIcon icon={faArrowLeft} />
            Quay lại
          </button>
          <div className={cx('header-content')}>
            <h1>🩺 Đánh giá buổi tư vấn</h1>
            <p>Chia sẻ trải nghiệm tư vấn của bạn để chúng tôi phục vụ tốt hơn</p>
          </div>
        </div>

        {/* Appointment Info */}
        {appointmentData && (
          <div className={cx('appointment-info')}>
            <h3>Thông tin buổi tư vấn</h3>
            <div className={cx('info-grid')}>
              <div className={cx('info-item')}>
                <FontAwesomeIcon icon={faUserMd} />
                <span>Bác sĩ: {appointmentData.doctor_name || 'Chưa xác định'}</span>
              </div>
              <div className={cx('info-item')}>
                <FontAwesomeIcon icon={faCalendarAlt} />
                <span>Ngày: {new Date(appointmentData.appointment_date).toLocaleDateString('vi-VN')}</span>
              </div>
              <div className={cx('info-item')}>
                <FontAwesomeIcon icon={faClock} />
                <span>Giờ: {appointmentData.appointment_time}</span>
              </div>
              <div className={cx('info-item')}>
                <FontAwesomeIcon icon={faStethoscope} />
                <span>Loại tư vấn: {appointmentData.consultant_type}</span>
              </div>
            </div>
          </div>
        )}

        {/* Feedback Form */}
        <form onSubmit={handleSubmit} className={cx('feedback-form')}>
          {/* Overall Rating */}
          <div className={cx('rating-section', 'main-rating')}>
            <h3>🌟 Đánh giá tổng quan về buổi tư vấn</h3>
            <div className={cx('rating-container')}>
              <div className={cx('stars-container')}>
                {renderStarRating('overall_rating', feedback.overall_rating, 'large')}
              </div>
              <div className={cx('rating-text')}>
                {getRatingText(hoverRating || feedback.overall_rating)}
              </div>
            </div>
          </div>

          {/* Consultation Specific Ratings */}
          <div className={cx('consultation-ratings')}>
            <h3>📋 Đánh giá chi tiết</h3>
            
            <div className={cx('rating-row')}>
              <label>
                <FontAwesomeIcon icon={faUserMd} className={cx('rating-icon')} />
                Bác sĩ tư vấn
              </label>
              <div className={cx('rating-stars')}>
                {renderStarRating('doctor_rating', feedback.doctor_rating)}
              </div>
              <span className={cx('rating-label')}>
                {getRatingText(feedback.doctor_rating)}
              </span>
            </div>

            <div className={cx('rating-row')}>
              <label>
                <FontAwesomeIcon icon={faStethoscope} className={cx('rating-icon')} />
                Chất lượng tư vấn
              </label>
              <div className={cx('rating-stars')}>
                {renderStarRating('consultation_quality', feedback.consultation_quality)}
              </div>
              <span className={cx('rating-label')}>
                {getRatingText(feedback.consultation_quality)}
              </span>
            </div>
          </div>

          {/* Recommendation */}
          <div className={cx('recommendation-section')}>
            <h3>💡 Bạn có giới thiệu dịch vụ tư vấn này cho người khác không?</h3>
            <div className={cx('recommendation-buttons')}>
              <button
                type="button"
                className={cx('recommend-btn', { active: feedback.would_recommend === true })}
                onClick={() => handleInputChange('would_recommend', true)}
              >
                <FontAwesomeIcon icon={faThumbsUp} />
                Có, tôi sẽ giới thiệu
              </button>
              <button
                type="button"
                className={cx('recommend-btn', 'negative', { active: feedback.would_recommend === false })}
                onClick={() => handleInputChange('would_recommend', false)}
              >
                <FontAwesomeIcon icon={faThumbsDown} />
                Không
              </button>
            </div>
          </div>

          {/* Comments */}
          <div className={cx('comment-section')}>
            <h3>💬 Nhận xét về buổi tư vấn</h3>
            <textarea
              className={cx('comment-textarea')}
              placeholder="Chia sẻ cảm nhận của bạn về buổi tư vấn: Bác sĩ có nhiệt tình không? Lời khuyên có hữu ích không? Thời gian tư vấn có đủ không?..."
              value={feedback.comment}
              onChange={(e) => handleInputChange('comment', e.target.value)}
              rows={5}
            />
          </div>

          {/* Improvement Suggestions */}
          <div className={cx('suggestion-section')}>
            <h3>🚀 Đề xuất cải thiện</h3>
            <textarea
              className={cx('suggestion-textarea')}
              placeholder="Bạn có đề xuất gì để chúng tôi cải thiện chất lượng tư vấn? (Ví dụ: thời gian tư vấn, cách thức tư vấn, thông tin cung cấp...)"
              value={feedback.improvement_suggestions}
              onChange={(e) => handleInputChange('improvement_suggestions', e.target.value)}
              rows={3}
            />
          </div>

          {/* Submit Button */}
          <div className={cx('submit-section')}>
            <button
              type="submit"
              className={cx('submit-btn')}
              disabled={isSubmitting || feedback.overall_rating === 0}
            >
              {isSubmitting ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} spin />
                  Đang gửi đánh giá...
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faPaperPlane} />
                  Gửi đánh giá tư vấn
                </>
              )}
            </button>

            <p className={cx('submit-note')}>
              * Đánh giá của bạn sẽ giúp chúng tôi cải thiện chất lượng dịch vụ tư vấn
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default FeedbackAppointment;