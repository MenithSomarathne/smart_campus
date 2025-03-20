package com.smartcampus.controller;

import com.smartcampus.dto.UserScheduleDTO;
import com.smartcampus.service.UserScheduleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class UserScheduleController {

    @Autowired
    private UserScheduleService userScheduleService;

    @GetMapping("/userSchedule-by-email")
    public ResponseEntity<?> getUserScheduleByEmail(@RequestParam String email) {
        try {
            UserScheduleDTO userSchedule = userScheduleService.getUserScheduleByEmail(email);
            return ResponseEntity.ok(userSchedule);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found: " + email);
        }
    }
}
