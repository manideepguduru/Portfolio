package com.portfolio.repository;

import com.portfolio.model.Service;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data JPA repository for Service entities.
 */
@Repository
public interface ServiceRepository extends JpaRepository<Service, Long> {

    /** Return only active services ordered by sort_order ASC */
    List<Service> findByActiveTrueOrderBySortOrderAsc();

    /** Return all services ordered by sort_order ASC */
    List<Service> findAllByOrderBySortOrderAsc();
}
