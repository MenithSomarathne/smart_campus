package com.smartcampus.service;

import com.smartcampus.model.Reservation;
import com.smartcampus.model.ReservationStatus;
import com.smartcampus.model.Resource;
import com.smartcampus.repository.ReservationRepository;
import com.smartcampus.repository.ResourceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ReservationService {

    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private ResourceRepository resourceRepository;

    public List<Reservation> getAllReservations() {
        return reservationRepository.findAll();
    }

    public List<Reservation> getReservationsByUser(Long userId) {
        return reservationRepository.findByUserId(userId);
    }

    public Reservation createOrUpdateReservation(Reservation reservation) {
        return reservationRepository.save(reservation);
    }

    public void deleteReservation(Long reservationId) {
        reservationRepository.deleteById(reservationId);
    }

    public Reservation getReservationById(Long reservationId) {
        return reservationRepository.findById(reservationId).orElse(null);
    }

    @Scheduled(fixedRate = 60000)
    public void checkAndUpdateResourceStatus() {
        List<Reservation> activeReservations = reservationRepository.findAllByStatus(ReservationStatus.ACTIVE);

        for (Reservation reservation : activeReservations) {
            if (reservation.getEndTime().isBefore(LocalDateTime.now())) {
                Resource resource = reservation.getResource();
                if (!"Available".equals(resource.getStatus())) {
                    resource.setStatus("Available");
                    resourceRepository.save(resource);
                    System.out.println("Resource " + resource.getName() + " is now available.");
                }

                reservation.setStatus(ReservationStatus.COMPLETED);
                reservationRepository.save(reservation);
            }
        }
    }
}
