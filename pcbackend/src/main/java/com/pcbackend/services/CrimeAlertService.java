package com.pcbackend.services;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.pcbackend.model.CrimeData;

@Service
public class CrimeAlertService {

    private static final Logger log = LoggerFactory.getLogger(CrimeAlertService.class);

    @Autowired
    private MailService mailService;

    public void checkAndNotifyUser(String userEmail, double userLat, double userLng, CrimeData crimeData) {
        double distance = getDistance(userLat, userLng, crimeData.getLatitude(), crimeData.getLongitude());

        log.info("Checking crime: {} at {},{}", crimeData.getName(), crimeData.getLatitude(), crimeData.getLongitude());
        log.info("User: {}, distance = {} km", userEmail, distance);

        // Example: within 1 km radius → send alert
        if (distance <= 1) {
            String subject = "Pulse-Community | ⚠ Crime Alert Near You!";
            String body = "Dear User,\n\nWe detected a crime hotspot near your location (" 
                           + crimeData.getName() +" at Distance of "+distance+ " km). Stay alert and take precautions.\n\n- CrimeWatch Team";

            try {
                mailService.sendCrimeAlert(userEmail, subject, body);
                log.info("Crime alert mail sent successfully to {}", userEmail);
            } catch (Exception e) {
                log.error("Failed to send crime alert mail to {}", userEmail, e);
            }
        } else {
            log.info("No alert sent. User is outside the 1 km radius.");
        }
    }

    // Haversine formula to calculate distance in KM
    public double getDistance(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371; // Earth radius in KM
        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);

        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; // distance in KM
    }
}
