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

@Document("professional_skills")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ProfessionalSkills {
    @Id
    private String id;
    @NotBlank(message = "Skill name is required")
    private String skillName;
    @NotNull(message = "Skill level is required")
    private SkillLevel skillLevel;
    @NotNull(message = "Display order is required")
    @Min(value = 1, message = "Display order must be greater than 0")
    private Integer displayOrder;


    public enum SkillLevel {
        BEGINNER("Beginner"), INTERMEDIATE("Intermediate"), ADVANCED("Advanced");
        private String name;
        private SkillLevel(String name) {
            this.name = name;
        }
        public String getName() {
            return name;
        }
    }
}
