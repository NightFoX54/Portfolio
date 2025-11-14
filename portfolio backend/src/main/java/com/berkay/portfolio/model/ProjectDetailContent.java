package com.berkay.portfolio.model;

import org.springframework.data.annotation.Id;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Builder;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Document("project_detail_content")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ProjectDetailContent {
    @Id
    private String id;
    @NotNull(message = "Project is required")
    @Field("project_id")
    private String projectId;
    @NotNull(message = "Project detail content type is required")
    private ProjectDetailContentType projectDetailContentType;
    @NotBlank(message = "Project detail content is required")
    private String projectDetailContent;
    @NotNull(message = "Display order is required")
    @Min(value = 1, message = "Display order must be greater than 0")
    private Integer displayOrder;

    public enum ProjectDetailContentType {
        TEXT("Text"), IMAGE("Image"), VIDEO("Video");
        private String name;
        private ProjectDetailContentType(String name) {
            this.name = name;
        }
        public String getName() {
            return name;
        }
    }
}
