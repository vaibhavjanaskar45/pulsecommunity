package com.pcbackend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.pcbackend.model.User;


public interface UserRepository extends JpaRepository<User, Long> {
    User findByEmail(String email);
}
