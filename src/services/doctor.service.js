import axiosClient from "./axiosClient";

const fetchDoctorAvailableTimeslots = async () => {
  try {
    const result = await axiosClient.get(`/v1/doctors/my/appointments`);
    return result.data;
  } catch (error) {
    console.error("Error fetching doctor's available timeslots:", error);
    throw error;
  }
};

const fetchAllDoctors = async () => {
  try {
    const result = await axiosClient.get(`/v1/doctors`);
    return result.data;
  } catch (error) {
    console.error("Error fetching all doctors:", error);
    throw error;
  }
};

const fetchDoctorScheduleByDoctorId = async (doctorId) => {
  try {
    const result = await axiosClient.get(
      `/v1/doctors/${doctorId}/appointments`
    );
    return result.data;
  } catch (error) {
    console.error("Error fetching doctor's available timeslots:", error);
    throw error;
  }
};

const fetchDoctorAppointmentsDoctorId = async (doctorId) => {
  try {
    const result = await axiosClient.get(
      `/v1/doctors/${doctorId}/appointments`
    );
    return result.data;
  } catch (error) {
    console.error("Error fetching doctor's available timeslots:", error);
    throw error;
  }
};

const fetchProfileDoctor = async () => {
  try {
    const result = await axiosClient.get(`/v1/users/profile/me`);
    return result.data;
  } catch (error) {
    console.error("Error fetching doctor's profile:", error);
    throw error;
  }
};

const doctorService = {
  fetchDoctorAvailableTimeslots,
  fetchAllDoctors,
  fetchDoctorScheduleByDoctorId,
  fetchDoctorAppointmentsDoctorId,
  fetchProfileDoctor,
};

export default doctorService;
