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
  faInfoCircle
} from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames/bind';
import styles from '../Appointment.module.scss';
import { doctorsData } from '../../../components/Data/Doctor';

const cx = classNames.bind(styles);

function DoctorSelection({ formData, errors, onChange }) {
  const [filteredDoctors, setFilteredDoctors] = useState(doctorsData);
  const [isRandomizing, setIsRandomizing] = useState(false);

  // Filter doctors based on consultation type
  useEffect(() => {
    if (formData.consultationType) {
      const filtered = doctorsData.filter(doctor =>
        doctor.specialty.includes(formData.consultationType)
      );
      setFilteredDoctors(filtered);
    } else {
      setFilteredDoctors(doctorsData);
    }
  }, [formData.consultationType]);

  const handleDoctorSelect = (doctor) => {
    onChange({ target: { name: 'selectedDoctor', value: doctor.id } });
    onChange({ target: { name: 'doctorName', value: doctor.name } });
    onChange({ target: { name: 'preferredTime', value: '' } });
  };

  // Clear doctor selection
  const handleClearSelection = () => {
    onChange({ target: { name: 'selectedDoctor', value: '' } });
    onChange({ target: { name: 'doctorName', value: '' } });
  };

  // Random doctor selection function
  const handleRandomSelection = () => {
    if (filteredDoctors.length === 0) return;
    
    setIsRandomizing(true);
    
    // Create animation effect by cycling through doctors
    let cycleCount = 0;
    const maxCycles = 8; // Reduced cycles for better UX
    
    const cycleInterval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * filteredDoctors.length);
      const randomDoctor = filteredDoctors[randomIndex];
      
      // Temporarily highlight the doctor during cycling
      onChange({ target: { name: 'selectedDoctor', value: randomDoctor.id } });
      
      cycleCount++;
      
      if (cycleCount >= maxCycles) {
        clearInterval(cycleInterval);
        
        // Final selection after a short delay
        setTimeout(() => {
          const finalRandomIndex = Math.floor(Math.random() * filteredDoctors.length);
          const finalRandomDoctor = filteredDoctors[finalRandomIndex];
          
          handleDoctorSelect(finalRandomDoctor);
          setIsRandomizing(false);
          
          // Show success notification
          console.log(`🎲 Đã chọn ngẫu nhiên bác sĩ: ${finalRandomDoctor.name}`);
        }, 300);
      }
    }, 120); // Slightly slower for better visual
  };

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
              <div className={cx('doctor-avatar')}>
                <img src={doctor.avatar} alt={doctor.name} />
                {isRandomizing && formData.selectedDoctor === doctor.id && (
                  <div className={cx('randomizing-overlay')}>
                    <FontAwesomeIcon icon={faDice} className={cx('dice-icon')} />
                  </div>
                )}
              </div>

              <div className={cx('doctor-info')}>
                <h4>{doctor.name}</h4>
                {doctor.specialty.map((spec, index) => (
                  <p className={cx('specialty')} key={index}>
                    <FontAwesomeIcon icon={faStethoscope} />
                    <span className={cx('specialty-item')}>
                      {spec}
                    </span>
                  </p>
                ))}
                <p className={cx('experience')}>
                  <FontAwesomeIcon icon={faGraduationCap} />
                  {doctor.experience}
                </p>
                <p className={cx('education')}>{doctor.education}</p>

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
            <p>Không có bác sĩ nào chuyên về loại tư vấn đã chọn.</p>
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
              📊 Có <strong>{filteredDoctors.length}</strong> bác sĩ chuyên về {formData.consultationType || 'tư vấn này'}
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