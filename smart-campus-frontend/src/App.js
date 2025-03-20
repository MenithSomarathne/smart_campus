import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Home from "./pages/Home";
import Login from "./pages/Login";
import EventManagement from "./pages/EventManagement";
import ResourceManagement from "./pages/ResourceManagement";
import CourseManagement from "./pages/CourseManagement";
import BadgeManagement from "./pages/BadgeManagement";
import ReservationManagement from "./pages/ReservationManagement";
import ClassScheduleManagement from "./pages/ClassScheduleManagement";
import UserManagement from "./pages/UserManagement";
import UserBadgeManagement from "./pages/UserBadgeMangement";
import ProfileManagement from "./pages/ProfileManagement";
import AdminDashboard from "./pages/Admin-Dashboard";
import LecturerDashboard from "./pages/Lecturer-Dashboard";
import StudentDashboard from "./pages/Student-Dashboard";

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [role, setRole] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("authToken");
        const storedRole = localStorage.getItem("role");
        if (token && storedRole) {
            setIsAuthenticated(true);
            setRole(storedRole);
        }
    }, []);

    return (
        <Router>
            <Routes>
                {!isAuthenticated ? (
                    <>
                        <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} setRole={setRole} />} />
                        <Route path="*" element={<Navigate to="/login" />} />
                    </>
                ) : (
                    <>
                        {role === "STUDENT" && (
                            <Route path="/" element={<Home role={role} setIsAuthenticated={setIsAuthenticated} />}>
                                <Route index element={<Navigate to="/events" />} />
                                <Route path="events" element={<EventManagement />} />
                                <Route path="resources" element={<ResourceManagement />} />
                                <Route path="course" element={<CourseManagement />} />
                                <Route path="badge" element={<BadgeManagement />} />
                                <Route path="reservation" element={<ReservationManagement />} />
                                <Route path="classschedule" element={<ClassScheduleManagement />} />
                                <Route path="profile" element={<ProfileManagement />} />
                                <Route path="user" element={<UserManagement />} />
                                <Route path="student-dashboard" element={<StudentDashboard />} />
                                <Route path="*" element={<Navigate to="/student-dashboard" />} />
                            </Route>
                        )}

                        {role === "LECTURER" && (
                            <Route path="/" element={<Home role={role} setIsAuthenticated={setIsAuthenticated} />}>
                                <Route index element={<Navigate to="/events" />} />
                                <Route path="events" element={<EventManagement />} />
                                <Route path="resources" element={<ResourceManagement />} />
                                <Route path="course" element={<CourseManagement />} />
                                <Route path="reservation" element={<ReservationManagement />} />
                                <Route path="classschedule" element={<ClassScheduleManagement />} />
                                <Route path="user" element={<UserManagement />} />
                                <Route path="profile" element={<ProfileManagement />} />
                                <Route path="lecturer-dashboard" element={<LecturerDashboard />} />
                                <Route path="*" element={<Navigate to="/lecturer-dashboard" />} />
                            </Route>
                        )}

                        {role === "ADMIN" && (
                            <Route path="/" element={<Home role={role} setIsAuthenticated={setIsAuthenticated} />}>
                                <Route index element={<Navigate to="/events" />} />
                                <Route path="events" element={<EventManagement />} />
                                <Route path="resources" element={<ResourceManagement />} />
                                <Route path="course" element={<CourseManagement />} />
                                <Route path="badge" element={<BadgeManagement />} />
                                <Route path="reservation" element={<ReservationManagement />} />
                                <Route path="classschedule" element={<ClassScheduleManagement />} />
                                <Route path="user" element={<UserManagement />} />
                                <Route path="userbadge" element={<UserBadgeManagement />} />
                                <Route path="profile" element={<ProfileManagement />} />
                                <Route path="admin-dashboard" element={<AdminDashboard />} />
                                <Route path="userbadge" element={<UserBadgeManagement />} />
                                <Route path="*" element={<Navigate to="/admin-dashboard" />} />
                            </Route>
                        )}
                    </>
                )}
            </Routes>
        </Router>
    );
};

export default App;