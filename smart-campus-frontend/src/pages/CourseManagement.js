import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, ListGroup, Alert, Nav, Modal } from "react-bootstrap";
import { FaBook, FaList, FaTrash, FaEdit, FaEye } from "react-icons/fa";
import { getAllCourses, getCourseById, createOrUpdateCourse, deleteCourse } from "../service/CourseService";
import { getAllLectures } from "../service/UserManagementService";

const CourseManagement = () => {
    const [courseName, setCourseName] = useState("");
    const [description, setDescription] = useState("");
    const [credits, setCredits] = useState(0);
    const [departmentID, setDepartmentID] = useState("");
    const [assignedLecturer, setAssignedLecturer] = useState("");
    const [courses, setCourses] = useState([]);
    const [notification, setNotification] = useState("");
    const [activeTab, setActiveTab] = useState("courses");
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [departments, setDepartments] = useState([]);
    const [lecturers, setLecturers] = useState([]);

    const userRole = localStorage.getItem("role");

    useEffect(() => {
        fetchCourses();
        fetchDepartmentsAndLecturers();
    }, []);

    const fetchCourses = async () => {
        try {
            const data = await getAllCourses();
            setCourses(data);
        } catch (error) {
            setNotification("Error fetching courses.");
        }
    };

    const fetchDepartmentsAndLecturers = async () => {
        const departmentsData = [
            { department: "Computer Science" },
            { department: "Information Technology" },
            { department: "Software Engineering" }
        ];
        try {
            const lecturersData = await getAllLectures();
            setDepartments(departmentsData);
            setLecturers(lecturersData);
        } catch (error) {
            console.error("Error fetching lecturers:", error);
        }
    };

    const handleAddOrUpdateCourse = async (e) => {
        e.preventDefault();
        if (userRole !== "ADMIN" && userRole !== "LECTURER") {
            alert("You do not have permission to perform this action.");
            return;
        }

        if (!courseName || !description || !credits || !departmentID || !assignedLecturer) {
            alert("Please fill in all fields.");
            return;
        }

        const selectedLecturerObject = lecturers.find(
            (lecturer) => lecturer.name === assignedLecturer
        );

        if (selectedLecturerObject) {
            const newCourse = {
                courseName,
                description,
                credits,
                department: departmentID,
                assignedLecturer: {
                    id: selectedLecturerObject.id,
                    name: assignedLecturer
                }
            };

            try {
                if (isEditing) {
                    await createOrUpdateCourse({ ...newCourse, courseID: selectedCourse.courseID });
                    setNotification(`Course updated: ${courseName}`);
                } else {
                    await createOrUpdateCourse(newCourse);
                    setNotification(`New course added: ${courseName}`);
                }
                fetchCourses();
            } catch (error) {
                setNotification("Error saving course.");
            }

            setCourseName("");
            setDescription("");
            setCredits(0);
            setDepartmentID("");
            setAssignedLecturer("");
            setActiveTab("courses");
            setSelectedCourse(null);
            setIsEditing(false);
        } else {
            alert("Lecturer not found.");
        }
    };

    const handleDeleteCourse = async (courseID) => {
        if (userRole !== "ADMIN" && userRole !== "LECTURER") {
            alert("You do not have permission to perform this action.");
            return;
        }

        try {
            await deleteCourse(courseID);
            setNotification("Course deleted.");
            fetchCourses();
        } catch (error) {
            setNotification("Error deleting course.");
        }
    };

    const handleViewCourse = (course) => {
        setSelectedCourse(course);
        setShowModal(true);
    };

    const handleEditCourse = (course) => {
        if (userRole !== "ADMIN" && userRole !== "LECTURER") {
            alert("You do not have permission to perform this action.");
            return;
        }

        setCourseName(course.courseName);
        setDescription(course.description);
        setCredits(course.credits);
        setDepartmentID(course.department);
        setAssignedLecturer(course.assignedLecturer.name);
        setSelectedCourse(course);
        setIsEditing(true);
        setActiveTab("add");
    };

    const handleAddNewCourse = () => {
        // Check if the user has permission to add courses
        if (userRole !== "ADMIN" && userRole !== "LECTURER") {
            alert("You do not have permission to perform this action.");
            return;
        }

        setCourseName("");
        setDescription("");
        setCredits(0);
        setDepartmentID("");
        setAssignedLecturer("");
        setSelectedCourse(null);
        setIsEditing(false);
        setActiveTab("add");
    };

    return (
        <Container className="mt-5 text-light">
            <Nav variant="tabs" activeKey={activeTab} className="mb-4">
                <Nav.Item>
                    <Nav.Link eventKey="courses" onClick={() => setActiveTab("courses")}>
                        <FaList className="me-2" /> Courses
                    </Nav.Link>
                </Nav.Item>
                {(userRole === "ADMIN" || userRole === "LECTURER") && (
                    <Nav.Item>
                        <Nav.Link eventKey="add" onClick={handleAddNewCourse}>
                            <FaBook className="me-2" /> {isEditing ? "Edit Course" : "Add Course"}
                        </Nav.Link>
                    </Nav.Item>
                )}
            </Nav>

            <Row>
                <Col md={8} className="mx-auto">
                    {activeTab === "courses" ? (
                        <>
                            <h2 className="mb-3">Courses</h2>
                            {courses.length === 0 ? (
                                <Alert variant="info">No courses available.</Alert>
                            ) : (
                                <ListGroup className="shadow-sm rounded bg-secondary">
                                    {courses.map((course) => (
                                        <ListGroup.Item key={course.courseID} className="d-flex justify-content-between align-items-center bg-dark text-light">
                                            <div>
                                                <strong>{course.courseName}</strong> <span className="badge bg-secondary ms-2">{course.credits} Credits</span>
                                                <br />
                                                <small className="text-light">{course.description}</small>
                                                <br />
                                                <small className="text-light">Lecturer: {course.assignedLecturer.name}</small> {/* Access name here */}
                                            </div>
                                            <div>
                                                <Button variant="outline-info" size="sm" className="me-2" onClick={() => handleViewCourse(course)}>
                                                    <FaEye />
                                                </Button>
                                                {(userRole === "ADMIN" || userRole === "LECTURER") && (
                                                    <>
                                                        <Button variant="outline-warning" size="sm" className="me-2" onClick={() => handleEditCourse(course)}>
                                                            <FaEdit />
                                                        </Button>
                                                        <Button variant="outline-danger" size="sm" onClick={() => handleDeleteCourse(course.courseID)}>
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
                            <h2 className="mb-3">{isEditing ? "Edit Course" : "Add Course"}</h2>
                            <Form onSubmit={handleAddOrUpdateCourse} className="shadow-sm p-4 rounded bg-dark text-light">
                                <Form.Group className="mb-3">
                                    <Form.Label>Course Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter course name"
                                        value={courseName}
                                        onChange={(e) => setCourseName(e.target.value)}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Description</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        placeholder="Enter course description"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Credits</Form.Label>
                                    <Form.Control
                                        type="number"
                                        placeholder="Enter credits"
                                        value={credits}
                                        onChange={(e) => setCredits(e.target.value)}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Department</Form.Label>
                                    <Form.Select
                                        value={departmentID}
                                        onChange={(e) => setDepartmentID(e.target.value)}
                                    >
                                        <option value="">Select a department</option>
                                        {departments.map((department) => (
                                            <option key={department.department} value={department.department}>
                                                {department.department}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Assigned Lecturer</Form.Label>
                                    <Form.Select
                                        value={assignedLecturer}
                                        onChange={(e) => setAssignedLecturer(e.target.value)}
                                    >
                                        <option value="">Select a lecturer</option>
                                        {lecturers.map((lecturer) => (
                                            <option key={lecturer.id} value={lecturer.name}>
                                                {lecturer.name}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>

                                <Button variant="primary" type="submit" className="w-100">
                                    {isEditing ? "Update Course" : "Add Course"}
                                </Button>
                            </Form>
                        </>
                    )}
                </Col>
            </Row>

            {notification && (
                <Alert variant="info" className="mt-4 text-center shadow-sm">{notification}</Alert>
            )}

            {/* View Course Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)} dialogClassName="bg-dark">
                <Modal.Header closeButton>
                    <Modal.Title>Course Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedCourse && (
                        <>
                            <p><strong>Name:</strong> {selectedCourse.courseName}</p>
                            <p><strong>Description:</strong> {selectedCourse.description}</p>
                            <p><strong>Credits:</strong> {selectedCourse.credits}</p>
                            <p><strong>Department ID:</strong> {selectedCourse.departmentID}</p>
                            <p><strong>Lecturer:</strong> {selectedCourse.assignedLecturer.name}</p>
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

export default CourseManagement;