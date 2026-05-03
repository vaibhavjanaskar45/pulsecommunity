package com.pcbackend.services;

import org.springframework.stereotype.Service;

import com.pcbackend.model.Announcement;
import com.pcbackend.repository.AnnouncementRepository;

import java.util.List;

@Service
public class AnnouncementService {
    
    private final AnnouncementRepository repository;

    public AnnouncementService(AnnouncementRepository repository) {
        this.repository = repository;
    }

    public List<Announcement> getAllAnnouncements() {
        return repository.findAll();
    }

    public Announcement createAnnouncement(Announcement announcement) {
        return repository.save(announcement);
    }

    public Announcement updateAnnouncement(Long id, Announcement updated) {
        return repository.findById(id).map(existing -> {
            existing.setTitle(updated.getTitle());
            existing.setMessage(updated.getMessage());
            return repository.save(existing);
        }).orElseThrow(() -> new RuntimeException("Announcement not found"));
    }

    public void deleteAnnouncement(Long id) {
        repository.deleteById(id);
    }
}
