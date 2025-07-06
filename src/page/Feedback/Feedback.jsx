import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faStethoscope, faFlaskVial, faStar, faComments,
  faCalendarCheck, faClipboardList, faArrowRight,
  faUserMd, faHospital, faChartLine, faHandHoldingHeart,
  faEye, faTimes
} from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames/bind';
import styles from './Feedback.module.scss';
import axiosClient from '../../services/axiosClient';

const cx = classNames.bind(styles);

function Feedback() {
  const navigate = useNavigate();
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [recentTestOrders, setRecentTestOrders] = useState([]);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        const user = JSON.parse(localStorage.getItem('user'));
        if (!accessToken || !user) {
          navigate('/login');
          return;
        }
        const response = await axiosClient.get(`/v1/appointments/user/${user.user_id}`, {
          headers: {
            'x-access-token': accessToken
          }
        });
        if (response.data.success) {
          setRecentAppointments(response.data.data);
        }

      } catch (error) {
        console.error('Error fetching data:', error);
      }

    };
    fetchData();
    setRecentTestOrders([
      {
        id: 'TST001',
        serviceName: 'Xét nghiệm máu tổng quát',
        date: '2024-01-12',
        time: '08:00',
        status: 'completed',
        canFeedback: true
      },
      {
        id: 'TST002',
        serviceName: 'Xét nghiệm hormone',
        date: '2024-01-08',
        time: '10:30',
        status: 'completed',
        canFeedback: true
      }
    ]);
  }, []);

  const handleAppointmentFeedback = (appointmentId) => {
    navigate(`/feedback/consultation/${appointmentId}`);
  };

  const handleTestServiceFeedback = (testOrderId) => {
    navigate(`/feedback/test-service/${testOrderId}`);
  };

  const handleViewFeedback = async (appointmentId) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const user = JSON.parse(localStorage.getItem('user'));
      
      if (!accessToken || !user) {
        navigate('/login');
        return;
      }

      // Get all appointments and find the specific one
      const response = await axiosClient.get(`/v1/appointments/user/${user.user_id}`, {
        headers: {
          'x-access-token': accessToken
        }
      });

      if (response.data.success) {
        const appointment = response.data.data.find(
          app => app.appointment_id === appointmentId
        );
        
        if (appointment) {
          setSelectedAppointment(appointment);
          setShowFeedbackModal(true);
        }
      }
    } catch (error) {
      console.error('Error fetching appointment details:', error);
    }
  };

  const closeFeedbackModal = () => {
    setShowFeedbackModal(false);
    setSelectedAppointment(null);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  // Đổi tên hàm từ renderStars thành renderStars (giữ nguyên vì đây là UI component)
  const renderStars = (feedback) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FontAwesomeIcon
          key={i}
          icon={faStar}
          className={cx('star', { 'star-filled': i <= feedback })}
        />
      );
    }
    return stars;
  };

  return (
    <div className={cx('feedback-main')}>
      <div className={cx('container')}>
        {/* Header */}
        <div className={cx('page-header')}>
          <div className={cx('header-content')}>
            <h1>Đánh giá dịch vụ</h1>
            <p>Chia sẻ trải nghiệm của bạn để chúng tôi phục vụ tốt hơn</p>
          </div>
          <div className={cx('stats-cards')}>
            <div className={cx('stat-card')}>
              <div className={cx('stat-icon')}>
                <FontAwesomeIcon icon={faStethoscope} />
              </div>
              <div className={cx('stat-info')}>
                <span className={cx('stat-number')}>{recentAppointments.length}</span>
                <span className={cx('stat-label')}>Cuộc hẹn tư vấn</span>
              </div>
            </div>
            <div className={cx('stat-card')}>
              <div className={cx('stat-icon')}>
                <FontAwesomeIcon icon={faFlaskVial} />
              </div>
              <div className={cx('stat-info')}>
                <span className={cx('stat-number')}>{recentTestOrders.length}</span>
                <span className={cx('stat-label')}>Đơn xét nghiệm</span>
              </div>
            </div>
          </div>
        </div>

        {/* Feedback Options */}
        <div className={cx('feedback-options')}>
          <h2>Chọn loại dịch vụ để đánh giá</h2>

          <div className={cx('options-grid')}>
            {/* Appointment Feedback Option */}
            <div className={cx('option-card', 'appointment-option')}>
              <div className={cx('option-header')}>
                <div className={cx('option-icon')}>
                  <FontAwesomeIcon icon={faUserMd} />
                </div>
                <h3>Đánh giá buổi tư vấn</h3>
                <p>Chia sẻ trải nghiệm về buổi tư vấn với bác sĩ</p>
              </div>

              <div className={cx('option-features')}>
                <div className={cx('feature-item')}>
                  <FontAwesomeIcon icon={faStar} />
                  <span>Đánh giá chất lượng tư vấn</span>
                </div>
                <div className={cx('feature-item')}>
                  <FontAwesomeIcon icon={faComments} />
                  <span>Nhận xét về bác sĩ</span>
                </div>
                <div className={cx('feature-item')}>
                  <FontAwesomeIcon icon={faChartLine} />
                  <span>Đề xuất cải thiện</span>
                </div>
              </div>

              {/* Recent Appointments */}
              {recentAppointments.length > 0 && (
                <div className={cx('recent-items')}>
                  <h4>Cuộc hẹn gần đây</h4>
                  {recentAppointments.slice(0, 2).map((appointment) => (
                    <div key={appointment.appointment_id} className={cx('recent-item')}>
                      {appointment.status === 'completed' && (
                        <>
                          <div className={cx('item-info')}>
                            <div className={cx('item-title')}>
                              {appointment.consultant_type} - Bác sĩ <span className={cx('item-type')}>{appointment.doctor_name}</span>
                            </div>
                            <div className={cx('item-details')}>
                              <span>{formatDate(appointment.appointment_date)} - {appointment.appointment_time}</span>
                            </div>
                          </div>
                          <div className={cx('item-actions')}>
                            {!appointment.feedback && (
                              <button
                                className={cx('feedback-btn')}
                                onClick={() => handleAppointmentFeedback(appointment.appointment_id)}
                              >
                                Đánh giá
                                <FontAwesomeIcon icon={faArrowRight} />
                              </button>
                            )}
                            {appointment.feedback && (
                              <button
                                className={cx('view-feedback-btn')}
                                onClick={() => handleViewFeedback(appointment.appointment_id)}
                              >
                                Xem feedback
                                <FontAwesomeIcon icon={faEye} />
                              </button>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Test Service Feedback Option */}
            <div className={cx('option-card', 'test-option')}>
              <div className={cx('option-header')}>
                <div className={cx('option-icon')}>
                  <FontAwesomeIcon icon={faFlaskVial} />
                </div>
                <h3>Đánh giá dịch vụ xét nghiệm</h3>
                <p>Chia sẻ trải nghiệm về quy trình xét nghiệm</p>
              </div>

              <div className={cx('option-features')}>
                <div className={cx('feature-item')}>
                  <FontAwesomeIcon icon={faHospital} />
                  <span>Đánh giá cơ sở vật chất</span>
                </div>
                <div className={cx('feature-item')}>
                  <FontAwesomeIcon icon={faCalendarCheck} />
                  <span>Quy trình đặt lịch</span>
                </div>
                <div className={cx('feature-item')}>
                  <FontAwesomeIcon icon={faClipboardList} />
                  <span>Chất lượng dịch vụ</span>
                </div>
              </div>

              {/* Recent Test Orders */}
              {recentTestOrders.length > 0 && (
                <div className={cx('recent-items')}>
                  <h4>Đơn xét nghiệm gần đây</h4>
                  {recentTestOrders.slice(0, 2).map((testOrder) => (
                    <div key={testOrder.id} className={cx('recent-item')}>
                      <div className={cx('item-info')}>
                        <div className={cx('item-title')}>{testOrder.serviceName}</div>
                        <div className={cx('item-details')}>
                          <span>{formatDate(testOrder.date)} - {testOrder.time}</span>
                          <span className={cx('item-status', testOrder.status)}>
                            {testOrder.status === 'completed' ? 'Hoàn thành' : 'Đang xử lý'}
                          </span>
                        </div>
                      </div>
                      {testOrder.canFeedback && (
                        <button
                          className={cx('feedback-btn')}
                          onClick={() => handleTestServiceFeedback(testOrder.id)}
                        >
                          Đánh giá
                          <FontAwesomeIcon icon={faArrowRight} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Why Feedback Matters */}
        <div className={cx('why-feedback')}>
          <h2>Tại sao đánh giá của bạn quan trọng?</h2>
          <div className={cx('benefits-grid')}>
            <div className={cx('benefit-item')}>
              <div className={cx('benefit-icon')}>
                <FontAwesomeIcon icon={faChartLine} />
              </div>
              <h4>Cải thiện chất lượng</h4>
              <p>Giúp chúng tôi nâng cao chất lượng dịch vụ và trải nghiệm khách hàng</p>
            </div>
            <div className={cx('benefit-item')}>
              <div className={cx('benefit-icon')}>
                <FontAwesomeIcon icon={faUserMd} />
              </div>
              <h4>Phát triển đội ngũ</h4>
              <p>Hỗ trợ đội ngũ y tế và nhân viên phục vụ khách hàng tốt hơn</p>
            </div>
            <div className={cx('benefit-item')}>
              <div className={cx('benefit-icon')}>
                <FontAwesomeIcon icon={faHandHoldingHeart} />
              </div>
              <h4>Tạo niềm tin</h4>
              <p>Xây dựng lòng tin với cộng đồng và khách hàng tương lai</p>
            </div>
          </div>
        </div>

        {/* Feedback Modal */}
        {showFeedbackModal && selectedAppointment && (
          <div className={cx('modal-overlay')} onClick={closeFeedbackModal}>
            <div className={cx('feedback-modal')} onClick={(e) => e.stopPropagation()}>
              <div className={cx('modal-header')}>
                <h3>Chi tiết đánh giá</h3>
                <button className={cx('close-btn')} onClick={closeFeedbackModal}>
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>
              
              <div className={cx('modal-content')}>
                <div className={cx('appointment-info')}>
                  <h4>Thông tin cuộc hẹn</h4>
                  <div className={cx('info-row')}>
                    <span className={cx('label')}>Loại tư vấn:</span>
                    <span className={cx('value')}>{selectedAppointment.consultant_type}</span>
                  </div>
                  <div className={cx('info-row')}>
                    <span className={cx('label')}>Bác sĩ:</span>
                    <span className={cx('value')}>{selectedAppointment.doctor_name}</span>
                  </div>
                  <div className={cx('info-row')}>
                    <span className={cx('label')}>Ngày:</span>
                    <span className={cx('value')}>{formatDate(selectedAppointment.appointment_date)}</span>
                  </div>
                  <div className={cx('info-row')}>
                    <span className={cx('label')}>Giờ:</span>
                    <span className={cx('value')}>{selectedAppointment.appointment_time}</span>
                  </div>
                </div>

                {selectedAppointment.feedback && (
                  <div className={cx('feedback-details')}>
                    <h4>Đánh giá của bạn</h4>
                    
                    <div className={cx('feedback-section')}>
                      <span className={cx('feedback-label')}>Đánh giá tổng thể:</span>
                      <div className={cx('feedback-stars')}>
                        {renderStars(selectedAppointment.rating)}
                        <span className={cx('feedback-number')}>
                          ({selectedAppointment.rating}/5)
                        </span>
                      </div>
                    </div>

                    {selectedAppointment.feedback && (
                      <div className={cx('comments-section')}>
                        <span className={cx('comments-label')}>Nhận xét:</span>
                        <p className={cx('comments-text')}>
                          {selectedAppointment.feedback}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Feedback;