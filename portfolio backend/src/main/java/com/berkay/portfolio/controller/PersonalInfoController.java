package com.berkay.portfolio.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.berkay.portfolio.model.PersonalInfo;
import com.berkay.portfolio.service.PortfolioService;
import com.berkay.portfolio.service.MediaService;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Optional;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/personal-info")
public class PersonalInfoController {

    @Autowired
    private PortfolioService portfolioService;

    @Autowired
    private MediaService mediaService;

    @GetMapping("/fetch")
    public ResponseEntity<List<PersonalInfo>> getAllPersonalInfo() {
        List<PersonalInfo> personalInfoList = portfolioService.getAllPersonalInfo();
        return ResponseEntity.ok(personalInfoList);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PersonalInfo> getPersonalInfoById(@PathVariable String id) {
        Optional<PersonalInfo> personalInfo = portfolioService.getPersonalInfoById(id);
        return personalInfo.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<PersonalInfo> createPersonalInfo(@Valid @RequestBody PersonalInfo personalInfo) {
        PersonalInfo savedPersonalInfo = portfolioService.savePersonalInfo(personalInfo);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedPersonalInfo);
    }

    // Create personal info with media upload
    @PostMapping("/with-media")
    public ResponseEntity<PersonalInfo> createPersonalInfoWithMedia(
            @RequestParam("name") String name,
            @RequestParam("email") String email,
            @RequestParam("phone") String phone,
            @RequestParam("address") String address,
            @RequestParam("city") String city,
            @RequestParam("state") String state,
            @RequestParam("zip") String zip,
            @RequestParam("country") String country,
            @RequestParam(value = "workTitle", required = false) String workTitle,
            @RequestParam(value = "profilePicture", required = false) MultipartFile profilePicture,
            @RequestParam(value = "resume", required = false) MultipartFile resume) {
        
        try {
            System.out.println("Received data: name=" + name + ", email=" + email + ", phone=" + phone);
            System.out.println("Profile picture: " + (profilePicture != null ? profilePicture.getOriginalFilename() : "null"));
            System.out.println("Resume: " + (resume != null ? resume.getOriginalFilename() : "null"));
            String profilePictureUrl = null;
            String resumeUrl = null;

            // Upload profile picture if provided
            if (profilePicture != null && !profilePicture.isEmpty()) {
                profilePictureUrl = mediaService.uploadFile(profilePicture, "personal-info");
            }

            // Upload resume if provided
            if (resume != null && !resume.isEmpty()) {
                resumeUrl = mediaService.uploadFile(resume, "personal-info");
            }

            // Create personal info entity
            PersonalInfo personalInfo = PersonalInfo.builder()
                    .name(name)
                    .email(email)
                    .phone(phone)
                    .address(address)
                    .city(city)
                    .state(state)
                    .zip(zip)
                    .country(country)
                    .workTitle(workTitle)
                    .profilePicture(profilePictureUrl)
                    .resume(resumeUrl)
                    .build();

            PersonalInfo savedPersonalInfo = portfolioService.savePersonalInfo(personalInfo);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedPersonalInfo);
        } catch (Exception e) {
            System.out.println("Error in createPersonalInfoWithMedia: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<PersonalInfo> updatePersonalInfo(@PathVariable String id, @Valid @RequestBody PersonalInfo personalInfo) {
        Optional<PersonalInfo> existingPersonalInfo = portfolioService.getPersonalInfoById(id);
        if (existingPersonalInfo.isPresent()) {
            personalInfo.setId(id);
            PersonalInfo updatedPersonalInfo = portfolioService.savePersonalInfo(personalInfo);
            return ResponseEntity.ok(updatedPersonalInfo);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Update personal info with media upload
    @PutMapping("/{id}/with-media")
    public ResponseEntity<PersonalInfo> updatePersonalInfoWithMedia(
            @PathVariable String id,
            @RequestParam("name") String name,
            @RequestParam("email") String email,
            @RequestParam("phone") String phone,
            @RequestParam("address") String address,
            @RequestParam("city") String city,
            @RequestParam("state") String state,
            @RequestParam("zip") String zip,
            @RequestParam("country") String country,
            @RequestParam(value = "workTitle", required = false) String workTitle,
            @RequestParam(value = "profilePicture", required = false) MultipartFile profilePicture,
            @RequestParam(value = "resume", required = false) MultipartFile resume) {
        
        try {
            Optional<PersonalInfo> existingPersonalInfo = portfolioService.getPersonalInfoById(id);
            if (!existingPersonalInfo.isPresent()) {
                return ResponseEntity.notFound().build();
            }

            String oldProfilePictureUrl = null;
            String oldResumeUrl = null;
            PersonalInfo currentInfo = existingPersonalInfo.get();
            String profilePictureUrl = currentInfo.getProfilePicture();
            String resumeUrl = currentInfo.getResume();

            // Upload new profile picture if provided
            if (profilePicture != null && !profilePicture.isEmpty()) {
                profilePictureUrl = mediaService.uploadFile(profilePicture, "personal-info");
                oldProfilePictureUrl = currentInfo.getProfilePicture();
            }

            // Upload new resume if provided
            if (resume != null && !resume.isEmpty()) {
                resumeUrl = mediaService.uploadFile(resume, "personal-info");
                oldResumeUrl = currentInfo.getResume();
            }

            // Update personal info entity
            PersonalInfo updatedPersonalInfo = PersonalInfo.builder()
                    .id(id)
                    .name(name)
                    .email(email)
                    .phone(phone)
                    .address(address)
                    .city(city)
                    .state(state)
                    .zip(zip)
                    .country(country)
                    .workTitle(workTitle)
                    .profilePicture(profilePictureUrl)
                    .resume(resumeUrl)
                    .build();

            PersonalInfo savedPersonalInfo = portfolioService.savePersonalInfo(updatedPersonalInfo);
            if (oldProfilePictureUrl != null) {
                mediaService.deleteFile(oldProfilePictureUrl);
            }
            if (oldResumeUrl != null) {
                mediaService.deleteFile(oldResumeUrl);
            }
            return ResponseEntity.ok(savedPersonalInfo);
        } catch (Exception e) {
            System.out.println("Error in updatePersonalInfoWithMedia: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePersonalInfo(@PathVariable String id) {
        Optional<PersonalInfo> personalInfo = portfolioService.getPersonalInfoById(id);
        if (personalInfo.isPresent()) {
            String personalPictureUrl = personalInfo.get().getProfilePicture();
            String resumeUrl = personalInfo.get().getResume();
            portfolioService.deletePersonalInfo(id);
            if (personalPictureUrl != null) {
                mediaService.deleteFile(personalPictureUrl);
            }
            if (resumeUrl != null) {
                mediaService.deleteFile(resumeUrl);
            }
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
