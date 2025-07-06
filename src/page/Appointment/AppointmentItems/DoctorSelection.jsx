import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUserMd,
  faExclamationTriangle,
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

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setIsLoading(true);
        setApiError(null);

        const response = await axiosClient.get('/v1/doctors');

        const apiData = response.data;

        if (!apiData.success || !apiData.listAllDoctors) {
          throw new Error('Invalid API response format');
        }

        const transformedDoctors = apiData.listAllDoctors.map(doctor => {
          const education = doctor.certificates?.map(cert => cert.certificate) || [];
          
          // Ensure consultationTypes is always an array
          let consultationTypes = [];
          if (doctor.certificates && doctor.certificates.length > 0) {
            consultationTypes = doctor.certificates
              .map(cert => cert.specialization);
          }
          
          // If no consultationTypes found, provide default
          if (consultationTypes.length === 0) {
            consultationTypes = ['Khám tổng quát'];
          }

          return {
            id: doctor.doctor_id,
            name: `${doctor.last_name} ${doctor.first_name}`.trim(),
            specialty: doctor.certificates?.[0]?.specialization || 'Chuyên khoa',
            experience: `${doctor.experience_year} năm kinh nghiệm`,
            education: education.length > 0 ? education : ['Bằng cấp y khoa'],
            bio: doctor.bio || 'Bác sĩ chuyên nghiệp với nhiều năm kinh nghiệm',
            consultationTypes: consultationTypes, // Now guaranteed to be an array
            phone: doctor.phone,
            email: doctor.email,
            gender: doctor.gender,
            status: doctor.status,
            certificates: doctor.certificates || []
          };
        }).filter(doctor => doctor.status === 1);

        setAllDoctors(transformedDoctors);
        console.log('✅ Fetched doctors from API:', transformedDoctors);

      } catch (error) {
        console.error('❌ Error fetching doctors:', error);

        let errorMessage = 'Không thể tải danh sách bác sĩ';

        if (error.response) {
          errorMessage = `Server error: ${error.response.status}`;
          if (error.response.data?.message) {
            errorMessage += ` - ${error.response.data.message}`;
          }
        } else if (error.request) {
          errorMessage = 'Lỗi kết nối mạng';
        } else {
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

  useEffect(() => {
    if (formData.consultationType && allDoctors.length > 0) {
      const filtered = allDoctors.filter(doctor => {
        // Ensure consultationTypes is an array
        const consultationTypes = Array.isArray(doctor.consultationTypes) 
          ? doctor.consultationTypes 
          : [doctor.consultationTypes].filter(Boolean);
        
        if (consultationTypes.length === 0) {
          return true; // Include doctor if no consultation types specified
        }
        
        return consultationTypes.some(type =>
          type && typeof type === 'string' && (
            type.toLowerCase().includes(formData.consultationType.toLowerCase()) ||
            formData.consultationType.toLowerCase().includes(type.toLowerCase())
          )
        );
      });

      setFilteredDoctors(filtered.length > 0 ? filtered : allDoctors);
    } else {
      setFilteredDoctors(allDoctors);
    }
  }, [formData.consultationType, allDoctors]);

  const fetchDoctorTimeSlots = async (doctorId) => {
    try {
      console.log(`🕒 Fetching available time slots for doctor ID: ${doctorId}`);

      const accessToken = localStorage.getItem('accessToken');

      const response = await axiosClient.get(`/v1/doctors/${doctorId}/available-timeslots`, {
        headers: {
          "x-access-token": accessToken,
        }
      });

      if (response.data && response.data.success && response.data.data && response.data.data.schedules) {
        const schedules = response.data.data.schedules;
        console.log('✅ Available schedules:', schedules);

        schedules.sort((a, b) => {
          return new Date(a.date) - new Date(b.date);
        });

        localStorage.setItem('doctorAvailableTimeslots', JSON.stringify(schedules));

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

      onChange({
        target: {
          name: 'availableTimeSlots',
          value: []
        }
      });

      localStorage.removeItem('doctorAvailableTimeslots');

      return [];
    }
  };

  const handleDoctorSelect = async (doctor) => {
    onChange({ target: { name: 'doctor_id', value: doctor.id } });
    onChange({ target: { name: 'doctorName', value: doctor.name } });
    onChange({ target: { name: 'preferredTime', value: '' } });

    await fetchDoctorTimeSlots(doctor.id);
  };

  const handleClearSelection = () => {
    onChange({ target: { name: 'doctor_id', value: '' } });
    onChange({ target: { name: 'doctorName', value: '' } });
    onChange({ target: { name: 'availableTimeSlots', value: [] } });
    onChange({ target: { name: 'preferredTime', value: '' } });

    localStorage.removeItem('doctorAvailableTimeslots');
  };

  const handleRandomSelection = async () => {
    if (filteredDoctors.length === 0) return;

    setIsRandomizing(true);

    let cycleCount = 0;
    const maxCycles = 8;

    const cycleInterval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * filteredDoctors.length);
      const randomDoctor = filteredDoctors[randomIndex];

      onChange({ target: { name: 'doctor_id', value: randomDoctor.id } });

      cycleCount++;

      if (cycleCount >= maxCycles) {
        clearInterval(cycleInterval);

        setTimeout(async () => {
          const finalRandomIndex = Math.floor(Math.random() * filteredDoctors.length);
          const finalRandomDoctor = filteredDoctors[finalRandomIndex];

          onChange({ target: { name: 'doctor_id', value: finalRandomDoctor.id } });
          onChange({ target: { name: 'doctorName', value: finalRandomDoctor.name } });
          onChange({ target: { name: 'preferredTime', value: '' } });

          await fetchDoctorTimeSlots(finalRandomDoctor.id);

          setIsRandomizing(false);

          console.log(`🎲 Đã chọn ngẫu nhiên bác sĩ: ${finalRandomDoctor.name}`);
        }, 300);
      }
    }, 120);
  };

  if (isLoading) {
    return (
      <div className={cx('form-section', 'doctor-selection-section')}>
        <div className={cx('section-header')}>
          <h3 className={cx('section-title')}>
            <FontAwesomeIcon icon={faUserMd} />
            Chọn bác sĩ tư vấn
            <span className={cx('required-badge')}>Bắt buộc</span>
          </h3>
        </div>

        <div className={cx('loading-state')}>
          <FontAwesomeIcon icon={faSpinner} spin className={cx('loading-icon')} />
          <p>Đang tải danh sách bác sĩ...</p>
        </div>
      </div>
    );
  }

  if (apiError) {
    return (
      <div className={cx('form-section', 'doctor-selection-section')}>
        <div className={cx('section-header')}>
          <h3 className={cx('section-title')}>
            <FontAwesomeIcon icon={faUserMd} />
            Chọn bác sĩ tư vấn
            <span className={cx('required-badge')}>Bắt buộc</span>
          </h3>
        </div>

        <div className={cx('error-state')}>
          <FontAwesomeIcon icon={faExclamationTriangle} className={cx('error-icon')} />
          <p>❌ Không thể tải danh sách bác sĩ: {apiError}</p>
          <p>Vui lòng thử lại để có thể chọn bác sĩ và tiếp tục đặt lịch.</p>
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
    <div className={cx('form-section', 'doctor-selection')}>
      <div className={cx('section-header')}>
        <h3 className={cx('section-title')}>
          👨‍⚕️ Chọn bác sĩ tư vấn
        </h3>
      </div>
      
      <div className={cx('doctor-actions')}>
        <button
          type="button"
          onClick={handleRandomSelection}
          className={cx('action-button', 'random-button')}
          disabled={isRandomizing}
        >
          🎲 Chọn ngẫu nhiên
        </button>
        
        {formData.doctor_id && (
          <button
            type="button"
            onClick={handleClearSelection}
            className={cx('action-button', 'clear-button')}
            disabled={isRandomizing}
          >
            ✖️ Xóa chọn
          </button>
        )}
      </div>

      {/* Validation Error */}
      {errors.doctor_id && (
        <div className={cx('validation-error')}>
          <span className={cx('error-icon')}>❌</span>
          <span className={cx('error-text')}>{errors.doctor_id}</span>
        </div>
      )}

      {/* Randomizing State */}
      {isRandomizing && (
        <div className={cx('loading-container')}>
          <div className={cx('loading-spinner')}></div>
          <p className={cx('loading-text')}>Đang chọn bác sĩ ngẫu nhiên...</p>
        </div>
      )}

      {/* Doctors List */}
      {!isRandomizing && filteredDoctors.length > 0 && (
        <div className={cx('doctors-list')}>
          {filteredDoctors.map(doctor => (
            <div
              key={doctor.id}
              className={cx('doctor-card', {
                'selected': formData.doctor_id === doctor.id
              })}
              onClick={() => handleDoctorSelect(doctor)}
            >
              <div className={cx('doctor-info')}>
                <h4 className={cx('doctor-name')}>
                  {doctor.name}
                </h4>
                <p className={cx('doctor-specialty')}>
                  {doctor.certificates?.[0]?.specialization || 'Chuyên khoa'}
                </p>
                <div className={cx('doctor-meta')}>
                  <span className={cx('doctor-experience')}>
                    {doctor.experience}
                  </span>
                </div>
                <p className={cx('doctor-education')}>
                  {doctor.education.join(', ')}
                </p>
              </div>
              
              <div className={cx('doctor-status')}>
                {formData.doctor_id === doctor.id ? (
                  <span className={cx('status-badge', 'selected')}>
                    ✓ Đã chọn
                  </span>
                ) : (
                  <span className={cx('status-badge', 'available')}>
                    Có thể tư vấn
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* No Doctors Available */}
      {!isRandomizing && filteredDoctors.length === 0 && (
        <div className={cx('no-doctors')}>
          <span className={cx('no-doctors-icon')}>👨‍⚕️</span>
          <p className={cx('no-doctors-text')}>
            Hiện tại không có bác sĩ nào có thể tư vấn.
          </p>
          <small className={cx('no-doctors-note')}>
            Vui lòng thử lại sau hoặc liên hệ 1900-1133.
          </small>
        </div>
      )}

      {/* Selection Summary */}
      {formData.doctor_id && !isRandomizing && (
        <div className={cx('selection-summary')}>
          <div className={cx('summary-card')}>
            <span className={cx('summary-icon')}>✅</span>
            <div className={cx('summary-content')}>
              <strong>Bác sĩ đã chọn:</strong>
              <span>{formData.doctorName}</span>
            </div>
          </div>
        </div>
      )}

      {/* Quick Note */}
      <div className={cx('quick-note')}>
        <span className={cx('note-icon')}>💡</span>
        <p>Tất cả bác sĩ đều có chuyên môn cao về sức khỏe giới tính</p>
      </div>
    </div>
  );
}

export default DoctorSelection;