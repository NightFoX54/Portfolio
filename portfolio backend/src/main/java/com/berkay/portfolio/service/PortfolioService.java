package com.berkay.portfolio.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.berkay.portfolio.model.EducationHistory;
import com.berkay.portfolio.model.JobHistory;
import com.berkay.portfolio.model.PersonalInfo;
import com.berkay.portfolio.model.ProfessionalSkills;
import com.berkay.portfolio.model.ProjectDetailContent;
import com.berkay.portfolio.model.Projects;
import com.berkay.portfolio.repository.EducationHistoryRepository;
import com.berkay.portfolio.repository.JobHistoryRepository;
import com.berkay.portfolio.repository.PersonalInfoRepository;
import com.berkay.portfolio.repository.ProfessionalSkillsRepository;
import com.berkay.portfolio.repository.ProjectDetailContentRepository;
import com.berkay.portfolio.repository.ProjectsRepository;

@Service
public class PortfolioService {

    @Autowired
    private PersonalInfoRepository personalInfoRepository;

    @Autowired
    private ProjectsRepository projectsRepository;

    @Autowired
    private ProjectDetailContentRepository projectDetailContentRepository;

    @Autowired
    private JobHistoryRepository jobHistoryRepository;

    @Autowired
    private EducationHistoryRepository educationHistoryRepository;

    @Autowired
    private ProfessionalSkillsRepository professionalSkillsRepository;

    // Personal Info methods
    public List<PersonalInfo> getAllPersonalInfo() {
        return personalInfoRepository.findAll();
    }

    public Optional<PersonalInfo> getPersonalInfoById(String id) {
        return personalInfoRepository.findById(id);
    }

    public PersonalInfo savePersonalInfo(PersonalInfo personalInfo) {
        return personalInfoRepository.save(personalInfo);
    }

    public void deletePersonalInfo(String id) {
        personalInfoRepository.deleteById(id);
    }

    // Projects methods
    public List<Projects> getAllProjects() {
        return projectsRepository.findAllByOrderByDisplayOrderAsc();
    }

    public Optional<Projects> getProjectById(String id) {
        return projectsRepository.findById(id);
    }

    public Projects saveProject(Projects project) {
        return projectsRepository.save(project);
    }

    public void deleteProject(String id) {
        projectsRepository.deleteById(id);
    }

    // Project Detail Content methods
    public List<ProjectDetailContent> getAllProjectDetailContent() {
        return projectDetailContentRepository.findAll();
    }

    public Optional<ProjectDetailContent> getProjectDetailContentById(String id) {
        return projectDetailContentRepository.findById(id);
    }

    public List<ProjectDetailContent> getProjectDetailContentByProjectId(String projectId) {
        return projectDetailContentRepository.findByProjectId(projectId);
    }

    public ProjectDetailContent saveProjectDetailContent(ProjectDetailContent content) {
        return projectDetailContentRepository.save(content);
    }

    public void deleteProjectDetailContent(String id) {
        projectDetailContentRepository.deleteById(id);
    }

    // Job History methods
    public List<JobHistory> getAllJobHistory() {
        return jobHistoryRepository.findAllByOrderByDisplayOrderAsc();
    }

    public Optional<JobHistory> getJobHistoryById(String id) {
        return jobHistoryRepository.findById(id);
    }

    public JobHistory saveJobHistory(JobHistory jobHistory) {
        return jobHistoryRepository.save(jobHistory);
    }

    public void deleteJobHistory(String id) {
        jobHistoryRepository.deleteById(id);
    }

    // Education History methods
    public List<EducationHistory> getAllEducationHistory() {
        return educationHistoryRepository.findAllByOrderByDisplayOrderAsc();
    }

    public Optional<EducationHistory> getEducationHistoryById(String id) {
        return educationHistoryRepository.findById(id);
    }

    public EducationHistory saveEducationHistory(EducationHistory educationHistory) {
        return educationHistoryRepository.save(educationHistory);
    }

    public void deleteEducationHistory(String id) {
        educationHistoryRepository.deleteById(id);
    }

    // Professional Skills methods
    public List<ProfessionalSkills> getAllProfessionalSkills() {
        return professionalSkillsRepository.findAllByOrderByDisplayOrderAsc();
    }

    public Optional<ProfessionalSkills> getProfessionalSkillsById(String id) {
        return professionalSkillsRepository.findById(id);
    }

    public ProfessionalSkills saveProfessionalSkills(ProfessionalSkills skills) {
        return professionalSkillsRepository.save(skills);
    }

    public void deleteProfessionalSkills(String id) {
        professionalSkillsRepository.deleteById(id);
    }
}
