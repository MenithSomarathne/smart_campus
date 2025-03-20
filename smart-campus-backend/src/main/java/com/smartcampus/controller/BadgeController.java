package com.smartcampus.controller;

import com.smartcampus.model.Badge;
import com.smartcampus.service.BadgeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/badges")
@CrossOrigin("*")
public class BadgeController {

    @Autowired
    private BadgeService badgeService;

    @GetMapping
    public List<Badge> getAllBadges() {
        return badgeService.getAllBadges();
    }

    @GetMapping("/{badgeID}")
    public Optional<Badge> getBadgeById(@PathVariable Long badgeID) {
        return badgeService.getBadgeById(badgeID);
    }

    @PostMapping
    public Badge addBadge(@RequestBody Badge badge) {
        return badgeService.addBadge(badge);
    }

    @PutMapping("/{badgeID}")
    public Badge updateBadge(@PathVariable Long badgeID, @RequestBody Badge badge) {
        return badgeService.updateBadge(badgeID, badge);
    }

    @DeleteMapping("/{badgeID}")
    public void deleteBadge(@PathVariable Long badgeID) {
        badgeService.deleteBadge(badgeID);
    }
}
