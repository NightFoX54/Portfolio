package com.berkay.portfolio.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.berkay.portfolio.model.ProfessionalSkills;
import com.berkay.portfolio.service.PortfolioService;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/professional-skills")
public class ProfessionalSkillsController {

    @Autowired
    private PortfolioService portfolioService;

    @GetMapping("/fetch")
    public ResponseEntity<List<ProfessionalSkills>> getAllProfessionalSkills() {
        List<ProfessionalSkills> skillsList = portfolioService.getAllProfessionalSkills();
        return ResponseEntity.ok(skillsList);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProfessionalSkills> getProfessionalSkillsById(@PathVariable String id) {
        Optional<ProfessionalSkills> skills = portfolioService.getProfessionalSkillsById(id);
        return skills.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<ProfessionalSkills> createProfessionalSkills(@Valid @RequestBody ProfessionalSkills skills) {
        ProfessionalSkills savedSkills = portfolioService.saveProfessionalSkills(skills);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedSkills);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProfessionalSkills> updateProfessionalSkills(@PathVariable String id, @Valid @RequestBody ProfessionalSkills skills) {
        Optional<ProfessionalSkills> existingSkills = portfolioService.getProfessionalSkillsById(id);
        if (existingSkills.isPresent()) {
            skills.setId(id);
            ProfessionalSkills updatedSkills = portfolioService.saveProfessionalSkills(skills);
            return ResponseEntity.ok(updatedSkills);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProfessionalSkills(@PathVariable String id) {
        Optional<ProfessionalSkills> skills = portfolioService.getProfessionalSkillsById(id);
        if (skills.isPresent()) {
            portfolioService.deleteProfessionalSkills(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
