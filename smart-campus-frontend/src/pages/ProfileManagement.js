import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Container, Form, Button, Card, Image } from "react-bootstrap";

const Profile = () => {
    const [user, setUser] = useState({
        id: "",
        name: "",
        email: "",
        phone: "",
        profilePicture: "",
    });

    const [imagePreview, setImagePreview] = useState(null);
    const email = localStorage.getItem("email");

    useEffect(() => {
        if (email) {
            fetchUserProfile(email);
        }
    }, [email]);

    const fetchUserProfile = async (email) => {
        try {
            const response = await axios.get(`http://localhost:8081/smart-campus/api/v1/api/auth/user-by-email`, {
                params: { email },
            });
            setUser(response.data);
            setImagePreview(response.data.profilePicture);
        } catch (error) {
            toast.error("Failed to fetch user details.");
        }
    };

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
                setUser({ ...user, profilePicture: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const userId = user.id;
            if (!userId) {
                toast.error("User ID is missing.");
                return;
            }
            const response = await axios.put(`http://localhost:8081/smart-campus/api/v1/api/auth/users/${userId}`, user);
            console.log("Profile updated:", response.data);
            toast.success("Profile updated successfully!");
        } catch (error) {
            toast.error("Failed to update profile.");
            console.error("Error updating profile:", error);
        }
    };

    return (
        <Container className="d-flex justify-content-center align-items-center min-vh-100">
            <Card className="shadow-lg p-4" style={{ width: "100%", maxWidth: "500px" }}>
                <Card.Body>
                    <Card.Title className="text-center mb-4">Profile Management</Card.Title>

                    {/* Profile Picture */}
                    <div className="text-center mb-4">
                        <label htmlFor="profilePicture" style={{ cursor: "pointer" }}>
                            <Image
                                src={imagePreview || "https://via.placeholder.com/150"}
                                alt="Profile"
                                roundedCircle
                                style={{ width: "150px", height: "150px", objectFit: "cover" }}
                            />
                            <Form.Control
                                type="file"
                                id="profilePicture"
                                className="d-none"
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                            <Button variant="link" className="mt-2">
                                Change Photo
                            </Button>
                        </label>
                    </div>

                    {/* Profile Form */}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={user.name}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                value={user.email}
                                readOnly
                                className="bg-light"
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Phone</Form.Label>
                            <Form.Control
                                type="text"
                                name="phone"
                                value={user.phone}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Button variant="primary" type="submit" className="w-100">
                            Update Profile
                        </Button>
                    </Form>
                </Card.Body>
            </Card>

            {/* Toast Container */}
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar closeOnClick />
        </Container>
    );
};

export default Profile;
