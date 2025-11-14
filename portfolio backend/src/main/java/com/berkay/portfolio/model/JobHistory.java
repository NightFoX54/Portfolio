package com.berkay.portfolio.model;

import java.time.LocalDate;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document("job_history")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class JobHistory {
    @Id
    private String id;
    @NotBlank(message = "Company name is required")
    private String companyName;
    @NotBlank(message = "Job title is required")
    private String jobTitle;
    @NotNull(message = "Start date is required")
    private LocalDate startDate;
    private LocalDate endDate;
    @NotNull(message = "Is current is required")
    private Boolean isCurrent = false;
    @NotBlank(message = "Description is required")
    private String description;
    @NotBlank(message = "Location is required")
    private String location;

    @NotNull(message = "Display order is required")
    @Min(value = 1, message = "Display order must be greater than 0")
    private Integer displayOrder;

    private String companyLogo;
}
