package com.berkay.portfolio.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.berkay.portfolio.model.ProfessionalSkills;

public interface ProfessionalSkillsRepository extends MongoRepository<ProfessionalSkills, String> {
    List<ProfessionalSkills> findAllByOrderByDisplayOrderAsc();
    List<ProfessionalSkills> findAll();

}
