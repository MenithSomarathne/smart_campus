package com.smartcampus.repository;

import com.smartcampus.model.Badge;
import com.smartcampus.model.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    List<Event> findByBadge(Badge badge);

}
