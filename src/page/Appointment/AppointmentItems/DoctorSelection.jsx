import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUserMd,
  faStar,
  faGraduationCap,
  faStethoscope,
  faCheckCircle
} from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames/bind';
import styles from '../Appointment.module.scss';
import { doctorsData } from '../../../components/Data/Doctor';

const cx = classNames.bind(styles);

function DoctorSelection({ formData, errors, onChange }) {
  const [filteredDoctors, setFilteredDoctors] = useState(doctorsData);

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

  return (
    <div className={cx('form-section', 'doctor-selection-section')}>
      <h3>
        <FontAwesomeIcon icon={faUserMd} />
        Chọn bác sĩ tư vấn
      </h3>

      {/* Doctor Selection */}
      <div className={cx('doctors-grid')}>
        {filteredDoctors.map((doctor) => (
          <button
            type="button"
            key={doctor.id}
            className={cx('doctor-card', {
              selected: formData.selectedDoctor === doctor.id
            })}
            onClick={() => handleDoctorSelect(doctor)}
          >
            <div className={cx('doctor-avatar')}>
              <img src={doctor.avatar} alt={doctor.name} />
            </div>

            <div className={cx('doctor-info')}>
              <h4>{doctor.name}</h4>
              {doctor.specialty.map((spec, index) => (
                <p className={cx('specialty')} key={index}>
                  <FontAwesomeIcon icon={faStethoscope} />
                  <span  className={cx('specialty-item')}>
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
        ))}
      </div>

      {errors.selectedDoctor && (
        <span className={cx('error-message')}>{errors.selectedDoctor}</span>
      )}

      {/* Doctor info note */}
      {formData.selectedDoctor && (
        <div className={cx('doctor-selected-note')}>
          <p>✅ Đã chọn bác sĩ. Vui lòng chọn ngày và giờ hẹn ở phần tiếp theo.</p>
        </div>
      )}
    </div>
  );
}

// Export doctorsData để sử dụng ở DateTimeSection
export default DoctorSelection;