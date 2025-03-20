import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, ListGroup, Alert, Nav, Modal } from "react-bootstrap";
import { FaTrash, FaEdit, FaEye, FaPlus, FaList } from "react-icons/fa";
import {addUser, getAllUsers, updateUser} from "../service/UserManagementService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [activeTab, setActiveTab] = useState("users");

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("ADMIN");
    const [phone, setPhone] = useState("");
    const [profilePicture, setProfilePicture] = useState("");
    const [status, setStatus] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const usersData = await getAllUsers();
                setUsers(usersData);
            } catch (error) {
                console.error("Error fetching users:", error);
                toast.error("Failed to fetch users. Please try again.");
            }
        };

        fetchUsers();
    }, []);

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfilePicture(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAddOrUpdateUser = async (e) => {
        e.preventDefault();
        if (!name || !email || !password || !role || !phone) {
            toast.error("Please fill in all fields.");
            return;
        }

        const newUser = {
            name,
            email,
            password,
            role,
            phone,
            profilePicture: profilePicture || "https://via.placeholder.com/150",
            status,
        };

        try {
            if (isEditing) {
                console.log("selectedUser", selectedUser);
                const updatedUser = await updateUser(selectedUser.id, newUser);
                const updatedUsers = users.map((user) =>
                    user.id === updatedUser.id ? updatedUser : user
                );
                setUsers(updatedUsers);
                toast.success(`User updated: ${updatedUser.name}`);
            } else {
                const addedUser = await addUser(newUser);
                setUsers([...users, newUser]);
                toast.success(`New user added: ${addedUser.name}`);
            }

            setName("");
            setEmail("");
            setPassword("");
            setRole("ADMIN");
            setPhone("");
            setProfilePicture("");
            setStatus(true);
            setSelectedUser(null);
            setIsEditing(false);
            setActiveTab("users");
        } catch (error) {
            console.error("Error saving user:", error);
            toast.error("Failed to save user. Please try again.");
        }
    };

    const handleDeleteUser = (userID) => {
        const updatedUsers = users.filter((user) => user.userID !== userID);
        setUsers(updatedUsers);
        toast.success("User deleted.");
    };

    const handleEditUser = (user) => {
        setName(user.name);
        setEmail(user.email);
        setPassword(user.password);
        setRole(user.role);
        setPhone(user.phone);
        setProfilePicture(user.profilePicture);
        setStatus(user.status);
        setSelectedUser(user);
        setIsEditing(true);
        setActiveTab("add-user");
    };

    const handleViewUser = (user) => {
        setSelectedUser(user);
        setShowModal(true);
    };

    const handleAddNewUser = () => {
        setName("");
        setEmail("");
        setPassword("");
        setRole("ADMIN");
        setPhone("");
        setProfilePicture("");
        setStatus(true);
        setSelectedUser(null);
        setIsEditing(false);
        setActiveTab("add-user");
    };

    return (
        <Container className="mt-5 p-4 rounded text-light">
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick />

            <Nav variant="tabs" activeKey={activeTab} className="mb-4">
                <Nav.Item>
                    <Nav.Link eventKey="users" onClick={() => setActiveTab("users")}>
                        <FaList className="me-2" /> Users
                    </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="add-user" onClick={() => setActiveTab("add-user")}>
                        <FaPlus className="me-2" /> {isEditing ? "Edit User" : "Add User"}
                    </Nav.Link>
                </Nav.Item>
            </Nav>

            {activeTab === "users" && (
                <>
                    <h2 className="mb-3 text-light">Users</h2>
                    {users.length === 0 ? (
                        <Alert variant="info" className="bg-secondary text-light">No users available.</Alert>
                    ) : (
                        <ListGroup className="shadow-sm rounded">
                            {users.map((user) => (
                                <ListGroup.Item key={user.userID} className="d-flex justify-content-between align-items-center bg-dark text-light border-secondary">
                                    <div>
                                        <strong>{user.name}</strong>
                                        <br />
                                        <small className="text-light">Email: {user.email}</small>
                                        <br />
                                        <small className="text-light">Role: {user.role}</small>
                                        <br />
                                        <small className="text-light">Status: {user.status ? "Active" : "Inactive"}</small>
                                    </div>
                                    <div>
                                        <Button variant="outline-info" size="sm" className="me-2" onClick={() => handleViewUser(user)}>
                                            <FaEye />
                                        </Button>
                                        <Button variant="outline-warning" size="sm" className="me-2" onClick={() => handleEditUser(user)}>
                                            <FaEdit />
                                        </Button>
                                        <Button variant="outline-danger" size="sm" onClick={() => handleDeleteUser(user.userID)}>
                                            <FaTrash />
                                        </Button>
                                    </div>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    )}
                </>
            )}

            {activeTab === "add-user" && (
                <>
                    <h2 className="mb-3 text-light">{isEditing ? "Edit User" : "Add User"}</h2>
                    <Form onSubmit={handleAddOrUpdateUser} className="shadow-sm p-4 rounded bg-secondary text-light">
                        <Form.Group className="mb-3">
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="text" className="bg-dark text-light" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter name" />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" className="bg-dark text-light" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter email" />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" className="bg-dark text-light" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter password" />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Role</Form.Label>
                            <Form.Select className="bg-dark text-light" value={role} onChange={(e) => setRole(e.target.value)}>
                                <option value="ADMIN">ADMIN</option>
                                <option value="LECTURER">LECTURER</option>
                                <option value="STUDENT">STUDENT</option>
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Phone</Form.Label>
                            <Form.Control type="text" className="bg-dark text-light" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Enter phone number" />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Profile Picture</Form.Label>
                            <div className="d-flex flex-column align-items-start">
                                <Form.Control type="file" accept="image/*" className="bg-dark text-light" onChange={handleFileUpload} />
                                {profilePicture && (
                                    <img src={profilePicture} alt="Profile Preview" className="mt-2 rounded-circle" style={{ width: "100px", height: "100px", objectFit: "cover" }} />
                                )}
                            </div>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Status</Form.Label>
                            <Form.Select className="bg-dark text-light" value={status} onChange={(e) => setStatus(e.target.value === "true")}>
                                <option value={true}>Active</option>
                                <option value={false}>Inactive</option>
                            </Form.Select>
                        </Form.Group>

                        <Button variant="primary" type="submit" className="w-100">
                            {isEditing ? "Update User" : "Add User"}
                        </Button>
                    </Form>
                </>
            )}

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton className="bg-dark text-light">
                    <Modal.Title>User Details</Modal.Title>
                </Modal.Header>
                <Modal.Body className="bg-secondary text-light">
                    {selectedUser && (
                        <>
                            <p><strong>Name:</strong> {selectedUser.name}</p>
                            <p><strong>Email:</strong> {selectedUser.email}</p>
                            <p><strong>Role:</strong> {selectedUser.role}</p>
                            <p><strong>Phone:</strong> {selectedUser.phone}</p>
                            <p><strong>Status:</strong> {selectedUser.status ? "Active" : "Inactive"}</p>
                            {selectedUser.profilePicture && <img src={selectedUser.profilePicture} alt="Profile" className="rounded-circle mt-2" style={{ width: "100px", height: "100px" }} />}
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer className="bg-dark">
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default UserManagement;