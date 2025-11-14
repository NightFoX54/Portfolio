package com.berkay.portfolio.model;

import java.time.LocalDate;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document("education_history")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class EducationHistory {
    @Id
    private String id;
    @NotBlank(message = "School name is required")
    private String schoolName;
    @NotBlank(message = "Degree is required")
    private String degree;
    @NotBlank(message = "Field of study is required")
    private String fieldOfStudy;
    @NotNull(message = "Start date is required")
    private LocalDate startDate;
    private LocalDate endDate;

    @NotNull(message = "Is current is required")
    private Boolean isCurrent = false;

    @NotBlank(message = "Description is required")
    private String description;
    @NotBlank(message = "Location is required")
    private String location;
    @NotBlank(message = "GPA is required")
    @Pattern(regexp = "^\\d{1,3}\\.\\d{2}$", message = "Invalid GPA")
    private String gpa;

    @NotNull(message = "Display order is required")
    @Min(value = 1, message = "Display order must be greater than 0")
    private Integer displayOrder;
}
