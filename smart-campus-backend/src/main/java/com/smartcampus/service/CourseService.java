package com.smartcampus.service;

import com.smartcampus.model.Course;
import com.smartcampus.model.Role;
import com.smartcampus.model.User;
import com.smartcampus.repository.CourseRepository;
import com.smartcampus.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CourseService {

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private UserRepository userRepository;

    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    public Optional<Course> getCourseById(Long id) {
        return courseRepository.findById(id);
    }

    public Course createOrUpdateCourse(Course course) {
        return courseRepository.save(course);
    }

    public void deleteCourse(Long id) {
        courseRepository.deleteById(id);
    }

    public Course assignLecturerToCourse(Long courseId, Long lecturerId) {
        Optional<Course> courseOptional = courseRepository.findById(courseId);
        Optional<User> lecturerOptional = userRepository.findById(lecturerId);

        if (courseOptional.isPresent() && lecturerOptional.isPresent()) {
            Course course = courseOptional.get();
            User lecturer = lecturerOptional.get();

            if (!lecturer.getRole().equals(Role.LECTURER)) {
                throw new IllegalArgumentException("User is not a lecturer.");
            }

            course.setAssignedLecturer(lecturer);
            return courseRepository.save(course);
        }

        throw new IllegalArgumentException("Course or Lecturer not found.");
    }

}
