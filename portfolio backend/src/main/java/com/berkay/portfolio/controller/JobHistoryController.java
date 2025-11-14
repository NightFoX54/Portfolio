package com.berkay.portfolio.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.berkay.portfolio.model.JobHistory;
import com.berkay.portfolio.service.PortfolioService;
import com.berkay.portfolio.service.MediaService;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Optional;
import java.time.LocalDate;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/job-history")
public class JobHistoryController {

    @Autowired
    private PortfolioService portfolioService;

    @Autowired
    private MediaService mediaService;

    @GetMapping("/fetch")
    public ResponseEntity<List<JobHistory>> getAllJobHistory() {
        List<JobHistory> jobHistoryList = portfolioService.getAllJobHistory();
        return ResponseEntity.ok(jobHistoryList);
    }

    @GetMapping("/{id}")
    public ResponseEntity<JobHistory> getJobHistoryById(@PathVariable String id) {
        Optional<JobHistory> jobHistory = portfolioService.getJobHistoryById(id);
        return jobHistory.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<JobHistory> createJobHistory(@Valid @RequestBody JobHistory jobHistory) {
        JobHistory savedJobHistory = portfolioService.saveJobHistory(jobHistory);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedJobHistory);
    }

    // Create job history with company logo upload
    @PostMapping("/with-media")
    public ResponseEntity<JobHistory> createJobHistoryWithMedia(
            @RequestParam("companyName") String companyName,
            @RequestParam("jobTitle") String jobTitle,
            @RequestParam("startDate") String startDate,
            @RequestParam(value = "endDate", required = false) String endDate,
            @RequestParam("isCurrent") Boolean isCurrent,
            @RequestParam("description") String description,
            @RequestParam("location") String location,
            @RequestParam("displayOrder") Integer displayOrder,
            @RequestParam(value = "companyLogo", required = false) MultipartFile companyLogo) {
        
        try {
            String companyLogoUrl = null;

            // Upload company logo if provided
            if (companyLogo != null && !companyLogo.isEmpty()) {
                companyLogoUrl = mediaService.uploadFile(companyLogo, "job-history");
            }

            // Parse dates
            java.time.LocalDate startDateParsed = java.time.LocalDate.parse(startDate);
            java.time.LocalDate endDateParsed = (endDate != null && !endDate.isEmpty()) ? java.time.LocalDate.parse(endDate) : null;

            // Create job history entity
            JobHistory jobHistory = new JobHistory();
            jobHistory.setCompanyName(companyName);
            jobHistory.setJobTitle(jobTitle);
            jobHistory.setStartDate(startDateParsed);
            jobHistory.setEndDate(endDateParsed);
            jobHistory.setIsCurrent(isCurrent);
            jobHistory.setDescription(description);
            jobHistory.setLocation(location);
            jobHistory.setDisplayOrder(displayOrder);
            jobHistory.setCompanyLogo(companyLogoUrl);

            JobHistory savedJobHistory = portfolioService.saveJobHistory(jobHistory);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedJobHistory);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<JobHistory> updateJobHistory(@PathVariable String id, @Valid @RequestBody JobHistory jobHistory) {
        Optional<JobHistory> existingJobHistory = portfolioService.getJobHistoryById(id);
        if (existingJobHistory.isPresent()) {
            jobHistory.setId(id);
            JobHistory updatedJobHistory = portfolioService.saveJobHistory(jobHistory);
            return ResponseEntity.ok(updatedJobHistory);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Update job history with media upload
    @PutMapping("/{id}/with-media")
    public ResponseEntity<JobHistory> updateJobHistoryWithMedia(
            @PathVariable String id,
            @RequestParam("companyName") String companyName,
            @RequestParam("jobTitle") String jobTitle,
            @RequestParam("startDate") String startDate,
            @RequestParam(value = "endDate", required = false) String endDate,
            @RequestParam("isCurrent") Boolean isCurrent,
            @RequestParam("description") String description,
            @RequestParam("location") String location,
            @RequestParam("displayOrder") Integer displayOrder,
            @RequestParam(value = "companyLogo", required = false) MultipartFile companyLogo) {
        
        try {
            Optional<JobHistory> existingJobHistory = portfolioService.getJobHistoryById(id);
            if (!existingJobHistory.isPresent()) {
                return ResponseEntity.notFound().build();
            }

            String oldCompanyLogoUrl = null;
            JobHistory currentJobHistory = existingJobHistory.get();
            String companyLogoUrl = currentJobHistory.getCompanyLogo();
            // Upload new company logo if provided
            if (companyLogo != null && !companyLogo.isEmpty()) {
                companyLogoUrl = mediaService.uploadFile(companyLogo, "job-history");
                oldCompanyLogoUrl = currentJobHistory.getCompanyLogo();
            }

            // Update job history entity
            JobHistory updatedJobHistory = JobHistory.builder()
                    .id(id)
                    .companyName(companyName)
                    .jobTitle(jobTitle)
                    .startDate(LocalDate.parse(startDate))
                    .endDate(endDate != null && !endDate.isEmpty() ? LocalDate.parse(endDate) : null)
                    .isCurrent(isCurrent)
                    .description(description)
                    .location(location)
                    .displayOrder(displayOrder)
                    .companyLogo(companyLogoUrl)
                    .build();

            JobHistory savedJobHistory = portfolioService.saveJobHistory(updatedJobHistory);
            if (oldCompanyLogoUrl != null) {
                mediaService.deleteFile(oldCompanyLogoUrl);
            }
            return ResponseEntity.ok(savedJobHistory);
        } catch (Exception e) {
            System.out.println("Error in updateJobHistoryWithMedia: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteJobHistory(@PathVariable String id) {
        Optional<JobHistory> jobHistory = portfolioService.getJobHistoryById(id);
        if (jobHistory.isPresent()) {
            String companyLogoUrl = jobHistory.get().getCompanyLogo();
            portfolioService.deleteJobHistory(id);
            if (companyLogoUrl != null) {
                mediaService.deleteFile(companyLogoUrl);
            }
            return ResponseEntity.noContent().build();
            
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
