import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Events API
export const eventService = {
  getEvents: async (date) => {
    const response = await api.get('/events', { params: { date } });
    return response.data;
  },
  getEvent: async (id) => {
    const response = await api.get(`/events/${id}`);
    return response.data;
  },
  createEvent: async (eventData) => {
    console.log('Attempting to create event:', eventData);
    try {
      const response = await api.post('/events', eventData);
      console.log('Event creation response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating event:', error.response?.data || error.message);
      throw error;
    }
  },
  updateEvent: async (id, eventData) => {
    const response = await api.put(`/events/${id}`, eventData);
    return response.data;
  },
  deleteEvent: async (id) => {
    const response = await api.delete(`/events/${id}`);
    return response.data;
  }
};

// Goals API
export const goalService = {
  getGoals: async () => {
    const response = await api.get('/goals');
    return response.data;
  },
  getGoal: async (id) => {
    const response = await api.get(`/goals/${id}`);
    return response.data;
  },
  createGoal: async (goalData) => {
    console.log('Attempting to create goal:', goalData);
    try {
      const response = await api.post('/goals', goalData);
      console.log('Goal creation response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating goal:', error.response?.data || error.message);
      throw error;
    }
  },
  updateGoal: async (id, goalData) => {
    const response = await api.put(`/goals/${id}`, goalData);
    return response.data;
  },
  deleteGoal: async (id) => {
    const response = await api.delete(`/goals/${id}`);
    return response.data;
  }
};

// Tasks API
export const taskService = {
  getTasks: async (goalId) => {
    const response = await api.get('/tasks', { 
      params: { goalId, populate: 'true' } 
    });
    return response.data;
  },
  getTask: async (id) => {
    const response = await api.get(`/tasks/${id}`);
    return response.data;
  },
  createTask: async (taskData) => {
    const response = await api.post('/tasks', taskData);
    return response.data;
  },
  updateTask: async (id, taskData) => {
    const response = await api.put(`/tasks/${id}`, taskData);
    return response.data;
  },
  deleteTask: async (id) => {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
  }
};

const apiServices = {
  eventService,
  goalService,
  taskService
};

export default apiServices;