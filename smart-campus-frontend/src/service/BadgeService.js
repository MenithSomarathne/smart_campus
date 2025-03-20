import axios from "axios";

const API_BASE_URL = "http://localhost:8081/smart-campus/api/v1/api/badges";

export const getAllBadges = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}`);
        console.log("response", response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching badges:", error);
        throw error;
    }
};

export const getBadgeById = async (id) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching badge by ID:", error);
        throw error;
    }
};

export const createOrUpdateBadge = async (badge) => {
    try {
        console.log("badge", badge);
        const response = await axios.post(`${API_BASE_URL}`, badge);
        return response.data;
    } catch (error) {
        console.error("Error creating/updating badge:", error);
        throw error;
    }
};

export const deleteBadge = async (id) => {
    try {
        const response = await axios.delete(`${API_BASE_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting badge:", error);
        throw error;
    }
};
