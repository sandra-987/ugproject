package com.marian.demo.services;

import com.marian.demo.model.User;
import com.marian.demo.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProjectServices {

    @Autowired
    private ProjectRepository projectRepository;

    // Register a new user
    public User registerUser(User user) {
        return projectRepository.save(user);
    }

    // Get all users
    public List<User> getAllUsers() {
        return projectRepository.findAll();
    }

    // Get a user by ID
    public Optional<User> findById(int id) {
        return projectRepository.findById(id);
    }

    // Find a user by email
    public Optional<User> findByEmail(String email) {
        return projectRepository.findByEmail(email);
    }

    // Get total user count
    public Long getTotalUsers() {
        return projectRepository.countUsers(); // Call repository method for count
    }

    // Update a user
    public User updateUser(User user) {
        Optional<User> existingUser = projectRepository.findById(user.getId());
        if (existingUser.isPresent()) {
            return projectRepository.save(user);
        } else {
            throw new RuntimeException("User not found with ID: " + user.getId());
        }
    }

    // Delete a user by ID
    public void deleteUser(int id) {
        Optional<User> existingUser = projectRepository.findById(id);
        if (existingUser.isPresent()) {
            projectRepository.deleteById(id);
        } else {
            throw new RuntimeException("User not found with ID: " + id);
        }
    }
}
