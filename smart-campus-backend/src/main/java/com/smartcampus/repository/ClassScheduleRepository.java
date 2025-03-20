package com.smartcampus.repository;

import com.smartcampus.model.Badge;
import com.smartcampus.model.ClassSchedule;
import com.smartcampus.model.Reservation;
import com.smartcampus.model.ReservationStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ClassScheduleRepository extends JpaRepository<ClassSchedule, Long> {

    List<ClassSchedule> findAllByStatus(String status);

    List<ClassSchedule> findByBadge(Badge badge);

}
