package com.smartcampus.controller;

import com.smartcampus.dto.LoginRequest;
import com.smartcampus.dto.LoginResponse;
import com.smartcampus.dto.UserDTO;
import com.smartcampus.model.Role;
import com.smartcampus.model.User;
import com.smartcampus.repository.UserRepository;
import com.smartcampus.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        try {
            String result = authService.register(user);
            return ResponseEntity.ok().body(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Registration failed: " + e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            String token = authService.login(loginRequest.getEmail(), loginRequest.getPassword());
            if ("Invalid credentials!".equals(token)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials!");
            }
            Optional<User> userOptional = userRepository.findByEmail(loginRequest.getEmail());
            String role = userOptional.isPresent() ? userOptional.get().getRole().toString() : "UNKNOWN";

            LoginResponse loginResponse = new LoginResponse(token, role);

            return ResponseEntity.ok().body(loginResponse);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Login failed: " + e.getMessage());
        }
    }
    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = authService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @PutMapping("/users/{userId}")
    public ResponseEntity<?> updateUser(@PathVariable Long userId, @RequestBody User updatedUser) {
        try {
            User user = authService.updateUser(userId, updatedUser);
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to update user: " + e.getMessage());
        }
    }

    @GetMapping("/id-and-name")
    public List<UserDTO> getAllUsersIdAndName() {
        return authService.getAllUsersIdAndName();
    }

    @GetMapping("/lecturers")
    public ResponseEntity<?> getAllLecturers() {
        System.out.println("Getting lecturers");
        try {
            List<User> lecturers = authService.getUsersByRole(Role.LECTURER);
            return ResponseEntity.ok(lecturers);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to get lecturers: " + e.getMessage());
        }
    }

    @GetMapping("/students")
    public ResponseEntity<?> getAllStudents() {
        System.out.println("Getting lecturers");
        try {
            List<User> lecturers = authService.getUsersByRole(Role.STUDENT);
            return ResponseEntity.ok(lecturers);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to get students: " + e.getMessage());
        }
    }

    @GetMapping("/user-by-email")
    public ResponseEntity<?> getUserByEmail(@RequestParam String email) {
        User user = authService.getUserByEmail(email);
        if (user != null) {
            return ResponseEntity.ok(user);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found with email: " + email);
        }
    }

    @GetMapping("/userSchedule-by-email")
    public ResponseEntity<?> getUserScheduleByEmail(@RequestParam String email) {
        System.out.println("Getting user by email: " + email);
        User user = authService.getUserByEmail(email);
        if (user != null) {
            return ResponseEntity.ok(user);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found with email: " + email);
        }
    }


}
