import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUserMd,
  faStar,
  faGraduationCap,
  faStethoscope,
  faCheckCircle,
  faDice,
  faShuffle,
  faInfoCircle,
  faSpinner
} from '@fortawesome/free-solid-svg-icons';
import axiosClient from "../../../services/axiosClient";
import classNames from 'classnames/bind';
import styles from '../Appointment.module.scss';

const cx = classNames.bind(styles);

function DoctorSelection({ formData, errors, onChange }) {
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [allDoctors, setAllDoctors] = useState([]);
  const [isRandomizing, setIsRandomizing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState(null);
  const [isLoadingTimeslots, setIsLoadingTimeslots] = useState(false);

  // Fetch doctors from API
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setIsLoading(true);
        setApiError(null);
        
        const response = await axiosClient.get('/v1/doctors');
        
        const apiData = response.data;
        
        // Check if response has success flag and data
        if (!apiData.success || !apiData.listAllDoctors) {
          throw new Error('Invalid API response format');
        }
        
        // Transform API data to match the expected format
        const transformedDoctors = apiData.listAllDoctors.map(doctor => {
          // Get specialization from certificates
          const specializations = doctor.certificates?.map(cert => cert.specialization) || [];
          
          return {
            id: doctor.doctor_id,
            name: `${doctor.last_name} ${doctor.first_name}`.trim(),
            specialty: specializations.length > 0 ? specializations : ['Tư vấn tổng quát'],
            experience: `${doctor.experience_year} năm kinh nghiệm`,
            reviews: Math.floor(Math.random() * 100) + 20, // Random reviews for demo
            education: doctor.certificates?.[0]?.certificate || 'Bằng cấp y khoa',
            bio: doctor.bio || 'Bác sĩ chuyên nghiệp với nhiều năm kinh nghiệm',
            consultationTypes: specializations,
            phone: doctor.phone,
            email: doctor.email,
            gender: doctor.gender,
            status: doctor.status,
            certificates: doctor.certificates || []
          };
        }).filter(doctor => doctor.status === 1); // Only active doctors
        
        setAllDoctors(transformedDoctors);
        console.log('✅ Fetched doctors from API:', transformedDoctors);
        
      } catch (error) {
        console.error('❌ Error fetching doctors:', error);
        
        // Xử lý lỗi chi tiết hơn với axios
        let errorMessage = 'Không thể tải danh sách bác sĩ';
        
        if (error.response) {
          // Lỗi từ server
          errorMessage = `Server error: ${error.response.status}`;
          if (error.response.data?.message) {
            errorMessage += ` - ${error.response.data.message}`;
          }
        } else if (error.request) {
          // Lỗi network
          errorMessage = 'Lỗi kết nối mạng';
        } else {
          // Lỗi khác
          errorMessage = error.message;
        }
        
        setApiError(errorMessage);
        setAllDoctors([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  // Filter doctors based on consultation type
  useEffect(() => {
    if (formData.consultationType && allDoctors.length > 0) {
      const filtered = allDoctors.filter(doctor => {
        // Check if doctor's specialty matches consultation type
        return doctor.specialty.some(spec => 
          spec.toLowerCase().includes(formData.consultationType.toLowerCase()) ||
          formData.consultationType.toLowerCase().includes(spec.toLowerCase())
        ) || doctor.consultationTypes.some(type =>
          type.toLowerCase().includes(formData.consultationType.toLowerCase()) ||
          formData.consultationType.toLowerCase().includes(type.toLowerCase())
        );
      });
      
      // If no specific match, show all doctors (they can handle general consultations)
      setFilteredDoctors(filtered.length > 0 ? filtered : allDoctors);
    } else {
      setFilteredDoctors(allDoctors);
    }
  }, [formData.consultationType, allDoctors]);

  // Fetch available time slots for selected doctor
  const fetchDoctorTimeSlots = async (doctorId) => {
    setIsLoadingTimeslots(true);
    
    try {
      console.log(`🕒 Fetching available time slots for doctor ID: ${doctorId}`);
      
      // Get access token from localStorage
      const accessToken = localStorage.getItem('accessToken');
      
      // Make API request with token in headers
      const response = await axiosClient.get(`/v1/doctors/${doctorId}/available-timeslots`, {
        headers: {
          "x-access-token": accessToken,
        }
      });
      
      // Check for the exact response format provided
      if (response.data && response.data.success && response.data.data && response.data.data.schedules) {
        const schedules = response.data.data.schedules;
        console.log('✅ Available schedules:', schedules);

        // Sort schedules by date
        schedules.sort((a, b) => {
          return new Date(a.date) - new Date(b.date);
        });
        
        // Save to localStorage for DateTimeSection to use
        localStorage.setItem('doctorAvailableTimeslots', JSON.stringify(schedules));
        
        // Pass the entire schedules array to parent component
        onChange({ 
          target: { 
            name: 'availableTimeSlots', 
            value: schedules 
          } 
        });
        
        return schedules;
      } else {
        throw new Error('Invalid response format for time slots');
      }
    } catch (error) {
      console.error('❌ Error fetching doctor time slots:', error);
      
      // Reset timeSlots to empty array on error
      onChange({ 
        target: { 
          name: 'availableTimeSlots', 
          value: [] 
        } 
      });

      localStorage.removeItem('doctorAvailableTimeslots');
      
      return [];
    } finally {
      setIsLoadingTimeslots(false);
    }
  };

  const handleDoctorSelect = async (doctor) => {
    onChange({ target: { name: 'selectedDoctor', value: doctor.id } });
    onChange({ target: { name: 'doctorName', value: doctor.name } });
    onChange({ target: { name: 'preferredTime', value: '' } });
    
    // Fetch available time slots when doctor is selected
    await fetchDoctorTimeSlots(doctor.id);
  };

  // Clear doctor selection
  const handleClearSelection = () => {
    onChange({ target: { name: 'selectedDoctor', value: '' } });
    onChange({ target: { name: 'doctorName', value: '' } });
    onChange({ target: { name: 'availableTimeSlots', value: [] } });
    onChange({ target: { name: 'preferredTime', value: '' } });

    localStorage.removeItem('doctorAvailableTimeslots');
  };

  // Random doctor selection function
  const handleRandomSelection = async () => {
    if (filteredDoctors.length === 0) return;
    
    setIsRandomizing(true);
    
    // Create animation effect by cycling through doctors
    let cycleCount = 0;
    const maxCycles = 8;
    
    const cycleInterval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * filteredDoctors.length);
      const randomDoctor = filteredDoctors[randomIndex];
      
      // Temporarily highlight the doctor during cycling
      onChange({ target: { name: 'selectedDoctor', value: randomDoctor.id } });
      
      cycleCount++;
      
      if (cycleCount >= maxCycles) {
        clearInterval(cycleInterval);
        
        // Final selection after a short delay
        setTimeout(async () => {
          const finalRandomIndex = Math.floor(Math.random() * filteredDoctors.length);
          const finalRandomDoctor = filteredDoctors[finalRandomIndex];
          
          // Update selection with final doctor
          onChange({ target: { name: 'selectedDoctor', value: finalRandomDoctor.id } });
          onChange({ target: { name: 'doctorName', value: finalRandomDoctor.name } });
          onChange({ target: { name: 'preferredTime', value: '' } });
          
          // Fetch available time slots
          await fetchDoctorTimeSlots(finalRandomDoctor.id);
          
          setIsRandomizing(false);
          
          // Show success notification
          console.log(`🎲 Đã chọn ngẫu nhiên bác sĩ: ${finalRandomDoctor.name}`);
        }, 300);
      }
    }, 120);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className={cx('form-section', 'doctor-selection-section')}>
        <div className={cx('section-header')}>
          <h3 className={cx('section-title')}>
            <FontAwesomeIcon icon={faUserMd} />
            Chọn bác sĩ tư vấn
            <span className={cx('optional-badge')}>Tùy chọn</span>
          </h3>
        </div>
        
        <div className={cx('loading-state')}>
          <FontAwesomeIcon icon={faSpinner} spin className={cx('loading-icon')} />
          <p>Đang tải danh sách bác sĩ...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (apiError) {
    return (
      <div className={cx('form-section', 'doctor-selection-section')}>
        <div className={cx('section-header')}>
          <h3 className={cx('section-title')}>
            <FontAwesomeIcon icon={faUserMd} />
            Chọn bác sĩ tư vấn
            <span className={cx('optional-badge')}>Tùy chọn</span>
          </h3>
        </div>
        
        <div className={cx('error-state')}>
          <p>❌ Không thể tải danh sách bác sĩ: {apiError}</p>
          <p>Hệ thống sẽ tự động phân công bác sĩ phù hợp khi xử lý đơn đặt lịch.</p>
          <button 
            type="button" 
            onClick={() => window.location.reload()}
            className={cx('retry-btn')}
          >
            🔄 Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={cx('form-section', 'doctor-selection-section')}>
      <div className={cx('section-header')}>
        <h3 className={cx('section-title')}>
          <FontAwesomeIcon icon={faUserMd} />
          Chọn bác sĩ tư vấn
          <span className={cx('optional-badge')}>Tùy chọn</span>
        </h3>
        
        {/* Info notice */}
        <div className={cx('optional-info')}>
          <FontAwesomeIcon icon={faInfoCircle} className={cx('info-icon')} />
          <span>
            Bạn có thể chọn bác sĩ mong muốn hoặc để hệ thống tự động phân công bác sĩ phù hợp khi đặt lịch
          </span>
        </div>

        {/* Action buttons */}
        <div className={cx('selection-actions')}>
          {filteredDoctors.length > 0 && (
            <button
              type="button"
              className={cx('random-selection-btn', {
                'randomizing': isRandomizing
              })}
              onClick={handleRandomSelection}
              disabled={isRandomizing}
              title="Chọn ngẫu nhiên bác sĩ ngay"
            >
              <FontAwesomeIcon 
                icon={isRandomizing ? faShuffle : faDice} 
                className={cx('random-icon', {
                  'spinning': isRandomizing
                })}
              />
              {isRandomizing ? 'Đang chọn...' : 'Chọn ngẫu nhiên'}
            </button>
          )}

          {formData.selectedDoctor && (
            <button
              type="button"
              className={cx('clear-selection-btn')}
              onClick={handleClearSelection}
              title="Bỏ chọn bác sĩ"
            >
              <FontAwesomeIcon icon={faCheckCircle} />
              Bỏ chọn
            </button>
          )}
        </div>
      </div>

      {/* Auto assignment notice */}
      {!formData.selectedDoctor && !isRandomizing && (
        <div className={cx('auto-assignment-notice')}>
          <div className={cx('notice-content')}>
            <FontAwesomeIcon icon={faUserMd} className={cx('notice-icon')} />
            <div className={cx('notice-text')}>
              <p><strong>🤖 Tự động phân công bác sĩ</strong></p>
              <p>
                Nếu bạn không chọn bác sĩ cụ thể, hệ thống sẽ tự động phân công 
                bác sĩ có kinh nghiệm phù hợp với loại tư vấn của bạn khi xử lý đơn đặt lịch.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Doctor Selection Grid */}
      <div className={cx('doctors-grid')}>
        {filteredDoctors.length > 0 ? (
          filteredDoctors.map((doctor) => (
            <button
              type="button"
              key={doctor.id}
              className={cx('doctor-card', {
                selected: formData.selectedDoctor === doctor.id,
                randomizing: isRandomizing && formData.selectedDoctor === doctor.id
              })}
              onClick={() => handleDoctorSelect(doctor)}
              disabled={isRandomizing}
            >
              <div className={cx('doctor-info')}>
                <h4>{doctor.name}</h4>
                
                {/* Display specialties */}
                {doctor.specialty.map((spec, index) => (
                  <p className={cx('specialty')} key={index}>
                    <FontAwesomeIcon icon={faStethoscope} />
                    <span className={cx('specialty-item')}>
                      {spec}
                    </span>
                  </p>
                ))}
                
                {/* Experience */}
                <p className={cx('experience')}>
                  <FontAwesomeIcon icon={faGraduationCap} />
                  {doctor.experience}
                </p>
                
                {/* Education/Certificates */}
                <p className={cx('education')}>{doctor.education}</p>
                
                {/* Bio */}
                {doctor.bio && (
                  <p className={cx('bio')}>{doctor.bio}</p>
                )}

                {/* Rating */}
                <div className={cx('rating')}>
                  <FontAwesomeIcon icon={faStar} />
                  <span>{doctor.rating}</span>
                  <span className={cx('reviews')}>({doctor.reviews} đánh giá)</span>
                </div>
              </div>

              <div className={cx('selection-indicator')}>
                <FontAwesomeIcon icon={faCheckCircle} />
              </div>
            </button>
          ))
        ) : (
          <div className={cx('no-doctors-message')}>
            <FontAwesomeIcon icon={faUserMd} />
            <p>Không có bác sĩ nào có sẵn hiện tại.</p>
            <p>Hệ thống sẽ tự động phân công bác sĩ phù hợp khi xử lý đơn đặt lịch.</p>
          </div>
        )}
      </div>

      {/* Selected doctor confirmation */}
      {formData.selectedDoctor && !isRandomizing && (
        <div className={cx('doctor-selected-note')}>
          <div className={cx('success-content')}>
            <FontAwesomeIcon icon={faCheckCircle} className={cx('success-icon')} />
            <div className={cx('success-text')}>
              <p><strong>✅ Đã chọn bác sĩ cụ thể!</strong></p>
              <p>
                Bác sĩ <strong>{formData.doctorName}</strong> sẽ được ưu tiên phân công cho lịch tư vấn của bạn.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Randomizing feedback */}
      {isRandomizing && (
        <div className={cx('randomizing-feedback')}>
          <div className={cx('randomizing-content')}>
            <FontAwesomeIcon icon={faShuffle} className={cx('shuffle-icon')} />
            <div className={cx('randomizing-text')}>
              <p><strong>🎲 Đang chọn bác sĩ ngẫu nhiên...</strong></p>
              <p>Hệ thống đang tìm bác sĩ phù hợp nhất cho bạn</p>
            </div>
          </div>
        </div>
      )}

      {/* Statistics and options */}
      <div className={cx('section-footer')}>
        {filteredDoctors.length > 0 && (
          <div className={cx('doctors-stats')}>
            <span className={cx('stats-text')}>
              📊 Có <strong>{filteredDoctors.length}</strong> bác sĩ có sẵn
              {formData.consultationType && ` chuyên về ${formData.consultationType}`}
            </span>
          </div>
        )}
        
        <div className={cx('selection-options')}>
          <div className={cx('option-item')}>
            <span className={cx('option-label')}>🎯 Chọn bác sĩ cụ thể:</span>
            <span className={cx('option-desc')}>Được ưu tiên phân công</span>
          </div>
          <div className={cx('option-item')}>
            <span className={cx('option-label')}>🤖 Để hệ thống chọn:</span>
            <span className={cx('option-desc')}>Tự động phân công bác sĩ phù hợp</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DoctorSelection;