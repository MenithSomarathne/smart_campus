package com.smartcampus.controller;

import com.smartcampus.model.Course;
import com.smartcampus.service.CourseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/courses")
@CrossOrigin("*")
public class CourseController {

    @Autowired
    private CourseService courseService;

    @GetMapping
    public List<Course> getCourses() {
        return courseService.getAllCourses();
    }

    @GetMapping("/{id}")
    public Optional<Course> getCourseById(@PathVariable Long id) {
        return courseService.getCourseById(id);
    }

    @PostMapping
    public Course createOrUpdateCourse(@RequestBody Course course) {
        return courseService.createOrUpdateCourse(course);
    }

    @DeleteMapping("/{id}")
    public void deleteCourse(@PathVariable Long id) {
        courseService.deleteCourse(id);
    }

    @PostMapping("/{courseId}/assign-lecturer/{lecturerId}")
    public Course assignLecturerToCourse(@PathVariable Long courseId, @PathVariable Long lecturerId) {
        return courseService.assignLecturerToCourse(courseId, lecturerId);
    }

}
