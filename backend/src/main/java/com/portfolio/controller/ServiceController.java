package com.portfolio.controller;

import com.portfolio.dto.ApiResponse;
import com.portfolio.dto.ServiceDTO;
import com.portfolio.model.Service;
import com.portfolio.service.ServiceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller for Service-offering endpoints.
 *
 * Public  : GET  /api/services          (active only)
 * Admin   : GET  /api/services/all      (all, including inactive)
 *           POST, PUT, DELETE
 */
@RestController
@RequestMapping("/api/services")
@RequiredArgsConstructor
public class ServiceController {

    private final ServiceService serviceService;

    /** Public endpoint — returns only active services */
    @GetMapping
    public ResponseEntity<ApiResponse<List<Service>>> getActiveServices() {
        List<Service> services = serviceService.getActiveServices();
        return ResponseEntity.ok(ApiResponse.success("Services fetched successfully", services));
    }

    /** Admin endpoint — returns all services regardless of active flag */
    @GetMapping("/all")
    public ResponseEntity<ApiResponse<List<Service>>> getAllServices() {
        List<Service> services = serviceService.getAllServices();
        return ResponseEntity.ok(ApiResponse.success("All services fetched", services));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Service>> getServiceById(@PathVariable Long id) {
        Service service = serviceService.getServiceById(id);
        return ResponseEntity.ok(ApiResponse.success("Service fetched", service));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Service>> createService(@Valid @RequestBody ServiceDTO dto) {
        Service created = serviceService.createService(dto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Service created successfully", created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Service>> updateService(
            @PathVariable Long id, @Valid @RequestBody ServiceDTO dto) {
        Service updated = serviceService.updateService(id, dto);
        return ResponseEntity.ok(ApiResponse.success("Service updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteService(@PathVariable Long id) {
        serviceService.deleteService(id);
        return ResponseEntity.ok(ApiResponse.success("Service deleted successfully"));
    }
}
