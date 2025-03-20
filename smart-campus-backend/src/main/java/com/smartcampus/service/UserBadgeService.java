package com.smartcampus.service;

import com.smartcampus.model.Badge;
import com.smartcampus.model.User;
import com.smartcampus.model.UserBadge;
import com.smartcampus.repository.BadgeRepository;
import com.smartcampus.repository.UserBadgeRepository;
import com.smartcampus.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class UserBadgeService {

    @Autowired
    private UserBadgeRepository userBadgeRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BadgeRepository badgeRepository;

    public UserBadge assignBadgeToUser(Long userId, Long badgeId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Badge badge = badgeRepository.findById(badgeId)
                .orElseThrow(() -> new RuntimeException("Badge not found"));

        UserBadge userBadge = new UserBadge();
        userBadge.setUserId(user.getId());
        userBadge.setBadgeId(badge.getBadgeID());
        userBadge.setAssignedAt(LocalDateTime.now());

        return userBadgeRepository.save(userBadge);
    }
}
