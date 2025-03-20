import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, ListGroup, Nav, Modal } from "react-bootstrap";
import { FaPlus, FaList, FaTrash, FaEdit, FaEye, FaCheck } from "react-icons/fa";
import { getAllResources, createResource, updateResource, deleteResource } from "../service/ResourceManagementService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ResourceManagement = () => {
    const [resourceName, setResourceName] = useState("");
    const [resourceType, setResourceType] = useState("Room");
    const [resourceStatus, setResourceStatus] = useState("Available");
    const [resourceAvailability, setResourceAvailability] = useState("");
    const [resources, setResources] = useState([]);
    const [activeTab, setActiveTab] = useState("resources");
    const [selectedResource, setSelectedResource] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [reservationDetails, setReservationDetails] = useState({});

    useEffect(() => {
        const fetchResources = async () => {
            try {
                const data = await getAllResources();
                setResources(data);
            } catch (error) {
                toast.error("Error fetching resources.");
            }
        };
        fetchResources();
    }, []);

    const handleAddOrUpdateResource = async (e) => {
        e.preventDefault();
        if (!resourceName || !resourceAvailability) {
            toast.warning("Please fill in all fields.");
            return;
        }

        const newResource = {
            name: resourceName,
            type: resourceType,
            status: resourceStatus,
            availability: resourceAvailability,
        };

        try {
            if (isEditing) {
                const updatedResource = await updateResource(selectedResource.id, newResource);
                setResources(resources.map((resource) => resource.id === selectedResource.id ? updatedResource : resource));
                toast.success(`Resource updated: ${resourceName}`);
            } else {
                const addedResource = await createResource(newResource);
                setResources([...resources, addedResource]);
                toast.success(`New resource added: ${resourceName}`);
            }
            resetForm();
        } catch (error) {
            toast.error("Error saving resource.");
        }
    };

    const handleDeleteResource = async (id) => {
        try {
            const success = await deleteResource(id);
            if (success) {
                setResources(resources.filter((resource) => resource.id !== id));
                toast.success("Resource deleted.");
            }
        } catch (error) {
            toast.error("Error deleting resource.");
        }
    };

    const handleViewResource = (resource) => {
        setSelectedResource(resource);
        setShowModal(true);
    };

    const handleEditResource = (resource) => {
        setResourceName(resource.name);
        setResourceType(resource.type);
        setResourceStatus(resource.status);
        setResourceAvailability(resource.availability);
        setSelectedResource(resource);
        setIsEditing(true);
        setActiveTab("add");
    };

    const handleReserveResource = (resource) => {
        setSelectedResource(resource);
        setReservationDetails({
            resourceId: resource.id,
            resourceName: resource.name,
            reservedBy: "",
            reservationTime: "",
        });
        setShowModal(true);
    };

    const handleConfirmReservation = async () => {
        if (!reservationDetails.reservedBy || !reservationDetails.reservationTime) {
            toast.warning("Please fill in all fields.");
            return;
        }

        try {
            const updatedResource = { ...selectedResource, status: "Reserved" };
            await updateResource(selectedResource.id, updatedResource);
            toast.success(`Resource reserved: ${selectedResource.name}`);
            setShowModal(false);
        } catch (error) {
            toast.error("Error reserving resource.");
        }
    };

    const handleAddNewResource = () => {
        resetForm();
        setActiveTab("add");
    };

    const resetForm = () => {
        setResourceName("");
        setResourceType("Room");
        setResourceStatus("Available");
        setResourceAvailability("");
        setSelectedResource(null);
        setIsEditing(false);
    };

    return (
        <Container className="mt-5 text-light p-4 rounded">
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
            <Nav variant="tabs" activeKey={activeTab} className="mb-4">
                <Nav.Item>
                    <Nav.Link eventKey="resources" onClick={() => setActiveTab("resources")} className="text-light bg-secondary">
                        <FaList className="me-2" /> Resources
                    </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="add" onClick={() => setActiveTab("add")} className="text-light bg-secondary">
                        <FaPlus className="me-2" /> {isEditing ? "Edit Resource" : "Add Resource"}
                    </Nav.Link>
                </Nav.Item>
            </Nav>

            <Row>
                <Col md={8} className="mx-auto">
                    {activeTab === "resources" ? (
                        <>
                            <h2 className="mb-3">Resource List</h2>
                            {resources.length === 0 ? (
                                <div className="text-center text-warning">No resources available.</div>
                            ) : (
                                <ListGroup className="shadow-sm rounded">
                                    {resources.map((resource) => (
                                        <ListGroup.Item key={resource.id} className="d-flex justify-content-between align-items-center bg-secondary text-light">
                                            <div>
                                                <strong>{resource.name}</strong> <span className="badge bg-dark ms-2">{resource.type}</span>
                                                <br />
                                                <small className="text-light">Status: {resource.status}</small>
                                                <br />
                                                <small className="text-light">Availability: {resource.availability}</small>
                                            </div>
                                            <div>
                                                <Button variant="outline-light" size="sm" className="me-2" onClick={() => handleViewResource(resource)}>
                                                    <FaEye />
                                                </Button>
                                                <Button variant="outline-warning" size="sm" className="me-2" onClick={() => handleEditResource(resource)}>
                                                    <FaEdit />
                                                </Button>
                                                <Button variant="outline-danger" size="sm" className="me-2" onClick={() => handleDeleteResource(resource.id)}>
                                                    <FaTrash />
                                                </Button>
                                                <Button variant="outline-success" size="sm" onClick={() => handleReserveResource(resource)}>
                                                    <FaCheck /> Reserve
                                                </Button>
                                            </div>
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            )}
                        </>
                    ) : (
                        <>
                            <h2 className="mb-3">{isEditing ? "Edit Resource" : "Add Resource"}</h2>
                            <Form onSubmit={handleAddOrUpdateResource} className="shadow-sm p-4 rounded bg-secondary text-light">
                                <Form.Group className="mb-3">
                                    <Form.Label>Resource Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter resource name"
                                        value={resourceName}
                                        onChange={(e) => setResourceName(e.target.value)}
                                        className="bg-dark text-light"
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Resource Type</Form.Label>
                                    <Form.Select value={resourceType} onChange={(e) => setResourceType(e.target.value)} className="bg-dark text-light">
                                        <option value="Room">Room</option>
                                        <option value="Equipment">Equipment</option>
                                    </Form.Select>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Resource Status</Form.Label>
                                    <Form.Select value={resourceStatus} onChange={(e) => setResourceStatus(e.target.value)} className="bg-dark text-light">
                                        <option value="Available">Available</option>
                                        <option value="Reserved">Reserved</option>
                                    </Form.Select>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Availability</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter availability"
                                        value={resourceAvailability}
                                        onChange={(e) => setResourceAvailability(e.target.value)}
                                        className="bg-dark text-light"
                                    />
                                </Form.Group>

                                <Button variant="primary" type="submit" className="w-100">
                                    {isEditing ? "Update Resource" : "Add Resource"}
                                </Button>
                            </Form>
                        </>
                    )}
                </Col>
            </Row>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{selectedResource?.name}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p><strong>Type:</strong> {selectedResource?.type}</p>
                    <p><strong>Status:</strong> {selectedResource?.status}</p>
                    <p><strong>Availability:</strong> {selectedResource?.availability}</p>
                    {reservationDetails.resourceId && (
                        <>
                            <Form.Group className="mb-3">
                                <Form.Label>Reserved By</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter your name"
                                    value={reservationDetails.reservedBy}
                                    onChange={(e) => setReservationDetails({ ...reservationDetails, reservedBy: e.target.value })}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Reservation Time</Form.Label>
                                <Form.Control
                                    type="datetime-local"
                                    value={reservationDetails.reservationTime}
                                    onChange={(e) => setReservationDetails({ ...reservationDetails, reservationTime: e.target.value })}
                                />
                            </Form.Group>
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Close
                    </Button>
                    {reservationDetails.resourceId && (
                        <Button variant="primary" onClick={handleConfirmReservation}>
                            Confirm Reservation
                        </Button>
                    )}
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default ResourceManagement;