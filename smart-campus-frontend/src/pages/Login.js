import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const Login = ({ setIsAuthenticated, setRole }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [role, setLocalRole] = useState("STUDENT");
    const [status, setStatus] = useState(true);
    const [profilePicture, setProfilePicture] = useState("");
    const [isSignup, setIsSignup] = useState(false);
    const navigate = useNavigate();

    const API_URL = "http://localhost:8081/smart-campus/api/v1/api/auth";

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfilePicture(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isSignup) {
            try {
                const response = await axios.post(`${API_URL}/register`, {
                    name,
                    email,
                    password,
                    role,
                    phone,
                    profilePicture,
                    status,
                });
                console.log("Signup Response:", response.data);
                alert("Signup Successful!");
                setIsSignup(false);
            } catch (error) {
                console.error("Signup Error:", error);
                alert("Error during signup. Please try again.");
            }
        } else {
            try {
                const response = await axios.post(
                    `${API_URL}/login`,
                    {
                        email: email,
                        password: password,
                    },
                    {
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );

                console.log("Login Response:", response.data);
                if (response.data && response.data.token && response.data.role) {
                    const { token, role } = response.data;

                    setIsAuthenticated(true);
                    setRole(role);

                    localStorage.setItem("authToken", token);
                    localStorage.setItem("role", role);
                    localStorage.setItem("email", email);

                    navigate("/");
                } else {
                    alert("Invalid credentials");
                }
            } catch (error) {
                console.error("Login Error:", error);
                if (error.response) {
                    alert(`Error: ${error.response.data.message || "An error occurred during login."}`);
                } else if (error.request) {
                    alert("No response from the server. Please try again later.");
                } else {
                    alert("An error occurred. Please try again.");
                }
            }
        }
    };

    return (
        <div
            className="d-flex justify-content-center align-items-center vh-100"
            style={{
                background: "linear-gradient(135deg, #2c3e50, #4b6cb7)",
            }}
        >
            <div className="card shadow-lg border-0" style={{ width: "400px", borderRadius: "15px" }}>
                <div className="card-body p-4">
                    <h2 className="card-title text-center mb-4">{isSignup ? "Sign Up" : "Login"}</h2>
                    <Form onSubmit={handleSubmit}>
                        {isSignup && (
                            <Form.Group className="mb-3">
                                <Form.Label>Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Enter your name"
                                    required
                                    className="rounded-pill"
                                />
                            </Form.Group>
                        )}

                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter email"
                                required
                                className="rounded-pill"
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter password"
                                required
                                className="rounded-pill"
                            />
                        </Form.Group>

                        {isSignup && (
                            <>
                                <Form.Group className="mb-3">
                                    <Form.Label>Role</Form.Label>
                                    <Form.Select
                                        value={role}
                                        onChange={(e) => setLocalRole(e.target.value)}
                                        className="rounded-pill"
                                    >
                                        <option value="STUDENT">Student</option>
                                        <option value="LECTURER">Lecturer</option>
                                        <option value="ADMIN">Admin</option>
                                    </Form.Select>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Phone</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        placeholder="Enter phone number"
                                        className="rounded-pill"
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Profile Picture</Form.Label>
                                    <div className="d-flex flex-column align-items-start">
                                        <Form.Control
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="rounded-pill"
                                        />
                                        {profilePicture && (
                                            <img
                                                src={profilePicture}
                                                alt="Profile"
                                                style={{ width: "100px", height: "100px", marginTop: "10px", borderRadius: "10px" }}
                                            />
                                        )}
                                    </div>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Status</Form.Label>
                                    <Form.Select
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value === "true")}
                                        className="rounded-pill"
                                    >
                                        <option value={true}>Active</option>
                                        <option value={false}>Inactive</option>
                                    </Form.Select>
                                </Form.Group>
                            </>
                        )}

                        <Button
                            variant="primary"
                            type="submit"
                            className="w-100 rounded-pill mt-3"
                            style={{ fontWeight: "bold" }}
                        >
                            {isSignup ? "Sign Up" : "Login"}
                        </Button>
                    </Form>

                    <div className="text-center mt-3">
                        {isSignup ? (
                            <p>
                                Already have an account?{" "}
                                <span
                                    className="text-primary"
                                    style={{ cursor: "pointer", fontWeight: "bold" }}
                                    onClick={() => setIsSignup(false)}
                                >
                                    Login
                                </span>
                            </p>
                        ) : (
                            <p>
                                Don't have an account?{" "}
                                <span
                                    className="text-primary"
                                    style={{ cursor: "pointer", fontWeight: "bold" }}
                                    onClick={() => setIsSignup(true)}
                                >
                                    Sign Up
                                </span>
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;