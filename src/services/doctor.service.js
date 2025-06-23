import axiosClient from "./axiosClient";

//xong roi
const fetchProfileDoctor = async () => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    const result = await axiosClient.get(`/v1/doctors/profile`, {
      headers: {
        "x-access-token": accessToken,
        "Content-Type": "application/json",
      },
    });
    return result.data;
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

const doctorService = {
  fetchProfileDoctor,
  fetchRegisterDoctorSchedule,
  fetchMyDoctorAppointments,
  fetchDoctorAppointmentsById,
  fetchAllDoctors,
  fetchAvailableTimeslotsByDoctorId,
};

export default doctorService;
