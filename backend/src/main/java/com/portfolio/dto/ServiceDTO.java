package com.portfolio.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * DTO used for creating / updating a Service offering.
 */
@Data
public class ServiceDTO {

    @NotBlank(message = "Title is required")
    @Size(max = 200)
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    @Size(max = 100)
    private String icon;

    @Size(max = 100)
    private String priceRange;

    private Integer sortOrder = 0;
    private Boolean active = true;
}
