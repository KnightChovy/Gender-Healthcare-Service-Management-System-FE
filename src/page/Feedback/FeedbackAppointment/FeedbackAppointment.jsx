import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faStar, faUserMd, faCalendarAlt,
  faClock, faCheckCircle, faTimesCircle, faSpinner,
  faPaperPlane, faArrowLeft, faStethoscope, faComments
} from '@fortawesome/free-solid-svg-icons';
import axiosClient from '../../../services/axiosClient';
import classNames from 'classnames/bind';
import styles from './FeedbackAppointment.module.scss';

const cx = classNames.bind(styles);

function FeedbackAppointment() {
  const navigate = useNavigate();
  const { appointmentId } = useParams();
  const location = useLocation();
  
  const [appointmentData, setAppointmentData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  
  const [hoverRating, setHoverRating] = useState(0);
  const [feedback, setFeedback] = useState({
    doctor_rating: 0,
    consultation_rating: 0,
    comment: ''
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
      const accessToken = localStorage.getItem('access_token');
      const user = JSON.parse(localStorage.getItem('user'));
      setIsLoading(true);
      const response = await axiosClient.get(`/v1/appointments/user/${user.user_id}`, {
        headers: {
          'x-access-token': accessToken
        }
      });
      if (response.data.success) {
        const arrayAppointments = response.data.data || [];
        const appointment = arrayAppointments.find(app => app.appointment_id === appointmentId);
        setAppointmentData(appointment);
      }
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
    
    if (feedback.doctor_rating === 0 || feedback.consultation_rating === 0) {
      alert('Vui lòng đánh giá cả bác sĩ và cuộc tư vấn');
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
          navigate('/feedback');
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
    const starSize = '1.5rem';
    
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <button
          key={i}
          type="button"
          className={cx('star-btn')}
          onClick={() => handleRatingChange(category, i)}
          onMouseEnter={() => setHoverRating(i)}
          onMouseLeave={() => setHoverRating(0)}
        >
          <FontAwesomeIcon 
            icon={faStar} 
            style={{ 
              fontSize: starSize,
              color: i <= (hoverRating && category === 'doctor_rating' ? hoverRating : currentRating) 
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
          <p>Phản hồi của bạn giúp chúng tôi cải thiện chất lượng dịch vụ</p>
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
            <h1>Đánh giá buổi tư vấn</h1>
            <p>Chia sẻ đánh giá của bạn về bác sĩ và cuộc tư vấn</p>
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
          {/* Rating Grid - 2 columns */}
          <div className={cx('rating-grid')}>
            {/* Doctor Rating */}
            <div className={cx('rating-section', 'doctor-rating')}>
              <h3>
                <FontAwesomeIcon icon={faUserMd} />
                Đánh giá bác sĩ
              </h3>
              <p className={cx('rating-description')}>
                Bác sĩ có chuyên nghiệp và nhiệt tình không?
              </p>
              <div className={cx('rating-container')}>
                <div className={cx('stars-container')}>
                  {renderStarRating('doctor_rating', feedback.doctor_rating)}
                </div>
                <div className={cx('rating-text')}>
                  {getRatingText(feedback.doctor_rating)}
                </div>
              </div>
            </div>

            {/* Consultation Rating */}
            <div className={cx('rating-section', 'consultation-rating')}>
              <h3>
                <FontAwesomeIcon icon={faStethoscope} />
                Đánh giá tư vấn
              </h3>
              <p className={cx('rating-description')}>
                Cuộc tư vấn có hữu ích không?
              </p>
              <div className={cx('rating-container')}>
                <div className={cx('stars-container')}>
                  {renderStarRating('consultation_rating', feedback.consultation_rating)}
                </div>
                <div className={cx('rating-text')}>
                  {getRatingText(feedback.consultation_rating)}
                </div>
              </div>
            </div>
          </div>

          {/* Optional Comment */}
          <div className={cx('comment-section')}>
            <h3>
              <FontAwesomeIcon icon={faComments} />
              Nhận xét (tùy chọn)
            </h3>
            <textarea
              className={cx('comment-textarea')}
              placeholder="Chia sẻ thêm cảm nhận của bạn về buổi tư vấn..."
              value={feedback.comment}
              onChange={(e) => handleInputChange('comment', e.target.value)}
              rows={3}
            />
          </div>

          {/* Submit Button */}
          <div className={cx('submit-section')}>
            <button
              type="submit"
              className={cx('submit-btn')}
              disabled={isSubmitting || feedback.doctor_rating === 0 || feedback.consultation_rating === 0}
            >
              {isSubmitting ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} spin />
                  Đang gửi...
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faPaperPlane} />
                  Gửi đánh giá
                </>
              )}
            </button>

            <p className={cx('submit-note')}>
              * Đánh giá giúp cải thiện chất lượng dịch vụ
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default FeedbackAppointment;