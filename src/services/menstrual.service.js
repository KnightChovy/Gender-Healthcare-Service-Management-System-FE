import axiosClient from "./axiosClient";

const menstrualService = {
  getCycleData: async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const result = await axiosClient.get(`/v1/cycle`, {
        headers: {
          "x-access-token": accessToken,
        },
      });
      console.log("data cycle:", result.data);
      return result.data.cycle;
    } catch (error) {
      console.error("Error fetching data cycle:", error);
      throw error;
    }
  },
  updateCycleData: async (cycleData) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const result = await axiosClient.post(`/v1/cycle`, cycleData, {
        headers: {
          "x-access-token": accessToken,
        },
      });
      console.log("data cycle:", result.data);
      return result.data.data;
    } catch (error) {
      console.error("Error updating cycle data:", error);
      throw error;
    }
  },
};

export default menstrualService;
