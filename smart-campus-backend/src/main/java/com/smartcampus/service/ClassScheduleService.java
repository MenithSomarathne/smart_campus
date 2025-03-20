package com.smartcampus.service;

import com.smartcampus.model.ClassSchedule;
import com.smartcampus.model.Reservation;
import com.smartcampus.model.ReservationStatus;
import com.smartcampus.model.Resource;
import com.smartcampus.repository.ClassScheduleRepository;
import com.smartcampus.repository.ReservationRepository;
import com.smartcampus.repository.ResourceRepository;
import com.smartcampus.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Locale;
import java.util.Optional;

@Service
public class ClassScheduleService {
    @Autowired
    private ClassScheduleRepository repository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;


    @Autowired
    private ResourceRepository resourceRepository;

    public List<ClassSchedule> getAllSchedules() {
        return repository.findAll();
    }

    public Optional<ClassSchedule> getScheduleById(Long id) {
        return repository.findById(id);
    }


    public ClassSchedule saveSchedule(ClassSchedule schedule) {
        System.out.println("Saving schedule: " + schedule.getName());
        System.out.println("Current status: " + schedule.getStatus());

        boolean isNew = (schedule.getScheduleID() == null);
        ClassSchedule existingSchedule = null;

        if (!isNew) {
            System.out.println("Updating schedule with ID: " + schedule.getScheduleID());
            existingSchedule = repository.findById(schedule.getScheduleID()).orElse(null);

            if (existingSchedule == null) {
                System.out.println("Error: Existing schedule not found in database!");
            } else {
                System.out.println("Existing status: " + existingSchedule.getStatus());
            }
        }

        ClassSchedule savedSchedule = repository.save(schedule);

        Long badgeId = savedSchedule.getBadge().getBadgeID();
        List<String> emails = userRepository.findEmailsByBadgeId(badgeId);

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMMM dd, yyyy 'at' hh:mm a", Locale.ENGLISH);
        String formattedStartTime = savedSchedule.getStartTime().format(formatter);
        String formattedEndTime = savedSchedule.getEndTime().format(formatter);

        System.out.println(existingSchedule);
        System.out.println();
        if (isNew) {
            System.out.println("Sending new schedule email...");
            String subject = "📅 New Class Scheduled: " + savedSchedule.getName();
            String message = getNewScheduleEmailTemplate(savedSchedule.getName(), formattedStartTime, formattedEndTime);

            emailService.sendEmail(emails, subject, message);
            System.out.println("New schedule email sent!");
        }
        else if (existingSchedule != null && schedule.getStatus().equals("CANCELLED")){
            System.out.println("Sending cancellation email...");
            String subject = "🚫 Class Canceled: " + savedSchedule.getName();
            String message = getCancellationEmailTemplate(savedSchedule.getName(), formattedStartTime);
            emailService.sendEmail(emails, subject, message);
            System.out.println("Cancellation email sent!");
        } else {
            System.out.println("No cancellation email sent (status not changed to CANCELLED).");
        }

        return savedSchedule;
    }


    private String getNewScheduleEmailTemplate(String className, String startTime, String endTime) {
        return "<!DOCTYPE html>" +
                "<html>" +
                "<head>" +
                "<meta name='viewport' content='width=device-width, initial-scale=1'>" +
                "<style>" +
                "body { font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; margin: 0; }" +
                ".container { background: white; max-width: 600px; margin: auto; padding: 20px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); }" +
                "h2 { color: #2C3E50; font-size: 24px; }" +
                "p { font-size: 16px; color: #555; line-height: 1.6; }" +
                ".button { background-color: #3498DB; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 20px; font-size: 16px; font-weight: bold; }" +
                "@media (max-width: 600px) { .container { width: 100%; padding: 15px; } h2 { font-size: 20px; } p { font-size: 14px; } .button { font-size: 14px; padding: 10px 16px; } }" +
                "</style>" +
                "</head>" +
                "<body>" +
                "<div class='container'>" +
                "<h2>📚 New Class Scheduled!</h2>" +
                "<p>Dear student,</p>" +
                "<p>A new class has been scheduled for you:</p>" +
                "<p><strong>📌 Class:</strong> " + className + "</p>" +
                "<p><strong>🕒 Start Time:</strong> " + startTime + "</p>" +
                "<p><strong>⏳ End Time:</strong> " + endTime + "</p>" +
                "<a class='button' href='#'>View Schedule</a>" +
                "<p>Best Regards,<br><strong>Smart Campus Team</strong></p>" +
                "</div>" +
                "</body>" +
                "</html>";
    }

    // Email template for class cancellation
    private String getCancellationEmailTemplate(String className, String startTime) {
        return "<!DOCTYPE html>" +
                "<html>" +
                "<head>" +
                "<meta name='viewport' content='width=device-width, initial-scale=1'>" +
                "<style>" +
                "body { font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; margin: 0; }" +
                ".container { background: white; max-width: 600px; margin: auto; padding: 20px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); }" +
                "h2 { color: #C0392B; font-size: 24px; }" +
                "p { font-size: 16px; color: #555; line-height: 1.6; }" +
                ".button { background-color: #E74C3C; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 20px; font-size: 16px; font-weight: bold; }" +
                "@media (max-width: 600px) { .container { width: 100%; padding: 15px; } h2 { font-size: 20px; } p { font-size: 14px; } .button { font-size: 14px; padding: 10px 16px; } }" +
                "</style>" +
                "</head>" +
                "<body>" +
                "<div class='container'>" +
                "<h2>🚫 Class Canceled</h2>" +
                "<p>Dear student,</p>" +
                "<p>We regret to inform you that the following class has been canceled:</p>" +
                "<p><strong>📌 Class:</strong> " + className + "</p>" +
                "<p><strong>🕒 Scheduled Time:</strong> " + startTime + "</p>" +
                "<p>We apologize for any inconvenience.</p>" +
                "<p>Best Regards,<br><strong>Smart Campus Team</strong></p>" +
                "</div>" +
                "</body>" +
                "</html>";
    }

    public List<String> getEmailsForClassSchedule(Long scheduleId) {
        ClassSchedule schedule = repository.findById(scheduleId)
                .orElseThrow(() -> new RuntimeException("Schedule not found"));
        Long badgeId = schedule.getBadge().getBadgeID();
        return userRepository.findEmailsByBadgeId(badgeId);
    }

    public void deleteSchedule(Long id) {
        repository.deleteById(id);
    }

    @Scheduled(fixedRate = 60000)
    public void checkAndUpdateResourceStatus() {
        List<ClassSchedule> activeClassSchedule = repository.findAllByStatus("ACTIVE");

        for (ClassSchedule classSchedule : activeClassSchedule) {
            if (classSchedule.getEndTime().isBefore(LocalDateTime.now())) {
                Resource resource = classSchedule.getResource();
                if (!"Available".equals(resource.getStatus())) {
                    resource.setStatus("Available");
                    resourceRepository.save(resource);
                    System.out.println("Resource " + resource.getName() + " is now available.");
                }
                classSchedule.setStatus("COMPLETED");
                repository.save(classSchedule);
            }
        }
    }
}