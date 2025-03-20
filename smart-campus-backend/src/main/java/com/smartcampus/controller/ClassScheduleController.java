package com.smartcampus.controller;

import com.smartcampus.model.ClassSchedule;
import com.smartcampus.service.ClassScheduleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/schedules")
@CrossOrigin("*")
public class ClassScheduleController {
    @Autowired
    private ClassScheduleService service;

    @GetMapping
    public List<ClassSchedule> getAllSchedules() {
        return service.getAllSchedules();
    }

    @GetMapping("/{id}")
    public Optional<ClassSchedule> getScheduleById(@PathVariable Long id) {
        return service.getScheduleById(id);
    }

    @PostMapping
    public ClassSchedule createSchedule(@RequestBody ClassSchedule schedule) {
        return service.saveSchedule(schedule);
    }

    @DeleteMapping("/{id}")
    public void deleteSchedule(@PathVariable Long id) {
        service.deleteSchedule(id);
    }
}
