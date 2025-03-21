import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Container, Row, Col, Card, Table, Spinner } from "react-bootstrap";
import { FaChalkboardTeacher, FaCalendarAlt, FaBook, FaUserGraduate } from 'react-icons/fa';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from "moment";

const localizer = momentLocalizer(moment);

const LecturerDashboard = () => {
    const [courses, setCourses] = useState([]);
    const [schedules, setSchedules] = useState([]);
    const [events, setEvents] = useState([]);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchCourses = async () => {
        try {
            const lecturerId = localStorage.getItem("userId");
            const response = await axios.get(`http://localhost:8081/smart-campus/api/v1/api/courses`);
            setCourses(response.data);
        } catch (error) {
            toast.error("Error fetching courses.");
        }
    };

    const fetchSchedules = async () => {
        try {
            const lecturerId = localStorage.getItem("userId");
            const response = await axios.get(`http://localhost:8081/smart-campus/api/v1/api/schedules`);
            setSchedules(response.data);
        } catch (error) {
            toast.error("Error fetching schedules.");
        }
    };

    const fetchEvents = async () => {
        try {
            const lecturerId = localStorage.getItem("userId");
            const response = await axios.get(`http://localhost:8081/smart-campus/api/v1/api/events`);
            setEvents(response.data);
        } catch (error) {
            toast.error("Error fetching events.");
        }
    };

    const fetchStudents = async () => {
        try {
            const lecturerId = localStorage.getItem("userId");
            const response = await axios.get(`http://localhost:8081/smart-campus/api/v1/api/auth/students`);
            setStudents(response.data);
        } catch (error) {
            toast.error("Error fetching students.");
        }
    };

    const calendarEvents = [
        ...schedules.map(schedule => ({
            title: schedule.name,
            start: new Date(schedule.startTime),
            end: new Date(schedule.endTime),
            allDay: false,
        })),
        ...events.map(event => ({
            title: event.name,
            start: new Date(event.date),
            end: new Date(new Date(event.date).getTime() + 8 * 60 * 60 * 1000),
            allDay: event.allDay || false,
        })),
    ];

    useEffect(() => {
        const fetchData = async () => {
            await Promise.all([
                fetchCourses(),
                fetchSchedules(),
                fetchEvents(),
                fetchStudents(),
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
            <h1 className="text-center mb-4 font-weight-bold">Lecturer Dashboard</h1>

            <Row className="mb-4">
                <Col xs={12} md={6} lg={3} className="mb-3">
                    <Card className="bg-info text-white shadow-sm hover-shadow">
                        <Card.Body className="d-flex justify-content-between align-items-center">
                            <FaBook size={40} />
                            <div>
                                <h5>Courses</h5>
                                <p>{courses.length}</p>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xs={12} md={6} lg={3} className="mb-3">
                    <Card className="bg-warning text-white shadow-sm hover-shadow">
                        <Card.Body className="d-flex justify-content-between align-items-center">
                            <FaUserGraduate size={40} />
                            <div>
                                <h5>Students</h5>
                                <p>{students.length}</p>
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
                            <Card.Title className="font-weight-bold">Courses</Card.Title>
                            <div className="table-responsive">
                                <Table striped bordered hover variant="dark">
                                    <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Name</th>
                                        <th>Description</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {courses.map((course) => (
                                        <tr key={course.courseID}>
                                            <td>{course.courseID}</td>
                                            <td>{course.courseName}</td>
                                            <td>{course.description}</td>
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
                            <Card.Title className="font-weight-bold">Students</Card.Title>
                            <div className="table-responsive">
                                <Table striped bordered hover variant="dark">
                                    <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Phone</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {students.map((student) => (
                                        <tr key={student.id}>
                                            <td>{student.id}</td>
                                            <td>{student.name}</td>
                                            <td>{student.email}</td>
                                            <td>{student.phone}</td>
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

export default LecturerDashboard;