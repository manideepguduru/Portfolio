package com.portfolio.service;

import com.portfolio.dto.ProjectDTO;
import com.portfolio.exception.ResourceNotFoundException;
import com.portfolio.model.Project;
import com.portfolio.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Business logic for Project CRUD operations.
 */
@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;

    /** Return all projects ordered by sort_order. */
    public List<Project> getAllProjects() {
        return projectRepository.findAllByOrderBySortOrderAsc();
    }

    /** Return featured projects only. */
    public List<Project> getFeaturedProjects() {
        return projectRepository.findByFeaturedTrueOrderBySortOrderAsc();
    }

    /** Return a single project by ID or throw 404. */
    public Project getProjectById(Long id) {
        return projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project", id));
    }

    /** Create a new project from a DTO. */
    public Project createProject(ProjectDTO dto) {
        Project project = Project.builder()
                .title(dto.getTitle())
                .description(dto.getDescription())
                .techStack(dto.getTechStack())
                .githubUrl(dto.getGithubUrl())
                .liveUrl(dto.getLiveUrl())
                .imageUrl(dto.getImageUrl())
                .featured(dto.getFeatured() != null ? dto.getFeatured() : false)
                .sortOrder(dto.getSortOrder() != null ? dto.getSortOrder() : 0)
                .build();
        return projectRepository.save(project);
    }

    /** Update an existing project. Throws 404 if not found. */
    public Project updateProject(Long id, ProjectDTO dto) {
        Project existing = getProjectById(id);
        existing.setTitle(dto.getTitle());
        existing.setDescription(dto.getDescription());
        existing.setTechStack(dto.getTechStack());
        existing.setGithubUrl(dto.getGithubUrl());
        existing.setLiveUrl(dto.getLiveUrl());
        existing.setImageUrl(dto.getImageUrl());
        existing.setFeatured(dto.getFeatured() != null ? dto.getFeatured() : false);
        existing.setSortOrder(dto.getSortOrder() != null ? dto.getSortOrder() : 0);
        return projectRepository.save(existing);
    }

    /** Delete a project by ID. Throws 404 if not found. */
    public void deleteProject(Long id) {
        getProjectById(id); // ensures 404 if missing
        projectRepository.deleteById(id);
    }
}
