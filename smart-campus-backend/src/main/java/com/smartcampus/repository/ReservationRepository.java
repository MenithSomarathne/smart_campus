package com.smartcampus.repository;

import com.smartcampus.model.Reservation;
import com.smartcampus.model.ReservationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    List<Reservation> findByUserId(Long userId);
    List<Reservation> findAllByStatus(ReservationStatus status);

}
