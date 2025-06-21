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
  faCalendarCheck
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

        if (response.data && response.data.success) {
          // The API returns userProfile instead of data
          const userData = response.data.userProfile;
          
          // Transform the data to match our expected format
          const transformedData = {
            ...userData,
            // Map birthday to birth_date as expected by our form
            birth_date: userData.birthday || '',
          };
          
          setProfile(transformedData);
          
          // Initialize form data with user data
          setFormData({
            first_name: transformedData.first_name || '',
            last_name: transformedData.last_name || '',
            email: transformedData.email || '',
            phone: transformedData.phone || '',
            birth_date: transformedData.birth_date || '',
            gender: transformedData.gender || '',
            address: transformedData.address || '',
          });
          
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
    // Reset form data to original profile
    if (profile) {
      setFormData({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        email: profile.email || '',
        phone: profile.phone || '',
        birth_date: profile.birth_date || '',
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

      const response = await axiosClient.put('/v1/users/profile/update', formData, {
        headers: {
          'x-access-token': accessToken
        }
      });

      if (response.data && response.data.success) {
        // Update profile with new data
        setProfile({
          ...profile,
          ...formData
        });
        setIsEditing(false);
        toast.success('Cập nhật thông tin thành công!');
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

  const getGenderText = (gender) => {
    if (!gender) return 'Chưa cập nhật';
    
    switch (gender.toLowerCase()) {
      case 'male': return 'Nam';
      case 'female': return 'Nữ';
      default: return gender;
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className={cx('profile-loading')}>
        <FontAwesomeIcon icon={faSpinner} spin className={cx('loading-icon')} />
        <p>Đang tải thông tin người dùng...</p>
      </div>
    );
  }

  // Error state
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
                          name="birth_date"
                          value={formData.birth_date}
                          onChange={handleChange}
                          className={cx('form-input')}
                        />
                      ) : (
                        <div className={cx('form-value')}>{formatDate(profile?.birth_date)}</div>
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
    </div>
  );
};

export default ProfilePage;
