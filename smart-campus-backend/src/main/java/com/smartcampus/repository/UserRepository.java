package com.smartcampus.repository;


import com.smartcampus.model.Role;
import com.smartcampus.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findById(Long id);
    List<User> findByRole(Role role);

    @Query("SELECT u.email FROM User u WHERE u.id IN " +
            "(SELECT ub.userId FROM UserBadge ub WHERE ub.badgeId = :badgeId)")
    List<String> findEmailsByBadgeId(@Param("badgeId") Long badgeId);
}
