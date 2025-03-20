package com.smartcampus.model;

import jakarta.persistence.*;

@Entity
public class Course {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long courseID;
    private String courseName;
    private String description;
    private int credits;
    private String department;

    @ManyToOne
    @JoinColumn(name = "assigned_lecturer_id", nullable = false)
    private User assignedLecturer;

    public Course(Long courseID, String courseName, String description, int credits, String department, User assignedLecturer) {
        this.courseID = courseID;
        this.courseName = courseName;
        this.description = description;
        this.credits = credits;
        this.department = department;
        this.assignedLecturer = assignedLecturer;
    }

    public Long getCourseID() {
        return courseID;
    }

    public void setCourseID(Long courseID) {
        this.courseID = courseID;
    }

    public String getCourseName() {
        return courseName;
    }

    public void setCourseName(String courseName) {
        this.courseName = courseName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public int getCredits() {
        return credits;
    }

    public void setCredits(int credits) {
        this.credits = credits;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public User getAssignedLecturer() {
        return assignedLecturer;
    }

    public void setAssignedLecturer(User assignedLecturer) {
        this.assignedLecturer = assignedLecturer;
    }

    public Course() {
    }
}
