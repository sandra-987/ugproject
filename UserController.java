package com.marian.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.marian.demo.model.User;
import com.marian.demo.services.ProjectServices;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/users")
@CrossOrigin(origins = "http://localhost:3000") // Enable CORS for your frontend
public class UserController {

    @Autowired
    private ProjectServices projectServices;

    private static final int ROLE_BUYER = 1;
    private static final int ROLE_SELLER = 2;
    private static final int ROLE_ADMIN = 3;

    // Register a new user
    @PostMapping("/register")
    public ResponseEntity<User> registerUser(@RequestBody User user) {
        // Validate password match
        if (user.getPassword() == null || !user.getPassword().equals(user.getConfirmPassword())) {
            return ResponseEntity.badRequest().body(null);
        }

        // Ensure valid role
        if (user.getRole() != ROLE_BUYER && user.getRole() != ROLE_SELLER && user.getRole() != ROLE_ADMIN) {
            return ResponseEntity.badRequest().body(null);
        }

        User registeredUser = projectServices.registerUser(user);
        return ResponseEntity.ok(registeredUser);
    }

    // Get all users (only admin can access this)
    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        User loggedInUser = getLoggedInUser(); // Replace with actual logged-in user logic
        if (loggedInUser != null && loggedInUser.getRole() == ROLE_ADMIN) {
            List<User> users = projectServices.getAllUsers();
            return ResponseEntity.ok(users);
        }
        return ResponseEntity.status(403).body(null);
    }
 // Fetch total number of users
    @GetMapping("/count")
    public ResponseEntity<Long> getTotalUsers() {
        Long totalUsers = projectServices.getTotalUsers();
        return ResponseEntity.ok(totalUsers);
    }


    // Login endpoint
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) {
        Optional<User> foundUser = projectServices.findByEmail(user.getEmail());

        if (foundUser.isPresent() && foundUser.get().getPassword().equals(user.getPassword())) {
            return new ResponseEntity<>(foundUser.get(), HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Unauthorized: Invalid credentials", HttpStatus.UNAUTHORIZED);
        }
    }

    // Helper method to simulate getting the logged-in user (replace with actual logic)
    private User getLoggedInUser() {
        // This should fetch the currently logged-in user, e.g., from a session or JWT token
        return new User(); // Placeholder for logged-in user
    }
}
