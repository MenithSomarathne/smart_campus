import axios from "axios";

const API_BASE_URL = "http://localhost:8081/smart-campus/api/v1/api/schedules";

export const getAllSchedules = async () => {
    try {
        const response = await axios.get(API_BASE_URL);
        console.log("Fetched schedules:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching schedules:", error);
        throw error;
    }
};

export const getScheduleById = async (id) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching schedule by ID:", error);
        throw error;
    }
};

export const createOrUpdateSchedule = async (schedule) => {
    try {
        console.log("schedule", schedule)
        const response = await axios.post(API_BASE_URL, schedule);
        return response.data;
    } catch (error) {
        console.error("Error creating/updating schedule:", error);
        throw error;
    }
};

export const deleteSchedule = async (id) => {
    try {
        await axios.delete(`${API_BASE_URL}/${id}`);
    } catch (error) {
        console.error("Error deleting schedule:", error);
        throw error;
    }
};
