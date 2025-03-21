import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, ListGroup, Nav, Modal, Toast } from "react-bootstrap";
import { FaPlus, FaList, FaTrash, FaEdit, FaEye, FaCheck } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import { assignBadgeToUser } from "../service/UserBadgeService";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const UserBadgeManagement = () => {
    const [userId, setUserId] = useState("");
    const [badgeId, setBadgeId] = useState("");
    const [users, setUsers] = useState([]);
    const [badges, setBadges] = useState([]);
    const [assignedBadges, setAssignedBadges] = useState([]);
    const [activeTab, setActiveTab] = useState("assign");
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedAssignment, setSelectedAssignment] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get("http://localhost:8081/smart-campus/api/v1/api/auth/students");
                console.log("response", response.data)
                setUsers(response.data);
            } catch (error) {
                toast.error("Error fetching users.");
            }
        };

        const fetchBadges = async () => {
            try {
                const response = await axios.get("http://localhost:8081/smart-campus/api/v1/api/badges");
                setBadges(response.data);
            } catch (error) {
                toast.error("Error fetching badges.");
            }
        };

        fetchUsers();
        fetchBadges();
    }, []);

    const handleAssignBadge = async (e) => {
        e.preventDefault();

        if (!userId || !badgeId) {
            toast.warning("Please select both a user and a badge.");
            return;
        }

        try {
            await assignBadgeToUser(userId, badgeId);
            setAssignedBadges([...assignedBadges, { userId, badgeId }]);

            toast.success("Badge assigned successfully!");
        } catch (error) {
            toast.error("Error assigning badge.");
        }
    };

    const handleDeleteAssignment = (assignmentId) => {
        setAssignedBadges(assignedBadges.filter((assignment) => assignment.id !== assignmentId));
        toast.success("Assignment deleted.");
    };

    const handleViewAssignment = (assignment) => {
        setSelectedAssignment(assignment);
        setShowModal(true);
    };

    const handleEditAssignment = (assignment) => {
        setUserId(assignment.userId);
        setBadgeId(assignment.badgeId);
        setSelectedAssignment(assignment);
        setIsEditing(true);
        setActiveTab("edit");
    };

    const handleReset = () => {
        setUserId("");
        setBadgeId("");
        setSelectedAssignment(null);
        setIsEditing(false);
        setActiveTab("assign");
    };

    return (
        <Container className="mt-5 p-4 rounded">
            <Nav variant="tabs" activeKey={activeTab} className="mb-4">
                <Nav.Item>
                    <Nav.Link eventKey="assign" onClick={() => setActiveTab("assign")}>
                        <FaList className="me-2" /> Assign Badge
                    </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="view" onClick={() => setActiveTab("view")}>
                        <FaList className="me-2" /> Assigned Badges
                    </Nav.Link>
                </Nav.Item>
            </Nav>

            <Row>
                <Col md={8} className="mx-auto">
                    {activeTab === "assign" ? (
                        <>
                            <h2 className="mb-3 text-light">Assign Badge to User</h2>
                            <Form onSubmit={handleAssignBadge} className="shadow-sm p-4 rounded bg-secondary">
                                <Form.Group className="mb-3">
                                    <Form.Label className="text-light">Select User</Form.Label>
                                    <Form.Select
                                        value={userId}
                                        onChange={(e) => setUserId(e.target.value)}
                                        className="bg-dark text-light"
                                    >
                                        <option value="">Select User</option>
                                        {users.map((user) => (
                                            <option key={user.id} value={user.id}>
                                                {user.name}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label className="text-light">Select Badge</Form.Label>
                                    <Form.Select
                                        value={badgeId}
                                        onChange={(e) => setBadgeId(e.target.value)}
                                        className="bg-dark text-light"
                                    >
                                        <option value="">Select Badge</option>
                                        {badges.map((badge) => (
                                            <option key={badge.badgeID} value={badge.badgeID}>
                                                {badge.badgeName}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>

                                <Button variant="primary" type="submit" className="w-100">
                                    Assign Badge
                                </Button>
                            </Form>
                        </>
                    ) : (
                        <>
                            <h2 className="mb-3 text-light">Assigned Badges</h2>
                            <ListGroup className="shadow-sm rounded">
                                {assignedBadges.length === 0 ? (
                                    <Toast className="bg-danger text-light">
                                        <Toast.Body>No badges assigned.</Toast.Body>
                                    </Toast>
                                ) : (
                                    assignedBadges.map((assignment) => (
                                        <ListGroup.Item key={assignment.id} className="d-flex justify-content-between align-items-center bg-dark text-light">
                                            <div>
                                                <strong>User:</strong> {assignment.userId} <br />
                                                <strong>Badge:</strong> {assignment.badgeId}
                                            </div>
                                            <div>
                                                <Button
                                                    variant="outline-info"
                                                    size="sm"
                                                    className="me-2"
                                                    onClick={() => handleViewAssignment(assignment)}
                                                >
                                                    <FaEye />
                                                </Button>
                                                <Button
                                                    variant="outline-warning"
                                                    size="sm"
                                                    className="me-2"
                                                    onClick={() => handleEditAssignment(assignment)}
                                                >
                                                    <FaEdit />
                                                </Button>
                                                <Button
                                                    variant="outline-danger"
                                                    size="sm"
                                                    onClick={() => handleDeleteAssignment(assignment.id)}
                                                >
                                                    <FaTrash />
                                                </Button>
                                            </div>
                                        </ListGroup.Item>
                                    ))
                                )}
                            </ListGroup>
                        </>
                    )}
                </Col>
            </Row>

            <Modal show={showModal} onHide={() => setShowModal(false)} className="text-light">
                <Modal.Header closeButton className="bg-dark">
                    <Modal.Title>Assignment Details</Modal.Title>
                </Modal.Header>
                <Modal.Body className="bg-secondary text-light">
                    {selectedAssignment && (
                        <>
                            <p>
                                <strong>User ID:</strong> {selectedAssignment.userId}
                            </p>
                            <p>
                                <strong>Badge ID:</strong> {selectedAssignment.badgeId}
                            </p>
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer className="bg-dark">
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

            <ToastContainer position="top-right" autoClose={5000} hideProgressBar newestOnTop closeOnClick />
        </Container>
    );
};

export default UserBadgeManagement;
