package com.pcbackend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.pcbackend.model.Announcement;

public interface AnnouncementRepository extends JpaRepository<Announcement, Long> {
}
