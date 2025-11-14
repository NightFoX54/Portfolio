package com.berkay.portfolio.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document("projects")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Projects {
    @Id
    private String id;
    @NotBlank(message = "Project name is required")
    private String projectName;
    @NotBlank(message = "Project description is required")
    private String projectDescription;
    @NotBlank(message = "Project URL is required")
    private String projectLink;


    private String projectLink2 = null;
    private String projectLink3 = null;
    @NotNull(message = "Project content type is required")
    private ProjectContentType projectContentType;
    @NotBlank(message = "Project content is required")
    private String projectContent;
    @NotBlank(message = "Project technologies is required")
    private String projectTechnologies;
    @NotNull(message = "Display order is required")
    @Min(value = 1, message = "Display order must be greater than 0")
    private Integer displayOrder;

    public enum ProjectContentType {
        IMAGE("Image"), VIDEO("Video");
        private String name;
        private ProjectContentType(String name) {
            this.name = name;
        }
        public String getName() {
            return name;
        }
    }
}
