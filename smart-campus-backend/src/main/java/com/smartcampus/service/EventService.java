package com.smartcampus.service;

import com.smartcampus.model.Event;
import com.smartcampus.model.User;
import com.smartcampus.model.UserBadge;
import com.smartcampus.repository.EventRepository;
import com.smartcampus.repository.UserBadgeRepository;
import com.smartcampus.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EventService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private UserBadgeRepository userBadgeRepository;


    @Autowired
    private EventRepository eventRepository;

    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    public Optional<Event> getEventById(Long id) {
        return eventRepository.findById(id);
    }

    public Event createEvent(Event event) {
        sendEventNotifications(event);
        return eventRepository.save(event);
    }

    public Event updateEvent(Event event) {
        return eventRepository.save(event);
    }

    public void deleteEvent(Long id) {
        eventRepository.deleteById(id);
    }

    public void sendEventNotifications(Event event) {
        List<UserBadge> userBadges = userBadgeRepository.findByBadgeId(event.getBadge().getBadgeID());

        for (UserBadge userBadge : userBadges) {
            User user = userRepository.findById(userBadge.getUserId()).orElse(null);
            if (user != null) {
                String subject = "Upcoming Event: " + event.getName();

                String emailContent = generateHtmlContent(event, user);

                List<String> emailList = List.of(user.getEmail());
                emailService.sendEmail(emailList, subject, emailContent);
            }
        }
    }

    private String generateHtmlContent(Event event, User user) {
        String htmlContent = "<!DOCTYPE html><html lang=\"en\"><head><meta charset=\"UTF-8\"><meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"><style>body {font-family: Arial, sans-serif;margin: 0;padding: 0;background-color: #f4f4f9;}.email-container {width: 100%;max-width: 600px;margin: 0 auto;background-color: #ffffff;padding: 20px;border-radius: 8px;box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);}.header {text-align: center;padding-bottom: 20px;}.header h1 {color: #4CAF50;}.event-details {margin: 20px 0;}.event-details p {font-size: 16px;line-height: 1.5;margin: 10px 0;}.button {display: inline-block;padding: 10px 20px;background-color: #4CAF50;color: #ffffff;text-decoration: none;border-radius: 5px;margin-top: 20px;}@media (max-width: 600px) {.email-container {padding: 10px;}}</style><title>Upcoming Event Notification</title></head><body><div class=\"email-container\"><div class=\"header\"><h1>Upcoming Event: " + event.getName() + "</h1></div><div class=\"event-details\"><p>Hello " + user.getName() + ",</p><p>We are excited to inform you about the upcoming event:</p><p><strong>Event Name:</strong> " + event.getName() + "</p><p><strong>Date:</strong> " + event.getDate().toString() + "</p><p><strong>Type:</strong> " + event.getType() + "</p></div><p>We hope to see you there!</p><p>Best regards,<br>The Smart Campus Team</p><a href=\"#\" class=\"button\">Learn More</a></div></body></html>";

        return htmlContent;
    }

}
