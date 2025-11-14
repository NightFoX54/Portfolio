package com.berkay.portfolio.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.berkay.portfolio.model.Projects;

public interface ProjectsRepository extends MongoRepository<Projects, String> {
    List<Projects> findAllByOrderByDisplayOrderAsc();
    List<Projects> findAll();
    List<Projects> findByDisplayOrder(Integer displayOrder);
    List<Projects> findByProjectName(String projectName);
    List<Projects> findByProjectDescription(String projectDescription);
    List<Projects> findByProjectLink(String projectLink);
}
