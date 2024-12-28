import { create } from 'zustand';
import axios from 'axios';

const coursesStore = create((set) => ({
    courses: [],
    loading: false,
    error: null,

    fetchCourses: async () => {
        set({ loading: true, error: null });
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_API_URL}/api/courses`); // Replace with your backend endpoint
            set({ courses: response.data?.courses, loading: false });
        } catch (err) {
            set({ error: err.response?.data?.message || 'Failed to fetch courses', loading: false });
        }
    },

    enrollInCourse: async (courseId) => {
        try {
            await axios.post(`/api/enrollments`, { courseId }); // Replace with your enrollment endpoint
            alert('Enrolled successfully!'); // Optionally, use a toast
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to enroll');
        }
    },
}));

export default coursesStore;
