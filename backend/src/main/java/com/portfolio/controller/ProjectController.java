package com.portfolio.controller;

import com.portfolio.dto.ApiResponse;
import com.portfolio.dto.ProjectDTO;
import com.portfolio.model.Project;
import com.portfolio.service.ProjectService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller for Project endpoints.
 *
 * Public  : GET  /api/projects, /api/projects/featured, /api/projects/{id}
 * Admin   : POST /api/projects, PUT /api/projects/{id}, DELETE /api/projects/{id}
 */
@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Project>>> getAllProjects() {
        List<Project> projects = projectService.getAllProjects();
        return ResponseEntity.ok(ApiResponse.success("Projects fetched successfully", projects));
    }

    @GetMapping("/featured")
    public ResponseEntity<ApiResponse<List<Project>>> getFeaturedProjects() {
        List<Project> projects = projectService.getFeaturedProjects();
        return ResponseEntity.ok(ApiResponse.success("Featured projects fetched", projects));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Project>> getProjectById(@PathVariable Long id) {
        Project project = projectService.getProjectById(id);
        return ResponseEntity.ok(ApiResponse.success("Project fetched", project));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Project>> createProject(@Valid @RequestBody ProjectDTO dto) {
        Project created = projectService.createProject(dto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Project created successfully", created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Project>> updateProject(
            @PathVariable Long id, @Valid @RequestBody ProjectDTO dto) {
        Project updated = projectService.updateProject(id, dto);
        return ResponseEntity.ok(ApiResponse.success("Project updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteProject(@PathVariable Long id) {
        projectService.deleteProject(id);
        return ResponseEntity.ok(ApiResponse.success("Project deleted successfully"));
    }
}
