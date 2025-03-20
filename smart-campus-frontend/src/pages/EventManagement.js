import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, ListGroup, Nav, Modal } from "react-bootstrap";
import { FaCalendarPlus, FaList, FaTrash, FaEdit, FaEye } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getAllEvents, updateEvent, createEvent, deleteEvent } from "../service/EventService";
import { getAllResources } from "../service/ResourceManagementService";
import { getAllBadges } from "../service/BadgeService";

const EventManagement = () => {
    const [eventName, setEventName] = useState("");
    const [eventDate, setEventDate] = useState("");
    const [eventType, setEventType] = useState("class");
    const [resourceName, setResourceName] = useState("");
    const [badge, setBadge] = useState("");
    const [events, setEvents] = useState([]);
    const [resources, setResources] = useState([]);
    const [badges, setBadges] = useState([]);
    const [activeTab, setActiveTab] = useState("events");
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const userRole = localStorage.getItem("role");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const eventsData = await getAllEvents();
                const resourcesData = await getAllResources();
                const badgesData = await getAllBadges();
                setEvents(eventsData);
                setResources(resourcesData);
                setBadges(badgesData);
            } catch (error) {
                toast.error("Error fetching data. Please try again later.");
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, []);

    const handleAddOrUpdateEvent = async (e) => {
        e.preventDefault();

        if (userRole !== "ADMIN" && userRole !== "LECTURER") {
            toast.error("You do not have permission to perform this action.");
            return;
        }

        if (!eventName || !eventDate || !resourceName || !badge) {
            toast.warning("Please fill in all fields.");
            return;
        }

        const newEvent = {
            name: eventName,
            date: eventDate,
            type: eventType,
            resource: {
                id: resourceName,
            },
            badge: {
                badgeID: badge,
            },
        };

        try {
            if (isEditing) {
                const updatedEvent = await updateEvent(selectedEvent.id, newEvent);
                setEvents(events.map((event) => (event.id === selectedEvent.id ? updatedEvent : event)));
                toast.success(`Event updated: ${eventName}`);
            } else {
                const createdEvent = await createEvent(newEvent);
                setEvents([...events, createdEvent]);
                toast.success(`New event added: ${eventName}`);
            }

            setEventName("");
            setEventDate("");
            setEventType("class");
            setResourceName("");
            setBadge("");
            setActiveTab("events");
            setSelectedEvent(null);
            setIsEditing(false);
        } catch (error) {
            toast.error("Error saving event. Please try again.");
            console.error("Error saving event:", error);
        }
    };

    const handleDeleteEvent = async (id) => {
        if (userRole !== "ADMIN" && userRole !== "LECTURER") {
            toast.error("You do not have permission to perform this action.");
            return;
        }

        try {
            await deleteEvent(id);
            setEvents(events.filter((event) => event.id !== id));
            toast.success("Event deleted successfully.");
        } catch (error) {
            toast.error("Error deleting event. Please try again.");
            console.error("Error deleting event:", error);
        }
    };

    const handleViewEvent = (event) => {
        setSelectedEvent(event);
        setShowModal(true);
    };

    const handleEditEvent = (event) => {
        if (userRole !== "ADMIN" && userRole !== "LECTURER") {
            toast.error("You do not have permission to perform this action.");
            return;
        }

        setEventName(event.name);
        setEventDate(event.date);
        setEventType(event.type);
        setResourceName(event.resource.id);
        setBadge(event.badge.badgeID);
        setSelectedEvent(event);
        setIsEditing(true);
        setActiveTab("add");
    };

    const handleAddNewEvent = () => {
        if (userRole !== "ADMIN" && userRole !== "LECTURER") {
            toast.error("You do not have permission to perform this action.");
            return;
        }

        setEventName("");
        setEventDate("");
        setEventType("class");
        setResourceName("");
        setBadge("");
        setSelectedEvent(null);
        setIsEditing(false);
        setActiveTab("add");
    };

    useEffect(() => {
        const interval = setInterval(() => {
            if (events.length > 0) {
                const randomEvent = events[Math.floor(Math.random() * events.length)];
                toast.info(
                    <div>
                        <strong>Reminder:</strong> {randomEvent.name} is coming up on{" "}
                        {new Date(randomEvent.date).toLocaleString()}
                    </div>,
                    {
                        autoClose: 10000,
                        position: 'bottom-right',
                    }
                );
            }
        }, 15000);

        return () => clearInterval(interval);
    }, [events]);

    return (
        <Container className="mt-5">
            <ToastContainer />

            <Nav variant="tabs" activeKey={activeTab} className="mb-4 border-light">
                <Nav.Item>
                    <Nav.Link eventKey="events" onClick={() => setActiveTab("events")}>
                        <FaList className="me-2" /> Scheduled Events
                    </Nav.Link>
                </Nav.Item>
                {(userRole === "ADMIN" || userRole === "LECTURER") && (
                    <Nav.Item>
                        <Nav.Link eventKey="add" onClick={handleAddNewEvent}>
                            <FaCalendarPlus className="me-2" /> {isEditing ? "Edit Event" : "Add Event"}
                        </Nav.Link>
                    </Nav.Item>
                )}
            </Nav>

            <Row>
                <Col md={8} className="mx-auto">
                    {activeTab === "events" ? (
                        <>
                            <h2 className="mb-3 text-light">Scheduled Events</h2>
                            {events.length === 0 ? (
                                <div className="text-center text-muted">No events scheduled yet.</div>
                            ) : (
                                <ListGroup className="shadow-sm rounded bg-dark text-light">
                                    {events.map((event) => (
                                        <ListGroup.Item key={event.id} className="d-flex justify-content-between align-items-center bg-secondary">
                                            <div>
                                                <strong>{event.name}</strong> <span className="badge bg-secondary ms-2">{event.type}</span>
                                                <br />
                                                <small className="text-muted">{new Date(event.date).toLocaleString()}</small>
                                                <br />
                                                <small className="text-muted">Resource: {event.resource.name}</small>
                                                <br />
                                                <small className="text-muted">Badge: {event.badge.badgeName}</small>
                                            </div>
                                            <div>
                                                <Button variant="outline-info" size="sm" className="me-2" onClick={() => handleViewEvent(event)}>
                                                    <FaEye />
                                                </Button>
                                                {(userRole === "ADMIN" || userRole === "LECTURER") && (
                                                    <>
                                                        <Button variant="outline-warning" size="sm" className="me-2" onClick={() => handleEditEvent(event)}>
                                                            <FaEdit />
                                                        </Button>
                                                        <Button variant="outline-danger" size="sm" onClick={() => handleDeleteEvent(event.id)}>
                                                            <FaTrash />
                                                        </Button>
                                                    </>
                                                )}
                                            </div>
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            )}
                        </>
                    ) : (
                        <>
                            <h2 className="mb-3 text-light">{isEditing ? "Edit Event" : "Add Event"}</h2>
                            <Form onSubmit={handleAddOrUpdateEvent} className="shadow-sm p-4 rounded bg-dark text-light">
                                <Form.Group className="mb-3">
                                    <Form.Label>Event Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter event name"
                                        value={eventName}
                                        onChange={(e) => setEventName(e.target.value)}
                                        className="bg-secondary text-light border-light"
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Event Date</Form.Label>
                                    <Form.Control
                                        type="datetime-local"
                                        value={eventDate}
                                        onChange={(e) => setEventDate(e.target.value)}
                                        className="bg-secondary text-light border-light"
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Event Type</Form.Label>
                                    <Form.Select value={eventType} onChange={(e) => setEventType(e.target.value)} className="bg-secondary text-light border-light">
                                        <option value="class">Class</option>
                                        <option value="workshop">Workshop</option>
                                        <option value="meeting">Meeting</option>
                                        <option value="other">Other</option>
                                    </Form.Select>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Resource Name</Form.Label>
                                    <Form.Select
                                        value={resourceName}
                                        onChange={(e) => setResourceName(e.target.value)}
                                        className="bg-secondary text-light border-light"
                                    >
                                        <option value="">Select a resource</option>
                                        {resources.map((resource, index) => (
                                            <option key={index} value={resource.id}>
                                                {resource.name}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Badge</Form.Label>
                                    <Form.Select
                                        value={badge}
                                        onChange={(e) => setBadge(e.target.value)}
                                        className="bg-secondary text-light border-light"
                                    >
                                        <option value="">Select a badge</option>
                                        {badges.map((badge, index) => (
                                            <option key={index} value={badge.badgeID}>
                                                {badge.badgeName}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>

                                <Button variant="primary" type="submit" className="w-100">
                                    {isEditing ? "Update Event" : "Add Event"}
                                </Button>
                            </Form>
                        </>
                    )}
                </Col>
            </Row>

            <Modal show={showModal} onHide={() => setShowModal(false)} dialogClassName="bg-dark">
                <Modal.Header closeButton>
                    <Modal.Title>Event Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedEvent && (
                        <>
                            <p><strong>Name:</strong> {selectedEvent.name}</p>
                            <p><strong>Type:</strong> {selectedEvent.type}</p>
                            <p><strong>Date:</strong> {new Date(selectedEvent.date).toLocaleString()}</p>
                            <p><strong>Resource:</strong> {selectedEvent.resource.name}</p>
                            <p><strong>Badge:</strong> {selectedEvent.badge.badgeName}</p>
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

export default EventManagement;