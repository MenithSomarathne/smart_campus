package com.smartcampus.dto;

import com.smartcampus.model.ClassSchedule;
import com.smartcampus.model.Event;
import com.smartcampus.model.User;

import java.util.List;

public class UserScheduleDTO {

    private User user;
    private List<ClassSchedule> classSchedules;
    private List<Event> events;

    public UserScheduleDTO(User user, List<ClassSchedule> classSchedules, List<Event> events) {
        this.user = user;
        this.classSchedules = classSchedules;
        this.events = events;
    }

    // Getters and setters
    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public List<ClassSchedule> getClassSchedules() {
        return classSchedules;
    }

    public void setClassSchedules(List<ClassSchedule> classSchedules) {
        this.classSchedules = classSchedules;
    }

    public List<Event> getEvents() {
        return events;
    }

    public void setEvents(List<Event> events) {
        this.events = events;
    }
}
