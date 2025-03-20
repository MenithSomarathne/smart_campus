package com.smartcampus.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
public class ClassSchedule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long scheduleID;

    private String name;
    @ManyToOne
    @JoinColumn(name = "lecturerID", nullable = false)
    private User lecturer;

    @ManyToOne
    @JoinColumn(name = "badgeID", nullable = false)
    private Badge badge;

    @ManyToOne
    @JoinColumn(name = "resourceID", nullable = false)
    private Resource resource;

    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String status;


    public ClassSchedule(Long scheduleID, String name, User lecturer, Badge badge, Resource resource, LocalDateTime startTime, LocalDateTime endTime, String status) {
        this.scheduleID = scheduleID;
        this.name = name;
        this.lecturer = lecturer;
        this.badge = badge;
        this.resource = resource;
        this.startTime = startTime;
        this.endTime = endTime;
        this.status = status;
    }

    public Long getScheduleID() {
        return scheduleID;
    }

    public void setScheduleID(Long scheduleID) {
        this.scheduleID = scheduleID;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public User getLecturer() {
        return lecturer;
    }

    public void setLecturer(User lecturer) {
        this.lecturer = lecturer;
    }

    public Badge getBadge() {
        return badge;
    }

    public void setBadge(Badge badge) {
        this.badge = badge;
    }

    public Resource getResource() {
        return resource;
    }

    public void setResource(Resource resource) {
        this.resource = resource;
    }

    public LocalDateTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalDateTime startTime) {
        this.startTime = startTime;
    }

    public LocalDateTime getEndTime() {
        return endTime;
    }

    public void setEndTime(LocalDateTime endTime) {
        this.endTime = endTime;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public ClassSchedule() {
    }
}
