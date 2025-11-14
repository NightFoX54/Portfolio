package com.berkay.portfolio.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.berkay.portfolio.model.EducationHistory;
import com.berkay.portfolio.service.PortfolioService;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/education-history")
public class EducationHistoryController {

    @Autowired
    private PortfolioService portfolioService;

    @GetMapping("/fetch")
    public ResponseEntity<List<EducationHistory>> getAllEducationHistory() {
        List<EducationHistory> educationHistoryList = portfolioService.getAllEducationHistory();
        return ResponseEntity.ok(educationHistoryList);
    }

    @GetMapping("/{id}")
    public ResponseEntity<EducationHistory> getEducationHistoryById(@PathVariable String id) {
        Optional<EducationHistory> educationHistory = portfolioService.getEducationHistoryById(id);
        return educationHistory.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<EducationHistory> createEducationHistory(@Valid @RequestBody EducationHistory educationHistory) {
        EducationHistory savedEducationHistory = portfolioService.saveEducationHistory(educationHistory);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedEducationHistory);
    }

    @PutMapping("/{id}")
    public ResponseEntity<EducationHistory> updateEducationHistory(@PathVariable String id, @Valid @RequestBody EducationHistory educationHistory) {
        Optional<EducationHistory> existingEducationHistory = portfolioService.getEducationHistoryById(id);
        if (existingEducationHistory.isPresent()) {
            educationHistory.setId(id);
            EducationHistory updatedEducationHistory = portfolioService.saveEducationHistory(educationHistory);
            return ResponseEntity.ok(updatedEducationHistory);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEducationHistory(@PathVariable String id) {
        Optional<EducationHistory> educationHistory = portfolioService.getEducationHistoryById(id);
        if (educationHistory.isPresent()) {
            portfolioService.deleteEducationHistory(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
