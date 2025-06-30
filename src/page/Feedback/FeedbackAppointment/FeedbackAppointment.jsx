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
  
  // FIX: Separate hover states for each rating category
  const [hoverRating, setHoverRating] = useState({
    doctor_rating: 0,
    consultation_rating: 0
  });
  
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
    } else {
      // FIX: Handle case when no appointment data
      setError('Không tìm thấy thông tin cuộc hẹn');
      setIsLoading(false);
    }
  }, [appointmentId, location.state]);

  const fetchAppointmentDetails = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const user = JSON.parse(localStorage.getItem('user'));

      if (!accessToken || !user) {
        setError('Vui lòng đăng nhập để tiếp tục');
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      const response = await axiosClient.get(`/v1/appointments/user/${user.user_id}`, {
        headers: {
          'x-access-token': accessToken
        }
      });
      
      if (response.data.success) {
        const arrayAppointments = response.data.data || [];
        const appointment = arrayAppointments.find(app => app.appointment_id === appointmentId);
        
        // FIX: Handle case when appointment not found
        if (!appointment) {
          setError('Không tìm thấy cuộc hẹn này');
        } else {
          setAppointmentData(appointment);
        }
      } else {
        setError('Không thể tải thông tin cuộc hẹn');
      }
    } catch (error) {
      console.error('Error fetching appointment:', error);
      
      // FIX: More specific error messages
      if (error.response?.status === 401) {
        setError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại');
      } else if (error.response?.status === 404) {
        setError('Không tìm thấy cuộc hẹn');
      } else {
        setError('Không thể tải thông tin cuộc hẹn. Vui lòng thử lại');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRatingChange = (category, value) => {
    setFeedback(prev => ({ ...prev, [category]: value }));
    // FIX: Reset hover when rating is set
    setHoverRating(prev => ({ ...prev, [category]: 0 }));
  };

  const handleInputChange = (field, value) => {
    setFeedback(prev => ({ ...prev, [field]: value }));
  };

  // FIX: Handle hover for specific category
  const handleStarHover = (category, value) => {
    setHoverRating(prev => ({ ...prev, [category]: value }));
  };

  const handleStarLeave = (category) => {
    setHoverRating(prev => ({ ...prev, [category]: 0 }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // FIX: Better validation messages
    if (feedback.doctor_rating === 0) {
      alert('Vui lòng đánh giá bác sĩ');
      return;
    }
    
    if (feedback.consultation_rating === 0) {
      alert('Vui lòng đánh giá cuộc tư vấn');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const accessToken = localStorage.getItem('accessToken');

      const feedbackData = {
        // appointment_id: appointmentId || appointmentData?.appointment_id,
        // user_id: user.user_id,
        rating: parseInt((feedback.doctor_rating + feedback.consultation_rating) / 2),
        feedback: feedback.comment.trim()
      };

      console.log('Submitting feedback:', feedbackData);

      const response = await axiosClient.post(`/v1/appointments/${appointmentId}/feedback`, feedbackData, {
        headers: {
          'x-access-token': accessToken,
        }
      });
      
      if (response.status === 200 || response.status === 201) {
        setShowSuccess(true);
        setTimeout(() => {
          navigate('/feedback');
        }, 3000);
      } else {
        throw new Error('Server responded with error');
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // FIX: Corrected star rating logic
  const renderStarRating = (category, currentRating) => {
    const stars = [];
    const starSize = '1.5rem';
    const currentHover = hoverRating[category];
    
    for (let i = 1; i <= 5; i++) {
      const isActive = i <= (currentHover || currentRating);
      
      stars.push(
        <button
          key={i}
          type="button"
          className={cx('star-btn', { 'active': isActive })}
          onClick={() => handleRatingChange(category, i)}
          onMouseEnter={() => handleStarHover(category, i)}
          onMouseLeave={() => handleStarLeave(category)}
        >
          <FontAwesomeIcon 
            icon={faStar} 
            style={{ 
              fontSize: starSize,
              color: isActive ? '#fbbf24' : '#e5e7eb',
              transition: 'color 0.2s ease'
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
        <button onClick={() => navigate('/feedback')} className={cx('back-btn')}>
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
            <span>Đang chuyển về trang feedback...</span>
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
            onClick={() => navigate('/feedback')} 
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
          <div className={cx('ratings-grid')}>
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
              maxLength={500} // FIX: Add character limit
            />
            <div className={cx('char-count')}>
              {feedback.comment.length}/500 ký tự
            </div>
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
                  Đang gửi đánh giá...
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faPaperPlane} />
                  Gửi đánh giá
                </>
              )}
            </button>

            <p className={cx('submit-note')}>
              * Đánh giá của bạn sẽ giúp chúng tôi cải thiện chất lượng dịch vụ
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default FeedbackAppointment;