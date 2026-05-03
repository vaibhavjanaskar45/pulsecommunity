package com.pcbackend.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.pcbackend.model.User;
import com.pcbackend.repository.UserRepository;


@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public User signup(User user) {
        // check if email already exists
        if (userRepository.findByEmail(user.getEmail()) != null) {
            throw new RuntimeException("Email already registered: " + user.getEmail());
        }

        return userRepository.save(user);
    }
    
    
    
    
    
    public User login(String email, String password) {

    	
        System.out.println("Login attempt: email=" + email + ", password=" + password);
        User user = userRepository.findByEmail(email);
        System.out.println("User fetched: " + user.toString());
        if (user != null && user.getPassword().equals(password)) {
            return user;
        }
        return null;
    }


   
}
