package com.smartcampus.service;

import com.smartcampus.dto.UserScheduleDTO;
import com.smartcampus.model.*;
import com.smartcampus.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class UserScheduleService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserBadgeRepository userBadgeRepository;

    @Autowired
    private ClassScheduleRepository classScheduleRepository;

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private BadgeRepository badgeRepository;

    public UserScheduleDTO getUserScheduleByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));

        List<UserBadge> userBadges = userBadgeRepository.findByUserId(user.getId());

        List<ClassSchedule> classSchedules = new ArrayList<>();
        List<Event> events = new ArrayList<>();

        for (UserBadge userBadge : userBadges) {
            Badge badge = badgeRepository.findById(userBadge.getBadgeId())
                    .orElseThrow(() -> new RuntimeException("Badge not found with ID: " + userBadge.getBadgeId()));

            classSchedules.addAll(classScheduleRepository.findByBadge(badge));

            events.addAll(eventRepository.findByBadge(badge));
        }

        return new UserScheduleDTO(user, classSchedules, events);
    }
}
