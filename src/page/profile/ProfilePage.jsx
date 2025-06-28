import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser,
  faUserCircle,
  faEnvelope,
  faPhone,
  faBirthdayCake,
  faVenusMars,
  faMapMarkerAlt,
  faEdit,
  faSave,
  faSpinner,
  faExclamationTriangle,
  faCheckCircle,
  faTimes,
  faShieldAlt,
  faIdCard,
  faCalendarCheck,
  faFileText, // Icon cho hồ sơ bệnh án
  faStethoscope,
  faCalendarAlt,
  faUserMd,
  faHeartbeat,
  faWeight,
  faRuler,
  faThermometer,
  faPrescription,
  faClipboardList,
  faNotesMedical,
  faEye,
  faDownload
} from '@fortawesome/free-solid-svg-icons';
import axiosClient from "../../services/axiosClient";
import { Link } from "react-router-dom";
import { toast } from 'react-toastify';
import styles from './ProfilePage.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const [medicalRecords, setMedicalRecords] = useState([]); // State cho hồ sơ bệnh án
  const [selectedRecord, setSelectedRecord] = useState(null); // State cho record được chọn
  const [showMedicalModal, setShowMedicalModal] = useState(false); // State cho modal

  // Mock data cho hồ sơ bệnh án - trong thực tế sẽ fetch từ API
  const mockMedicalRecords = [
    {
      id: 1,
      visitDate: '2024-01-15',
      visitTime: '09:30',
      doctor: 'BS. Nguyễn Thị Lan',
      consultationType: 'Khám phụ khoa',
      chiefComplaint: 'Khám sức khỏe định kỳ',
      vitalSigns: {
        weight: '55 kg',
        height: '160 cm',
        bloodPressure: '120/80 mmHg',
        temperature: '36.5°C',
        heartRate: '72 bpm'
      },
      diagnosis: {
        preliminaryDiagnosis: 'Khám sức khỏe định kỳ',
        finalDiagnosis: 'Bình thường',
        icdCode: 'Z00.0'
      },
      treatment: {
        prescription: [
          {
            medicine: 'Vitamin B Complex',
            dosage: '1 viên/ngày',
            duration: '30 ngày',
            instructions: 'Uống sau ăn'
          }
        ],
        recommendations: [
          'Tập thể dục thường xuyên',
          'Ăn uống đầy đủ chất dinh dưỡng',
          'Tái khám sau 3 tháng'
        ]
      },
      notes: 'Bệnh nhân có sức khỏe tốt, không có dấu hiệu bất thường.',
      status: 'completed'
    },
    {
      id: 2,
      visitDate: '2024-02-20',
      visitTime: '14:00',
      doctor: 'BS. Trần Văn Minh',
      consultationType: 'Tư vấn chu kỳ kinh nguyệt',
      chiefComplaint: 'Chu kỳ kinh nguyệt không đều',
      vitalSigns: {
        weight: '54 kg',
        height: '160 cm',
        bloodPressure: '118/78 mmHg',
        temperature: '36.8°C',
        heartRate: '75 bpm'
      },
      diagnosis: {
        preliminaryDiagnosis: 'Rối loạn chu kỳ kinh nguyệt',
        finalDiagnosis: 'Rối loạn nội tiết tố nhẹ',
        icdCode: 'N92.1'
      },
      treatment: {
        prescription: [
          {
            medicine: 'Iron supplement',
            dosage: '1 viên/ngày',
            duration: '60 ngày',
            instructions: 'Uống sau ăn sáng'
          },
          {
            medicine: 'Evening Primrose Oil',
            dosage: '2 viên/ngày',
            duration: '30 ngày',
            instructions: 'Uống sau bữa tối'
          }
        ],
        recommendations: [
          'Nghỉ ngơi đầy đủ',
          'Giảm stress',
          'Theo dõi chu kỳ kinh nguyệt',
          'Tái khám sau 2 tháng'
        ]
      },
      notes: 'Bệnh nhân cần theo dõi chu kỳ kinh nguyệt và tái khám định kỳ.',
      status: 'completed'
    },
    {
      id: 3,
      visitDate: '2024-03-10',
      visitTime: '10:15',
      doctor: 'BS. Lê Thị Hương',
      consultationType: 'Tư vấn tránh thai',
      chiefComplaint: 'Tư vấn về phương pháp tránh thai phù hợp',
      vitalSigns: {
        weight: '55.5 kg',
        height: '160 cm',
        bloodPressure: '115/75 mmHg',
        temperature: '36.6°C',
        heartRate: '70 bpm'
      },
      diagnosis: {
        preliminaryDiagnosis: 'Tư vấn tránh thai',
        finalDiagnosis: 'Sức khỏe sinh sản bình thường',
        icdCode: 'Z30.0'
      },
      treatment: {
        prescription: [],
        recommendations: [
          'Sử dụng phương pháp tránh thai phù hợp',
          'Khám định kỳ 6 tháng/lần',
          'Duy trì lối sống lành mạnh'
        ]
      },
      notes: 'Đã tư vấn các phương pháp tránh thai. Bệnh nhân lựa chọn phương pháp phù hợp.',
      status: 'completed'
    }
  ];

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
          throw new Error('Không tìm thấy thông tin đăng nhập');
        }

        const response = await axiosClient.get('/v1/users/profile/me', {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'x-access-token': accessToken
          }
        });

        if (response.data?.success) {
          const userData = response.data.userProfile;

          const transformedData = {
            ...userData,
            birthday: userData.birthday || '',
          };

          setProfile(transformedData);

          setFormData({
            first_name: transformedData.first_name || '',
            last_name: transformedData.last_name || '',
            email: transformedData.email || '',
            phone: transformedData.phone || '',
            birthday: transformedData.birthday || '',
            gender: transformedData.gender || '',
            address: transformedData.address || '',
          });

          // Load medical records (mock data)
          setMedicalRecords(mockMedicalRecords);

          console.log("✅ User profile loaded:", transformedData);
        } else {
          throw new Error(response.data?.message || 'Không thể tải thông tin người dùng');
        }
      } catch (err) {
        console.error("❌ Error fetching user profile:", err);
        setError(err.message || 'Đã xảy ra lỗi khi tải thông tin người dùng');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        email: profile.email || '',
        phone: profile.phone || '',
        birthday: profile.birthday || '',
        gender: profile.gender || '',
        address: profile.address || '',
      });
    }
    setIsEditing(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const accessToken = localStorage.getItem('accessToken');
      const user = JSON.parse(localStorage.getItem('user'));

      const response = await axiosClient.put(`/v1/users/${user.user_id}`, formData, {
        headers: {
          'x-access-token': accessToken
        }
      });

      if (response.data.message) {
        setProfile({
          ...profile,
          ...formData
        });
        setIsEditing(false);
        toast.success('Cập nhật thông tin thành công!');
        setTimeout(() => {
          window.location.reload();
        }, 2500);
      } else {
        throw new Error(response.data?.message || 'Không thể cập nhật thông tin người dùng');
      }
    } catch (err) {
      console.error("❌ Error updating profile:", err);
      toast.error(err.message || 'Đã xảy ra lỗi khi cập nhật thông tin');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handler cho xem chi tiết hồ sơ bệnh án
  const viewMedicalRecord = (record) => {
    setSelectedRecord(record);
    setShowMedicalModal(true);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Chưa cập nhật';

    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('vi-VN');
    } catch (error) {
      console.error("❌ Error formatting date:", error);
      return dateString;
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'Chưa cập nhật';

    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('vi-VN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      console.error("❌ Error formatting date:", error);
      return dateString;
    }
  };

  const getGenderText = (gender) => {
    if (!gender) return 'Chưa cập nhật';

    switch (gender.toLowerCase()) {
      case 'male': return 'Nam';
      case 'female': return 'Nữ';
      default: return gender;
    }
  };

  if (isLoading) {
    return (
      <div className={cx('profile-loading')}>
        <FontAwesomeIcon icon={faSpinner} spin className={cx('loading-icon')} />
        <p>Đang tải thông tin người dùng...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cx('profile-error')}>
        <FontAwesomeIcon icon={faExclamationTriangle} className={cx('error-icon')} />
        <h2>Không thể tải thông tin người dùng</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()} className={cx('retry-button')}>
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className={cx('profile-container')}>
      <div className={cx('profile-header')}>
        <h1>
          <FontAwesomeIcon icon={faUser} className={cx('header-icon')} />
          Thông tin cá nhân
        </h1>
        <p className={cx('profile-subtitle')}>Quản lý thông tin cá nhân của bạn</p>
      </div>

      <div className={cx('profile-content')}>
        <div className={cx('profile-sidebar')}>
          <div className={cx('profile-avatar')}>
            <FontAwesomeIcon icon={faUserCircle} />
            {profile?.first_name && profile?.last_name && (
              <p className={cx('avatar-name')}>{`${profile.last_name} ${profile.first_name}`}</p>
            )}
          </div>

          <nav className={cx('profile-tabs')}>
            <button
              className={cx('tab-button', { active: activeTab === 'personal' })}
              onClick={() => setActiveTab('personal')}
            >
              <FontAwesomeIcon icon={faIdCard} />
              Thông tin cá nhân
            </button>
            <button
              className={cx('tab-button', { active: activeTab === 'medical' })}
              onClick={() => setActiveTab('medical')}
            >
              <FontAwesomeIcon icon={faFileText} />
              Hồ sơ bệnh án
            </button>
            <button
              className={cx('tab-button', { active: activeTab === 'security' })}
              onClick={() => setActiveTab('security')}
            >
              <FontAwesomeIcon icon={faShieldAlt} />
              Bảo mật tài khoản
            </button>
          </nav>

          <div className={cx('profile-actions')}>
            <Link to="/my-appointments" className={cx('action-button')}>
              <FontAwesomeIcon icon={faCalendarCheck} />
              Lịch hẹn của tôi
            </Link>
          </div>
        </div>

        <div className={cx('profile-main')}>
          {activeTab === 'personal' && (
            <div className={cx('profile-section', 'personal-info')}>
              <div className={cx('section-header')}>
                <h2>Thông tin cá nhân</h2>
                {!isEditing ? (
                  <button
                    onClick={handleEdit}
                    className={cx('edit-button')}
                    title="Chỉnh sửa thông tin cá nhân"
                  >
                    <FontAwesomeIcon icon={faEdit} />
                    Chỉnh sửa
                  </button>
                ) : (
                  <div className={cx('edit-actions')}>
                    <button onClick={handleCancel} className={cx('cancel-button')}>
                      <FontAwesomeIcon icon={faTimes} />
                      Hủy
                    </button>
                  </div>
                )}
              </div>

              <form onSubmit={handleSubmit} className={cx('profile-form')}>
                <div className={cx('form-grid')}>
                  <div className={cx('form-group')}>
                    <label>
                      <span className={cx('label-text')}>Họ</span>
                      {isEditing ? (
                        <input
                          type="text"
                          name="last_name"
                          value={formData.last_name}
                          onChange={handleChange}
                          className={cx('form-input')}
                          placeholder="Nhập họ"
                        />
                      ) : (
                        <div className={cx('form-value')}>{profile?.last_name || 'Chưa cập nhật'}</div>
                      )}
                    </label>
                  </div>

                  <div className={cx('form-group')}>
                    <label>
                      <span className={cx('label-text')}>Tên</span>
                      {isEditing ? (
                        <input
                          type="text"
                          name="first_name"
                          value={formData.first_name}
                          onChange={handleChange}
                          className={cx('form-input')}
                          placeholder="Nhập tên"
                        />
                      ) : (
                        <div className={cx('form-value')}>{profile?.first_name || 'Chưa cập nhật'}</div>
                      )}
                    </label>
                  </div>

                  <div className={cx('form-group')}>
                    <label>
                      <span className={cx('label-text')}>
                        <FontAwesomeIcon icon={faEnvelope} className={cx('input-icon')} />
                        Email
                      </span>
                      <div className={cx('form-value', 'email')}>{profile?.email}</div>
                    </label>
                  </div>

                  <div className={cx('form-group')}>
                    <label>
                      <span className={cx('label-text')}>
                        <FontAwesomeIcon icon={faPhone} className={cx('input-icon')} />
                        Số điện thoại
                      </span>
                      {isEditing ? (
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className={cx('form-input')}
                          placeholder="Nhập số điện thoại"
                        />
                      ) : (
                        <div className={cx('form-value')}>{profile?.phone || 'Chưa cập nhật'}</div>
                      )}
                    </label>
                  </div>

                  <div className={cx('form-group')}>
                    <label>
                      <span className={cx('label-text')}>
                        <FontAwesomeIcon icon={faBirthdayCake} className={cx('input-icon')} />
                        Ngày sinh
                      </span>
                      {isEditing ? (
                        <input
                          type="date"
                          name="birthday"
                          value={formData.birthday}
                          onChange={handleChange}
                          className={cx('form-input')}
                        />
                      ) : (
                        <div className={cx('form-value')}>{formatDate(profile?.birthday)}</div>
                      )}
                    </label>
                  </div>

                  <div className={cx('form-group')}>
                    <label>
                      <span className={cx('label-text')}>
                        <FontAwesomeIcon icon={faVenusMars} className={cx('input-icon')} />
                        Giới tính
                      </span>
                      {isEditing ? (
                        <select
                          name="gender"
                          value={formData.gender}
                          onChange={handleChange}
                          className={cx('form-select')}
                        >
                          <option value="">Chọn giới tính</option>
                          <option value="male">Nam</option>
                          <option value="female">Nữ</option>
                        </select>
                      ) : (
                        <div className={cx('form-value')}>{getGenderText(profile?.gender)}</div>
                      )}
                    </label>
                  </div>

                  <div className={cx('form-group', 'full-width')}>
                    <label>
                      <span className={cx('label-text')}>
                        <FontAwesomeIcon icon={faMapMarkerAlt} className={cx('input-icon')} />
                        Địa chỉ
                      </span>
                      {isEditing ? (
                        <input
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          className={cx('form-input')}
                          placeholder="Nhập địa chỉ"
                        />
                      ) : (
                        <div className={cx('form-value')}>{profile?.address || 'Chưa cập nhật'}</div>
                      )}
                    </label>
                  </div>
                </div>

                {isEditing && (
                  <div className={cx('form-actions')}>
                    <button
                      type="submit"
                      className={cx('save-button')}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <FontAwesomeIcon icon={faSpinner} spin />
                          Đang lưu...
                        </>
                      ) : (
                        <>
                          <FontAwesomeIcon icon={faSave} />
                          Lưu thay đổi
                        </>
                      )}
                    </button>
                  </div>
                )}
              </form>
            </div>
          )}

          {activeTab === 'medical' && (
            <div className={cx('profile-section', 'medical-info')}>
              <div className={cx('section-header')}>
                <h2>
                  <FontAwesomeIcon icon={faFileText} />
                  Hồ sơ bệnh án
                </h2>
                <div className={cx('medical-stats')}>
                  <span className={cx('stats-item')}>
                    <strong>{medicalRecords.length}</strong> hồ sơ
                  </span>
                </div>
              </div>

              {medicalRecords.length > 0 ? (
                <div className={cx('medical-records-list')}>
                  {medicalRecords.map((record) => (
                    <div key={record.id} className={cx('medical-record-card')}>
                      <div className={cx('record-header')}>
                        <div className={cx('record-date')}>
                          <FontAwesomeIcon icon={faCalendarAlt} />
                          <span>{formatDateTime(record.visitDate)}</span>
                          <span className={cx('record-time')}>{record.visitTime}</span>
                        </div>
                        <div className={cx('record-status', record.status)}>
                          <FontAwesomeIcon icon={faCheckCircle} />
                          Hoàn thành
                        </div>
                      </div>

                      <div className={cx('record-content')}>
                        <div className={cx('record-info')}>
                          <div className={cx('info-item')}>
                            <FontAwesomeIcon icon={faUserMd} />
                            <span><strong>Bác sĩ:</strong> {record.doctor}</span>
                          </div>
                          <div className={cx('info-item')}>
                            <FontAwesomeIcon icon={faStethoscope} />
                            <span><strong>Loại khám:</strong> {record.consultationType}</span>
                          </div>
                          <div className={cx('info-item')}>
                            <FontAwesomeIcon icon={faNotesMedical} />
                            <span><strong>Lý do khám:</strong> {record.chiefComplaint}</span>
                          </div>
                        </div>

                        <div className={cx('record-summary')}>
                          <div className={cx('diagnosis-summary')}>
                            <strong>Chẩn đoán:</strong> {record.diagnosis.finalDiagnosis}
                          </div>
                          {record.treatment.prescription.length > 0 && (
                            <div className={cx('prescription-summary')}>
                              <strong>Đơn thuốc:</strong> {record.treatment.prescription.length} loại thuốc
                            </div>
                          )}
                        </div>
                      </div>

                      <div className={cx('record-actions')}>
                        <button
                          className={cx('view-record-btn')}
                          onClick={() => viewMedicalRecord(record)}
                        >
                          <FontAwesomeIcon icon={faEye} />
                          Xem chi tiết
                        </button>
                        <button className={cx('download-record-btn')}>
                          <FontAwesomeIcon icon={faDownload} />
                          Tải xuống
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={cx('empty-medical-records')}>
                  <FontAwesomeIcon icon={faFileText} className={cx('empty-icon')} />
                  <h3>Chưa có hồ sơ bệnh án</h3>
                  <p>Sau khi hoàn thành các cuộc hẹn tư vấn, hồ sơ bệnh án sẽ được hiển thị tại đây.</p>
                  <Link to="/appointment" className={cx('book-appointment-btn')}>
                    <FontAwesomeIcon icon={faCalendarCheck} />
                    Đặt lịch tư vấn
                  </Link>
                </div>
              )}
            </div>
          )}

          {activeTab === 'security' && (
            <div className={cx('profile-section', 'security-info')}>
              <h2>Bảo mật tài khoản</h2>

              <div className={cx('security-content')}>
                <div className={cx('account-info')}>
                  <div className={cx('info-item')}>
                    <span className={cx('info-label')}>Trạng thái tài khoản:</span>
                    <span className={cx('info-value', 'account-status')}>
                      <FontAwesomeIcon
                        icon={faCheckCircle}
                        className={cx('status-icon', 'active')}
                      />
                      Hoạt động
                    </span>
                  </div>
                  <div className={cx('info-item')}>
                    <span className={cx('info-label')}>Email chính:</span>
                    <span className={cx('info-value', 'email')}>
                      {profile?.email}
                      {profile?.email_verified && (
                        <FontAwesomeIcon
                          icon={faCheckCircle}
                          className={cx('verified-icon')}
                          title="Email đã xác thực"
                        />
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Medical Record Detail Modal */}
      {showMedicalModal && selectedRecord && (
        <div className={cx('modal-overlay')} onClick={() => setShowMedicalModal(false)}>
          <div className={cx('modal-content', 'medical-modal')} onClick={(e) => e.stopPropagation()}>
            <div className={cx('modal-header')}>
              <h2>
                <FontAwesomeIcon icon={faFileText} />
                Hồ sơ bệnh án - {formatDate(selectedRecord.visitDate)}
              </h2>
              <button className={cx('close-btn')} onClick={() => setShowMedicalModal(false)}>×</button>
            </div>

            <div className={cx('modal-body', 'medical-modal-body')}>
              {/* Patient Info */}
              <div className={cx('medical-section')}>
                <h3>
                  <FontAwesomeIcon icon={faUser} />
                  Thông tin bệnh nhân
                </h3>
                <div className={cx('medical-grid')}>
                  <div className={cx('medical-item')}>
                    <strong>Họ tên:</strong>
                    <span>{profile.last_name} {profile.first_name}</span>
                  </div>
                  <div className={cx('medical-item')}>
                    <strong>Giới tính:</strong>
                    <span>{getGenderText(profile.gender)}</span>
                  </div>
                  <div className={cx('medical-item')}>
                    <strong>Ngày sinh:</strong>
                    <span>{formatDate(profile.birthday)}</span>
                  </div>
                  <div className={cx('medical-item')}>
                    <strong>Số điện thoại:</strong>
                    <span>{profile.phone}</span>
                  </div>
                </div>
              </div>

              {/* Visit Info */}
              <div className={cx('medical-section')}>
                <h3>
                  <FontAwesomeIcon icon={faCalendarAlt} />
                  Thông tin khám
                </h3>
                <div className={cx('medical-grid')}>
                  <div className={cx('medical-item')}>
                    <strong>Ngày khám:</strong>
                    <span>{formatDateTime(selectedRecord.visitDate)}</span>
                  </div>
                  <div className={cx('medical-item')}>
                    <strong>Giờ khám:</strong>
                    <span>{selectedRecord.visitTime}</span>
                  </div>
                  <div className={cx('medical-item')}>
                    <strong>Bác sĩ:</strong>
                    <span>{selectedRecord.doctor}</span>
                  </div>
                  <div className={cx('medical-item')}>
                    <strong>Loại tư vấn:</strong>
                    <span>{selectedRecord.consultationType}</span>
                  </div>
                </div>
                <div className={cx('medical-item', 'full-width')}>
                  <strong>Lý do khám:</strong>
                  <p>{selectedRecord.chiefComplaint}</p>
                </div>
              </div>

              {/* Vital Signs */}
              <div className={cx('medical-section')}>
                <h3>
                  <FontAwesomeIcon icon={faHeartbeat} />
                  Chỉ số sinh hiệu
                </h3>
                <div className={cx('vital-signs-grid')}>
                  <div className={cx('vital-item')}>
                    <FontAwesomeIcon icon={faWeight} />
                    <div>
                      <strong>Cân nặng</strong>
                      <span>{selectedRecord.vitalSigns.weight}</span>
                    </div>
                  </div>
                  <div className={cx('vital-item')}>
                    <FontAwesomeIcon icon={faRuler} />
                    <div>
                      <strong>Chiều cao</strong>
                      <span>{selectedRecord.vitalSigns.height}</span>
                    </div>
                  </div>
                  <div className={cx('vital-item')}>
                    <FontAwesomeIcon icon={faHeartbeat} />
                    <div>
                      <strong>Huyết áp</strong>
                      <span>{selectedRecord.vitalSigns.bloodPressure}</span>
                    </div>
                  </div>
                  <div className={cx('vital-item')}>
                    <FontAwesomeIcon icon={faThermometer} />
                    <div>
                      <strong>Nhiệt độ</strong>
                      <span>{selectedRecord.vitalSigns.temperature}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Diagnosis */}
              <div className={cx('medical-section')}>
                <h3>
                  <FontAwesomeIcon icon={faClipboardList} />
                  Chẩn đoán
                </h3>
                <div className={cx('medical-grid')}>
                  <div className={cx('medical-item')}>
                    <strong>Chẩn đoán sơ bộ:</strong>
                    <span>{selectedRecord.diagnosis.preliminaryDiagnosis}</span>
                  </div>
                  <div className={cx('medical-item')}>
                    <strong>Chẩn đoán cuối:</strong>
                    <span>{selectedRecord.diagnosis.finalDiagnosis}</span>
                  </div>
                  <div className={cx('medical-item')}>
                    <strong>Mã ICD:</strong>
                    <span>{selectedRecord.diagnosis.icdCode}</span>
                  </div>
                </div>
              </div>

              {/* Treatment */}
              <div className={cx('medical-section')}>
                <h3>
                  <FontAwesomeIcon icon={faPrescription} />
                  Điều trị
                </h3>

                {selectedRecord.treatment.prescription.length > 0 && (
                  <div className={cx('prescription-section')}>
                    <h4>Đơn thuốc</h4>
                    <div className={cx('prescription-list')}>
                      {selectedRecord.treatment.prescription.map((med, index) => (
                        <div key={index} className={cx('prescription-item')}>
                          <div className={cx('medicine-info')}>
                            <strong>{med.medicine}</strong>
                            <div className={cx('medicine-details')}>
                              <span>Liều dùng: {med.dosage}</span>
                              <span>Thời gian: {med.duration}</span>
                              <span>Cách dùng: {med.instructions}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className={cx('recommendations-section')}>
                  <h4>Khuyến cáo</h4>
                  <ul className={cx('recommendations-list')}>
                    {selectedRecord.treatment.recommendations.map((rec, index) => (
                      <li key={index}>{rec}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Notes */}
              <div className={cx('medical-section')}>
                <h3>
                  <FontAwesomeIcon icon={faNotesMedical} />
                  Ghi chú bác sĩ
                </h3>
                <p className={cx('doctor-notes')}>{selectedRecord.notes}</p>
              </div>

              {/* Signature */}
              <div className={cx('medical-section', 'signature-section')}>
                <div className={cx('signature-info')}>
                  <p><strong>Bác sĩ thực hiện:</strong> {selectedRecord.doctor}</p>
                  <p><strong>Ngày tạo:</strong> {formatDateTime(selectedRecord.visitDate)}</p>
                </div>
              </div>
            </div>

            <div className={cx('modal-footer')}>
              <button
                className={cx('print-btn')}
                onClick={() => window.print()}
              >
                <FontAwesomeIcon icon={faFileText} /> In hồ sơ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
