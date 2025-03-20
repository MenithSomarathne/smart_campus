import React, { useState, useEffect } from "react";
import { Container, Row, Col, Nav, Button, ListGroup, Spinner } from "react-bootstrap";
import { Link, Outlet, useNavigate } from "react-router-dom";
import axios from "axios";
import {
    FaTachometerAlt,
    FaCalendarAlt,
    FaUser,
    FaCog,
    FaBars,
    FaUsers,
    FaClock,
    FaBookmark,
    FaGraduationCap,
    FaSignOutAlt, FaList, FaTimes, FaTimesCircle, FaPen,
} from "react-icons/fa";
import { toast } from "react-toastify";

const Home = ({ role, setIsAuthenticated }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const [showSettings, setShowSettings] = useState(false);

    useEffect(() => {
        const storedRole = localStorage.getItem("role");
        if (!storedRole) {
            navigate("/login");
        }

        if (storedRole === "ADMIN") {
            fetchUsers();
        }
    }, [navigate]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await axios.get("http://localhost:8081/smart-campus/api/v1/api/auth/students");
            setUsers(response.data);
        } catch (error) {
            toast.error("Error fetching users.");
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("authToken");
        localStorage.removeItem("role");
        localStorage.removeItem("email");
        setIsAuthenticated(false);
        navigate("/login");
    };

    return (
        <Container fluid className="p-0" style={{ height: "100vh", background: "linear-gradient(135deg, #1E1E2F, #121212)", color: "white" }}>
            <Row className="h-100">
                <Col
                    md={2}
                    className={`sidebar d-flex flex-column align-items-start p-3 position-fixed bg-dark text-white shadow-lg ${sidebarOpen ? "d-block" : "d-none d-md-flex"}`}
                    style={{ height: "100vh", zIndex: 1050 }}
                >
                    <Button variant="outline-light" className="d-md-none mb-3" onClick={() => setSidebarOpen(false)}>
                        ✖ Close
                    </Button>
                    <h4 className="text-center w-100 mb-4 fw-bold">Dashboard</h4>
                    <Nav className="flex-column w-100">

                        {(role === "ADMIN") && (

                            <Nav.Link as={Link} to="/admin-dashboard" className="nav-link text-white py-3 px-3 rounded shadow-sm mb-2 d-flex align-items-center sidebar-item">
                            <FaTachometerAlt className="me-2" /> Dashboard
                        </Nav.Link>
                        )}


                        {(role === "LECTURER") && (
                            <Nav.Link as={Link} to="/lecturer-dashboard" className="nav-link text-white py-3 px-3 rounded shadow-sm mb-2 d-flex align-items-center sidebar-item">
                                <FaTachometerAlt className="me-2" /> Dashboard
                            </Nav.Link>
                        )}

                        {(role === "STUDENT") && (
                            <Nav.Link as={Link} to="/student-dashboard" className="nav-link text-white py-3 px-3 rounded shadow-sm mb-2 d-flex align-items-center sidebar-item">
                                <FaTachometerAlt className="me-2" /> Dashboard
                            </Nav.Link>
                        )}

                        <Nav.Link as={Link} to="events" className="nav-link text-white py-3 px-3 rounded shadow-sm mb-2 d-flex align-items-center sidebar-item">
                            <FaCalendarAlt className="me-2" /> Events
                        </Nav.Link>

                        {(role === "STUDENT" || role === "LECTURER" || role === "ADMIN") && (
                            <Nav.Link as={Link} to="course" className="nav-link text-white py-3 px-3 rounded shadow-sm mb-2 d-flex align-items-center sidebar-item">
                                <FaGraduationCap className="me-2" /> Course
                            </Nav.Link>
                        )}

                        {(role === "STUDENT" || role === "LECTURER" || role === "ADMIN") && (
                            <Nav.Link as={Link} to="badge" className="nav-link text-white py-3 px-3 rounded shadow-sm mb-2 d-flex align-items-center sidebar-item">
                                <FaBookmark className="me-2" /> Badge
                            </Nav.Link>
                        )}

                        {(role === "STUDENT" || role === "LECTURER" || role === "ADMIN") && (
                            <Nav.Link as={Link} to="reservation" className="nav-link text-white py-3 px-3 rounded shadow-sm mb-2 d-flex align-items-center sidebar-item">
                                <FaClock className="me-2" /> Reservation
                            </Nav.Link>
                        )}

                        <Nav.Link as={Link} to="profile" className="nav-link text-white py-3 px-3 rounded shadow-sm mb-2 d-flex align-items-center sidebar-item">
                            <FaUser className="me-2" /> Profile
                        </Nav.Link>

                        <Nav.Link
                            as={Link}
                            to="profile"
                            className="nav-link text-white py-3 px-3 rounded shadow-sm mb-2 d-flex align-items-center sidebar-item"
                            onClick={() => setShowSettings(!showSettings)}
                        >
                            <FaCog className="me-2" /> Settings
                        </Nav.Link>

                        {(role === "LECTURER" || role === "ADMIN") && (
                            <Nav.Link as={Link} to="user" className="nav-link text-white py-3 px-3 rounded shadow-sm mb-2 d-flex align-items-center sidebar-item">
                                <FaUsers className="me-2" /> Users
                            </Nav.Link>
                        )}

                        {(role === "LECTURER" || role === "ADMIN") && (
                            <Nav.Link as={Link} to="classschedule" className="nav-link text-white py-3 px-3 rounded shadow-sm mb-2 d-flex align-items-center sidebar-item">
                            <FaTimesCircle className="me-2" /> Class Schedule
                        </Nav.Link>
                        )}

                        {(role === "ADMIN") && (
                            <Nav.Link as={Link} to="resources" className="nav-link text-white py-3 px-3 rounded shadow-sm mb-2 d-flex align-items-center sidebar-item">
                                <FaList className="me-2" /> Resourses
                            </Nav.Link>
                        )}

                        {(role === "LECTURER" || role === "ADMIN") && (
                            <Nav.Link as={Link} to="userbadge" className="nav-link text-white py-3 px-3 rounded shadow-sm mb-2 d-flex align-items-center sidebar-item">
                                <FaPen className="me-2" /> User Badge
                            </Nav.Link>
                        )}
                        <Button variant="outline-light" className="d-flex align-items-center sidebar-item mt-auto" onClick={handleLogout}>
                            <FaSignOutAlt className="me-2" /> Logout
                        </Button>
                    </Nav>
                </Col>

                <Col md={{ span: 10, offset: 2 }} className="main-content p-4" style={{ height: "100%", overflowY: "auto" }}>
                    <Button variant="outline-light" className="d-md-none mb-3" onClick={() => setSidebarOpen(true)}>
                        <FaBars /> Menu
                    </Button>
                    <Outlet />
                </Col>
            </Row>
        </Container>
    );
};

export default Home;