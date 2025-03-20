package com.smartcampus.model;

import jakarta.persistence.*;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.time.LocalDateTime;

@Entity
@Table(name = "events")
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private LocalDateTime date;
    private String type;
    @ManyToOne
    @JoinColumn(name = "resourceID", nullable = false)
    private Resource resource;
    @ManyToOne
    @JoinColumn(name = "badgeID", nullable = false)
    private Badge badge;

    public Event() {
    }

    public Event(Long id, String name, LocalDateTime date, String type, Resource resource, Badge badge) {
        this.id = id;
        this.name = name;
        this.date = date;
        this.type = type;
        this.resource = resource;
        this.badge = badge;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public LocalDateTime getDate() {
        return date;
    }

    public void setDate(LocalDateTime date) {
        this.date = date;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Resource getResource() {
        return resource;
    }

    public void setResource(Resource resource) {
        this.resource = resource;
    }

    public Badge getBadge() {
        return badge;
    }

    public void setBadge(Badge badge) {
        this.badge = badge;
    }
}
