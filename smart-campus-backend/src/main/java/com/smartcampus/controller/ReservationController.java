package com.smartcampus.controller;

import com.smartcampus.model.Reservation;
import com.smartcampus.model.ReservationStatus;
import com.smartcampus.model.Resource;
import com.smartcampus.service.ReservationService;
import com.smartcampus.service.ResourceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reservations")
@CrossOrigin("*")
public class ReservationController {

    @Autowired
    private ReservationService reservationService;

    @Autowired
    private ResourceService resourceService;
    @GetMapping
    public List<Reservation> getAllReservations() {
        return reservationService.getAllReservations();
    }

    @GetMapping("/{id}")
    public Reservation getReservationById(@PathVariable Long id) {
        return reservationService.getReservationById(id);
    }

    @PostMapping
    public Reservation createReservation(@RequestBody Reservation reservation) {
        Resource resource = reservation.getResource();
        if ("Available".equals(resource.getStatus())) {
            resource.setStatus("Unavailable");
        }
        resourceService.updateResource(resource.getId(),resource);
        return reservationService.createOrUpdateReservation(reservation);
    }


    @PutMapping("/{id}")
    public Reservation updateReservation(@PathVariable Long id, @RequestBody Reservation reservation) {
        reservation.setId(id);
        return reservationService.createOrUpdateReservation(reservation);
    }

    @DeleteMapping("/{id}")
    public void deleteReservation(@PathVariable Long id) {
        reservationService.deleteReservation(id);
    }
}
