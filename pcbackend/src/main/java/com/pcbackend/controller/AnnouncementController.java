package com.pcbackend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.pcbackend.model.Announcement;
import com.pcbackend.services.AnnouncementService;

import java.util.List;

@RestController
@RequestMapping("/api/announcements")
public class AnnouncementController {

    private final AnnouncementService service;

    public AnnouncementController(AnnouncementService service) {
        this.service = service;
    }

    // ✅ User: View all announcements
    @GetMapping
    public ResponseEntity<List<Announcement>> getAllAnnouncements() {
        return ResponseEntity.ok(service.getAllAnnouncements());
    }

    // ✅ Admin: Create new announcement
    @PostMapping
    public ResponseEntity<Announcement> create(@RequestBody Announcement announcement) {
        return ResponseEntity.ok(service.createAnnouncement(announcement));
    }

    // ✅ Admin: Update existing announcement
    @PutMapping("/{id}")
    public ResponseEntity<Announcement> update(@PathVariable Long id, @RequestBody Announcement announcement) {
        return ResponseEntity.ok(service.updateAnnouncement(id, announcement));
    }

    // ✅ Admin: Delete announcement
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.deleteAnnouncement(id);
        return ResponseEntity.noContent().build();
    }
}
