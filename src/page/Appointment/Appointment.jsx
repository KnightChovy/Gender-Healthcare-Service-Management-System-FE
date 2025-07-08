import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PersonalInfoSection from "./AppointmentItems/PersonalInfoSection";
import ConsultationSection from "./AppointmentItems/ConsultationSection";
import DoctorSelection from "./AppointmentItems/DoctorSelection";
import DateTimeSection from "./AppointmentItems/DateTimeSection";
import AdditionalInfoSection from "./AppointmentItems/AdditionalInfoSection";

function Appointment() {
  const navigate = useNavigate();

  // State quản lý các bước đặt lịch
  const [currentStep, setCurrentStep] = useState(1);

  const [userProfile, setUserProfile] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    birthDate: "",
    gender: "",
    phone: "",
    email: "",
    address: "",

    consultationType: "",
    consultationServiceId: "",
    doctor_id: "",
    doctorName: "",
    appointmentDate: "",
    appointmentTime: "",

    symptoms: "",
    medicalHistory: "",
    notes: "",
    priority: "normal",

    fee: 0,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatDateForDisplay = (dateString) => {
    if (!dateString) return '';

    try {
      if (dateString.includes('-') && dateString.length === 10) {
        const parts = dateString.split('-');
        if (parts.length === 3 && parts[0].length === 2) {
          return dateString;
        }
      }

      const date = new Date(dateString + 'T00:00:00');
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();

      return `${day}-${month}-${year}`;
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString;
    }
  };

  const formatDateForInput = (dateString) => {
    if (!dateString) return '';

    try {
      if (dateString.includes('-') && dateString.length === 10) {
        const parts = dateString.split('-');
        if (parts.length === 3 && parts[0].length === 4) {
          return dateString;
        }
      }

      const parts = dateString.split('-');
      if (parts.length === 3) {
        const [day, month, year] = parts;
        return `${year}-${month}-${day}`;
      }

      return dateString;
    } catch (error) {
      console.error('Error formatting date for input:', error);
      return dateString;
    }
  };

  const formatTimeForDisplay = (timeString) => {
    if (!timeString) return '';

    try {
      if (timeString.includes(':')) {
        const parts = timeString.split(':');
        if (parts.length >= 2) {
          return `${parts[0]}:${parts[1]}`;
        }
      }

      return timeString;
    } catch (error) {
      console.error('Error formatting time:', error);
      return timeString;
    }
  };

  useEffect(() => {
    checkUserStatus();
  }, []);

  const checkUserStatus = () => {
    try {
      const isLoggedIn = localStorage.getItem("accessToken") !== null;
      const userInfo = localStorage.getItem("user");

      if (isLoggedIn) {
        const profile = JSON.parse(userInfo);
        setUserProfile(profile);

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
      } else {
        setUserProfile(null);
      }
    } catch (error) {
      console.error("❌ Error checking user status:", error);
    }
  };

  const calculateAge = (birthDate) => {
    if (!birthDate) return null;

    let date;
    if (birthDate.includes('-')) {
      const parts = birthDate.split('-');
      if (parts.length === 3) {
        if (parts[0].length === 4) {
          date = new Date(birthDate + 'T00:00:00');
        } else {
          const [day, month, year] = parts;
          date = new Date(`${year}-${month}-${day}T00:00:00`);
        }
      }
    } else {
      date = new Date(birthDate);
    }

    if (isNaN(date.getTime())) return null;

    const today = new Date();
    let age = today.getFullYear() - date.getFullYear();
    const monthDiff = today.getMonth() - date.getMonth();
    const dayDiff = today.getDate() - date.getDate();

    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      age--;
    }

    return age;
  };

  const getTimeslotIdFromStorage = (selectedDate, selectedTime) => {
    console.log('🔍 START: getTimeslotIdFromStorage', { selectedDate, selectedTime });

    try {
      const doctorTimeslots = localStorage.getItem('doctorAvailableTimeslots');
      if (!doctorTimeslots) {
        console.warn('⚠️ No doctor timeslots found in localStorage');
        return null;
      }

      const timeslotsData = JSON.parse(doctorTimeslots);

      const dateForComparison = formatDateForInput(selectedDate);

      const daySchedule = timeslotsData.find(day => {
        return day.date === dateForComparison;
      });

      if (!daySchedule) {
        return null;
      }

      if (!daySchedule.timeslots || !Array.isArray(daySchedule.timeslots)) {
        return null;
      }

      let targetTime;

      if (selectedTime.includes(' - ')) {
        const [start] = selectedTime.split(' - ');
        targetTime = start.trim();

        if (targetTime.split(':').length === 2) {
          targetTime += ':00';
        }
      } else if (selectedTime.includes(':')) {
        targetTime = selectedTime.trim();
        if (targetTime.split(':').length === 2) {
          targetTime += ':00';
        }
      } else {
        console.warn('⚠️ Invalid time format:', selectedTime);
        return null;
      }

      const matchingTimeslot = daySchedule.timeslots.find(slot => {
        const isInRange = targetTime >= slot.time_start && targetTime < slot.time_end;

        const isExactStart = targetTime === slot.time_start;

        return isInRange || isExactStart;
      });

      if (matchingTimeslot) {

        return matchingTimeslot.timeslot_id;
      } else {
        const targetTimeShort = targetTime.substring(0, 5);

        const flexibleMatch = daySchedule.timeslots.find(slot => {
          const slotStartShort = slot.time_start.substring(0, 5);
          const slotEndShort = slot.time_end.substring(0, 5);

          const isInRangeFlexible = targetTimeShort >= slotStartShort && targetTimeShort < slotEndShort;
          const isExactStartFlexible = targetTimeShort === slotStartShort;

          return isInRangeFlexible || isExactStartFlexible;
        });

        if (flexibleMatch) {
          return flexibleMatch.timeslot_id;
        }

        return null;
      }

    } catch (error) {
      console.error('❌ Error in getTimeslotIdFromStorage:', error);
      return null;
    }
  };

  const validateForm = () => {
    const newErrors = {};

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
      let birthDate;
      if (formData.birthDate.includes('-')) {
        const parts = formData.birthDate.split('-');
        if (parts.length === 3) {
          if (parts[0].length === 4) {
            birthDate = new Date(formData.birthDate + 'T00:00:00');
          } else {
            const [day, month, year] = parts;
            birthDate = new Date(`${year}-${month}-${day}T00:00:00`);
          }
        }
      } else {
        birthDate = new Date(formData.birthDate);
      }

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

    if (!formData.gender) {
      newErrors.gender = "Vui lòng chọn giới tính";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Vui lòng nhập số điện thoại";
    } else if (!/^\d{10,11}$/.test(formData.phone.replace(/\s+/g, ""))) {
      newErrors.phone = "Số điện thoại không hợp lệ (10-11 chữ số)";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Vui lòng nhập email";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    if (!formData.consultationType) {
      newErrors.consultationType = "Vui lòng chọn loại tư vấn";
    }

    if (!formData.consultationServiceId) {
      newErrors.consultationType = "Dữ liệu loại tư vấn không hợp lệ, vui lòng chọn lại";
    }

    if (!formData.fee || formData.fee <= 0) {
      newErrors.consultationType = "Không thể xác định phí dịch vụ, vui lòng chọn lại loại tư vấn";
    }

    if (!formData.doctor_id) {
      newErrors.doctor_id = "Vui lòng chọn bác sĩ tư vấn";
    }

    if (!formData.appointmentDate) {
      newErrors.appointmentDate = "Vui lòng chọn ngày tư vấn";
    } else {
      let selectedDate;
      if (formData.appointmentDate.includes('-')) {
        const parts = formData.appointmentDate.split('-');
        if (parts.length === 3) {
          if (parts[0].length === 4) {
            selectedDate = new Date(formData.appointmentDate + 'T00:00:00');
          } else {
            const [day, month, year] = parts;
            selectedDate = new Date(`${year}-${month}-${day}T00:00:00`);
          }
        }
      } else {
        selectedDate = new Date(formData.appointmentDate);
      }

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
      alert("Vui lòng kiểm tra lại thông tin đã nhập.");
      return;
    }

    setIsSubmitting(true);

    try {
      const timeslotId = getTimeslotIdFromStorage(formData.appointmentDate, formData.appointmentTime);

      if (!timeslotId) {
        alert(`Không thể xác định khung giờ đã chọn.\n\nThông tin debug:\n- Ngày: ${formatDateForDisplay(formData.appointmentDate)}\n- Giờ: ${formatTimeForDisplay(formData.appointmentTime)}\n\nVui lòng kiểm tra console và chọn lại thời gian.`);
        setIsSubmitting(false);
        return;
      }

      // Convert dates to proper format for API
      const appointmentDateForAPI = formatDateForInput(formData.appointmentDate);
      const birthDateForAPI = formatDateForInput(formData.birthDate);

      const appointmentData = {
        user_id: userProfile?.user_id || null,
        fullName: formData.fullName,
        phone: formData.phone,
        email: formData.email,
        birthDate: birthDateForAPI,
        gender: formData.gender,
        address: formData.address,

        consultant_type: formData.consultationType,
        service_id: formData.consultationServiceId,
        doctor_id: formData.doctor_id,
        doctorName: formData.doctorName,
        appointmentDate: appointmentDateForAPI,
        appointment_time: formData.appointmentTime,
        timeslot_id: timeslotId,

        symptoms: formData.symptoms,
        medicalHistory: formData.medicalHistory,
        notes: formData.notes,
        priority: formData.priority,

        price_apm: formData.fee,

        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        status: "pending",
        booking: 0
      };

      console.log('Final appointment data:', appointmentData);

      if (!appointmentData.timeslot_id) {
        throw new Error('Missing timeslot_id in final data');
      }

      if (!appointmentData.doctor_id) {
        throw new Error('Missing doctor_id in final data');
      }

      if (!appointmentData.service_id) {
        throw new Error('Missing service_id in final data');
      }

      if (!appointmentData.price_apm || appointmentData.price_apm <= 0) {
        throw new Error('Missing or invalid price in final data');
      }

      localStorage.setItem("pendingAppointment", JSON.stringify(appointmentData));

      const res = await fetch("http://52.4.72.106:3000/v1/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": localStorage.getItem("accessToken") || "",
        },
        body: JSON.stringify(appointmentData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error('❌ API Error:', errorData);
        throw new Error(`HTTP error! status: ${res.status} - ${errorData.message || 'Unknown error'}`);
      }

      const responseData = await res.json();
      console.log("✅ Appointment created successfully:", responseData);

      showSuccessNotification();

      setTimeout(() => {
        localStorage.removeItem('doctorAvailableTimeslots');
        localStorage.removeItem('selectedDoctorId');
        localStorage.removeItem('pendingAppointment');
        navigate("/");
      }, 10000);

    } catch (error) {
      console.error("❌ Error submitting appointment:", error);

      let errorMessage = "Có lỗi xảy ra khi đặt lịch hẹn:\n\n";

      if (error.message.includes('timeslot_id')) {
        errorMessage += "• Không thể xác định khung giờ\n";
      }
      if (error.message.includes('doctor_id')) {
        errorMessage += "• Thiếu thông tin bác sĩ\n";
      }
      if (error.message.includes('service_id')) {
        errorMessage += "• Thiếu thông tin dịch vụ tư vấn\n";
      }
      if (error.message.includes('price')) {
        errorMessage += "• Không thể xác định phí dịch vụ\n";
      }
      if (error.message.includes('HTTP error')) {
        errorMessage += "• Lỗi kết nối server\n";
      }

      errorMessage += "\nVui lòng kiểm tra console để biết thêm chi tiết và thử lại.";

      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoHome = () => {
    localStorage.removeItem('doctorAvailableTimeslots');
    localStorage.removeItem('selectedDoctorId');
    localStorage.removeItem('pendingAppointment');
    navigate('/');
  };

  // ...existing showSuccessNotification function...
  const showSuccessNotification = () => {
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

                <button class="home-button" id="homeButton">
                    🏠 Về trang chủ ngay
                </button>
            </div>
        </div>
    `;

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
            transition: all 0.3s ease;
        }
        
        .home-button:hover {
            background: #26a69a;
            transform: translateY(-1px);
        }

        .home-button:active {
            transform: translateY(0);
        }

        /* Fade out animation for quick exit */
        .notification-fade-out {
            animation: fadeOut 0.3s ease forwards;
        }
        
        /* ===== ANIMATIONS ===== */
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
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

    let countdown = 10;
    const countdownElement = notification.querySelector(".countdown-number");
    let countdownInterval;
    let autoHideTimeout;

    // Function để cleanup tất cả timers và DOM elements
    const cleanupNotification = () => {
        // Clear tất cả intervals và timeouts
        if (countdownInterval) {
            clearInterval(countdownInterval);
            countdownInterval = null;
        }
        if (autoHideTimeout) {
            clearTimeout(autoHideTimeout);
            autoHideTimeout = null;
        }

        // Remove DOM elements
        if (document.body.contains(notification)) {
            notification.classList.add('notification-fade-out');
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300); // Wait for fade out animation
        }
        if (document.head.contains(style)) {
            document.head.removeChild(style);
        }
    };

    // Enhanced handleGoHome function với cleanup
    const handleGoHomeWithCleanup = () => {
      cleanupNotification();
      handleGoHome();
    };

    const homeButton = notification.querySelector('#homeButton');
    if (homeButton) {
      homeButton.addEventListener('click', handleGoHomeWithCleanup);
    }

    countdownInterval = setInterval(() => {
      countdown--;
      if (countdown > 0) {
        countdownElement.textContent = countdown;
      } else {
        countdownElement.textContent = "✓";
        countdownElement.style.background = "#28a745";
        cleanupNotification();
      }
    }, 1000);

    autoHideTimeout = setTimeout(() => {
      cleanupNotification();
      handleGoHome();
    }, 10000);
  };

  // Hàm xử lý chuyển bước
  const handleNextStep = () => {
    if (currentStep === 1) {
      // Validate thông tin cá nhân và loại tư vấn
      if (!formData.fullName || !formData.email || !formData.phone || !formData.birthDate || !formData.gender) {
        alert("Vui lòng điền đầy đủ thông tin cá nhân");
        return;
      }
      if (!formData.consultationType) {
        alert("Vui lòng chọn loại tư vấn");
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      // Validate chọn bác sĩ và lịch hẹn
      if (!formData.doctor_id) {
        alert("Vui lòng chọn bác sĩ");
        return;
      }
      if (!formData.appointmentDate || !formData.appointmentTime) {
        alert("Vui lòng chọn ngày và giờ hẹn");
        return;
      }
      setCurrentStep(3);
    } else if (currentStep === 3) {
      // Chuyển sang trang xác nhận
      if (!validateForm()) {
        return;
      }
      setCurrentStep(4);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleUserInfoChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handler for consultation selection with dynamic pricing
  const handleConsultationChange = (e, selectedService = null) => {
    const { name, value } = e.target;
    
    if (name === 'consultationType' && selectedService) {
      // Update form data with consultation type, service_id, and fee
      setFormData(prev => ({
        ...prev,
        consultationType: value,
        consultationServiceId: selectedService.service_id,
        fee: selectedService.price || 0
      }));
      
      console.log('✅ Updated consultation selection:', {
        consultationType: value,
        service_id: selectedService.service_id,
        fee: selectedService.price
      });
    } else {
      // Regular field update
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const calculateTotalAmount = () => {
    return formData.fee || 0;
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Tiêu đề trang */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            📅 Đặt lịch hẹn tư vấn
          </h1>
          <p className="mt-2 text-gray-600">
            Vui lòng hoàn thành các bước để đặt lịch hẹn tư vấn
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div
              className={`flex flex-col items-center ${currentStep >= 1 ? "text-blue-600" : "text-gray-400"
                }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${currentStep >= 1
                    ? "border-blue-600 bg-blue-100"
                    : "border-gray-300"
                  }`}
              >
                <span className="font-medium">1</span>
              </div>
              <span className="text-xs mt-1">Thông tin</span>
            </div>
            <div
              className={`flex-1 h-1 mx-2 ${currentStep >= 2 ? "bg-blue-600" : "bg-gray-300"
                }`}
            ></div>
            <div
              className={`flex flex-col items-center ${currentStep >= 2 ? "text-blue-600" : "text-gray-400"
                }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${currentStep >= 2
                    ? "border-blue-600 bg-blue-100"
                    : "border-gray-300"
                  }`}
              >
                <span className="font-medium">2</span>
              </div>
              <span className="text-xs mt-1">Lịch hẹn</span>
            </div>
            <div
              className={`flex-1 h-1 mx-2 ${currentStep >= 3 ? "bg-blue-600" : "bg-gray-300"
                }`}
            ></div>
            <div
              className={`flex flex-col items-center ${currentStep >= 3 ? "text-blue-600" : "text-gray-400"
                }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${currentStep >= 3
                    ? "border-blue-600 bg-blue-100"
                    : "border-gray-300"
                  }`}
              >
                <span className="font-medium">3</span>
              </div>
              <span className="text-xs mt-1">Ghi chú</span>
            </div>
            <div
              className={`flex-1 h-1 mx-2 ${currentStep >= 4 ? "bg-blue-600" : "bg-gray-300"
                }`}
            ></div>
            <div
              className={`flex flex-col items-center ${currentStep >= 4 ? "text-blue-600" : "text-gray-400"
                }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${currentStep >= 4
                    ? "border-blue-600 bg-blue-100"
                    : "border-gray-300"
                  }`}
              >
                <span className="font-medium">4</span>
              </div>
              <span className="text-xs mt-1">Xác nhận</span>
            </div>
          </div>
        </div>

        {/* Step 1: Thông tin cá nhân và chọn loại tư vấn */}
        {currentStep === 1 && (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 bg-blue-50">
              <h2 className="text-lg font-medium text-gray-900">
                Bước 1: Thông tin cá nhân & loại tư vấn
              </h2>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Vui lòng điền thông tin cá nhân và chọn loại tư vấn
              </p>
            </div>

            <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
              <PersonalInfoSection
                formData={formData}
                errors={errors}
                onChange={handleUserInfoChange}
              />

              <ConsultationSection
                formData={formData}
                errors={errors}
                onChange={handleConsultationChange}
              />
            </div>

            <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
              <button
                onClick={handleNextStep}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Tiếp tục
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Chọn bác sĩ và lịch hẹn */}
        {currentStep === 2 && (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 bg-blue-50">
              <h2 className="text-lg font-medium text-gray-900">
                Bước 2: Chọn bác sĩ và lịch hẹn
              </h2>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Vui lòng chọn bác sĩ và thời gian phù hợp với bạn
              </p>
            </div>

            <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
              <DoctorSelection
                formData={formData}
                errors={errors}
                onChange={handleUserInfoChange}
              />

              <DateTimeSection
                formData={formData}
                errors={errors}
                onChange={handleUserInfoChange}
              />

              {/* Hiển thị thông tin đã chọn */}
              {formData.consultationType && (
                <div className="mt-8 bg-blue-50 p-4 rounded-md border border-blue-100">
                  <h4 className="font-medium text-gray-700 mb-2">
                    Thông tin đã chọn:
                  </h4>
                  <ul className="space-y-1">
                    <li className="flex justify-between">
                      <span>Loại tư vấn:</span>
                      <span>{formData.consultationType}</span>
                    </li>
                    {formData.doctorName && (
                      <li className="flex justify-between">
                        <span>Bác sĩ:</span>
                        <span>{formData.doctorName}</span>
                      </li>
                    )}
                    {formData.appointmentDate && formData.appointmentTime && (
                      <li className="flex justify-between">
                        <span>Thời gian:</span>
                        <span>{formatDateForDisplay(formData.appointmentDate)} lúc {formatTimeForDisplay(formData.appointmentTime)}</span>
                      </li>
                    )}
                  </ul>
                  <div className="mt-3 pt-2 border-t border-blue-100 flex justify-between font-medium">
                    <span>Chi phí dự kiến:</span>
                    <span>{formatPrice(calculateTotalAmount())}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="px-4 py-3 bg-gray-50 text-right sm:px-6 flex justify-between">
              <button
                onClick={handlePreviousStep}
                className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Quay lại
              </button>
              <button
                onClick={handleNextStep}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Tiếp tục
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Ghi chú và thông tin bổ sung */}
        {currentStep === 3 && (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 bg-blue-50">
              <h2 className="text-lg font-medium text-gray-900">
                Bước 3: Thông tin bổ sung
              </h2>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Vui lòng cung cấp thêm thông tin để cuộc tư vấn hiệu quả hơn
              </p>
            </div>

            <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
              <AdditionalInfoSection
                formData={formData}
                onChange={handleUserInfoChange}
              />
            </div>

            <div className="px-4 py-3 bg-gray-50 text-right sm:px-6 flex justify-between">
              <button
                onClick={handlePreviousStep}
                className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Quay lại
              </button>
              <button
                onClick={handleNextStep}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Tiếp tục
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Xác nhận và hoàn tất */}
        {currentStep === 4 && (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 bg-blue-50">
              <h2 className="text-lg font-medium text-gray-900">
                Bước 4: Xác nhận thông tin và đặt lịch hẹn
              </h2>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Vui lòng kiểm tra lại thông tin và xác nhận đặt lịch hẹn
              </p>
            </div>

            <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
              {/* Thông tin cá nhân */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3">
                  Thông tin cá nhân
                </h3>
                <div className="bg-gray-50 p-4 rounded-md">
                  <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">Họ tên</dt>
                      <dd className="mt-1 text-sm text-gray-900">{formData.fullName}</dd>
                    </div>
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">Email</dt>
                      <dd className="mt-1 text-sm text-gray-900">{formData.email}</dd>
                    </div>
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">Số điện thoại</dt>
                      <dd className="mt-1 text-sm text-gray-900">{formData.phone}</dd>
                    </div>
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">Ngày sinh</dt>
                      <dd className="mt-1 text-sm text-gray-900">{formatDateForDisplay(formData.birthDate)}</dd>
                    </div>
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">Giới tính</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {(() => {
                          if (formData.gender === "male") return "Nam";
                          if (formData.gender === "female") return "Nữ";
                          return "Khác";
                        })()}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>

              {/* Thông tin lịch hẹn */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3">
                  Thông tin lịch hẹn
                </h3>
                <div className="bg-gray-50 p-4 rounded-md">
                  <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">Loại tư vấn</dt>
                      <dd className="mt-1 text-sm text-gray-900">{formData.consultationType}</dd>
                    </div>
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">Bác sĩ</dt>
                      <dd className="mt-1 text-sm text-gray-900">{formData.doctorName}</dd>
                    </div>
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">Ngày hẹn</dt>
                      <dd className="mt-1 text-sm text-gray-900">{formatDateForDisplay(formData.appointmentDate)}</dd>
                    </div>
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">Giờ hẹn</dt>
                      <dd className="mt-1 text-sm text-gray-900">{formatTimeForDisplay(formData.appointmentTime)}</dd>
                    </div>
                  </dl>
                </div>
              </div>

              {/* Thông tin bổ sung */}
              {(formData.symptoms || formData.medicalHistory || formData.notes) && (
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">
                    Thông tin bổ sung
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-md">
                    {formData.symptoms && (
                      <div className="mb-4">
                        <dt className="text-sm font-medium text-gray-500">Triệu chứng</dt>
                        <dd className="mt-1 text-sm text-gray-900">{formData.symptoms}</dd>
                      </div>
                    )}
                    {formData.medicalHistory && (
                      <div className="mb-4">
                        <dt className="text-sm font-medium text-gray-500">Tiền sử bệnh</dt>
                        <dd className="mt-1 text-sm text-gray-900">{formData.medicalHistory}</dd>
                      </div>
                    )}
                    {formData.notes && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Ghi chú</dt>
                        <dd className="mt-1 text-sm text-gray-900">{formData.notes}</dd>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Chi phí */}
              <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-medium">💰 Tổng chi phí:</span>
                  <span className="text-lg font-bold text-blue-600">
                    {formatPrice(calculateTotalAmount())}
                  </span>
                </div>
              </div>

              {/* Lưu ý */}
              <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-md p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">Lưu ý quan trọng</h3>
                    <div className="mt-2 text-sm text-yellow-700">
                      <ul className="list-disc list-inside space-y-1">
                        <li>Lịch hẹn sẽ được xác nhận trong vòng 1-2 giờ</li>
                        <li>Thông tin thanh toán sẽ được gửi qua email sau khi xác nhận</li>
                        <li>Vui lòng đến đúng giờ hẹn để đảm bảo chất lượng tư vấn</li>
                        <li>Liên hệ hotline 1900-1133 nếu cần hỗ trợ</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-4 py-3 bg-gray-50 text-right sm:px-6 flex justify-between">
              <button
                onClick={handlePreviousStep}
                className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Quay lại
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${isSubmitting
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                  }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Đang xử lý...
                  </>
                ) : (
                  'Xác nhận đặt lịch hẹn'
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Appointment;