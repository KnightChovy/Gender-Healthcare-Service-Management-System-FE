import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUserMd,
  faGraduationCap,
  faStethoscope,
  faCheckCircle,
  faDice,
  faShuffle,
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
  const [isLoadingTimeslots, setIsLoadingTimeslots] = useState(false);

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
              .map(cert => cert.specialization)
              .filter(Boolean);
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
    setIsLoadingTimeslots(true);

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
    } finally {
      setIsLoadingTimeslots(false);
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
    <div className={cx('form-section', 'doctor-selection-section')}>
      <div className={cx('section-header')}>
        <h3 className={cx('section-title')}>
          <FontAwesomeIcon icon={faUserMd} />
          Chọn bác sĩ tư vấn
          <span className={cx('required-badge')}>Bắt buộc</span>
        </h3>

        {/* Required notice */}
        <div className={cx('required-info')}>
          <FontAwesomeIcon icon={faExclamationTriangle} className={cx('warning-icon')} />
          <span>
            Bạn cần chọn một bác sĩ để có thể tiếp tục đặt lịch tư vấn
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

          {formData.doctor_id && (
            <button
              type="button"
              className={cx('clear-selection-btn')}
              onClick={handleClearSelection}
              title="Chọn lại bác sĩ khác"
            >
              <FontAwesomeIcon icon={faCheckCircle} />
              Chọn lại
            </button>
          )}
        </div>
      </div>

      {/* Validation error message */}
      {errors.doctor_id && (
        <div className={cx('doctor-error-message')}>
          <FontAwesomeIcon icon={faExclamationTriangle} />
          <span>{errors.doctor_id}</span>
        </div>
      )}

      {/* No selection warning */}
      {!formData.doctor_id && !isRandomizing && filteredDoctors.length > 0 && (
        <div className={cx('selection-warning')}>
          <div className={cx('warning-content')}>
            <FontAwesomeIcon icon={faExclamationTriangle} className={cx('warning-icon')} />
            <div className={cx('warning-text')}>
              <p><strong>⚠️ Chưa chọn bác sĩ</strong></p>
              <p>
                Vui lòng chọn một bác sĩ từ danh sách bên dưới hoặc sử dụng chức năng "Chọn ngẫu nhiên"
                để hệ thống tự động chọn bác sĩ phù hợp cho bạn.
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
                selected: formData.doctor_id === doctor.id,
                randomizing: isRandomizing && formData.doctor_id === doctor.id
              })}
              onClick={() => handleDoctorSelect(doctor)}
              disabled={isRandomizing}
            >
              <div className={cx('doctor-info')}>
                <h4>{doctor.name}</h4>

                {/* Display specialties */}
                <p className={cx('specialty')}>
                  <FontAwesomeIcon icon={faStethoscope} />
                  <span className={cx('specialty-item')}>
                    {doctor.certificates?.[0]?.specialization || 'Chuyên khoa'}
                  </span>
                </p>


                {/* Experience */}
                <p className={cx('experience')}>
                  <FontAwesomeIcon icon={faGraduationCap} />
                  {doctor.experience}
                </p>

                {/* Education/Certificates */}
                {doctor.education && doctor.education.length > 0 && (
                  <div className={cx('education-list')}>
                    <FontAwesomeIcon icon={faGraduationCap} />
                    <div className={cx('education-items')}>
                      {doctor.education.map((edu, index) => (
                        <span key={index} className={cx('education-item')}>
                          {edu}
                          {index < doctor.education.length - 1 && ', '}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Bio */}
                {doctor.bio && (
                  <p className={cx('bio')}>{doctor.bio}</p>
                )}
              </div>

              <div className={cx('selection-indicator')}>
                <FontAwesomeIcon icon={faCheckCircle} />
              </div>
            </button>
          ))
        ) : (
          <div className={cx('no-doctors-message')}>
            <FontAwesomeIcon icon={faExclamationTriangle} className={cx('no-doctors-icon')} />
            <p><strong>Không có bác sĩ nào có sẵn hiện tại</strong></p>
            <p>Vui lòng thử lại sau hoặc liên hệ với chúng tôi để được hỗ trợ.</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className={cx('retry-btn')}
            >
              🔄 Tải lại danh sách bác sĩ
            </button>
          </div>
        )}
      </div>

      {/* Selected doctor confirmation */}
      {formData.doctor_id && !isRandomizing && (
        <div className={cx('doctor-selected-note')}>
          <div className={cx('success-content')}>
            <div className={cx('success-text')}>
              <p><strong>Đã chọn bác sĩ!</strong></p>
              <p>
                Bác sĩ <strong>{formData.doctorName}</strong> sẽ thực hiện buổi tư vấn cho bạn.
                {isLoadingTimeslots && <span> Đang tải lịch trống...</span>}
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
              Có <strong>{filteredDoctors.length}</strong> bác sĩ có sẵn
              {formData.consultationType && ` chuyên về ${formData.consultationType}`}
            </span>
          </div>
        )}

        <div className={cx('selection-options')}>
          <div className={cx('option-item')}>
            <span className={cx('option-label')}>🎯 Chọn bác sĩ cụ thể:</span>
            <span className={cx('option-desc')}>Bạn sẽ được tư vấn bởi bác sĩ đã chọn</span>
          </div>
          <div className={cx('option-item')}>
            <span className={cx('option-label')}>🎲 Chọn ngẫu nhiên:</span>
            <span className={cx('option-desc')}>Hệ thống tự động chọn bác sĩ phù hợp</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DoctorSelection;