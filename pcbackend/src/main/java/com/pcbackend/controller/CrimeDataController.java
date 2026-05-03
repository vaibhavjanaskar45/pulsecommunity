package com.pcbackend.controller;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.pcbackend.model.CrimeData;
import com.pcbackend.repository.CrimeDataRepository;

import jakarta.servlet.http.HttpServletResponse;

import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.springframework.web.multipart.MultipartFile;

	@RestController
	@RequestMapping("/api")
	@CrossOrigin(origins = "*")// optional but better structure
	public class CrimeDataController {
    
    @Autowired
    private CrimeDataRepository crimeDataRepository;

    @GetMapping("/")
    public String home() {
        return "Welcome to PulseCommunity Backend";
    }

    // Get all crimes
    @GetMapping("/crimes")
    public List<CrimeData> getCrimeData() {
        return crimeDataRepository.findAll();
    }

    // Add new crime
    @PostMapping("/crimes/add")
    public CrimeData addCrime(@RequestBody CrimeData crimeData) {
        if (crimeData.getDate() == null) {
            crimeData.setDate(LocalDateTime.now());
        }
        return crimeDataRepository.save(crimeData);
    }
    
    // Update an existing crime
    @PutMapping("/crimes/{id}")
    public ResponseEntity<CrimeData> updateCrime(@PathVariable Long id, @RequestBody CrimeData crimeDetails) {
        return crimeDataRepository.findById(id)
                .map(crime -> {
                    crime.setName(crimeDetails.getName());
                    crime.setDescription(crimeDetails.getDescription());
                    crime.setLatitude(crimeDetails.getLatitude());
                    crime.setLongitude(crimeDetails.getLongitude());
                    crime.setIntensity(crimeDetails.getIntensity());
                    crime.setDate(crimeDetails.getDate());
                    crime.setPrecautions(crimeDetails.getPrecautions());
                    crime.setRiskGroup(crimeDetails.getRiskGroup());
                    crime.setReportedBy(crimeDetails.getReportedBy());
                    CrimeData updatedCrime = crimeDataRepository.save(crime);
                    return ResponseEntity.ok(updatedCrime);
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
    
    // Delete a crime
    @DeleteMapping("/crimes/{id}")
    public ResponseEntity<Object> deleteCrime(@PathVariable Long id) {
        return crimeDataRepository.findById(id)
                .map(crime -> {
                    crimeDataRepository.delete(crime);
                    return ResponseEntity.noContent().build();
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    
    
 // Bulk upload crimes
    @PostMapping("crimes/bulk")
    public ResponseEntity<List<CrimeData>> bulkUploadCrimes(@RequestBody List<CrimeData> crimes) {
        List<CrimeData> savedCrimes = crimeDataRepository.saveAll(crimes);
        return ResponseEntity.ok(savedCrimes);
    }

    
    
    @PostMapping("crimes/upload-csv")
    public ResponseEntity<String> uploadCSV(@RequestParam("file") MultipartFile file) {
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream()));
             CSVParser csvParser = new CSVParser(reader, CSVFormat.DEFAULT.withFirstRecordAsHeader())) {

            List<CrimeData> crimes = new ArrayList<>();
            for (CSVRecord record : csvParser) {
                CrimeData crime = new CrimeData();
                crime.setName(record.get("name"));
                crime.setDescription(record.get("description"));
                crime.setLatitude(Double.parseDouble(record.get("latitude")));
                crime.setLongitude(Double.parseDouble(record.get("longitude")));
                crime.setIntensity(Integer.parseInt(record.get("intensity")));
                crime.setDate(LocalDateTime.parse(record.get("date")));
                crime.setPrecautions(record.get("precautions"));
                crime.setRiskGroup(record.get("risk_group"));
                crime.setReportedBy(record.get("reported_by"));
                crimes.add(crime);
            }

            crimeDataRepository.saveAll(crimes);
            return ResponseEntity.ok("CSV uploaded successfully with " + crimes.size() + " records!");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error processing CSV: " + e.getMessage());
        }
    }

    
    @GetMapping("crimes/download-csv")
    public void downloadCsv(HttpServletResponse response) {
        response.setContentType("text/csv");
        response.setHeader("Content-Disposition", "attachment; filename=crime_data.csv");

        try (PrintWriter writer = response.getWriter()) {
            // Write header
        	writer.println("id,name,description,latitude,longitude,intensity,date,precautions,risk_group,reported_by");


            // Fetch all data
            List<CrimeData> crimes = crimeDataRepository.findAll();

            // Write rows
            for (CrimeData crime : crimes) {
                writer.println(
                    crime.getId() + "," +
                    crime.getName() + "," +
                    crime.getDescription() + "," +
                    crime.getLatitude() + "," +
                    crime.getLongitude() + "," +
                    crime.getIntensity() + "," +
                    crime.getDate() + "," +
                    crime.getPrecautions() + "," +
                    crime.getRiskGroup() + "," +
                    crime.getReportedBy() 
                );
            }
        } catch (IOException e) {
            throw new RuntimeException("Error generating CSV file: " + e.getMessage(), e);
        }
    }



    
    

    
}
