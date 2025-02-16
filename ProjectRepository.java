package com.marian.demo.repository;

import java.util.List;  // Changed from Optional to List for multiple users
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.marian.demo.model.User;

@Repository
public interface ProjectRepository extends JpaRepository<User, Integer> { 

    // Method to find a user by email
    Optional<User> findByEmail(String email);

    // Method to find users by role (e.g., role 2 for sellers)
    List<User> findByRole(int role);
    
    // New method to find a seller by id and role (role = 2 for sellers)
    Optional<User> findByIdAndRole(int id, int role);  // This will return the seller by id and role 2

    // Query to count the total number of users
    @Query("SELECT COUNT(u) FROM User u")
    Long countUsers();
}
