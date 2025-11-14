package com.berkay.portfolio.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.berkay.portfolio.model.Projects;
import com.berkay.portfolio.service.PortfolioService;
import com.berkay.portfolio.service.MediaService;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/projects")
public class ProjectsController {

    @Autowired
    private PortfolioService portfolioService;

    @Autowired
    private MediaService mediaService;

    @GetMapping("/fetch")
    public ResponseEntity<List<Projects>> getAllProjects() {
        List<Projects> projects = portfolioService.getAllProjects();
        return ResponseEntity.ok(projects);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Projects> getProjectById(@PathVariable String id) {
        Optional<Projects> project = portfolioService.getProjectById(id);
        return project.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Projects> createProject(@Valid @RequestBody Projects project) {
        Projects savedProject = portfolioService.saveProject(project);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedProject);
    }

    // NEW: Create project with media upload in single request
    @PostMapping("/with-media")
    public ResponseEntity<Projects> createProjectWithMedia(
            @RequestParam("projectName") String projectName,
            @RequestParam("projectDescription") String projectDescription,
            @RequestParam("projectLink") String projectLink,
            @RequestParam(value = "projectLink2", required = false) String projectLink2,
            @RequestParam(value = "projectLink3", required = false) String projectLink3,
            @RequestParam("projectContentType") String projectContentType,
            @RequestParam("projectTechnologies") String projectTechnologies,
            @RequestParam("displayOrder") Integer displayOrder,
            @RequestParam(value = "mediaFile", required = false) MultipartFile mediaFile) {
        
        try {
            String projectContent = null;
            if (mediaFile != null && !mediaFile.isEmpty()) {
                // Upload media and get URL
                projectContent = mediaService.uploadFile(mediaFile, "projects");
            }

            // Create project entity
            Projects project = Projects.builder()
                    .projectName(projectName)
                    .projectDescription(projectDescription)
                    .projectLink(projectLink)
                    .projectLink2(projectLink2)
                    .projectLink3(projectLink3)
                    .projectContentType(Projects.ProjectContentType.valueOf(projectContentType))
                    .projectContent(projectContent)
                    .projectTechnologies(projectTechnologies)
                    .displayOrder(displayOrder)
                    .build();

            Projects savedProject = portfolioService.saveProject(project);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedProject);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Projects> updateProject(@PathVariable String id, @Valid @RequestBody Projects project) {
        Optional<Projects> existingProject = portfolioService.getProjectById(id);
        if (existingProject.isPresent()) {
            project.setId(id);
            Projects updatedProject = portfolioService.saveProject(project);
            return ResponseEntity.ok(updatedProject);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Update project with media upload
    @PutMapping("/{id}/with-media")
    public ResponseEntity<Projects> updateProjectWithMedia(
            @PathVariable String id,
            @RequestParam("projectName") String projectName,
            @RequestParam("projectDescription") String projectDescription,
            @RequestParam("projectLink") String projectLink,
            @RequestParam(value = "projectLink2", required = false) String projectLink2,
            @RequestParam(value = "projectLink3", required = false) String projectLink3,
            @RequestParam("projectContentType") String projectContentType,
            @RequestParam("projectTechnologies") String projectTechnologies,
            @RequestParam("displayOrder") Integer displayOrder,
            @RequestParam(value = "mediaFile", required = false) MultipartFile mediaFile) {
        
        try {
            Optional<Projects> existingProject = portfolioService.getProjectById(id);
            if (!existingProject.isPresent()) {
                return ResponseEntity.notFound().build();
            }

            String oldProjectContent = null;
            Projects currentProject = existingProject.get();
            String projectContent = currentProject.getProjectContent();

            // Upload new media if provided
            if (mediaFile != null && !mediaFile.isEmpty()) {
                projectContent = mediaService.uploadFile(mediaFile, "projects");
                oldProjectContent = currentProject.getProjectContent();
            }

            // Update project entity
            Projects updatedProject = Projects.builder()
                    .id(id)
                    .projectName(projectName)
                    .projectDescription(projectDescription)
                    .projectLink(projectLink)
                    .projectLink2(projectLink2)
                    .projectLink3(projectLink3)
                    .projectContentType(Projects.ProjectContentType.valueOf(projectContentType))
                    .projectContent(projectContent)
                    .projectTechnologies(projectTechnologies)
                    .displayOrder(displayOrder)
                    .build();

            Projects savedProject = portfolioService.saveProject(updatedProject);
            if (oldProjectContent != null) {
                mediaService.deleteFile(oldProjectContent);
            }
            return ResponseEntity.ok(savedProject);
        } catch (Exception e) {
            System.out.println("Error in updateProjectWithMedia: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProject(@PathVariable String id) {
        Optional<Projects> project = portfolioService.getProjectById(id);
        if (project.isPresent()) {
            String projectContent = project.get().getProjectContent();
            if (projectContent != null) {
                mediaService.deleteFile(projectContent);
            }
            portfolioService.deleteProject(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}