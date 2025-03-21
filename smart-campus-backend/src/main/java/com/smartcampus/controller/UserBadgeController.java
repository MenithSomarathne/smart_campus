package com.smartcampus.controller;

import com.smartcampus.service.UserBadgeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user-badges")
@CrossOrigin("*")
public class UserBadgeController {

    @Autowired
    private UserBadgeService userBadgeService;

    @PostMapping("/assign")
    public ResponseEntity<String> assignBadge(@RequestParam Long userId, @RequestParam Long badgeId) {
        try {
            userBadgeService.assignBadgeToUser(userId, badgeId);
            return ResponseEntity.ok("Badge assigned successfully!");
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }
}
