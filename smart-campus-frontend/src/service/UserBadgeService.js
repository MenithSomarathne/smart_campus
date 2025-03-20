import axios from "axios";

const API_URL = "http://localhost:8081/smart-campus/api/v1/user-badges";

export const assignBadgeToUser = async (userId, badgeId) => {
    try {
        const response = await axios.post(`${API_URL}/assign`, null, {
            params: {
                userId: userId,
                badgeId: badgeId
            }
        });
        console.log("Badge Assigned:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error assigning badge:", error);
        throw error;
    }
};
