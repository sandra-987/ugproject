package com.marian.demo.controller;

import com.marian.demo.model.User;
import com.marian.demo.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000") // Allow frontend (React, for example) to access this endpoint
public class SellerController {

    @Autowired
    private ProjectRepository projectRepository; // Your Project repository to query the database

    @GetMapping("/get-sellers")
    public List<User> getSellers() {
        System.out.println("Fetching sellers..."); // Log to confirm the method is being hit
        List<User> sellers = projectRepository.findByRole(2); // Fetch sellers with role = 2
        if (sellers.isEmpty()) {
            System.out.println("No sellers found.");
        }
        return sellers;
    }

}
