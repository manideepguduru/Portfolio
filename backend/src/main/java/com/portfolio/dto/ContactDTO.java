package com.portfolio.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * DTO used for submitting the contact form.
 */
@Data
public class ContactDTO {

    @NotBlank(message = "Name is required")
    @Size(max = 150, message = "Name must be ≤ 150 characters")
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Email must be valid")
    @Size(max = 255)
    private String email;

    @Pattern(
        regexp = "^(\\+\\d{1,3})?\\d{10,15}$|^$",
        message = "Phone must be a valid number (10-15 digits, optional +country code)"
    )
    @Size(max = 20, message = "Phone must be ≤ 20 characters")
    private String phone;

    @NotBlank(message = "Subject is required")
    @Size(max = 300, message = "Subject must be ≤ 300 characters")
    private String subject;

    @NotBlank(message = "Message is required")
    @Size(min = 10, message = "Message must be at least 10 characters")
    private String message;
}
