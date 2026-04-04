package com.portfolio.service;

import com.portfolio.dto.ServiceDTO;
import com.portfolio.exception.ResourceNotFoundException;
import com.portfolio.model.Service;
import com.portfolio.repository.ServiceRepository;
import lombok.RequiredArgsConstructor;

import java.util.List;

/**
 * Business logic for Service-offering CRUD operations.
 */
@org.springframework.stereotype.Service
@RequiredArgsConstructor
public class ServiceService {

    private final ServiceRepository serviceRepository;

    /** Return all active services ordered by sort_order. */
    public List<Service> getActiveServices() {
        return serviceRepository.findByActiveTrueOrderBySortOrderAsc();
    }

    /** Return every service (for admin panel). */
    public List<Service> getAllServices() {
        return serviceRepository.findAllByOrderBySortOrderAsc();
    }

    /** Return a single service by ID or throw 404. */
    public Service getServiceById(Long id) {
        return serviceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Service", id));
    }

    /** Create a new service from a DTO. */
    public Service createService(ServiceDTO dto) {
        Service service = Service.builder()
                .title(dto.getTitle())
                .description(dto.getDescription())
                .icon(dto.getIcon())
                .priceRange(dto.getPriceRange())
                .sortOrder(dto.getSortOrder() != null ? dto.getSortOrder() : 0)
                .active(dto.getActive() != null ? dto.getActive() : true)
                .build();
        return serviceRepository.save(service);
    }

    /** Update an existing service. Throws 404 if not found. */
    public Service updateService(Long id, ServiceDTO dto) {
        Service existing = getServiceById(id);
        existing.setTitle(dto.getTitle());
        existing.setDescription(dto.getDescription());
        existing.setIcon(dto.getIcon());
        existing.setPriceRange(dto.getPriceRange());
        existing.setSortOrder(dto.getSortOrder() != null ? dto.getSortOrder() : 0);
        existing.setActive(dto.getActive() != null ? dto.getActive() : true);
        return serviceRepository.save(existing);
    }

    /** Delete a service by ID. Throws 404 if not found. */
    public void deleteService(Long id) {
        getServiceById(id);
        serviceRepository.deleteById(id);
    }
}
