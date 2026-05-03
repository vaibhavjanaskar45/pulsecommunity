package com.pcbackend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.pcbackend.model.CrimeData;
import com.pcbackend.model.LocationRequest;
import com.pcbackend.model.User;
import com.pcbackend.repository.CrimeDataRepository;
import com.pcbackend.repository.UserRepository;
import com.pcbackend.services.CrimeAlertService;

import java.util.List;


@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CrimeDataRepository crimeDataRepository;

    @Autowired
    private CrimeAlertService crimeAlertService;



    /**
     * Get all users
     */
    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    /**
     * Update user location and send crime alerts if necessary
     */
    @PostMapping("/location")
    public ResponseEntity<String> updateLocation(@RequestBody LocationRequest request) {
    	System.out.println("Received location: " + request);
        User user = userRepository.findByEmail(request.getEmail());
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }

        boolean locationChanged = (user.getLatitude() == null || user.getLongitude() == null ||
                !user.getLatitude().equals(request.getLatitude()) ||
                !user.getLongitude().equals(request.getLongitude()));

        // update location
        user.setLatitude(request.getLatitude());
        user.setLongitude(request.getLongitude());
        userRepository.save(user);

        if (locationChanged) {
            CrimeData nearestCrime = null;
            double minDistance = Double.MAX_VALUE;

            for (CrimeData crime : crimeDataRepository.findAll()) {
                double distance = crimeAlertService.getDistance(
                        request.getLatitude(), request.getLongitude(),
                        crime.getLatitude(), crime.getLongitude()
                );
                if (distance < minDistance) {
                    minDistance = distance;
                    nearestCrime = crime;
                }
            }

            if (nearestCrime != null && minDistance <= 1) {
                crimeAlertService.checkAndNotifyUser(user.getEmail(),
                        request.getLatitude(), request.getLongitude(), nearestCrime);
            }
        }



        return ResponseEntity.ok("Location updated");
    }
}
