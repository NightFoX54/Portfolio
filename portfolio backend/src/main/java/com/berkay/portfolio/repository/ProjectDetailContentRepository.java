package com.berkay.portfolio.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.berkay.portfolio.model.ProjectDetailContent;

public interface ProjectDetailContentRepository extends MongoRepository<ProjectDetailContent, String> {
    List<ProjectDetailContent> findAllByOrderByDisplayOrderAsc();
    List<ProjectDetailContent> findAll();
    List<ProjectDetailContent> findByDisplayOrder(Integer displayOrder);
    List<ProjectDetailContent> findByProjectId(String projectId);
}
