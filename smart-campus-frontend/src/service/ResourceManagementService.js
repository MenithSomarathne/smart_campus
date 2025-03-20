import axios from "axios";

const API_BASE_URL = "http://localhost:8081/smart-campus/api/v1/api/resources";
export const getAllResources = async () => {
    try {
        const response = await axios.get(API_BASE_URL);
        return response.data;
    } catch (error) {
        console.error("Error fetching resources:", error);
        throw error;
    }
};

export const getResourceById = async (id) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching resource with ID ${id}:`, error);
        throw error;
    }
};

export const createResource = async (resource) => {
    try {
        const response = await axios.post(API_BASE_URL, resource);
        return response.data;
    } catch (error) {
        console.error("Error creating resource:", error);
        throw error;
    }
};

export const updateResource = async (id, resource) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/${id}`, resource);
        return response.data;
    } catch (error) {
        console.error(`Error updating resource with ID ${id}:`, error);
        throw error;
    }
};

export const deleteResource = async (id) => {
    try {
        const response = await axios.delete(`${API_BASE_URL}/${id}`);
        return response.status === 204; // Return true if deletion is successful
    } catch (error) {
        console.error(`Error deleting resource with ID ${id}:`, error);
        throw error;
    }
};

export const getAllResourceIdAndName = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/id-and-name`);
        return response.data;
    } catch (error) {
        console.error("Error fetching resources:", error);
        throw error;
    }
};