package com.portfolio.model;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("Contact Entity Unit Tests")
class ContactModelTest {

    private Contact contact;
    private LocalDateTime testDateTime;

    @BeforeEach
    void setUp() {
        testDateTime = LocalDateTime.now();
    }

    @Test
    @DisplayName("Should create Contact using builder with all fields")
    void testContactBuilder_AllFields() {
        contact = Contact.builder()
                .id(1L)
                .name("John Doe")
                .email("john@example.com")
                .subject("Website Project")
                .message("I need a new website")
                .readStatus(false)
                .createdAt(testDateTime)
                .build();

        assertNotNull(contact);
        assertEquals(1L, contact.getId());
        assertEquals("John Doe", contact.getName());
        assertEquals("john@example.com", contact.getEmail());
        assertEquals("Website Project", contact.getSubject());
        assertEquals("I need a new website", contact.getMessage());
        assertFalse(contact.getReadStatus());
        assertEquals(testDateTime, contact.getCreatedAt());
    }

    @Test
    @DisplayName("Should have default readStatus as false")
    void testContactBuilder_DefaultReadStatus() {
        contact = Contact.builder()
                .id(1L)
                .name("Jane Doe")
                .email("jane@example.com")
                .subject("Test")
                .message("Test message")
                .build();

        assertFalse(contact.getReadStatus());
    }

    @Test
    @DisplayName("Should override readStatus default when explicitly set")
    void testContactBuilder_ExplicitReadStatus() {
        contact = Contact.builder()
                .id(1L)
                .name("Jane Doe")
                .email("jane@example.com")
                .subject("Test")
                .message("Test message")
                .readStatus(true)
                .build();

        assertTrue(contact.getReadStatus());
    }

    @Test
    @DisplayName("Should create Contact with no-arg constructor and set fields via setters")
    void testContactNoArgConstructor() {
        contact = new Contact();
        contact.setId(2L);
        contact.setName("Alice Smith");
        contact.setEmail("alice@example.com");
        contact.setSubject("Portfolio Review");
        contact.setMessage("Please review my portfolio");
        contact.setReadStatus(true);

        assertEquals(2L, contact.getId());
        assertEquals("Alice Smith", contact.getName());
        assertEquals("alice@example.com", contact.getEmail());
        assertEquals("Portfolio Review", contact.getSubject());
        assertEquals("Please review my portfolio", contact.getMessage());
        assertTrue(contact.getReadStatus());
    }

    @Test
    @DisplayName("Should create Contact with all-arg constructor")
    void testContactAllArgConstructor() {
        contact = new Contact(
                3L,
                "Bob Johnson",
                "bob@example.com",
                "+91 93469 29001",
                "API Integration",
                "Need API integration with our system",
                false,
                testDateTime
        );

        assertEquals(3L, contact.getId());
        assertEquals("Bob Johnson", contact.getName());
        assertEquals("bob@example.com", contact.getEmail());
        assertEquals("+91 93469 29001", contact.getPhone());
        assertEquals("API Integration", contact.getSubject());
        assertEquals("Need API integration with our system", contact.getMessage());
        assertFalse(contact.getReadStatus());
        assertEquals(testDateTime, contact.getCreatedAt());
    }

    @Test
    @DisplayName("Should handle long message content")
    void testContactWithLongMessage() {
        String longMessage = "A".repeat(1000);
        contact = Contact.builder()
                .id(4L)
                .name("Charlie Brown")
                .email("charlie@example.com")
                .subject("Complex Project")
                .message(longMessage)
                .build();

        assertEquals(longMessage.length(), contact.getMessage().length());
        assertEquals(longMessage, contact.getMessage());
    }

    @Test
    @DisplayName("Should handle special characters in fields")
    void testContactWithSpecialCharacters() {
        contact = Contact.builder()
                .id(5L)
                .name("José García-López")
                .email("jose.garcia@example.com")
                .subject("Projekt & Consultancy")
                .message("Message with special chars: @#$%^&*()")
                .build();

        assertEquals("José García-López", contact.getName());
        assertEquals("Projekt & Consultancy", contact.getSubject());
        assertTrue(contact.getMessage().contains("@#$%^&*()"));
    }

    @Test
    @DisplayName("Should support equality comparison")
    void testContactEquality() {
        Contact contact1 = Contact.builder()
                .id(6L)
                .name("Test User")
                .email("test@example.com")
                .subject("Test")
                .message("Test message")
                .build();

        Contact contact2 = Contact.builder()
                .id(6L)
                .name("Test User")
                .email("test@example.com")
                .subject("Test")
                .message("Test message")
                .build();

        assertEquals(contact1, contact2);
    }

    @Test
    @DisplayName("Should support inequality comparison")
    void testContactInequality() {
        Contact contact1 = Contact.builder()
                .id(7L)
                .name("User One")
                .email("user1@example.com")
                .subject("Test")
                .message("Message 1")
                .build();

        Contact contact2 = Contact.builder()
                .id(8L)
                .name("User Two")
                .email("user2@example.com")
                .subject("Test")
                .message("Message 2")
                .build();

        assertNotEquals(contact1, contact2);
    }

    @Test
    @DisplayName("Should update fields after creation")
    void testContactFieldUpdates() {
        contact = Contact.builder()
                .id(9L)
                .name("Original Name")
                .email("original@example.com")
                .subject("Original Subject")
                .message("Original message")
                .readStatus(false)
                .build();

        // Update fields
        contact.setName("Updated Name");
        contact.setReadStatus(true);

        assertEquals("Updated Name", contact.getName());
        assertTrue(contact.getReadStatus());
        assertEquals("original@example.com", contact.getEmail()); // Unchanged
    }

    @Test
    @DisplayName("Should handle null fields correctly in builder")
    void testContactBuilderWithNull() {
        contact = Contact.builder()
                .id(10L)
                .name("Name")
                .email("test@example.com")
                .subject("Subject")
                .message("Message")
                .createdAt(null)
                .build();

        assertNull(contact.getCreatedAt());
        assertNotNull(contact.getName());
    }

    @Test
    @DisplayName("Should generate valid toString representation")
    void testContactToString() {
        contact = Contact.builder()
                .id(11L)
                .name("Test User")
                .email("test@example.com")
                .subject("Test")
                .message("Message")
                .build();

        String toString = contact.toString();
        assertNotNull(toString);
        assertTrue(toString.contains("11"));
        assertTrue(toString.contains("test@example.com"));
    }

    @Test
    @DisplayName("Should generate valid hashCode")
    void testContactHashCode() {
        contact = Contact.builder()
                .id(12L)
                .name("Test User")
                .email("test@example.com")
                .subject("Test")
                .message("Message")
                .build();

        int hashCode1 = contact.hashCode();
        int hashCode2 = contact.hashCode();
        assertEquals(hashCode1, hashCode2);
    }
}
