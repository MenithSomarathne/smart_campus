import axios from "axios";

const API_BASE_URL = "http://localhost:8081/smart-campus/api/v1/api";

export const addUser = async (userData) => {
    try {
        console.log("userData", userData)
        const response = await axios.post(`${API_BASE_URL}/auth/register`, userData);
        return response.data;
    } catch (error) {
        console.error("Error adding user:", error);
        throw error;
    }
};
export const loginUser = async (email, password) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/auth/login`, { email, password });
        return response.data;
    } catch (error) {
        console.error("Error logging in:", error);
        throw error;
    }
};

export const getAllUsers = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/auth/users`);
        return response.data;
    } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
    }
};

export const updateUser = async (userID, userData) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/auth/users/${userID}`, userData);
        return response.data;
    } catch (error) {
        console.error("Error updating user:", error);
        throw error;
    }
};

export const deleteUser = async (userID) => {
    try {
        const response = await axios.delete(`${API_BASE_URL}/users/${userID}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting user:", error);
        throw error;
    }
};


export const getAllUsersIdAndName = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/auth/id-and-name`);
        return response.data;
    } catch (error) {
        console.error("Error fetching resources:", error);
        throw error;
    }
};

export const getAllLectures = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/auth/lecturers`);
        return response.data;
    } catch (error) {
        console.error("Error fetching resources:", error);
        throw error;
    }
};