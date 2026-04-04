package com.portfolio.service;

import com.portfolio.dto.ProjectDTO;
import com.portfolio.exception.ResourceNotFoundException;
import com.portfolio.model.Project;
import com.portfolio.repository.ProjectRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("ProjectService unit tests")
class ProjectServiceTest {

    @Mock
    private ProjectRepository projectRepository;

    @InjectMocks
    private ProjectService projectService;

    private Project sampleProject;
    private ProjectDTO sampleDTO;

    @BeforeEach
    void setUp() {
        sampleProject = Project.builder()
                .id(1L).title("Test Project")
                .description("A test project")
                .techStack("Java,Spring Boot")
                .featured(true).sortOrder(1).build();

        sampleDTO = new ProjectDTO();
        sampleDTO.setTitle("Test Project");
        sampleDTO.setDescription("A test project");
        sampleDTO.setTechStack("Java,Spring Boot");
        sampleDTO.setFeatured(true);
        sampleDTO.setSortOrder(1);
    }

    @Test
    @DisplayName("getAllProjects returns list ordered by sortOrder")
    void getAllProjects_returnsList() {
        when(projectRepository.findAllByOrderBySortOrderAsc()).thenReturn(List.of(sampleProject));

        List<Project> result = projectService.getAllProjects();

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getTitle()).isEqualTo("Test Project");
        verify(projectRepository).findAllByOrderBySortOrderAsc();
    }

    @Test
    @DisplayName("getFeaturedProjects returns only featured")
    void getFeaturedProjects_returnsOnlyFeatured() {
        when(projectRepository.findByFeaturedTrueOrderBySortOrderAsc()).thenReturn(List.of(sampleProject));

        List<Project> result = projectService.getFeaturedProjects();

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getFeatured()).isTrue();
    }

    @Test
    @DisplayName("getProjectById returns project when found")
    void getProjectById_found() {
        when(projectRepository.findById(1L)).thenReturn(Optional.of(sampleProject));

        Project result = projectService.getProjectById(1L);

        assertThat(result.getId()).isEqualTo(1L);
    }

    @Test
    @DisplayName("getProjectById throws ResourceNotFoundException when not found")
    void getProjectById_notFound_throws() {
        when(projectRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> projectService.getProjectById(99L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("99");
    }

    @Test
    @DisplayName("createProject saves and returns new project")
    void createProject_savesAndReturns() {
        when(projectRepository.save(any(Project.class))).thenReturn(sampleProject);

        Project result = projectService.createProject(sampleDTO);

        assertThat(result.getTitle()).isEqualTo("Test Project");
        verify(projectRepository).save(any(Project.class));
    }

    @Test
    @DisplayName("updateProject updates fields and saves")
    void updateProject_updatesFields() {
        when(projectRepository.findById(1L)).thenReturn(Optional.of(sampleProject));
        when(projectRepository.save(any(Project.class))).thenReturn(sampleProject);

        sampleDTO.setTitle("Updated Title");
        Project result = projectService.updateProject(1L, sampleDTO);

        verify(projectRepository).save(any(Project.class));
        assertThat(result).isNotNull();
    }

    @Test
    @DisplayName("deleteProject calls deleteById when project exists")
    void deleteProject_callsDelete() {
        when(projectRepository.findById(1L)).thenReturn(Optional.of(sampleProject));

        projectService.deleteProject(1L);

        verify(projectRepository).deleteById(1L);
    }

    @Test
    @DisplayName("deleteProject throws when project does not exist")
    void deleteProject_notFound_throws() {
        when(projectRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> projectService.deleteProject(99L))
                .isInstanceOf(ResourceNotFoundException.class);

        verify(projectRepository, never()).deleteById(any());
    }
}
