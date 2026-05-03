package com.pcbackend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import com.pcbackend.model.User;

import com.pcbackend.services.UserService;


@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserService userService;


    // Signup
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody User user) {
        try {
            User savedUser = userService.signup(user);
            return ResponseEntity.ok(savedUser);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }


    // Login
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User request) {
        System.out.println("Incoming login: " + request.getEmail());
        User user = userService.login(request.getEmail(), request.getPassword());
        if (user != null) {
            return ResponseEntity.ok(user); // return user object to frontend
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
    }

}
