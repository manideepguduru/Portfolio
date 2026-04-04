package com.portfolio.service;

import com.portfolio.dto.ServiceDTO;
import com.portfolio.exception.ResourceNotFoundException;
import com.portfolio.model.Service;
import com.portfolio.repository.ServiceRepository;
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
@DisplayName("ServiceService unit tests")
class ServiceServiceTest {

    @Mock  private ServiceRepository serviceRepository;
    @InjectMocks private ServiceService serviceService;

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
    @DisplayName("getActiveServices returns only active services")
    void getActiveServices_returnsActive() {
        when(serviceRepository.findByActiveTrueOrderBySortOrderAsc()).thenReturn(List.of(sample));
        List<Service> result = serviceService.getActiveServices();
        assertThat(result).hasSize(1);
        assertThat(result.get(0).getActive()).isTrue();
    }

    @Test
    @DisplayName("getAllServices returns all regardless of active flag")
    void getAllServices_returnsAll() {
        Service inactive = Service.builder().id(2L).title("Old Service").active(false).build();
        when(serviceRepository.findAllByOrderBySortOrderAsc()).thenReturn(List.of(sample, inactive));
        List<Service> result = serviceService.getAllServices();
        assertThat(result).hasSize(2);
    }

    @Test
    @DisplayName("getServiceById returns service when found")
    void getServiceById_found() {
        when(serviceRepository.findById(1L)).thenReturn(Optional.of(sample));
        Service result = serviceService.getServiceById(1L);
        assertThat(result.getTitle()).isEqualTo("Business Website Development");
    }

    @Test
    @DisplayName("getServiceById throws ResourceNotFoundException when not found")
    void getServiceById_notFound_throws() {
        when(serviceRepository.findById(99L)).thenReturn(Optional.empty());
        assertThatThrownBy(() -> serviceService.getServiceById(99L))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    @DisplayName("createService saves and returns new service")
    void createService_savesAndReturns() {
        when(serviceRepository.save(any(Service.class))).thenReturn(sample);
        Service result = serviceService.createService(sampleDTO);
        assertThat(result.getTitle()).isEqualTo("Business Website Development");
        verify(serviceRepository).save(any(Service.class));
    }

    @Test
    @DisplayName("updateService updates all fields and saves")
    void updateService_updatesFields() {
        when(serviceRepository.findById(1L)).thenReturn(Optional.of(sample));
        when(serviceRepository.save(any(Service.class))).thenReturn(sample);
        sampleDTO.setTitle("Updated Service");
        serviceService.updateService(1L, sampleDTO);
        verify(serviceRepository).save(any(Service.class));
    }

    @Test
    @DisplayName("deleteService calls deleteById when service exists")
    void deleteService_callsDelete() {
        when(serviceRepository.findById(1L)).thenReturn(Optional.of(sample));
        serviceService.deleteService(1L);
        verify(serviceRepository).deleteById(1L);
    }

    @Test
    @DisplayName("deleteService throws when service does not exist")
    void deleteService_notFound_throws() {
        when(serviceRepository.findById(99L)).thenReturn(Optional.empty());
        assertThatThrownBy(() -> serviceService.deleteService(99L))
                .isInstanceOf(ResourceNotFoundException.class);
        verify(serviceRepository, never()).deleteById(any());
    }
}
