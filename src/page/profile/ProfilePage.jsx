import React, { useState, useEffect, useCallback } from "react";
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
  faFileText,
  faStethoscope,
  faCalendarAlt,
  faUserMd,
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
  const [medicalRecords, setMedicalRecords] = useState([]); // Changed from mockMedicalRecords
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showMedicalModal, setShowMedicalModal] = useState(false);
  const [medicalLoading, setMedicalLoading] = useState(false); // New loading state for medical records
  const [medicalError, setMedicalError] = useState(null); // New error state

  // Add function to fetch medical records from API
  const fetchMedicalRecords = useCallback(async () => {
    try {
      setMedicalLoading(true);
      setMedicalError(null);

      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        throw new Error('Không tìm thấy thông tin đăng nhập');
      }

      const response = await axiosClient.get('/v1/users/test-results', {
        headers: {
          'x-access-token': accessToken
        }
      });

      if (response.data?.status === 'success') {
        const testResults = response.data.data?.results || [];
        
        // Transform API data to match the expected medical record format
        const transformedRecords = testResults.map((result, index) => ({
          id: result.testresult_id || `record_${index}`,
          visitDate: result.exam_date,
          visitTime: result.exam_time,
          doctor: 'BS. GenCare',
          consultationType: result.service.name,
          chiefComplaint: result.service.description,
          orderInfo: {
            order_id: result.order_id,
            order_detail_id: result.order_detail_id,
            service_id: result.service.service_id
          },
          vitalSigns: {
            weight: 'Không có dữ liệu',
            height: 'Không có dữ liệu', 
            bloodPressure: result.result?.result || 'Không có dữ liệu',
            temperature: 'Không có dữ liệu',
            heartRate: 'Không có dữ liệu'
          },
          diagnosis: {
            preliminaryDiagnosis: result.service.name,
            finalDiagnosis: result.result?.conclusion || 'Chưa có kết luận',
            icdCode: 'Không có mã'
          },
          treatment: {
            // Remove prescription since it's not available in API
            recommendations: result.result?.recommendations ? 
              result.result.recommendations.split(',').map(rec => rec.trim()) : 
              ['Theo dõi kết quả', 'Tái khám nếu có triệu chứng bất thường']
          },
          testResult: {
            result: result.result?.result,
            conclusion: result.result?.conclusion,
            normal_range: result.result?.normal_range,
            recommendations: result.result?.recommendations,
            created_at: result.result?.created_at
          },
          serviceInfo: {
            name: result.service.name,
            description: result.service.description,
            result_wait_time: result.service.result_wait_time
          },
          notes: result.result?.recommendations || 'Kết quả xét nghiệm đã được ghi nhận.',
          status: 'completed',
          created_at: result.created_at
        }));

        setMedicalRecords(transformedRecords);
        console.log('✅ Medical records loaded:', transformedRecords);
      } else {
        throw new Error(response.data?.message || 'Không thể tải hồ sơ bệnh án');
      }
    } catch (err) {
      console.error('❌ Error fetching medical records:', err);
      setMedicalError(err.message || 'Đã xảy ra lỗi khi tải hồ sơ bệnh án');
      setMedicalRecords([]);
    } finally {
      setMedicalLoading(false);
    }
  }, []);

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

          // Fetch medical records from API instead of using mock data
          await fetchMedicalRecords();

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
  }, [fetchMedicalRecords]);

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
                  Hồ sơ bệnh án & Kết quả xét nghiệm
                </h2>
                <div className={cx('medical-stats')}>
                  <span className={cx('stats-item')}>
                    <strong>{medicalRecords.length}</strong> kết quả xét nghiệm
                  </span>
                  {medicalLoading && (
                    <span className={cx('loading-indicator')}>
                      <FontAwesomeIcon icon={faSpinner} spin />
                      Đang tải...
                    </span>
                  )}
                </div>
              </div>

              {medicalError && (
                <div className={cx('error-message')}>
                  <FontAwesomeIcon icon={faExclamationTriangle} />
                  <p>{medicalError}</p>
                  <button onClick={fetchMedicalRecords} className={cx('retry-button')}>
                    Thử lại
                  </button>
                </div>
              )}

              {/* Extracted medical records content logic */}
              {(() => {
                if (!medicalLoading && !medicalError && medicalRecords.length > 0) {
                  return (
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
                                <span><strong>Dịch vụ:</strong> {record.serviceInfo?.name}</span>
                              </div>
                              <div className={cx('info-item')}>
                                <FontAwesomeIcon icon={faStethoscope} />
                                <span><strong>Mô tả:</strong> {record.serviceInfo?.description}</span>
                              </div>
                              <div className={cx('info-item')}>
                                <FontAwesomeIcon icon={faNotesMedical} />
                                <span><strong>Thời gian chờ:</strong> {record.serviceInfo?.result_wait_time}</span>
                              </div>
                            </div>

                            <div className={cx('record-summary')}>
                              <div className={cx('test-result-summary')}>
                                <strong>Kết quả:</strong> {record.testResult?.result || 'Đang cập nhật'}
                              </div>
                              <div className={cx('conclusion-summary')}>
                                <strong>Kết luận:</strong> {record.testResult?.conclusion || 'Đang cập nhật'}
                              </div>
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
                  );
                } else if (!medicalLoading && !medicalError) {
                  return (
                    <div className={cx('empty-medical-records')}>
                      <FontAwesomeIcon icon={faFileText} className={cx('empty-icon')} />
                      <h3>Chưa có kết quả xét nghiệm</h3>
                      <p>Sau khi hoàn thành các lịch hẹn xét nghiệm, kết quả sẽ được hiển thị tại đây.</p>
                      <Link to="/services/sti-testing" className={cx('book-appointment-btn')}>
                        <FontAwesomeIcon icon={faCalendarCheck} />
                        Đặt lịch xét nghiệm
                      </Link>
                    </div>
                  );
                } else {
                  return null;
                }
              })()}
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
                Kết quả xét nghiệm - {formatDate(selectedRecord.visitDate)}
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
                    <strong>Mã đơn hàng:</strong>
                    <span>{selectedRecord.orderInfo?.order_id}</span>
                  </div>
                  <div className={cx('medical-item')}>
                    <strong>Mã dịch vụ:</strong>
                    <span>{selectedRecord.orderInfo?.service_id}</span>
                  </div>
                  <div className={cx('medical-item')}>
                    <strong>Số điện thoại:</strong>
                    <span>{profile.phone}</span>
                  </div>
                </div>
              </div>

              {/* Test Info */}
              <div className={cx('medical-section')}>
                <h3>
                  <FontAwesomeIcon icon={faCalendarAlt} />
                  Thông tin xét nghiệm
                </h3>
                <div className={cx('medical-grid')}>
                  <div className={cx('medical-item')}>
                    <strong>Ngày xét nghiệm:</strong>
                    <span>{formatDateTime(selectedRecord.visitDate)}</span>
                  </div>
                  <div className={cx('medical-item')}>
                    <strong>Giờ xét nghiệm:</strong>
                    <span>{selectedRecord.visitTime}</span>
                  </div>
                  <div className={cx('medical-item')}>
                    <strong>Dịch vụ:</strong>
                    <span>{selectedRecord.serviceInfo?.name}</span>
                  </div>
                  <div className={cx('medical-item')}>
                    <strong>Thời gian chờ kết quả:</strong>
                    <span>{selectedRecord.serviceInfo?.result_wait_time}</span>
                  </div>
                </div>
                <div className={cx('medical-item', 'full-width')}>
                  <strong>Mô tả dịch vụ:</strong>
                  <p>{selectedRecord.serviceInfo?.description}</p>
                </div>
              </div>

              {/* Test Results */}
              <div className={cx('medical-section')}>
                <h3>
                  <FontAwesomeIcon icon={faClipboardList} />
                  Kết quả xét nghiệm
                </h3>
                <div className={cx('test-results-content')}>
                  <div className={cx('result-item')}>
                    <strong>Kết quả:</strong>
                    <span className={cx('result-value')}>{selectedRecord.testResult?.result}</span>
                  </div>
                  <div className={cx('result-item')}>
                    <strong>Kết luận:</strong>
                    <span className={cx('conclusion-value')}>{selectedRecord.testResult?.conclusion}</span>
                  </div>
                  {selectedRecord.testResult?.normal_range && (
                    <div className={cx('result-item')}>
                      <strong>Giá trị tham chiếu:</strong>
                      <span>{selectedRecord.testResult.normal_range}</span>
                    </div>
                  )}
                  <div className={cx('result-item')}>
                    <strong>Ngày tạo kết quả:</strong>
                    <span>{formatDateTime(selectedRecord.testResult?.created_at)}</span>
                  </div>
                </div>
              </div>

              {/* Recommendations - Updated to focus on test recommendations only */}
              <div className={cx('medical-section')}>
                <h3>
                  <FontAwesomeIcon icon={faNotesMedical} />
                  Khuyến cáo từ kết quả xét nghiệm
                </h3>
                <div className={cx('recommendations-section')}>
                  <div className={cx('recommendations-content')}>
                    {selectedRecord.testResult?.recommendations ? (
                      <div className={cx('recommendation-text')}>
                        <p>{selectedRecord.testResult.recommendations}</p>
                      </div>
                    ) : (
                      <ul className={cx('recommendations-list')}>
                        {selectedRecord.treatment.recommendations.map((rec, index) => (
                          <li key={index}>{rec}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className={cx('medical-section')}>
                <h3>
                  <FontAwesomeIcon icon={faNotesMedical} />
                  Ghi chú bổ sung
                </h3>
                <p className={cx('doctor-notes')}>{selectedRecord.notes}</p>
              </div>
            </div>

            <div className={cx('modal-footer')}>
              <button
                className={cx('print-btn')}
                onClick={() => window.print()}
              >
                <FontAwesomeIcon icon={faFileText} /> In kết quả
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
