package com.portfolio.repository;

import com.portfolio.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data JPA repository for Project entities.
 */
@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {

    /** Return all projects ordered by sort_order ASC */
    List<Project> findAllByOrderBySortOrderAsc();

    /** Return only featured projects */
    List<Project> findByFeaturedTrueOrderBySortOrderAsc();
}
