import React, { useState, useEffect } from "react";
import {Container, Row, Col, Form, Button, ListGroup, Nav, Modal, Alert} from "react-bootstrap";
import { FaTrash, FaEdit, FaEye, FaPlus, FaList } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
    getAllSchedules,
    getScheduleById,
    deleteSchedule,
    createOrUpdateSchedule,
} from "../service/classScheduleService";
import { getAllLectures } from "../service/UserManagementService";
import { getAllBadges } from "../service/BadgeService";
import { getAllResources } from "../service/ResourceManagementService";

const ClassScheduleManagement = () => {
    const [schedules, setSchedules] = useState([]);
    const [lecturers, setLecturers] = useState([]);
    const [badges, setBadges] = useState([]);
    const [resources, setResources] = useState([]);
    const [name, setName] = useState("");
    const [selectedLecturer, setSelectedLecturer] = useState("");
    const [selectedBadge, setSelectedBadge] = useState("");
    const [selectedResource, setSelectedResource] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [status, setStatus] = useState("ACTIVE");
    const [selectedSchedule, setSelectedSchedule] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [activeTab, setActiveTab] = useState("schedules");

    useEffect(() => {
        fetchSchedules();
        fetchLecturers();
        fetchBadges();
        fetchResources();
    }, []);

    const fetchSchedules = async () => {
        try {
            const data = await getAllSchedules();
            setSchedules(data);
        } catch (error) {
            console.error("Error fetching schedules:", error);
            toast.error("Failed to fetch schedules.");
        }
    };

    const fetchLecturers = async () => {
        try {
            const data = await getAllLectures();
            console.log("Lecturer data:", data);
            setLecturers(data);
        } catch (error) {
            console.error("Error fetching lecturers:", error);
            toast.error("Failed to fetch lecturers.");
        }
    };

    const fetchBadges = async () => {
        try {
            const data = await getAllBadges();
            console.log("Badge data:", data);
            setBadges(data);
        } catch (error) {
            console.error("Error fetching badges:", error);
            toast.error("Failed to fetch badges.");
        }
    };

    const fetchResources = async () => {
        try {
            const data = await getAllResources();
            console.log("Resource data:", data);
            setResources(data);
        } catch (error) {
            console.error("Error fetching resources:", error);
            toast.error("Failed to fetch resources.");
        }
    };

    const handleAddOrUpdateSchedule = async (e) => {
        e.preventDefault();
        if (!name || !selectedLecturer || !selectedBadge || !selectedResource || !startTime || !endTime) {
            toast.warning("Please fill in all fields.");
            return;
        }

        const newSchedule = {
            scheduleID: isEditing ? selectedSchedule.scheduleID : null,
            name,
            lecturer: {
                id: parseInt(selectedLecturer),
            },
            badge: {
                badgeID: parseInt(selectedBadge),
            },
            resource: {
                id: parseInt(selectedResource),
            },
            startTime,
            endTime,
            status,
        };

        try {
            const response = await createOrUpdateSchedule(newSchedule);
            if (isEditing) {
                setSchedules((prev) =>
                    prev.map((schedule) =>
                        schedule.scheduleID === response.scheduleID ? response : schedule
                    )
                );
                toast.success(`Schedule updated: ${response.name}`);
            } else {
                setSchedules((prev) => [...prev, response]);
                fetchSchedules();
                toast.success(`New schedule added: ${response.name}`);
            }

            setName("");
            setSelectedLecturer("");
            setSelectedBadge("");
            setSelectedResource("");
            setStartTime("");
            setEndTime("");
            setStatus("ACTIVE");
            setSelectedSchedule(null);
            setIsEditing(false);
            setActiveTab("schedules");
        } catch (error) {
            console.error("Error creating/updating schedule:", error);
            toast.error("Failed to create/update schedule.");
        }
    };

    const handleDeleteSchedule = async (scheduleID) => {
        try {
            await deleteSchedule(scheduleID);
            setSchedules((prev) => prev.filter((schedule) => schedule.scheduleID !== scheduleID));
            toast.success("Schedule deleted.");
        } catch (error) {
            console.error("Error deleting schedule:", error);
            toast.error("Failed to delete schedule.");
        }
    };

    const handleEditSchedule = (schedule) => {
        setName(schedule.name);
        setSelectedLecturer(schedule.lecturer.id.toString());
        setSelectedBadge(schedule.badge.badgeID.toString());
        setSelectedResource(schedule.resource.id.toString());
        setStartTime(schedule.startTime);
        setEndTime(schedule.endTime);
        setStatus(schedule.status);
        setSelectedSchedule(schedule);
        setIsEditing(true);
        setActiveTab("add-schedule");
    };

    const handleViewSchedule = (schedule) => {
        setSelectedSchedule(schedule);
        setShowModal(true);
    };

    const handleAddNewSchedule = () => {
        setName("");
        setSelectedLecturer("");
        setSelectedBadge("");
        setSelectedResource("");
        setStartTime("");
        setEndTime("");
        setStatus("ACTIVE");
        setSelectedSchedule(null);
        setIsEditing(false);
        setActiveTab("add-schedule");
    };

    return (
        <Container className="mt-5">
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />

            {/* Tab Nvigatin */}
            <Nav variant="tabs" activeKey={activeTab} className="mb-4 border-light">
                <Nav.Item>
                    <Nav.Link eventKey="schedules" onClick={() => setActiveTab("schedules")}>
                        <FaList className="me-2" /> Schedules
                    </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="add-schedule" onClick={handleAddNewSchedule}>
                        <FaPlus className="me-2" /> {isEditing ? "Edit Schedule" : "Add Schedule"}
                    </Nav.Link>
                </Nav.Item>
            </Nav>

            {activeTab === "schedules" && (
                <>
                    <h2 className="mb-3 text-light">Schedules</h2>
                    {schedules.length === 0 ? (
                        <Alert variant="info" className="text-light">No schedules available.</Alert>
                    ) : (
                        <ListGroup className="shadow-sm rounded bg-dark text-light">
                            {schedules.map((schedule) => (
                                <ListGroup.Item
                                    key={schedule.scheduleID}
                                    className="d-flex justify-content-between align-items-center bg-secondary"
                                >
                                    <div>
                                        <strong>{schedule.name}</strong>
                                        <br />
                                        <small className="text-muted">Lecturer: {schedule.lecturer.name}</small>
                                        <br />
                                        <small className="text-muted">Badge: {schedule.badge.badgeName}</small>
                                        <br />
                                        <small className="text-muted">Resource: {schedule.resource.name}</small>
                                        <br />
                                        <small className="text-muted">
                                            Start: {new Date(schedule.startTime).toLocaleString()}
                                        </small>
                                        <br />
                                        <small className="text-muted">
                                            End: {new Date(schedule.endTime).toLocaleString()}
                                        </small>
                                    </div>
                                    <div>
                                        <Button
                                            variant="outline-info"
                                            size="sm"
                                            className="me-2"
                                            onClick={() => handleViewSchedule(schedule)}
                                        >
                                            <FaEye />
                                        </Button>
                                        <Button
                                            variant="outline-warning"
                                            size="sm"
                                            className="me-2"
                                            onClick={() => handleEditSchedule(schedule)}
                                        >
                                            <FaEdit />
                                        </Button>
                                        <Button
                                            variant="outline-danger"
                                            size="sm"
                                            onClick={() => handleDeleteSchedule(schedule.scheduleID)}
                                        >
                                            <FaTrash />
                                        </Button>
                                    </div>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    )}
                </>
            )}

            {activeTab === "add-schedule" && (
                <>
                    <h2 className="mb-3 text-light">{isEditing ? "Edit Schedule" : "Add Schedule"}</h2>
                    <Form onSubmit={handleAddOrUpdateSchedule} className="shadow-sm p-4 rounded bg-dark text-light">
                        <Form.Group className="mb-3">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter schedule name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="bg-secondary text-light border-light"
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Lecturer</Form.Label>
                            <Form.Select
                                value={selectedLecturer}
                                onChange={(e) => setSelectedLecturer(e.target.value)}
                                className="bg-secondary text-light border-light"
                            >
                                <option value="">Select a lecturer</option>
                                {lecturers.map((lecturer) => (
                                    <option key={lecturer.id} value={lecturer.id}>
                                        {lecturer.name}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Badge</Form.Label>
                            <Form.Select
                                value={selectedBadge}
                                onChange={(e) => setSelectedBadge(e.target.value)}
                                className="bg-secondary text-light border-light"
                            >
                                <option value="">Select a badge</option>
                                {badges.map((badge) => (
                                    <option key={badge.badgeID} value={badge.badgeID}>
                                        {badge.badgeName}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Resource</Form.Label>
                            <Form.Select
                                value={selectedResource}
                                onChange={(e) => setSelectedResource(e.target.value)}
                                className="bg-secondary text-light border-light"
                            >
                                <option value="">Select a resource</option>
                                {resources.map((resource) => (
                                    <option key={resource.id} value={resource.id}>
                                        {resource.name}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Start Time</Form.Label>
                            <Form.Control
                                type="datetime-local"
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                                className="bg-secondary text-light border-light"
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>End Time</Form.Label>
                            <Form.Control
                                type="datetime-local"
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value)}
                                className="bg-secondary text-light border-light"
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Status</Form.Label>
                            <Form.Select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="bg-secondary text-light border-light"
                            >
                                <option value="ACTIVE">ACTIVE</option>
                                <option value="COMPLETED">COMPLETED</option>
                                <option value="CANCELLED">CANCELLED</option>
                            </Form.Select>
                        </Form.Group>

                        <Button variant="primary" type="submit" className="w-100">
                            {isEditing ? "Update Schedule" : "Add Schedule"}
                        </Button>
                    </Form>
                </>
            )}

            {/* View Schedule Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)} dialogClassName="bg-dark">
                <Modal.Header closeButton>
                    <Modal.Title>Schedule Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedSchedule && (
                        <>
                            <p><strong>Name:</strong> {selectedSchedule.name}</p>
                            <p><strong>Lecturer:</strong> {selectedSchedule.lecturer.name}</p>
                            <p><strong>Badge:</strong> {selectedSchedule.badge.badgeName}</p>
                            <p><strong>Resource:</strong> {selectedSchedule.resource.name}</p>
                            <p><strong>Start Time:</strong> {new Date(selectedSchedule.startTime).toLocaleString()}</p>
                            <p><strong>End Time:</strong> {new Date(selectedSchedule.endTime).toLocaleString()}</p>
                            <p><strong>Status:</strong> {selectedSchedule.status}</p>
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>

    );
};

export default ClassScheduleManagement;