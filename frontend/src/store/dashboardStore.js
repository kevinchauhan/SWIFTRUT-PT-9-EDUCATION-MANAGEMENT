// store/dashboardStore.js
import { create } from 'zustand';
import axios from 'axios';

const useDashboardStore = create((set) => ({
    user: null,
    courses: [],
    loading: true,
    error: null,

    fetchUserData: async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_API_URL}/api/auth/self`);
            set({ user: response.data, loading: false });
        } catch (error) {
            set({ error: 'Failed to fetch user data', loading: false });
        }
    },

    fetchCourses: async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_API_URL}/api/courses`);
            set({ courses: response.data });
        } catch (error) {
            set({ error: 'Failed to fetch courses', loading: false });
        }
    },
}));

export default useDashboardStore;
