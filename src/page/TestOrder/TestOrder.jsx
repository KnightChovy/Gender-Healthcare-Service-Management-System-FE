import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVial, faUser, faNotesMedical, faExclamationTriangle, faCheckCircle, faArrowRight, faArrowLeft, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { testCategories } from './TestOrderItems/TestCategories';
import classNames from 'classnames/bind';
import styles from './TestOrder.module.scss';

const cx = classNames.bind(styles);

function TestOrder() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    // Thông tin cá nhân
    fullName: '',
    phone: '',
    email: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    
    // Thông tin xét nghiệm
    testCategory: '',
    selectedTests: [],
    urgency: 'normal',
    preferredDate: '',
    preferredTime: '',
    location: '',
    
    // Thông tin y tế
    symptoms: '',
    medicalHistory: '',
    currentMedications: '',
    allergies: '',
    lastTest: '',
    
    // Ghi chú
    notes: '',
    agreeTerms: false,
    agreePrivacy: false
  });

  const [errors, setErrors] = useState({});
    // Uncomment if you want to track touched fields
    // const [touchedFields, setTouchedFields] = useState({});

  // Validation helpers
  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Vui lòng nhập họ tên';
    if (!formData.phone.trim()) newErrors.phone = 'Vui lòng nhập số điện thoại';
    if (!formData.email.trim()) newErrors.email = 'Vui lòng nhập email';
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Vui lòng chọn ngày sinh';
    if (!formData.gender) newErrors.gender = 'Vui lòng chọn giới tính';
    return newErrors;
  };

  const validateStep2 = () => {
    const newErrors = {};
    if (!formData.testCategory) newErrors.testCategory = 'Vui lòng chọn loại xét nghiệm';
    if (formData.selectedTests.length === 0) newErrors.selectedTests = 'Vui lòng chọn ít nhất một xét nghiệm';
    if (!formData.preferredDate) newErrors.preferredDate = 'Vui lòng chọn ngày xét nghiệm';
    if (!formData.location) newErrors.location = 'Vui lòng chọn địa điểm';
    return newErrors;
  };

  const validateStep4 = () => {
    const newErrors = {};
    if (!formData.agreeTerms) newErrors.agreeTerms = 'Vui lòng đồng ý với điều khoản';
    if (!formData.agreePrivacy) newErrors.agreePrivacy = 'Vui lòng đồng ý với chính sách bảo mật';
    return newErrors;
  };

  // Validation
  const validateStep = (stepNumber) => {
    let newErrors = {};
    if (stepNumber === 1) {
      newErrors = validateStep1();
    } else if (stepNumber === 2) {
      newErrors = validateStep2();
    } else if (stepNumber === 4) {
      newErrors = validateStep4();
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handlers
  const handleInputChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleTestSelection = (testId) => {
    setFormData(prev => ({
      ...prev,
      selectedTests: prev.selectedTests.includes(testId)
        ? prev.selectedTests.filter(id => id !== testId)
        : [...prev.selectedTests, testId]
    }));
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(4)) return;

    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Navigate to success page or dashboard
      navigate('/test-order-success');
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCurrentTests = () => {
    const category = testCategories.find(cat => cat.id === formData.testCategory);
    return category ? category.tests : [];
  };

  const getTotalPrice = () => {
    const currentTests = getCurrentTests();
    let basePrice = formData.selectedTests.reduce((total, testId) => {
      const test = currentTests.find(t => t.id === testId);
      return total + (test ? parseInt(test.price.replace(/,/g, '')) : 0);
    }, 0);

    // Add urgency fee
    if (formData.urgency === 'urgent') {
      basePrice += 500000;
    }

    // Add home service fee
    if (formData.location === 'home') {
      basePrice += 200000;
    }

    return basePrice;
  };

  const formatPrice = (price) => {
    return price.toLocaleString('vi-VN') + ' VNĐ';
  };

  return (
    <div className={cx('test-order-page')}>
      <div className={cx('container')}>
        {/* Header */}
        <div className={cx('header')}>
          <button className={cx('back-button')} onClick={() => navigate(-1)}>
            <FontAwesomeIcon icon={faArrowLeft} />
            <span>Quay lại</span>
          </button>
          <h1>
            <FontAwesomeIcon icon={faVial} />
            Đăng ký xét nghiệm
          </h1>
          <p>Đăng ký xét nghiệm STI và các bệnh sinh lý khác</p>
        </div>

        {/* Progress Steps */}
        <div className={cx('progress-steps')}>
          {[{
            step: 1,
            title: 'Thông tin cá nhân',
            icon: faUser
          },
          {
            step: 2,
            title: 'Chọn xét nghiệm',
            icon: faVial
          },
          {
            step: 3,
            title: 'Thông tin y tế',
            icon: faNotesMedical
          },
          {
            step: 4,
            title: 'Xác nhận',
            icon: faCheckCircle
          }].map((item) => (
            <div key={item.step} className={cx('step-item', {
                active: step === item.step,
                completed: step > item.step
              })}
            >
              <div className={cx('step-icon')}>
                <FontAwesomeIcon icon={item.icon} />
              </div>
              <span className={cx('step-title')}>{item.title}</span>
            </div>
          ))}
        </div>

        {/* Form Container */}
        <div className={cx('form-container')}>
          <form onSubmit={handleSubmit}>
            {/* Step 1: Personal Information */}
            {step === 1 && (
              <div className={cx('step-content')}>
                <h2>Thông tin cá nhân</h2>
                
                <div className={cx('form-row')}>
                  <div className={cx('form-group')}>
                    <span className={cx('required')}>Họ và tên</span>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      placeholder="Nhập họ và tên đầy đủ"
                      className={cx({ error: errors.fullName })}
                    />
                    {errors.fullName && <span className={cx('error-text')}>{errors.fullName}</span>}
                  </div>

                  <div className={cx('form-group')}>
                    <span className={cx('required')}>Số điện thoại</span>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="Nhập số điện thoại"
                      className={cx({ error: errors.phone })}
                    />
                    {errors.phone && <span className={cx('error-text')}>{errors.phone}</span>}
                  </div>
                </div>

                <div className={cx('form-row')}>
                  <div className={cx('form-group')}>
                    <span className={cx('required')}>Email</span>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="Nhập địa chỉ email"
                      className={cx({ error: errors.email })}
                    />
                    {errors.email && <span className={cx('error-text')}>{errors.email}</span>}
                  </div>

                  <div className={cx('form-group')}>
                    <span className={cx('required')}>Ngày sinh</span>
                    <input
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                      className={cx({ error: errors.dateOfBirth })}
                    />
                    {errors.dateOfBirth && <span className={cx('error-text')}>{errors.dateOfBirth}</span>}
                  </div>
                </div>

                <div className={cx('form-group')}>
                  <span className={cx('required')}>Giới tính</span>
                  <div className={cx('radio-group')}>
                    {['female', 'male'].map((gender) => (
                      <label key={gender} className={cx('radio-label')}>
                        <input
                          type="radio"
                          name="gender"
                          value={gender}
                          checked={formData.gender === gender}
                          onChange={(e) => handleInputChange('gender', e.target.value)}
                        />
                        <span>
                          {gender === 'female' ? 'Nữ' : 'Nam'}
                        </span>
                      </label>
                    ))}
                  </div>
                  {errors.gender && <span className={cx('error-text')}>{errors.gender}</span>}
                </div>

                <div className={cx('form-group')}>
                  <span>Địa chỉ</span>
                  <textarea
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="Nhập địa chỉ của bạn"
                    rows="3"
                  />
                </div>
              </div>
            )}

            {/* Step 2: Test Selection */}
            {step === 2 && (
              <div className={cx('step-content')}>
                <h2>Chọn loại xét nghiệm</h2>
                
                <div className={cx('test-categories')}>
                  {testCategories.map((category) => (
                    <div key={category.id} className={cx('category-card', {  selected: formData.testCategory === category.id })}
                      onClick={() => handleInputChange('testCategory', category.id)}
                    >
                      <div className={cx('category-icon')}>{category.icon}</div>
                      <h3>{category.name}</h3>
                      <p>{category.description}</p>
                    </div>
                  ))}
                </div>
                {errors.testCategory && <span className={cx('error-text')}>{errors.testCategory}</span>}

                {formData.testCategory && (
                  <>
                    <h3>Chọn xét nghiệm cụ thể</h3>
                    <div className={cx('test-selection')}>
                      {getCurrentTests().map((test) => (
                        <div key={test.id} className={cx('test-card', { selected: formData.selectedTests.includes(test.id)})}
                          onClick={() => handleTestSelection(test.id)}
                        >
                          <div className={cx('test-info')}>
                            <h4>{test.name}</h4>
                            <p>{test.description}</p>
                            <span className={cx('price')}>{test.price} VNĐ</span>
                          </div>
                          <div className={cx('checkbox')}>
                            <input
                              type="checkbox"
                              checked={formData.selectedTests.includes(test.id)}
                              onChange={() => handleTestSelection(test.id)}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                    {errors.selectedTests && <span className={cx('error-text')}>{errors.selectedTests}</span>}

                    {formData.selectedTests.length > 0 && (
                      <div className={cx('total-price')}>
                        <div>
                          <span>Chi phí xét nghiệm: {formatPrice(formData.selectedTests.reduce((total, testId) => {
                            const test = getCurrentTests().find(t => t.id === testId);
                            return total + (test ? parseInt(test.price.replace(/,/g, '')) : 0);
                          }, 0))}</span>
                        </div>
                        
                        {formData.urgency === 'urgent' && (
                          <div>
                            <span>Phí khẩn cấp: 500,000 VNĐ</span>
                          </div>
                        )}
                        
                        {formData.location === 'home' && (
                          <div>
                            <span>Phí xét nghiệm tại nhà: 200,000 VNĐ</span>
                          </div>
                        )}
                        
                        <div className={cx('total-line')}>
                          <strong>Tổng chi phí: {formatPrice(getTotalPrice())}</strong>
                        </div>
                      </div>
                    )}
                  </>
                )}

                <div className={cx('form-row')}>
                  <div className={cx('form-group')}>
                    <span className={cx('required')}>Ngày xét nghiệm mong muốn</span>
                    <input
                      type="date"
                      value={formData.preferredDate}
                      onChange={(e) => handleInputChange('preferredDate', e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className={cx({ error: errors.preferredDate })}
                    />
                    {errors.preferredDate && <span className={cx('error-text')}>{errors.preferredDate}</span>}
                  </div>

                  <div className={cx('form-group')}>
                    <span>Thời gian ưu tiên</span>
                    <select
                      value={formData.preferredTime}
                      onChange={(e) => handleInputChange('preferredTime', e.target.value)}
                    >
                      <option value="">Chọn thời gian</option>
                      <option value="morning">Buổi sáng (8:00 - 12:00)</option>
                      <option value="afternoon">Buổi chiều (13:00 - 17:00)</option>
                      <option value="evening">Buổi tối (17:00 - 20:00)</option>
                    </select>
                  </div>
                </div>

                <div className={cx('form-group')}>
                  <span className={cx('required')}>Địa điểm xét nghiệm</span>
                  <select
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className={cx({ error: errors.location })}
                  >
                    <option value="">Chọn địa điểm</option>
                    <option value="center1">GenCare Center - Quận 1</option>
                    <option value="center2">GenCare Center - Quận 3</option>
                    <option value="center3">GenCare Center - Quận 7</option>
                    <option value="home">Xét nghiệm tại nhà (+200,000 VNĐ)</option>
                  </select>
                  {errors.location && <span className={cx('error-text')}>{errors.location}</span>}
                </div>

                <div className={cx('form-group')}>
                  <span>Mức độ khẩn cấp</span>
                  <div className={cx('radio-group')}>
                    <label className={cx('radio-label')}>
                      <input
                        type="radio"
                        name="urgency"
                        value="normal"
                        checked={formData.urgency === 'normal'}
                        onChange={(e) => handleInputChange('urgency', e.target.value)}
                      />
                      <span>Bình thường</span>
                    </label>
                    <label className={cx('radio-label')}>
                      <input
                        type="radio"
                        name="urgency"
                        value="urgent"
                        checked={formData.urgency === 'urgent'}
                        onChange={(e) => handleInputChange('urgency', e.target.value)}
                      />
                      <span>Khẩn cấp (+500,000 VNĐ)</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Medical Information */}
            {step === 3 && (
              <div className={cx('step-content')}>
                <h2>Thông tin y tế</h2>
                <p className={cx('note')}>
                  <FontAwesomeIcon icon={faExclamationTriangle} />
                  Thông tin này sẽ giúp bác sĩ tư vấn chính xác hơn. Tất cả thông tin được bảo mật tuyệt đối.
                </p>

                <div className={cx('form-group')}>
                  <span>Triệu chứng hiện tại</span>
                  <textarea
                    value={formData.symptoms}
                    onChange={(e) => handleInputChange('symptoms', e.target.value)}
                    placeholder="Mô tả các triệu chứng bạn đang gặp phải (nếu có)"
                    rows="3"
                  />
                </div>

                <div className={cx('form-group')}>
                  <span>Tiền sử bệnh</span>
                  <textarea
                    value={formData.medicalHistory}
                    onChange={(e) => handleInputChange('medicalHistory', e.target.value)}
                    placeholder="Các bệnh đã từng mắc, phẫu thuật đã thực hiện"
                    rows="3"
                  />
                </div>

                <div className={cx('form-group')}>
                  <span>Thuốc đang sử dụng</span>
                  <textarea
                    value={formData.currentMedications}
                    onChange={(e) => handleInputChange('currentMedications', e.target.value)}
                    placeholder="Liệt kê các loại thuốc, vitamin, thực phẩm chức năng đang sử dụng"
                    rows="2"
                  />
                </div>

                <div className={cx('form-group')}>
                  <span>Dị ứng</span>
                  <textarea
                    value={formData.allergies}
                    onChange={(e) => handleInputChange('allergies', e.target.value)}
                    placeholder="Dị ứng với thuốc, thực phẩm, hóa chất nào (nếu có)"
                    rows="2"
                  />
                </div>

                <div className={cx('form-group')}>
                  <span>Lần xét nghiệm gần nhất</span>
                  <input
                    type="date"
                    value={formData.lastTest}
                    onChange={(e) => handleInputChange('lastTest', e.target.value)}
                  />
                </div>

                <div className={cx('form-group')}>
                  <span>Ghi chú thêm</span>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    placeholder="Thông tin bổ sung, yêu cầu đặc biệt"
                    rows="3"
                  />
                </div>
              </div>
            )}

            {/* Step 4: Confirmation */}
            {step === 4 && (
              <div className={cx('step-content')}>
                <h2>Xác nhận thông tin</h2>
                
                <div className={cx('confirmation-summary')}>
                  <div className={cx('summary-section')}>
                    <h3>Thông tin cá nhân</h3>
                    <p><strong>Họ tên:</strong> {formData.fullName}</p>
                    <p><strong>Điện thoại:</strong> {formData.phone}</p>
                    <p><strong>Email:</strong> {formData.email}</p>
                    <p><strong>Ngày sinh:</strong> {formData.dateOfBirth}</p>
                  </div>

                  <div className={cx('summary-section')}>
                    <h3>Xét nghiệm đã chọn</h3>
                    {getCurrentTests()
                      .filter(test => formData.selectedTests.includes(test.id))
                      .map(test => (
                        <p key={test.id}>
                          <strong>{test.name}:</strong> {test.price} VNĐ
                        </p>
                      ))}
                  </div>

                  <div className={cx('summary-section')}>
                    <h3>Lịch hẹn</h3>
                    <p><strong>Ngày:</strong> {formData.preferredDate}</p>
                    <p><strong>Thời gian:</strong> {formData.preferredTime}</p>
                    <p><strong>Địa điểm:</strong> {formData.location}</p>
                  </div>

                  <div className={cx('summary-section')}>
                    <h3>Chi phí</h3>
                    {getCurrentTests()
                      .filter(test => formData.selectedTests.includes(test.id))
                      .map(test => (
                        <p key={test.id}>
                          <strong>{test.name}:</strong> {test.price} VNĐ
                        </p>
                      ))}
                    
                    {formData.urgency === 'urgent' && (
                      <p><strong>Phí khẩn cấp:</strong> 500,000 VNĐ</p>
                    )}
                    
                    {formData.location === 'home' && (
                      <p><strong>Phí xét nghiệm tại nhà:</strong> 200,000 VNĐ</p>
                    )}
                    
                    <p className={cx('total')}>
                      <strong>Tổng cộng: {formatPrice(getTotalPrice())}</strong>
                    </p>
                  </div>
                </div>

                <div className={cx('agreement-section')}>
                  <label className={cx('checkbox-label', { error: errors.agreeTerms })}>
                    <input
                      type="checkbox"
                      checked={formData.agreeTerms}
                      onChange={(e) => handleInputChange('agreeTerms', e.target.checked)}
                    />
                    <span>Tôi đồng ý với <a href="/terms" target="_blank">điều khoản sử dụng</a></span>
                  </label>
                  {errors.agreeTerms && <span className={cx('error-text')}>{errors.agreeTerms}</span>}

                  <label className={cx('checkbox-label', { error: errors.agreePrivacy })}>
                    <input
                      type="checkbox"
                      checked={formData.agreePrivacy}
                      onChange={(e) => handleInputChange('agreePrivacy', e.target.checked)}
                    />
                    <span>Tôi đồng ý với <a href="/privacy" target="_blank">chính sách bảo mật</a></span>
                  </label>
                  {errors.agreePrivacy && <span className={cx('error-text')}>{errors.agreePrivacy}</span>}
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className={cx('form-actions')}>
              {step > 1 && (
                <button
                  type="button"
                  className={cx('btn-secondary')}
                  onClick={prevStep}
                >
                  <FontAwesomeIcon icon={faArrowLeft} />
                  Quay lại
                </button>
              )}

              {step < 4 ? (
                <button
                  type="button"
                  className={cx('btn-primary')}
                  onClick={nextStep}
                >
                  Tiếp tục
                  <FontAwesomeIcon icon={faArrowRight} />
                </button>
              ) : (
                <button
                  type="submit"
                  className={cx('btn-primary', 'submit-btn')}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <FontAwesomeIcon icon={faSpinner} spin />
                      Đang xử lý...
                    </>
                  ) : (
                    <>
                      Đăng ký xét nghiệm
                      <FontAwesomeIcon icon={faCheckCircle} />
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default TestOrder;