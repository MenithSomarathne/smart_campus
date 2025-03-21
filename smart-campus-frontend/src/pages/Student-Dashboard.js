import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Container, Row, Col, Card, Table, Spinner, Image } from "react-bootstrap";
import { FaUser, FaCalendarAlt, FaBook } from 'react-icons/fa';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from "moment";

const localizer = momentLocalizer(moment);

const StudentDashboard = () => {
    const [userSchedule, setUserSchedule] = useState(null);
    const [user, setUser] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchUserSchedule = async () => {
        try {
            const email = localStorage.getItem("email");
            const response = await axios.get(`http://localhost:8081/smart-campus/api/v1/api/userSchedule-by-email`, {
                params: { email },
            });
            setUserSchedule(response.data);
            console.log(response.data);
        } catch (error) {
            toast.error("Error fetching user schedule.");
        }
    };

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

    const calendarEvents = [
        ...(userSchedule?.classSchedules || []).map(schedule => ({
            title: schedule.name,
            start: new Date(schedule.startTime),
            end: new Date(schedule.endTime),
            allDay: false,
        })),
        ...(userSchedule?.events || []).map(event => ({
            title: event.name,
            start: new Date(event.date),
            end: new Date(new Date(event.date).getTime() + 8 * 60 * 60 * 1000),
            allDay: event.allDay || false,
        })),
    ];

    useEffect(() => {
        const email = localStorage.getItem("email");
        const fetchData = async () => {
            await Promise.all([
                fetchUserSchedule(),
                fetchUserProfile(email),
            ]);
            setLoading(false);
        };
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center min-vh-100">
                <Spinner animation="border" variant="light" />
            </div>
        );
    }

    return (
        <Container fluid className="bg-dark text-white min-vh-100 p-4">
            <h1 className="text-center mb-4 font-weight-bold">Student Dashboard</h1>

            <Row className="mb-4">
                <Col>
                    <Card className="bg-secondary text-white shadow-sm hover-shadow">
                        <Card.Body>
                            <Card.Title className="font-weight-bold">
                                <FaUser className="me-2" />
                                Student Information
                            </Card.Title>
                            <div className="d-flex align-items-center">
                                {/* Profile Picture */}
                                <div className="me-4">
                                    <Image
                                        src={imagePreview || "https://via.placeholder.com/150"}
                                        alt="Profile"
                                        roundedCircle
                                        style={{ width: "100px", height: "100px", objectFit: "cover" }}
                                    />
                                </div>
                                <Table striped bordered hover variant="dark">
                                    <tbody>
                                    <tr>
                                        <th>Name</th>
                                        <td>{user?.name}</td>
                                    </tr>
                                    <tr>
                                        <th>Email</th>
                                        <td>{user?.email}</td>
                                    </tr>
                                    <tr>
                                        <th>Phone</th>
                                        <td>{user?.phone}</td>
                                    </tr>
                                    </tbody>
                                </Table>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row className="mb-4">
                <Col>
                    <Card className="bg-secondary text-white shadow-sm hover-shadow">
                        <Card.Body>
                            <Card.Title className="font-weight-bold">
                                <FaCalendarAlt className="me-2" />
                                Schedules & Events
                            </Card.Title>
                            <div style={{ height: "500px", overflow: "auto" }}>
                                <Calendar
                                    localizer={localizer}
                                    events={calendarEvents}
                                    startAccessor="start"
                                    endAccessor="end"
                                    defaultView="month"
                                    views={['month']}
                                    style={{ minHeight: "400px" }}
                                />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row className="mb-4">
                <Col>
                    <Card className="bg-secondary text-white shadow-sm hover-shadow">
                        <Card.Body>
                            <Card.Title className="font-weight-bold">
                                <FaBook className="me-2" />
                                Class Schedules
                            </Card.Title>
                            <div className="table-responsive">
                                <Table striped bordered hover variant="dark">
                                    <thead>
                                    <tr>
                                        <th>Title</th>
                                        <th>Start Time</th>
                                        <th>End Time</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {userSchedule?.classSchedules?.map((schedule) => (
                                        <tr key={schedule.id}>
                                            <td>{schedule.name}</td>
                                            <td>{new Date(schedule.startTime).toLocaleString()}</td>
                                            <td>{new Date(schedule.endTime).toLocaleString()}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </Table>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row className="mb-4">
                <Col>
                    <Card className="bg-secondary text-white shadow-sm hover-shadow">
                        <Card.Body>
                            <Card.Title className="font-weight-bold">
                                <FaCalendarAlt className="me-2" />
                                Events
                            </Card.Title>
                            <div className="table-responsive">
                                <Table striped bordered hover variant="dark">
                                    <thead>
                                    <tr>
                                        <th>Title</th>
                                        <th>Start Time</th>
                                        <th>End Time</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {userSchedule?.events?.map((event) => (
                                        <tr key={event.id}>
                                            <td>{event.name}</td>
                                            <td>{new Date(event.date).toLocaleString()}</td>
                                            <td>{new Date(new Date(event.date).setHours(new Date(event.date).getHours() + 8)).toLocaleString()}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </Table>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default StudentDashboard;