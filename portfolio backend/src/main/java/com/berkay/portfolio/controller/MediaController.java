package com.berkay.portfolio.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.berkay.portfolio.service.MediaService;

@RestController
@RequestMapping("/api/media")
public class MediaController {

    @Autowired
    private MediaService mediaService;

    @PostMapping("/upload")
    public ResponseEntity<Map<String, String>> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam("folder") String folder) {
        
        try {
            // Returns S3 key (e.g., "profile-pictures/uuid_filename.jpg")
            String s3Key = mediaService.uploadFile(file, folder);
            
            // Generate presigned URL for immediate use
            String presignedUrl = mediaService.getPresignedUrl(s3Key);
            
            Map<String, String> response = new HashMap<>();
            response.put("key", s3Key); // Store this in database
            response.put("url", presignedUrl); // Use this for immediate display
            response.put("message", "File uploaded successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to upload file: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    /**
     * Generates a presigned URL for accessing a private S3 object
     * Use this endpoint when you need to access files stored as S3 keys
     */
    @GetMapping("/presigned-url")
    public ResponseEntity<Map<String, String>> getPresignedUrl(@RequestParam("key") String s3Key) {
        try {
            String presignedUrl = mediaService.getPresignedUrl(s3Key);
            Map<String, String> response = new HashMap<>();
            response.put("url", presignedUrl);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to generate presigned URL: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @DeleteMapping("/delete")
    public ResponseEntity<Map<String, String>> deleteFile(@RequestParam("fileUrl") String fileUrl) {
        try {
            mediaService.deleteFile(fileUrl);
            Map<String, String> response = new HashMap<>();
            response.put("message", "File deleted successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to delete file: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
}
