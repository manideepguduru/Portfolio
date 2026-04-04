package com.portfolio.service;

import com.portfolio.dto.ContactDTO;
import com.portfolio.exception.ResourceNotFoundException;
import com.portfolio.model.Contact;
import com.portfolio.repository.ContactRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Business logic for Contact form submissions.
 */
@Service
@RequiredArgsConstructor
public class ContactService {

    private final ContactRepository contactRepository;

    /** Save a new contact form submission. */
    public Contact saveContact(ContactDTO dto) {
        Contact contact = Contact.builder()
                .name(dto.getName())
                .email(dto.getEmail())
                .subject(dto.getSubject())
                .message(dto.getMessage())
                .readStatus(false)
                .build();
        return contactRepository.save(contact);
    }

    /** Return all messages, newest first (admin). */
    public List<Contact> getAllContacts() {
        return contactRepository.findAllByOrderByCreatedAtDesc();
    }

    /** Return unread messages only (admin). */
    public List<Contact> getUnreadContacts() {
        return contactRepository.findByReadStatusFalseOrderByCreatedAtDesc();
    }

    /** Count of unread messages (admin badge). */
    public long getUnreadCount() {
        return contactRepository.countByReadStatusFalse();
    }

    /** Mark a message as read. Throws 404 if not found. */
    public Contact markAsRead(Long id) {
        Contact contact = contactRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Contact", id));
        contact.setReadStatus(true);
        return contactRepository.save(contact);
    }

    /** Delete a contact message. Throws 404 if not found. */
    public void deleteContact(Long id) {
        contactRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Contact", id));
        contactRepository.deleteById(id);
    }
}
