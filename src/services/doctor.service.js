import axiosClient from "./axiosClient";

//xong roi
const fetchProfileDoctor = async () => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    const result = await axiosClient.get(`/v1/doctors/profile`, {
      headers: {
        "x-access-token": accessToken,
      },
    });
    return result.data.data;
  } catch (error) {
    console.error("Error fetching doctor's profile:", error);
    throw error;
  }
};

//Dăng ký lịch làm việc của bác sĩ, Tạo lịch làm việc mới cho bác sĩ.
const fetchRegisterDoctorSchedule = async (data) => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    const result = await axiosClient.post(`/v1/doctors/schedule`, data, {
      headers: {
        "Content-Type": "application/json",
        "x-access-token": accessToken,
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return result.data;
  } catch (error) {
    console.error("Error registering doctor's schedule:", error);
    throw error;
  }
};

//lấy lịch hẹn của chính bác sĩ đang đăng nhập, cho bác sĩ muốn xem lịch cá nhân của mình.
const fetchMyDoctorAppointments = async () => {
  try {
    const result = await axiosClient.get(`/v1/doctors/my/appointments`);
    return result.data;
  } catch (error) {
    console.error("Error fetching my doctor's appointments:", error);
    throw error;
  }
};

//Dùng để lấy lịch hẹn của một bác sĩ bất kỳ, thông qua doctor_id
//Lấy tất cả lịch hẹn với bệnh nhân của một bác sĩ cụ thể (theo ID).
const fetchDoctorAppointmentsById = async (doctorId) => {
  try {
    const result = await axiosClient.get(
      `/v1/doctors/${doctorId}/appointments`
    );
    return result.data;
  } catch (error) {
    console.error("Error fetching doctor's appointments by ID:", error);
    throw error;
  }
};

const fetchDoctorAppointmentsCompleted = async (doctorId, appointment) => {
  try {
    const appointmentSend = {
      ...appointment,
    };
    console.log("appointmentSend", appointmentSend);
    const result = await axiosClient.post(
      `/v1/doctors/${doctorId}/appointments`,
      appointmentSend,
      {
        headers: {
          "Content-Type": "application/json",
          "x-access-token": localStorage.getItem("accessToken"),
        },
      }
    );
    return result.data;
  } catch (error) {
    console.error("Error fetching doctor's appointments by ID:", error);
    throw error;
  }
};

//Lấy danh sách tất cả bác sĩ.
const fetchAllDoctors = async () => {
  try {
    const result = await axiosClient.get(`/v1/doctors`);
    return result.data;
  } catch (error) {
    console.error("Error fetching all doctors:", error);
    throw error;
  }
};

//Lấy tất cả khung giờ làm việc (rảnh) của một bác sĩ cụ thể.
const fetchAvailableTimeslotsByDoctorId = async (doctorId) => {
  try {
    const result = await axiosClient.get(
      `/v1/doctors/${doctorId}/available-timeslots`
    );
    return result.data;
  } catch (error) {
    console.error("Error fetching doctor's available time slots:", error);
    throw error;
  }
};

// Consultation Result APIs
const getAppointmentById = async (appointmentId) => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    const result = await axiosClient.get(`/v1/appointments/${appointmentId}`, {
      headers: {
        "x-access-token": accessToken,
      },
    });
    return result.data;
  } catch (error) {
    console.error("Error fetching appointment details:", error);
    throw error;
  }
};

const saveConsultationResult = async (resultData) => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    const result = await axiosClient.post(
      `/v1/doctors/consultation-result`,
      resultData,
      {
        headers: {
          "Content-Type": "application/json",
          "x-access-token": accessToken,
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return result.data;
  } catch (error) {
    console.error("Error saving consultation result:", error);
    throw error;
  }
};

const uploadConsultationFile = async (appointmentId, file) => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    const formData = new FormData();
    formData.append("file", file);
    formData.append("appointment_id", appointmentId);

    const result = await axiosClient.post(
      `/v1/doctors/consultation-result/upload`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          "x-access-token": accessToken,
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return result.data;
  } catch (error) {
    console.error("Error uploading consultation file:", error);
    throw error;
  }
};

const getConsultationResult = async (appointmentId) => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    const result = await axiosClient.get(
      `/v1/doctors/consultation-result/${appointmentId}`,
      {
        headers: {
          "x-access-token": accessToken,
        },
      }
    );
    return result.data;
  } catch (error) {
    console.error("Error fetching consultation result:", error);
    throw error;
  }
};

const updateAppointmentStatus = async (appointmentId, status) => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    const result = await axiosClient.patch(
      `/v1/appointments/${appointmentId}/status`,
      { status },
      {
        headers: {
          "Content-Type": "application/json",
          "x-access-token": accessToken,
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return result.data;
  } catch (error) {
    console.error("Error updating appointment status:", error);
    throw error;
  }
};

const fetchEmailRequestAppointmentFeedback = async (appointmentId) => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    const data = { appointment_id: appointmentId };
    const result = await axiosClient.post(
      `/v1/emails/appointment-feedback`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
          "x-access-token": accessToken,
        },
      }
    );
    return result.data;
  } catch (error) {
    console.error("Error fetching appointment feedback request:", error);
    throw error;
  }
};

const doctorService = {
  fetchProfileDoctor,
  fetchRegisterDoctorSchedule,
  fetchMyDoctorAppointments,
  fetchDoctorAppointmentsById,
  fetchAllDoctors,
  fetchAvailableTimeslotsByDoctorId,
  fetchDoctorAppointmentsCompleted,
  getAppointmentById,
  saveConsultationResult,
  uploadConsultationFile,
  getConsultationResult,
  updateAppointmentStatus,
  fetchEmailRequestAppointmentFeedback,
};

export default doctorService;
