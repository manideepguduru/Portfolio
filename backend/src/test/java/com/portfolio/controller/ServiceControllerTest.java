package com.portfolio.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.portfolio.dto.ServiceDTO;
import com.portfolio.model.Service;
import com.portfolio.service.ServiceService;
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

@WebMvcTest(ServiceController.class)
@DisplayName("ServiceController MockMvc tests")
class ServiceControllerTest {

    @Autowired private MockMvc mockMvc;
    @MockBean  private ServiceService serviceService;
    @Autowired private ObjectMapper objectMapper;

    private Service sample;
    private ServiceDTO sampleDTO;

    @BeforeEach
    void setUp() {
        sample = Service.builder()
                .id(1L).title("Business Website Development")
                .description("Professional websites for businesses")
                .icon("🏢").priceRange("₹8,000 – ₹30,000")
                .sortOrder(1).active(true).build();

        sampleDTO = new ServiceDTO();
        sampleDTO.setTitle("Business Website Development");
        sampleDTO.setDescription("Professional websites for businesses");
        sampleDTO.setIcon("🏢");
        sampleDTO.setPriceRange("₹8,000 – ₹30,000");
        sampleDTO.setSortOrder(1);
        sampleDTO.setActive(true);
    }

    @Test
    @DisplayName("GET /api/services returns active services")
    void getActiveServices_returns200() throws Exception {
        when(serviceService.getActiveServices()).thenReturn(List.of(sample));
        mockMvc.perform(get("/api/services"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data[0].title").value("Business Website Development"));
    }

    @Test
    @DisplayName("GET /api/services/all returns all services")
    void getAllServices_returns200() throws Exception {
        when(serviceService.getAllServices()).thenReturn(List.of(sample));
        mockMvc.perform(get("/api/services/all"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    @DisplayName("POST /api/services returns 201 on creation")
    void createService_returns201() throws Exception {
        when(serviceService.createService(any(ServiceDTO.class))).thenReturn(sample);
        mockMvc.perform(post("/api/services")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(sampleDTO)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.data.icon").value("🏢"));
    }

    @Test
    @DisplayName("POST /api/services returns 400 when title is blank")
    void createService_blankTitle_returns400() throws Exception {
        sampleDTO.setTitle("");
        mockMvc.perform(post("/api/services")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(sampleDTO)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("PUT /api/services/{id} updates and returns 200")
    void updateService_returns200() throws Exception {
        when(serviceService.updateService(eq(1L), any(ServiceDTO.class))).thenReturn(sample);
        mockMvc.perform(put("/api/services/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(sampleDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    @DisplayName("DELETE /api/services/{id} returns 200")
    void deleteService_returns200() throws Exception {
        doNothing().when(serviceService).deleteService(1L);
        mockMvc.perform(delete("/api/services/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Service deleted successfully"));
    }
}
