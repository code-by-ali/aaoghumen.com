import api from "./axiosConfig";
import endpoints from "./endpoints";

const apiService = {
  getCity: async () => {
    try {
      const response = await api.get(endpoints.GET_CITY);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  getLanguages: async () => {
    try {
      const response = await api.get(endpoints.GET_LANGUAGES);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  getHours: async () => {
    try {
      const response = await api.get(endpoints.GET_HOURS);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  getPickPoints: async (body) => {
    try {
      const response = await api.post(endpoints.GET_PICK_POINTS, body);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  getCategories: async (body) => {
    try {
      const response = await api.post(endpoints.GET_CATEGORIES, body);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  getPreTrips: async (body) => {
    try {
      const response = await api.post(endpoints.GET_PRE_TRIPS, body);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  getPlanTrips: async (body) => {
    try {
      const response = await api.post(endpoints.GET_PLAN_TRIPS, body);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default apiService;
