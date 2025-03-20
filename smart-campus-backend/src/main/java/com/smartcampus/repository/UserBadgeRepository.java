package com.smartcampus.repository;

import com.smartcampus.model.UserBadge;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserBadgeRepository extends JpaRepository<UserBadge, Long> {
    List<UserBadge> findByBadgeId(Long badgeId);

    List<UserBadge> findByUserId(Long userId);

}
