import axiosClient from "./axiosClient";

const testService = {
  // Lấy danh sách xét nghiệm của bác sĩ
  fetchDoctorTests: async (doctorId) => {
    try {
      const response = await axiosClient.get(`/v1/doctor/${doctorId}/tests`);
      return response;
    } catch (error) {
      console.error("Lỗi khi lấy danh sách xét nghiệm:", error);
      throw error;
    }
  },

  // Lấy chi tiết xét nghiệm
  getTestDetails: async (testId) => {
    try {
      const response = await axiosClient.get(`/v1/tests/${testId}`);
      return response;
    } catch (error) {
      console.error("Lỗi khi lấy chi tiết xét nghiệm:", error);
      throw error;
    }
  },

  // Cập nhật kết quả xét nghiệm
  updateTestResult: async (testId, resultData) => {
    try {
      const response = await axiosClient.put(
        `/v1/tests/${testId}/result`,
        resultData
      );
      return response;
    } catch (error) {
      console.error("Lỗi khi cập nhật kết quả xét nghiệm:", error);
      throw error;
    }
  },

  // Upload file kết quả
  uploadTestResultFile: async (testId, file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await axiosClient.post(
        `/v1/tests/${testId}/upload-result`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response;
    } catch (error) {
      console.error("Lỗi khi upload file kết quả:", error);
      throw error;
    }
  },

  // Tạo đơn xét nghiệm mới
  createTestOrder: async (appointmentId, testData) => {
    try {
      const response = await axiosClient.post(
        `/v1/appointments/${appointmentId}/tests`,
        testData
      );
      return response;
    } catch (error) {
      console.error("Lỗi khi tạo đơn xét nghiệm:", error);
      throw error;
    }
  },

  // Lấy danh sách các loại xét nghiệm có sẵn
  getAvailableTestTypes: async () => {
    try {
      const response = await axiosClient.get("/v1/test-types");
      return response;
    } catch (error) {
      console.error("Lỗi khi lấy danh sách loại xét nghiệm:", error);
      throw error;
    }
  },

  // Hủy xét nghiệm
  cancelTest: async (testId, reason) => {
    try {
      const response = await axiosClient.put(`/v1/tests/${testId}/cancel`, {
        reason,
      });
      return response;
    } catch (error) {
      console.error("Lỗi khi hủy xét nghiệm:", error);
      throw error;
    }
  },

  // Lấy thống kê xét nghiệm
  getTestStatistics: async (doctorId, period = "month") => {
    try {
      const response = await axiosClient.get(
        `/v1/doctor/${doctorId}/test-statistics`,
        {
          params: { period },
        }
      );
      return response;
    } catch (error) {
      console.error("Lỗi khi lấy thống kê xét nghiệm:", error);
      throw error;
    }
  },

  // Gửi thông báo kết quả cho bệnh nhân
  notifyPatientResult: async (testId) => {
    try {
      const response = await axiosClient.post(
        `/v1/tests/${testId}/notify-patient`
      );
      return response;
    } catch (error) {
      console.error("Lỗi khi gửi thông báo:", error);
      throw error;
    }
  },
};

export default testService;
