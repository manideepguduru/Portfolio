package com.portfolio.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Generic API response wrapper for consistent JSON structure.
 *
 * @param <T> type of the response payload
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ApiResponse<T> {

    private boolean success;
    private String message;
    private T data;
    private LocalDateTime timestamp = LocalDateTime.now();

    /** Success response with data */
    public static <T> ApiResponse<T> success(String message, T data) {
        ApiResponse<T> res = new ApiResponse<>();
        res.success = true;
        res.message = message;
        res.data = data;
        res.timestamp = LocalDateTime.now();
        return res;
    }

    /** Success response without data */
    public static <T> ApiResponse<T> success(String message) {
        return success(message, null);
    }

    /** Error response */
    public static <T> ApiResponse<T> error(String message) {
        ApiResponse<T> res = new ApiResponse<>();
        res.success = false;
        res.message = message;
        res.timestamp = LocalDateTime.now();
        return res;
    }
}
