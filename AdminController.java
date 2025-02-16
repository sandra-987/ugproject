package com.marian.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.marian.demo.model.User;
import com.marian.demo.services.ProjectServices;

import java.util.List;

@RestController
@RequestMapping("/admin")
public class AdminController {

    @Autowired
    private ProjectServices projectServices;

    // Endpoint to get all users
    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = projectServices.getAllUsers();
        return ResponseEntity.ok(users); // Return 200 OK with the list of users
    }
}
