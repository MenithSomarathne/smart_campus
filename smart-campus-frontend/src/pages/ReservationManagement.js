import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, ListGroup, Alert, Nav, Modal, Toast, ToastContainer } from "react-bootstrap";
import { FaTrash, FaEdit, FaEye, FaPlus, FaList } from "react-icons/fa";
import ReservationService from "../service/ReservationService";
import {getAllResourceIdAndName, getAllResources} from "../service/ResourceManagementService";
import {getAllUsers, getAllUsersIdAndName} from "../service/UserManagementService";

const ReservationManagement = () => {
    const [reservations, setReservations] = useState([]);
    const [users, setUsers] = useState([]);
    const [resources, setResources] = useState([]);
    const [selectedUser, setSelectedUser] = useState("");
    const [selectedResource, setSelectedResource] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [status, setStatus] = useState("ACTIVE");
    const [selectedReservation, setSelectedReservation] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [notification, setNotification] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [activeTab, setActiveTab] = useState("reservations");
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastVariant, setToastVariant] = useState("info");

    useEffect(() => {
        fetchReservations();
        fetchUsers();
        fetchResources();
    }, []);

    const fetchReservations = async () => {
        try {
            const data = await ReservationService.getAllReservations();
            setReservations(data);
        } catch (error) {
            console.error("Error fetching reservations:", error);
        }
    };

    const fetchUsers = async () => {
        try {
            const data = await getAllUsers();
            const formattedUsers = data.map((user) => ({
                userID: user.id,
                userName: user.name,
            }));
            setUsers(formattedUsers);
        } catch (err) {
            console.error("Error fetching users:", err);
        }
    };

    const fetchResources = async () => {
        try {
            const data = await getAllResources();
            const formattedResources = data.map((resource) => ({
                resourceID: resource.id,
                resourceName: resource.name,
            }));
            setResources(formattedResources);
        } catch (err) {
            console.error("Error fetching resources:", err);
        }
    };

    const handleAddOrUpdateReservation = async (e) => {
        e.preventDefault();
        if (!selectedUser || !selectedResource || !startTime || !endTime) {
            showToastNotification("Please fill in all fields.", "danger");
            return;
        }

        const user = users.find((user) => user.userID === parseInt(selectedUser));
        const resource = resources.find((resource) => resource.resourceID === parseInt(selectedResource));

        if (!user || !resource) {
            showToastNotification("Invalid user or resource selected.", "danger");
            return;
        }

        const newReservation = {
            user:{
                id: user.userID,
                name: user.userName,
            },
            resource:{
                id: resource.resourceID,
                name: resource.resourceName,
            },
            userName: user.userName,
            resourceName: resource.resourceName,
            startTime,
            endTime,
            status,
        };

        try {
            if (isEditing) {
                console.log("selectedReservation.id", selectedReservation.id)
                await ReservationService.updateReservation(selectedReservation.id, newReservation);
                showToastNotification("Reservation updated.", "success");
            } else {
                await ReservationService.createReservation(newReservation);
                showToastNotification("New reservation added.", "success");
            }
            fetchReservations();
        } catch (error) {
            console.error("Error saving reservation:", error);
            showToastNotification("Error saving reservation.", "danger");
        }

        resetForm();
    };

    const resetForm = () => {
        setSelectedUser("");
        setSelectedResource("");
        setStartTime("");
        setEndTime("");
        setStatus("ACTIVE");
        setSelectedReservation(null);
        setIsEditing(false);
        setActiveTab("reservations");
    };

    const handleDeleteReservation = async (reservationID) => {
        try {
            await ReservationService.deleteReservation(reservationID);
            showToastNotification("Reservation deleted.", "success");
            fetchReservations();
        } catch (error) {
            console.error("Error deleting reservation:", error);
            showToastNotification("Error deleting reservation.", "danger");
        }
    };

    const handleEditReservation = (reservation) => {
        setSelectedUser(reservation.user.id.toString());
        setSelectedResource(reservation.resource.id.toString());
        setStartTime(reservation.startTime);
        setEndTime(reservation.endTime);
        setStatus(reservation.status);
        setSelectedReservation(reservation);
        setIsEditing(true);
        setActiveTab("add-reservation");
    };

    const handleViewReservation = (reservation) => {
        setSelectedReservation(reservation);
        setShowModal(true);
    };

    const handleAddNewReservation = () => {
        resetForm();
        setActiveTab("add-reservation");
    };

    const showToastNotification = (message, variant) => {
        setToastMessage(message);
        setToastVariant(variant);
        setShowToast(true);

        setTimeout(() => {
            setShowToast(false);
        }, 3000);
    };

    return (
        <Container className="mt-5 p-4 rounded">
            <Nav variant="tabs" activeKey={activeTab} className="mb-4">
                <Nav.Item>
                    <Nav.Link eventKey="reservations" onClick={() => setActiveTab("reservations")}>
                        <FaList className="me-2" /> Reservations
                    </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="add-reservation" onClick={handleAddNewReservation}>
                        <FaPlus className="me-2" /> {isEditing ? "Edit Reservation" : "Add Reservation"}
                    </Nav.Link>
                </Nav.Item>
            </Nav>

            {activeTab === "reservations" && (
                <>
                    <h2 className="mb-3">Reservations</h2>
                    {reservations.length === 0 ? (
                        <Alert variant="info">No reservations available.</Alert>
                    ) : (
                        <ListGroup className="shadow-sm rounded bg-secondary">
                            {reservations.map((reservation) => (
                                <ListGroup.Item
                                    key={reservation.id}
                                    className="d-flex justify-content-between align-items-center bg-dark text-light border-secondary"
                                >
                                    <div>
                                        <strong>{reservation.resource.name}</strong> <span className="badge bg-info ms-2">{reservation.status}</span>
                                        <br />
                                        <small className="text-light">User: {reservation.user.name}</small>
                                        <br />
                                        <small className="text-light">Start: {new Date(reservation.startTime).toLocaleString()}</small>
                                        <br />
                                        <small className="text-light">End: {new Date(reservation.endTime).toLocaleString()}</small>
                                    </div>
                                    <div>
                                        <Button variant="outline-info" size="sm" className="me-2" onClick={() => handleViewReservation(reservation)}>
                                            <FaEye />
                                        </Button>
                                        <Button variant="outline-warning" size="sm" className="me-2" onClick={() => handleEditReservation(reservation)}>
                                            <FaEdit />
                                        </Button>
                                        <Button variant="outline-danger" size="sm" onClick={() => handleDeleteReservation(reservation.id)}>
                                            <FaTrash />
                                        </Button>
                                    </div>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    )}
                </>
            )}

            {activeTab === "add-reservation" && (
                <>
                    <h2 className="mb-3">{isEditing ? "Edit Reservation" : "Add Reservation"}</h2>
                    <Form onSubmit={handleAddOrUpdateReservation} className="shadow-sm p-4 rounded bg-dark text-light">
                        <Form.Group className="mb-3">
                            <Form.Label>User</Form.Label>
                            <Form.Select value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)} className="bg-secondary text-light">
                                <option value="">Select a user</option>
                                {users.map((user) => (
                                    <option key={user.userID} value={user.userID}>{user.userName}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Resource</Form.Label>
                            <Form.Select value={selectedResource} onChange={(e) => setSelectedResource(e.target.value)} className="bg-secondary text-light">
                                <option value="">Select a resource</option>
                                {resources.map((resource) => (
                                    <option key={resource.resourceID} value={resource.resourceID}>{resource.resourceName}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Start Time</Form.Label>
                            <Form.Control type="datetime-local" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="bg-secondary text-light"/>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>End Time</Form.Label>
                            <Form.Control type="datetime-local" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="bg-secondary text-light"/>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Status</Form.Label>
                            <Form.Select value={status} onChange={(e) => setStatus(e.target.value)} className="bg-secondary text-light">
                                <option value="ACTIVE">ACTIVE</option>
                                <option value="COMPLETED">COMPLETED</option>
                                <option value="CANCELLED">CANCELLED</option>
                            </Form.Select>
                        </Form.Group>

                        <Button variant="primary" type="submit" className="w-100">{isEditing ? "Update Reservation" : "Add Reservation"}</Button>
                    </Form>
                </>
            )}

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Reservation Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedReservation && (
                        <>
                            <p><strong>Resource:</strong> {selectedReservation.resourceName}</p>
                            <p><strong>User:</strong> {selectedReservation.userName}</p>
                            <p><strong>Start Time:</strong> {new Date(selectedReservation.startTime).toLocaleString()}</p>
                            <p><strong>End Time:</strong> {new Date(selectedReservation.endTime).toLocaleString()}</p>
                            <p><strong>Status:</strong> {selectedReservation.status}</p>
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default ReservationManagement;
