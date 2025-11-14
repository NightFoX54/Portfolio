package com.berkay.portfolio.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.berkay.portfolio.model.ProjectDetailContent;
import com.berkay.portfolio.service.PortfolioService;
import com.berkay.portfolio.service.MediaService;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/project-detail-content")
public class ProjectDetailContentController {

    @Autowired
    private PortfolioService portfolioService;

    @Autowired
    private MediaService mediaService;

    @GetMapping("/fetch")
    public ResponseEntity<List<ProjectDetailContent>> getAllProjectDetailContent() {
        List<ProjectDetailContent> contentList = portfolioService.getAllProjectDetailContent();
        return ResponseEntity.ok(contentList);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProjectDetailContent> getProjectDetailContentById(@PathVariable String id) {
        Optional<ProjectDetailContent> content = portfolioService.getProjectDetailContentById(id);
        return content.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<ProjectDetailContent>> getProjectDetailContentByProjectId(@PathVariable String projectId) {
        List<ProjectDetailContent> contentList = portfolioService.getProjectDetailContentByProjectId(projectId);
        return ResponseEntity.ok(contentList);
    }

    @PostMapping
    public ResponseEntity<ProjectDetailContent> createProjectDetailContent(@Valid @RequestBody ProjectDetailContent content) {
        ProjectDetailContent savedContent = portfolioService.saveProjectDetailContent(content);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedContent);
    }

    // Create project detail content with media upload
    @PostMapping("/with-media")
    public ResponseEntity<ProjectDetailContent> createProjectDetailContentWithMedia(
            @RequestParam("projectId") String projectId,
            @RequestParam("projectDetailContentType") String projectDetailContentType,
            @RequestParam("displayOrder") Integer displayOrder,
            @RequestParam(value = "mediaFile", required = false) MultipartFile mediaFile,
            @RequestParam(value = "textContent", required = false) String textContent) {
        
        try {
            String projectDetailContent = null;

            // Handle media upload for IMAGE or VIDEO types
            if (mediaFile != null && !mediaFile.isEmpty()) {
                String folder = "project-details";
                projectDetailContent = mediaService.uploadFile(mediaFile, folder);
            } else if (textContent != null && !textContent.isEmpty()) {
                // For TEXT type, use the text content directly
                projectDetailContent = textContent;
            }

            // Parse enum
            ProjectDetailContent.ProjectDetailContentType contentType = 
                ProjectDetailContent.ProjectDetailContentType.valueOf(projectDetailContentType);

            // Create project detail content entity
            ProjectDetailContent content = new ProjectDetailContent();
            content.setProjectId(projectId);
            content.setProjectDetailContentType(contentType);
            content.setProjectDetailContent(projectDetailContent);
            content.setDisplayOrder(displayOrder);

            ProjectDetailContent savedContent = portfolioService.saveProjectDetailContent(content);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedContent);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProjectDetailContent> updateProjectDetailContent(@PathVariable String id, @Valid @RequestBody ProjectDetailContent content) {
        Optional<ProjectDetailContent> existingContent = portfolioService.getProjectDetailContentById(id);
        if (existingContent.isPresent()) {
            content.setId(id);
            ProjectDetailContent updatedContent = portfolioService.saveProjectDetailContent(content);
            return ResponseEntity.ok(updatedContent);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Update project detail content with media upload
    @PutMapping("/{id}/with-media")
    public ResponseEntity<ProjectDetailContent> updateProjectDetailContentWithMedia(
            @PathVariable String id,
            @RequestParam("projectId") String projectId,
            @RequestParam("projectDetailContentType") String projectDetailContentType,
            @RequestParam("displayOrder") Integer displayOrder,
            @RequestParam(value = "mediaFile", required = false) MultipartFile mediaFile,
            @RequestParam(value = "textContent", required = false) String textContent) {
        
        try {
            Optional<ProjectDetailContent> existingContent = portfolioService.getProjectDetailContentById(id);
            if (!existingContent.isPresent()) {
                return ResponseEntity.notFound().build();
            }

            String oldProjectDetailContent = null;
            ProjectDetailContent currentContent = existingContent.get();
            String projectDetailContent = currentContent.getProjectDetailContent();

            // Handle media upload for IMAGE or VIDEO types
            if (mediaFile != null && !mediaFile.isEmpty()) {
                String folder = "project-details";
                projectDetailContent = mediaService.uploadFile(mediaFile, folder);
                oldProjectDetailContent = currentContent.getProjectDetailContent();
            } else if (textContent != null && !textContent.isEmpty()) {
                // For TEXT type, use the text content directly
                projectDetailContent = textContent;
            }

            // Parse enum
            ProjectDetailContent.ProjectDetailContentType contentType = 
                ProjectDetailContent.ProjectDetailContentType.valueOf(projectDetailContentType);

            // Update project detail content entity
            ProjectDetailContent updatedContent = new ProjectDetailContent();
            updatedContent.setId(id);
            updatedContent.setProjectId(projectId);
            updatedContent.setProjectDetailContentType(contentType);
            updatedContent.setProjectDetailContent(projectDetailContent);
            updatedContent.setDisplayOrder(displayOrder);

            ProjectDetailContent savedContent = portfolioService.saveProjectDetailContent(updatedContent);
            if (oldProjectDetailContent != null) {
                mediaService.deleteFile(oldProjectDetailContent);
            }
            return ResponseEntity.ok(savedContent);
        } catch (Exception e) {
            System.out.println("Error in updateProjectDetailContentWithMedia: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProjectDetailContent(@PathVariable String id) {
        Optional<ProjectDetailContent> content = portfolioService.getProjectDetailContentById(id);
        if (content.isPresent()) {
            String projectDetailContent = content.get().getProjectDetailContent();
            String projectDetailContentType = content.get().getProjectDetailContentType().name();
            portfolioService.deleteProjectDetailContent(id);
            if (projectDetailContent != null && !projectDetailContentType.equals("TEXT")) {
                mediaService.deleteFile(projectDetailContent);
            }
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
