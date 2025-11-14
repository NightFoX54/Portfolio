package com.berkay.portfolio.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.berkay.portfolio.model.JobHistory;

public interface JobHistoryRepository extends MongoRepository<JobHistory, String> {
    List<JobHistory> findAllByOrderByDisplayOrderAsc();
    List<JobHistory> findAll();
    List<JobHistory> findByDisplayOrder(Integer displayOrder);
    List<JobHistory> findByCompanyName(String companyName);
    List<JobHistory> findByJobTitle(String jobTitle);
    List<JobHistory> findByStartDate(LocalDate startDate);
    List<JobHistory> findByEndDate(LocalDate endDate);
    List<JobHistory> findByIsCurrent(Boolean isCurrent);
    List<JobHistory> findByDescription(String description);
    List<JobHistory> findByLocation(String location);
}
