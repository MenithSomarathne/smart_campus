import axios from "axios";

const API_URL = "http://localhost:8081/smart-campus/api/v1/api/reservations";

const ReservationService = {
    getAllReservations: async () => {
        try {
            const response = await axios.get(API_URL);
            console.log("response", response.data)
            return response.data;
        } catch (error) {
            console.error("There was an error fetching the reservations!", error);
            throw error;
        }
    },

    getReservationById: async (id) => {
        try {
            const response = await axios.get(`${API_URL}/${id}`);
            return response.data;
        } catch (error) {
            console.error(`There was an error fetching the reservation with ID ${id}!`, error);
            throw error;
        }
    },

    createReservation: async (reservation) => {
        try {
            console.log("reservation", reservation)
            const response = await axios.post(API_URL, reservation);
            return response.data;
        } catch (error) {
            console.error("There was an error creating the reservation!", error);
            throw error;
        }
    },

    updateReservation: async (id, reservation) => {
        try {
            const response = await axios.put(`${API_URL}/${id}`, reservation);
            return response.data;
        } catch (error) {
            console.error(`There was an error updating the reservation with ID ${id}!`, error);
            throw error;
        }
    },
    deleteReservation: async (id) => {
        try {
            await axios.delete(`${API_URL}/${id}`);
        } catch (error) {
            console.error(`There was an error deleting the reservation with ID ${id}!`, error);
            throw error;
        }
    }
};

export default ReservationService;
