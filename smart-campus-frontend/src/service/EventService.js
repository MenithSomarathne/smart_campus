import axios from "axios";

const API_BASE_URL = "http://localhost:8081/smart-campus/api/v1/api/events";

export const getAllEvents = async () => {
    try {
        const response = await axios.get(API_BASE_URL);
        return response.data;
    } catch (error) {
        console.error("Error fetching events:", error);
        throw error;
    }
};

export const getEventById = async (id) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching event with ID ${id}:`, error);
        throw error;
    }
};

export const createEvent = async (event) => {
    try {
        const response = await axios.post(API_BASE_URL, event);
        return response.data;
    } catch (error) {
        console.error("Error creating event:", error);
        throw error;
    }
};

export const updateEvent = async (id, event) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/${id}`, event);
        return response.data;
    } catch (error) {
        console.error(`Error updating event with ID ${id}:`, error);
        throw error;
    }
};

export const deleteEvent = async (id) => {
    try {
        const response = await axios.delete(`${API_BASE_URL}/${id}`);
        return response.status === 204;
    } catch (error) {
        console.error(`Error deleting event with ID ${id}:`, error);
        throw error;
    }
};

export const getAllEventResources = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/resources`);
        return response.data;
    } catch (error) {
        console.error("Error fetching event resources:", error);
        throw error;
    }
};

export const getAllEventBadges = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/badges`);
        return response.data;
    } catch (error) {
        console.error("Error fetching event badges:", error);
        throw error;
    }
};
