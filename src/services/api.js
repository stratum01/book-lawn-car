import axios from 'axios';

// In production, API calls are made to the same origin
const API_BASE_URL = import.meta.env.PROD 
  ? '/api' 
  : 'http://localhost:3001/api';

export const api = {
  // Create a new appointment
  createAppointment: async (formData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/appointments`, formData);
      return response.data;
    } catch (error) {
      console.error('Error creating appointment:', error);
      throw error;
    }
  },
  
  // Get available time slots for a specific date
  getAvailableSlots: async (date) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/available-slots?date=${date}`);
      return response.data.availableSlots;
    } catch (error) {
      console.error('Error fetching available slots:', error);
      throw error;
    }
  }

  //admin interface
  getAppointments: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/appointments`);
     return response.data;
    } catch (error) {
      console.error('Error fetching appointments:', error);
      throw error;
    }
  }
};

export default api;