package com.smartcampus.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "user_badge")
public class UserBadge {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;

    private Long badgeId;

    private LocalDateTime assignedAt = LocalDateTime.now();

    public UserBadge() {}

    public UserBadge(Long id, Long userId, Long badgeId, LocalDateTime assignedAt) {
        this.id = id;
        this.userId = userId;
        this.badgeId = badgeId;
        this.assignedAt = assignedAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getBadgeId() {
        return badgeId;
    }

    public void setBadgeId(Long badgeId) {
        this.badgeId = badgeId;
    }

    public LocalDateTime getAssignedAt() {
        return assignedAt;
    }

    public void setAssignedAt(LocalDateTime assignedAt) {
        this.assignedAt = assignedAt;
    }
}
