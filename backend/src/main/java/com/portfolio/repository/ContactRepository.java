package com.portfolio.repository;

import com.portfolio.model.Contact;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data JPA repository for Contact entities.
 */
@Repository
public interface ContactRepository extends JpaRepository<Contact, Long> {

    /** Return all contacts ordered by newest first */
    List<Contact> findAllByOrderByCreatedAtDesc();

    /** Return unread contacts */
    List<Contact> findByReadStatusFalseOrderByCreatedAtDesc();

    /** Count of unread messages */
    long countByReadStatusFalse();
}
