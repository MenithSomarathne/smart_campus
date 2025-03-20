package com.smartcampus.service;

import com.smartcampus.model.Badge;
import com.smartcampus.repository.BadgeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BadgeService {

    @Autowired
    private BadgeRepository badgeRepository;

    // Get all badges
    public List<Badge> getAllBadges() {
        return badgeRepository.findAll();
    }

    // Get badge by ID
    public Optional<Badge> getBadgeById(Long badgeID) {
        return badgeRepository.findById(badgeID);
    }

    // Add a new badge
    public Badge addBadge(Badge badge) {
        if (badge.getCourseID() == null) {
            throw new IllegalArgumentException("Course ID is required!");
        }
        return badgeRepository.save(badge);
    }


    public Badge updateBadge(Long badgeID, Badge badge) {
        return badgeRepository.findById(badgeID).map(existingBadge -> {
            existingBadge.setBadgeName(badge.getBadgeName());
            existingBadge.setDescription(badge.getDescription());
            existingBadge.setCourseID(badge.getCourseID());
            return badgeRepository.save(existingBadge);
        }).orElse(null);
    }


    // Delete a badge
    public void deleteBadge(Long badgeID) {
        badgeRepository.deleteById(badgeID);
    }
}
