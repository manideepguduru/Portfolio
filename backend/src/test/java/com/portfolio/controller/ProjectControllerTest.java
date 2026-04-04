package com.portfolio.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.portfolio.dto.ProjectDTO;
import com.portfolio.exception.ResourceNotFoundException;
import com.portfolio.model.Project;
import com.portfolio.service.ProjectService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ProjectController.class)
@DisplayName("ProjectController MockMvc tests")
class ProjectControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ProjectService projectService;

    @Autowired
    private ObjectMapper objectMapper;

    private Project sampleProject;
    private ProjectDTO sampleDTO;

    @BeforeEach
    void setUp() {
        sampleProject = Project.builder()
                .id(1L).title("Air Quality Prediction")
                .description("ML project")
                .techStack("Python,Scikit-learn")
                .featured(true).sortOrder(1).build();

        sampleDTO = new ProjectDTO();
        sampleDTO.setTitle("Air Quality Prediction");
        sampleDTO.setDescription("ML project");
        sampleDTO.setTechStack("Python,Scikit-learn");
        sampleDTO.setFeatured(true);
        sampleDTO.setSortOrder(1);
    }

    @Test
    @DisplayName("GET /api/projects returns 200 with project list")
    void getAllProjects_returns200() throws Exception {
        when(projectService.getAllProjects()).thenReturn(List.of(sampleProject));

        mockMvc.perform(get("/api/projects"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data[0].title").value("Air Quality Prediction"));
    }

    @Test
    @DisplayName("GET /api/projects/{id} returns 200 when found")
    void getProjectById_found_returns200() throws Exception {
        when(projectService.getProjectById(1L)).thenReturn(sampleProject);

        mockMvc.perform(get("/api/projects/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.id").value(1));
    }

    @Test
    @DisplayName("GET /api/projects/{id} returns 404 when not found")
    void getProjectById_notFound_returns404() throws Exception {
        when(projectService.getProjectById(99L))
                .thenThrow(new ResourceNotFoundException("Project", 99L));

        mockMvc.perform(get("/api/projects/99"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    @DisplayName("POST /api/projects returns 201 with created project")
    void createProject_returns201() throws Exception {
        when(projectService.createProject(any(ProjectDTO.class))).thenReturn(sampleProject);

        mockMvc.perform(post("/api/projects")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(sampleDTO)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.data.title").value("Air Quality Prediction"));
    }

    @Test
    @DisplayName("POST /api/projects returns 400 when title is blank")
    void createProject_blankTitle_returns400() throws Exception {
        sampleDTO.setTitle("");

        mockMvc.perform(post("/api/projects")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(sampleDTO)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    @DisplayName("PUT /api/projects/{id} returns 200 with updated project")
    void updateProject_returns200() throws Exception {
        when(projectService.updateProject(eq(1L), any(ProjectDTO.class))).thenReturn(sampleProject);

        mockMvc.perform(put("/api/projects/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(sampleDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    @DisplayName("DELETE /api/projects/{id} returns 200")
    void deleteProject_returns200() throws Exception {
        doNothing().when(projectService).deleteProject(1L);

        mockMvc.perform(delete("/api/projects/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }
}
