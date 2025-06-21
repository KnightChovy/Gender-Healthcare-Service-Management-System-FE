import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./AppointmentItems/Header";
import PersonalInfoSection from "./AppointmentItems/PersonalInfoSection";
import ConsultationSection from "./AppointmentItems/ConsultationSection";
import DoctorSelection from "./AppointmentItems/DoctorSelection";
import DateTimeSection from "./AppointmentItems/DateTimeSection";
import AdditionalInfoSection from "./AppointmentItems/AdditionalInfoSection";
import classNames from "classnames/bind";
import styles from "./Appointment.module.scss";

const cx = classNames.bind(styles);

function Appointment() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [formData, setFormData] = useState({
    // Thông tin cá nhân
    fullName: "",
    birthDate: "",
    gender: "",
    phone: "",
    email: "",
    address: "",

    // Thông tin cuộc hẹn
    consultationType: "",
    selectedDoctor: "",
    doctorName: "",
    appointmentDate: "",
    appointmentTime: "",

    // Thông tin bổ sung
    symptoms: "",
    medicalHistory: "",
    notes: "",
    priority: "normal",

    // Thông tin thanh toán
    fee: 200000,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    checkUserStatus();
  }, []);

  const checkUserStatus = () => {
    try {
      const isLoggedIn = localStorage.getItem("accessToken") !== null;
      const userInfo = localStorage.getItem("user");

      if (isLoggedIn) {
        const profile = JSON.parse(userInfo);
        setIsLoggedIn(true);
        setUserProfile(profile);

        // Auto-fill form với thông tin user
        setFormData((prev) => ({
          ...prev,
          fullName:
            profile.fullName ||
            `${profile.first_name || ""} ${profile.last_name || ""}`.trim(),
          phone: profile.phone || "",
          email: profile.email || "",
          birthDate: profile.birthday || profile.birth_date || "",
          gender: profile.gender || "",
          address: profile.address || "",
        }));

        console.log("✅ User logged in, auto-filled form data");
      } else {
        setIsLoggedIn(false);
        setUserProfile(null);
        console.log("ℹ️ User not logged in");
      }
    } catch (error) {
      console.error("❌ Error checking user status:", error);
      setIsLoggedIn(false);
    }
  };

  // Tính tuổi từ ngày sinh
  const calculateAge = (birthDate) => {
    if (!birthDate) return null;

    const birth = new Date(birthDate);
    const today = new Date();

    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    const dayDiff = today.getDate() - birth.getDate();

    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      age--;
    }

    return age;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error khi user bắt đầu nhập
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    // Validate ngày sinh realtime
    if (name === "birthDate" && value) {
      validateBirthDate(value);
    }

    // Auto calculate fee khi chọn consultation type
    if (name === "consultationType") {
      const newFee = calculateFee(value);
      setFormData((prev) => ({
        ...prev,
        fee: newFee,
      }));
    }
  };

  const validateBirthDate = (birthDate) => {
    const birth = new Date(birthDate);
    const today = new Date();

    if (birth > today) {
      setErrors((prev) => ({
        ...prev,
        birthDate: "Ngày sinh không được trong tương lai",
      }));
    } else {
      const age = calculateAge(birthDate);
      if (age < 0) {
        setErrors((prev) => ({
          ...prev,
          birthDate: "Ngày sinh không hợp lệ",
        }));
      } else if (age > 120) {
        setErrors((prev) => ({
          ...prev,
          birthDate: "Tuổi không được vượt quá 120",
        }));
      } else {
        setErrors((prev) => ({
          ...prev,
          birthDate: "",
        }));
      }
    }
  };

  // Thêm helper function để lấy timeslot_id từ localStorage
  const getTimeslotIdFromStorage = (selectedDate, selectedTime) => {
    try {
      const availableTimeslots = localStorage.getItem('doctorAvailableTimeslots');
      if (!availableTimeslots) {
        console.warn('⚠️ No timeslots found in localStorage');
        return null;
      }

      const timeslots = JSON.parse(availableTimeslots);
      console.log('🔍 Searching for timeslot:', { selectedDate, selectedTime });

      // Tìm timeslot theo ngày và giờ đã chọn
      for (const dateSchedule of timeslots) {
        if (dateSchedule.date === selectedDate) {
          console.log('📆 Found matching date:', dateSchedule);
          
          // Tìm trong từng period (morning, afternoon, evening)
          for (const period of dateSchedule.periods || []) {
            // Tìm trong từng timeslot
            for (const timeslot of period.timeslots || []) {
              // Tạo format thời gian để so sánh
              const timeslotTime = `${timeslot.start_time} - ${timeslot.end_time}`;
              
              // So sánh với nhiều format khác nhau
              if (timeslotTime === selectedTime || 
                  timeslot.start_time === selectedTime.split(' - ')[0] ||
                  selectedTime.includes(timeslot.start_time) ||
                  timeslot.start_time === selectedTime) {
                
                console.log('✅ Found matching timeslot:', {
                  timeslot_id: timeslot.timeslot_id,
                  start_time: timeslot.start_time,
                  end_time: timeslot.end_time,
                  status: timeslot.status
                });
                
                return timeslot.timeslot_id;
              }
            }
          }
        }
      }
      
      console.warn('⚠️ No matching timeslot found for:', { selectedDate, selectedTime });
      return null;
    } catch (error) {
      console.error('❌ Error parsing timeslots from localStorage:', error);
      return null;
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate thông tin cá nhân (bắt buộc cho cả user đã đăng nhập và chưa đăng nhập)
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Vui lòng nhập họ tên";
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = "Họ tên phải có ít nhất 2 ký tự";
    } else if (!/^[a-zA-ZÀ-ỹ\s]+$/.test(formData.fullName.trim())) {
      newErrors.fullName = "Họ tên chỉ được chứa chữ cái và khoảng trắng";
    }

    // Validate ngày sinh
    if (!formData.birthDate) {
      newErrors.birthDate = "Vui lòng chọn ngày sinh";
    } else {
      const birthDate = new Date(formData.birthDate);
      const today = new Date();

      if (birthDate > today) {
        newErrors.birthDate = "Ngày sinh không được trong tương lai";
      } else {
        const age = calculateAge(formData.birthDate);
        if (age < 0) {
          newErrors.birthDate = "Ngày sinh không hợp lệ";
        } else if (age > 120) {
          newErrors.birthDate = "Tuổi không được vượt quá 120";
        }
      }
    }

    // Validate giới tính
    if (!formData.gender) {
      newErrors.gender = "Vui lòng chọn giới tính";
    }

    // Validate số điện thoại
    if (!formData.phone.trim()) {
      newErrors.phone = "Vui lòng nhập số điện thoại";
    } else if (!/^[0-9]{10,11}$/.test(formData.phone.replace(/\s+/g, ""))) {
      newErrors.phone = "Số điện thoại không hợp lệ (10-11 chữ số)";
    }

    // Validate email
    if (!formData.email.trim()) {
      newErrors.email = "Vui lòng nhập email";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    // Validate thông tin cuộc hẹn
    if (!formData.consultationType) {
      newErrors.consultationType = "Vui lòng chọn loại tư vấn";
    }

    // Validate doctor selection - BẮT BUỘC
    if (!formData.selectedDoctor) {
      newErrors.selectedDoctor = "Vui lòng chọn bác sĩ tư vấn";
    }

    if (!formData.appointmentDate) {
      newErrors.appointmentDate = "Vui lòng chọn ngày tư vấn";
    } else {
      const selectedDate = new Date(formData.appointmentDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        newErrors.appointmentDate = "Ngày tư vấn không được trong quá khứ";
      }

      const sixMonthsFromNow = new Date();
      sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6);

      if (selectedDate > sixMonthsFromNow) {
        newErrors.appointmentDate =
          "Ngày tư vấn không được quá 6 tháng kể từ hôm nay";
      }
    }

    if (!formData.appointmentTime) {
      newErrors.appointmentTime = "Vui lòng chọn giờ tư vấn";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      console.warn("❌ Form validation failed:", errors);
      alert("Vui lòng kiểm tra lại thông tin đã nhập.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Lấy timeslot_id từ localStorage
      const timeslotId = getTimeslotIdFromStorage(formData.appointmentDate, formData.appointmentTime);

      // Tạo appointment data
      const appointmentData = {
        // Thông tin bệnh nhân
        user_id: userProfile?.user_id || null,
        fullName: formData.fullName,
        phone: formData.phone,
        email: formData.email,
        birthDate: formData.birthDate,
        gender: formData.gender,
        address: formData.address,

        // Thông tin cuộc hẹn
        consultant_type: formData.consultationType,
        selectedDoctor: formData.selectedDoctor, // Bắt buộc phải có
        doctorName: formData.doctorName, // Tên bác sĩ đã chọn
        appointmentDate: formData.appointmentDate,
        appointmentTime: formData.appointmentTime,
        timeslot_id: timeslotId || `TS${Date.now()}`, // Lấy từ localStorage hoặc tạo mới

        // Thông tin y tế
        symptoms: formData.symptoms,
        medicalHistory: formData.medicalHistory,
        notes: formData.notes,
        priority: formData.priority,

        // Thông tin thanh toán
        price_apm: formData.fee,

        // Metadata
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        status: "0", // Trạng thái chờ xác nhận
        isUserLoggedIn: isLoggedIn,
        id: `APT${Date.now()}`,
      };

      console.log('📋 Appointment data with selected doctor:', {
        selectedDoctor: appointmentData.selectedDoctor,
        doctorName: appointmentData.doctorName,
        timeslot_id: appointmentData.timeslot_id,
        appointmentDate: appointmentData.appointmentDate,
        appointmentTime: appointmentData.appointmentTime
      });

      // Lưu vào localStorage để theo dõi
      localStorage.setItem(
        "pendingAppointment",
        JSON.stringify(appointmentData)
      );

      // Gửi API request để tạo appointment
      const res = await fetch("http://52.4.72.106:3000/v1/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(appointmentData),
      });
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      console.log("✅ Appointment submitted successfully:", appointmentData);

      // Hiển thị thông báo thành công
      showSuccessNotification();

      // Chuyển về trang chủ sau 10 giây
      setTimeout(() => {
        navigate("/");
        localStorage.removeItem('doctorAvailableTimeslots');
      }, 10000);
    } catch (error) {
      console.error("❌ Error submitting appointment:", error);
      alert("Có lỗi xảy ra khi đặt lịch hẹn. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Hiển thị thông báo thành công
  const showSuccessNotification = () => {
    // Tạo element thông báo
    const notification = document.createElement("div");
    notification.className = "appointment-success-notification";
    notification.innerHTML = `
        <div class="notification-overlay"></div>
        <div class="notification-content">
            <div class="notification-text">
                <h3>Lịch hẹn đã được gửi về hệ thống</h3>
                <p class="main-message">Cảm ơn bạn đã tin tưởng dịch vụ của chúng tôi</p>
                <div class="info-box">
                    <div class="info-item">
                        <span class="info-icon">⏱️</span>
                        <span>Xác nhận trong 1-2 giờ</span>
                    </div>
                    <div class="info-item">
                        <span class="info-icon">📧</span>
                        <span>Thông tin thanh toán sẽ gửi sau khi hệ thống xác nhận</span>
                    </div>
                </div>
                <div class="countdown">
                    <div class="countdown-number">10</div>
                    <span class="countdown-label">Đang chuyển về trang chủ...</span>
                </div>

                <button class="home-button" onclick="window.location.href='/'">
                    🏠 Về trang chủ ngay
                </button>
            </div>
        </div>
    `;

    // CSS đơn giản
    const style = document.createElement("style");
    style.textContent = `
        .appointment-success-notification {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.7);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            animation: fadeIn 0.3s ease;
        }
        
        .notification-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
        }
        
        .notification-content {
            position: relative;
            background: white;
            padding: 2rem;
            border-radius: 16px;
            text-align: center;
            max-width: 500px;
            width: 90%;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            animation: slideUp 0.4s ease;
        }
        
        .success-icon {
            font-size: 4rem;
            margin-bottom: 1rem;
            animation: bounce 0.6s ease;
        }
        
        .notification-text h3 {
            color: #28a745;
            margin: 0 0 1rem 0;
            font-size: 1.5rem;
            font-weight: 600;
        }
        
        .main-message {
            color: #666;
            margin: 0 0 1.5rem 0;
            font-size: 1rem;
            line-height: 1.5;
        }
        
        .info-box {
            background: #f8f9fa;
            border-radius: 10px;
            padding: 1.25rem;
            margin: 1.5rem 0;
            border: 1px solid #e9ecef;
        }
        
        .info-item {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            padding: 0.5rem 0;
            font-size: 0.95rem;
            color: #495057;
        }
        
        .info-item:not(:last-child) {
            border-bottom: 1px solid #e9ecef;
            margin-bottom: 0.5rem;
            padding-bottom: 0.75rem;
        }
        
        .info-icon {
            font-size: 1.2rem;
            width: 24px;
            text-align: center;
        }
        
        .countdown {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 1rem;
            margin-top: 1.5rem;
            padding: 1rem;
            background: #e8f5e8;
            border-radius: 10px;
        }
        
        .countdown-number {
            background: #28a745;
            color: white;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.25rem;
            font-weight: 600;
            animation: pulse 1s infinite;
        }
        
        .countdown-label {
            color: #155724;
            font-weight: 500;
            font-size: 0.95rem;
        }

        .home-button {
            background: #2c9b95;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 500;
            cursor: pointer;
            margin-top: 15px;
            width: 100%;
        }
        
        .home-button:hover {
            background: #26a69a;
        }
        
        /* ===== ANIMATIONS ===== */
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes slideUp {
            from { 
                transform: translateY(50px);
                opacity: 0;
            }
            to { 
                transform: translateY(0);
                opacity: 1;
            }
        }
        
        @keyframes bounce {
            0%, 20%, 50%, 80%, 100% {
                transform: translateY(0);
            }
            40% {
                transform: translateY(-10px);
            }
            60% {
                transform: translateY(-5px);
            }
        }
        
        @keyframes pulse {
            0% {
                transform: scale(1);
                box-shadow: 0 0 0 0 rgba(40, 167, 69, 0.4);
            }
            50% {
                transform: scale(1.05);
                box-shadow: 0 0 0 10px rgba(40, 167, 69, 0);
            }
            100% {
                transform: scale(1);
                box-shadow: 0 0 0 0 rgba(40, 167, 69, 0);
            }
        }
        
        /* ===== RESPONSIVE ===== */
        @media (max-width: 768px) {
            .notification-content {
                padding: 1.5rem;
                margin: 1rem;
            }
            
            .success-icon {
                font-size: 3rem;
            }
            
            .notification-text h3 {
                font-size: 1.25rem;
            }
            
            .countdown {
                flex-direction: column;
                gap: 0.75rem;
            }
        }
        
        @media (max-width: 480px) {
            .notification-content {
                padding: 1.25rem;
            }
            
            .info-box {
                padding: 1rem;
            }
            
            .info-item {
                font-size: 0.875rem;
            }

            .home-button {
                font-size: 14px;
                padding: 10px 20px;
            }
        }
    `;

    document.head.appendChild(style);
    document.body.appendChild(notification);

    // Countdown 10 giây
    let countdown = 10;
    const countdownElement = notification.querySelector(".countdown-number");

    const countdownInterval = setInterval(() => {
      countdown--;
      if (countdown > 0) {
        countdownElement.textContent = countdown;
      } else {
        countdownElement.textContent = "✓";
        countdownElement.style.background = "#28a745";
        clearInterval(countdownInterval);
      }
    }, 1000);

    // Cleanup sau 10 giây
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
      window.location.href = "/";
    }, 10000);
  };

  // Helper function tính phí
  const calculateFee = (consultationType) => {
    const feeMap = {
      "Khám phụ khoa": 300000,
      "Tư vấn chu kì kinh nguyệt": 200000,
      "Tư vấn tránh thai": 250000,
      "Tư vấn thai kỳ": 250000,
      "Tư vấn sinh sản": 300000,
      "Tư vấn chung": 200000,
    };
    return feeMap[consultationType] || 200000;
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  // Check if form is valid
  const isFormValid = () => {
    return (
      formData.fullName &&
      formData.birthDate &&
      formData.gender &&
      formData.phone &&
      formData.email &&
      formData.consultationType &&
      formData.selectedDoctor && // BẮT BUỘC phải chọn bác sĩ
      formData.appointmentDate &&
      formData.appointmentTime
    );
  };

  return (
    <div className={cx("wrap")}>
      <div className={cx("appointment-container")}>
        {/* Header Section */}
        <Header />

        <form onSubmit={handleSubmit} className={cx("appointment-form")}>
          {/* User Status Display */}
          {isLoggedIn && userProfile && (
            <div className={cx("user-status-section")}>
              <div className={cx("user-welcome")}>
                <span className={cx("welcome-icon")}>👋</span>
                <div className={cx("welcome-text")}>
                  <h3>
                    Xin chào, {userProfile.fullName || userProfile.first_name}!
                  </h3>
                  <p>Thông tin của bạn đã được tự động điền từ tài khoản</p>
                </div>
              </div>
            </div>
          )}

          <div className={cx("form-content")}>
            <div className={cx("form-row")}>
              {/* Personal Info Section */}
              <PersonalInfoSection
                formData={formData}
                errors={errors}
                onChange={handleInputChange}
              />

              {/* Additional Info Section */}
              <AdditionalInfoSection
                formData={formData}
                onChange={handleInputChange}
              />
            </div>

            {/* Consultation Section */}
            <ConsultationSection
              formData={formData}
              errors={errors}
              onChange={handleInputChange}
            />

            {/* Doctor Selection */}
            <DoctorSelection
              formData={formData}
              errors={errors}
              onChange={handleInputChange}
            />

            {/* Date Time Section */}
            <DateTimeSection
              formData={formData}
              errors={errors}
              onChange={handleInputChange}
            />
          </div>

          {/* Fee Summary */}
          {formData.consultationType && (
            <div className={cx("fee-summary")}>
              <div className={cx("fee-content")}>
                <h4>💰 Chi phí dự kiến</h4>
                <div className={cx("fee-breakdown")}>
                  <div className={cx("fee-item")}>
                    <span>Loại tư vấn:</span>
                    <span>{formData.consultationType}</span>
                  </div>
                  <div className={cx("fee-item", "total")}>
                    <span>Tổng chi phí:</span>
                    <span className={cx("fee-amount")}>
                      {formatCurrency(formData.fee)}
                    </span>
                  </div>
                </div>
                <p className={cx("fee-note")}>
                  💡 Thông tin thanh toán sẽ được gửi qua email sau khi lịch hẹn
                  được xác nhận
                </p>
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className={cx("form-actions")}>
            <button
              type="submit"
              className={cx("submit-btn", {
                disabled: !isFormValid() || isSubmitting,
              })}
              disabled={!isFormValid() || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className={cx("spinner")}></span>
                  Đang xử lý...
                </>
              ) : (
                <>✅ Xác nhận đặt lịch hẹn</>
              )}
            </button>

            <button
              type="button"
              className={cx("cancel-btn")}
              onClick={() => {
                if (window.confirm("Bạn có chắc muốn hủy đặt lịch hẹn?")) {
                  navigate(-1);
                }
              }}
              disabled={isSubmitting}
            >
              ↩️ Quay lại
            </button>
          </div>

          {/* Validation Summary */}
          <div className={cx("validation-summary")}>
            <h4>Kiểm tra thông tin</h4>
            <div className={cx("validation-grid")}>
              <div
                className={cx("validation-item", {
                  valid: formData.fullName && !errors.fullName,
                })}
              >
                <span className={cx("validation-icon")}>
                  {formData.fullName && !errors.fullName ? "✅" : "❌"}
                </span>
                <span>Họ và tên</span>
              </div>

              <div
                className={cx("validation-item", {
                  valid: formData.birthDate && !errors.birthDate,
                })}
              >
                <span className={cx("validation-icon")}>
                  {formData.birthDate && !errors.birthDate ? "✅" : "❌"}
                </span>
                <span>Ngày sinh</span>
                {formData.birthDate && !errors.birthDate && (
                  <span className={cx("age-info")}>
                    ({calculateAge(formData.birthDate)} tuổi)
                  </span>
                )}
              </div>

              <div
                className={cx("validation-item", {
                  valid: formData.phone && !errors.phone,
                })}
              >
                <span className={cx("validation-icon")}>
                  {formData.phone && !errors.phone ? "✅" : "❌"}
                </span>
                <span>Số điện thoại</span>
              </div>

              <div
                className={cx("validation-item", {
                  valid: formData.email && !errors.email,
                })}
              >
                <span className={cx("validation-icon")}>
                  {formData.email && !errors.email ? "✅" : "❌"}
                </span>
                <span>Email</span>
              </div>

              <div
                className={cx("validation-item", {
                  valid: formData.consultationType,
                })}
              >
                <span className={cx("validation-icon")}>
                  {formData.consultationType ? "✅" : "❌"}
                </span>
                <span>Loại tư vấn</span>
              </div>

              {/* Cập nhật validation cho bác sĩ - BẮT BUỘC */}
              <div
                className={cx("validation-item", {
                  valid: formData.selectedDoctor && !errors.selectedDoctor,
                  invalid: !formData.selectedDoctor || errors.selectedDoctor,
                })}
              >
                <span className={cx("validation-icon")}>
                  {formData.selectedDoctor && !errors.selectedDoctor ? "✅" : "❌"}
                </span>
                <span>
                  {formData.selectedDoctor 
                    ? `Bác sĩ: ${formData.doctorName}` 
                    : "Chưa chọn bác sĩ"
                  }
                </span>
              </div>

              <div
                className={cx("validation-item", {
                  valid: formData.appointmentDate && !errors.appointmentDate,
                })}
              >
                <span className={cx("validation-icon")}>
                  {formData.appointmentDate && !errors.appointmentDate
                    ? "✅"
                    : "❌"}
                </span>
                <span>Ngày tư vấn</span>
              </div>

              <div
                className={cx("validation-item", {
                  valid: formData.appointmentTime,
                })}
              >
                <span className={cx("validation-icon")}>
                  {formData.appointmentTime ? "✅" : "❌"}
                </span>
                <span>Giờ tư vấn</span>
              </div>
            </div>
          </div>

          {/* Form Notice */}
          <div className={cx("form-notice")}>
            <div className={cx("notice-item", "highlight")}>
              <span className={cx("notice-icon")}>⏱️</span>
              <p>
                <strong>Quy trình xác nhận:</strong> Sau khi nhấn "Xác nhận đặt
                lịch hẹn", chúng tôi sẽ xem xét và xác nhận lịch hẹn trong vòng
                1-2 giờ
              </p>
            </div>

            <div className={cx("notice-item")}>
              <span className={cx("notice-icon")}>💳</span>
              <p>
                <strong>Thanh toán:</strong> Thông tin thanh toán sẽ được gửi
                qua email sau khi lịch hẹn được xác nhận
              </p>
            </div>

            {/* Loại bỏ notice về tự động phân công */}
            <div className={cx("notice-item")}>
              <span className={cx("notice-icon")}>👩‍⚕️</span>
              <p>
                <strong>Chọn bác sĩ:</strong> Bạn cần chọn bác sĩ tư vấn trước khi đặt lịch hẹn
              </p>
            </div>

            <div className={cx("notice-item")}>
              <span className={cx("notice-icon")}>📞</span>
              <p>
                Hotline hỗ trợ: <strong>1900-1133</strong> (24/7)
              </p>
            </div>

            <div className={cx("notice-item", "security")}>
              <span className={cx("notice-icon")}>🔒</span>
              <p>
                Thông tin của bạn được <strong>mã hóa và bảo mật</strong> tuyệt
                đối
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Appointment;
