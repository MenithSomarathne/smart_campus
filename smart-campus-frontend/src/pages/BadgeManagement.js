import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, ListGroup, Alert, Badge, Modal, Nav, Dropdown } from "react-bootstrap";
import { FaTrash, FaEdit, FaEye, FaPlus, FaList } from "react-icons/fa";
import { getAllBadges, getBadgeById, createOrUpdateBadge, deleteBadge } from "../service/BadgeService";
import { getAllCourses } from "../service/CourseService";

const CourseBadgeManagement = () => {
    const [courses, setCourses] = useState([]);
    const [badges, setBadges] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [badgeName, setBadgeName] = useState("");
    const [badgeDescription, setBadgeDescription] = useState("");
    const [selectedBadge, setSelectedBadge] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [notification, setNotification] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [activeTab, setActiveTab] = useState("badges");

    const userRole = localStorage.getItem("role");

    useEffect(() => {
        const fetchBadges = async () => {
            try {
                const fetchedBadges = await getAllBadges();
                setBadges(fetchedBadges);
            } catch (error) {
                console.error("Error fetching badges:", error);
            }
        };

        const fetchCourses = async () => {
            try {
                const coursesData = await getAllCourses();
                setCourses(coursesData); // Set courses in state
            } catch (error) {
                console.error("Error fetching courses:", error);
            }
        };

        fetchBadges();
        fetchCourses();
    }, []);

    const handleAddOrUpdateBadge = async (e) => {
        e.preventDefault();

        if (userRole !== "ADMIN" && userRole !== "LECTURER") {
            alert("You do not have permission to perform this action.");
            return;
        }

        if (!badgeName || !badgeDescription || !selectedCourse) {
            alert("Please fill in all fields and select a course.");
            return;
        }

        const newBadge = {
            badgeID: isEditing ? selectedBadge.badgeID : null,
            badgeName,
            description: badgeDescription,
            courseID: selectedCourse.courseID,
        };

        try {
            if (isEditing) {
                const updatedBadge = await createOrUpdateBadge(newBadge);
                const updatedBadges = badges.map((badge) =>
                    badge.badgeID === selectedBadge.badgeID ? updatedBadge : badge
                );
                setBadges(updatedBadges);
                setNotification(`Badge updated: ${badgeName}`);
            } else {
                const createdBadge = await createOrUpdateBadge(newBadge);
                setBadges([...badges, createdBadge]);
                setNotification(`New badge added: ${badgeName}`);
            }
        } catch (error) {
            console.error("Error adding/updating badge:", error);
        }

        setTimeout(() => setNotification(""), 3000);

        setBadgeName("");
        setBadgeDescription("");
        setSelectedBadge(null);
        setIsEditing(false);
        setActiveTab("badges");
    };

    const handleDeleteBadge = async (badgeID) => {
        if (userRole !== "ADMIN" && userRole !== "LECTURER") {
            alert("You do not have permission to perform this action.");
            return;
        }

        try {
            await deleteBadge(badgeID);
            const updatedBadges = badges.filter((badge) => badge.badgeID !== badgeID);
            setBadges(updatedBadges);
            setNotification("Badge deleted.");
        } catch (error) {
            console.error("Error deleting badge:", error);
        }

        setTimeout(() => setNotification(""), 3000);
    };

    const handleEditBadge = (badge) => {
        if (userRole !== "ADMIN" && userRole !== "LECTURER") {
            alert("You do not have permission to perform this action.");
            return;
        }

        setBadgeName(badge.badgeName);
        setBadgeDescription(badge.description);
        setSelectedBadge(badge);
        setIsEditing(true);
        setActiveTab("add-badge");
    };

    const handleViewBadge = (badge) => {
        setSelectedBadge(badge);
        setShowModal(true);
    };

    const handleAddNewBadge = () => {
        if (userRole !== "ADMIN" && userRole !== "LECTURER") {
            alert("You do not have permission to perform this action.");
            return;
        }

        setBadgeName("");
        setBadgeDescription("");
        setSelectedBadge(null);
        setIsEditing(false);
        setActiveTab("add-badge");
    };

    const handleSelectCourse = (course) => {
        setSelectedCourse(course);
    };

    return (
        <Container className="mt-5">
            <Nav variant="tabs" activeKey={activeTab} className="mb-4 border-light">
                <Nav.Item>
                    <Nav.Link eventKey="badges" onClick={() => setActiveTab("badges")}>
                        <FaList className="me-2" /> Badges
                    </Nav.Link>
                </Nav.Item>
                {(userRole === "ADMIN" || userRole === "LECTURER") && (
                    <Nav.Item>
                        <Nav.Link eventKey="add-badge" onClick={handleAddNewBadge}>
                            <FaPlus className="me-2" /> {isEditing ? "Edit Badge" : "Add Badge"}
                        </Nav.Link>
                    </Nav.Item>
                )}
            </Nav>

            {notification && (
                <Alert variant="info" className="text-center shadow-sm">
                    {notification}
                </Alert>
            )}

            {activeTab === "badges" && (
                <>
                    <h2 className="mb-3 text-light">Badges</h2>
                    {badges.length === 0 ? (
                        <Alert variant="info" className="text-light">No badges available.</Alert>
                    ) : (
                        <ListGroup className="shadow-sm rounded bg-dark text-light">
                            {badges.map((badge) => (
                                <ListGroup.Item
                                    key={badge.badgeID}
                                    className="d-flex justify-content-between align-items-center bg-secondary"
                                >
                                    <div>
                                        <Badge bg="primary" className="me-2">
                                            {badge.badgeName}
                                        </Badge>
                                        <small className="text-muted">{badge.description}</small>
                                    </div>
                                    <div>
                                        <Button
                                            variant="outline-info"
                                            size="sm"
                                            className="me-2"
                                            onClick={() => handleViewBadge(badge)}
                                        >
                                            <FaEye />
                                        </Button>
                                        {(userRole === "ADMIN" || userRole === "LECTURER") && (
                                            <>
                                                <Button
                                                    variant="outline-warning"
                                                    size="sm"
                                                    className="me-2"
                                                    onClick={() => handleEditBadge(badge)}
                                                >
                                                    <FaEdit />
                                                </Button>
                                                <Button
                                                    variant="outline-danger"
                                                    size="sm"
                                                    onClick={() => handleDeleteBadge(badge.badgeID)}
                                                >
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
            )}

            {activeTab === "add-badge" && (
                <>
                    <h2 className="mb-3 text-light">{isEditing ? "Edit Badge" : "Add Badge"}</h2>
                    <Form onSubmit={handleAddOrUpdateBadge} className="shadow-sm p-4 rounded bg-dark text-light">
                        <Form.Group className="mb-3">
                            <Form.Label>Choose Course</Form.Label>
                            <Dropdown>
                                <Dropdown.Toggle variant="primary" id="dropdown-course" className="bg-secondary text-light border-light">
                                    {selectedCourse ? selectedCourse.courseName : "Select Course"}
                                </Dropdown.Toggle>
                                <Dropdown.Menu className="bg-dark text-light">
                                    {courses.map((course) => (
                                        <Dropdown.Item
                                            key={course.courseID}
                                            onClick={() => handleSelectCourse(course)}
                                            className="bg-dark text-light"
                                        >
                                            {course.courseName}
                                        </Dropdown.Item>
                                    ))}
                                </Dropdown.Menu>
                            </Dropdown>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Badge Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter badge name"
                                value={badgeName}
                                onChange={(e) => setBadgeName(e.target.value)}
                                className="bg-secondary text-light border-light"
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                placeholder="Enter badge description"
                                value={badgeDescription}
                                onChange={(e) => setBadgeDescription(e.target.value)}
                                className="bg-secondary text-light border-light"
                            />
                        </Form.Group>

                        <Button variant="primary" type="submit" className="w-100">
                            {isEditing ? "Update Badge" : "Add Badge"}
                        </Button>
                    </Form>
                </>
            )}

            <Modal show={showModal} onHide={() => setShowModal(false)} dialogClassName="bg-dark">
                <Modal.Header closeButton>
                    <Modal.Title>Badge Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedBadge && (
                        <>
                            <p><strong>Name:</strong> {selectedBadge.badgeName}</p>
                            <p><strong>Description:</strong> {selectedBadge.description}</p>
                            <p><strong>Course:</strong> {courses.find(course => course.courseID === selectedBadge.courseID)?.courseName}</p>
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

export default CourseBadgeManagement;