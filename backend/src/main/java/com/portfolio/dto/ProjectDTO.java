package com.portfolio.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * DTO used for creating / updating a Project.
 */
@Data
public class ProjectDTO {

    @NotBlank(message = "Title is required")
    @Size(max = 200, message = "Title must be ≤ 200 characters")
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    @NotBlank(message = "Tech stack is required")
    @Size(max = 500)
    private String techStack;

    @Size(max = 500)
    private String githubUrl;

    @Size(max = 500)
    private String liveUrl;

    @Size(max = 500)
    private String imageUrl;

    private Boolean featured = false;
    private Integer sortOrder = 0;
}
