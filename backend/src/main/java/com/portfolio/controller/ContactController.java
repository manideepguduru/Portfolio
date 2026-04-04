package com.portfolio.controller;

import com.portfolio.dto.ApiResponse;
import com.portfolio.dto.ContactDTO;
import com.portfolio.model.Contact;
import com.portfolio.service.ContactService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * REST controller for Contact form endpoints.
 *
 * Public  : POST /api/contact
 * Admin   : GET  /api/contact, /api/contact/unread, /api/contact/unread-count
 *           PUT  /api/contact/{id}/read
 *           DELETE /api/contact/{id}
 */
@RestController
@RequestMapping("/api/contact")
@RequiredArgsConstructor
public class ContactController {

    private final ContactService contactService;

    /** Called by the public contact form */
    @PostMapping
    public ResponseEntity<ApiResponse<Contact>> submitContact(@Valid @RequestBody ContactDTO dto) {
        Contact saved = contactService.saveContact(dto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(
                        "Thank you " + saved.getName() + "! Your message has been received. I'll get back to you within 24 hours.",
                        saved));
    }

    /** Admin – all messages */
    @GetMapping
    public ResponseEntity<ApiResponse<List<Contact>>> getAllContacts() {
        List<Contact> contacts = contactService.getAllContacts();
        return ResponseEntity.ok(ApiResponse.success("Contacts fetched", contacts));
    }

    /** Admin – unread messages */
    @GetMapping("/unread")
    public ResponseEntity<ApiResponse<List<Contact>>> getUnreadContacts() {
        List<Contact> contacts = contactService.getUnreadContacts();
        return ResponseEntity.ok(ApiResponse.success("Unread contacts fetched", contacts));
    }

    /** Admin – badge count of unread messages */
    @GetMapping("/unread-count")
    public ResponseEntity<ApiResponse<Map<String, Long>>> getUnreadCount() {
        long count = contactService.getUnreadCount();
        return ResponseEntity.ok(ApiResponse.success("Unread count", Map.of("count", count)));
    }

    /** Admin – mark a message as read */
    @PutMapping("/{id}/read")
    public ResponseEntity<ApiResponse<Contact>> markAsRead(@PathVariable Long id) {
        Contact updated = contactService.markAsRead(id);
        return ResponseEntity.ok(ApiResponse.success("Message marked as read", updated));
    }

    /** Admin – delete a message */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteContact(@PathVariable Long id) {
        contactService.deleteContact(id);
        return ResponseEntity.ok(ApiResponse.success("Message deleted"));
    }
}
