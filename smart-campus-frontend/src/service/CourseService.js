import axios from "axios";

const API_BASE_URL = "http://localhost:8081/smart-campus/api/v1/api/courses";

export const getAllCourses = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}`);
        console.log("response", response.data)
        return response.data;
    } catch (error) {
        console.error("Error fetching courses:", error);
        throw error;
    }
};

export const getCourseById = async (id) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching course by ID:", error);
        throw error;
    }
};

export const createOrUpdateCourse = async (course) => {
    try {
        console.log("course", course)
        const response = await axios.post(`${API_BASE_URL}`, course);
        return response.data;
    } catch (error) {
        console.error("Error creating/updating course:", error);
        throw error;
    }
};

export const deleteCourse = async (id) => {
    try {
        const response = await axios.delete(`${API_BASE_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting course:", error);
        throw error;
    }
};

export const assignLecturerToCourse = async (courseId, lecturerId) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/${courseId}/assign-lecturer/${lecturerId}`);
        return response.data;
    } catch (error) {
        console.error("Error assigning lecturer to course:", error);
        throw error;
    }
};