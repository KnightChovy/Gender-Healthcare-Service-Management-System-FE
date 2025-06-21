import axiosClient from "./axiosClient";

const fetchDoctorAvailableTimeslots = async (doctorId) => {
  try {
    const result = await axiosClient.get(`/v1/doctors/my/appointments`);
    return result.data;
  } catch (error) {
    console.error("Error fetching doctor's available timeslots:", error);
    throw error;
  }
};

const doctorService = {
  fetchDoctorAvailableTimeslots,
};

export default doctorService;
