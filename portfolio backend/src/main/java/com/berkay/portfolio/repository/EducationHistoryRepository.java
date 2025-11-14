package com.berkay.portfolio.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.berkay.portfolio.model.EducationHistory;

public interface EducationHistoryRepository extends MongoRepository<EducationHistory, String> {
    List<EducationHistory> findAllByOrderByDisplayOrderAsc();
    List<EducationHistory> findAll();
    List<EducationHistory> findByDisplayOrder(Integer displayOrder);
    List<EducationHistory> findBySchoolName(String schoolName);
    List<EducationHistory> findByDegree(String degree);
    List<EducationHistory> findByFieldOfStudy(String fieldOfStudy);
    List<EducationHistory> findByStartDate(LocalDate startDate);
    List<EducationHistory> findByEndDate(LocalDate endDate);
    List<EducationHistory> findByIsCurrent(Boolean isCurrent);
    List<EducationHistory> findByDescription(String description);
    List<EducationHistory> findByLocation(String location);
    List<EducationHistory> findByGpa(String gpa);
}
