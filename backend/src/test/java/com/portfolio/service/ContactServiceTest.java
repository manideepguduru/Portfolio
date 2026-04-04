package com.portfolio.service;

import com.portfolio.dto.ContactDTO;
import com.portfolio.exception.ResourceNotFoundException;
import com.portfolio.model.Contact;
import com.portfolio.repository.ContactRepository;
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
@DisplayName("ContactService unit tests")
class ContactServiceTest {

    @Mock
    private ContactRepository contactRepository;

    @InjectMocks
    private ContactService contactService;

    private Contact sampleContact;
    private ContactDTO sampleDTO;

    @BeforeEach
    void setUp() {
        sampleContact = Contact.builder()
                .id(1L).name("Manideep").email("test@example.com")
                .subject("Project Inquiry").message("Hello, I need a website.")
                .readStatus(false).build();

        sampleDTO = new ContactDTO();
        sampleDTO.setName("Manideep");
        sampleDTO.setEmail("test@example.com");
        sampleDTO.setSubject("Project Inquiry");
        sampleDTO.setMessage("Hello, I need a website.");
    }

    @Test
    @DisplayName("saveContact persists and returns contact")
    void saveContact_savesAndReturns() {
        when(contactRepository.save(any(Contact.class))).thenReturn(sampleContact);

        Contact result = contactService.saveContact(sampleDTO);

        assertThat(result.getName()).isEqualTo("Manideep");
        assertThat(result.getReadStatus()).isFalse();
        verify(contactRepository).save(any(Contact.class));
    }

    @Test
    @DisplayName("getAllContacts returns list ordered by newest first")
    void getAllContacts_returnsList() {
        when(contactRepository.findAllByOrderByCreatedAtDesc()).thenReturn(List.of(sampleContact));

        List<Contact> result = contactService.getAllContacts();

        assertThat(result).hasSize(1);
    }

    @Test
    @DisplayName("getUnreadCount returns correct count")
    void getUnreadCount_returnsCount() {
        when(contactRepository.countByReadStatusFalse()).thenReturn(3L);

        long count = contactService.getUnreadCount();

        assertThat(count).isEqualTo(3L);
    }

    @Test
    @DisplayName("markAsRead updates readStatus to true")
    void markAsRead_updatesStatus() {
        when(contactRepository.findById(1L)).thenReturn(Optional.of(sampleContact));
        sampleContact.setReadStatus(true);
        when(contactRepository.save(sampleContact)).thenReturn(sampleContact);

        Contact result = contactService.markAsRead(1L);

        assertThat(result.getReadStatus()).isTrue();
        verify(contactRepository).save(sampleContact);
    }

    @Test
    @DisplayName("markAsRead throws ResourceNotFoundException when not found")
    void markAsRead_notFound_throws() {
        when(contactRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> contactService.markAsRead(99L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("99");
    }

    @Test
    @DisplayName("deleteContact calls deleteById when found")
    void deleteContact_callsDelete() {
        when(contactRepository.findById(1L)).thenReturn(Optional.of(sampleContact));

        contactService.deleteContact(1L);

        verify(contactRepository).deleteById(1L);
    }

    @Test
    @DisplayName("deleteContact throws when contact not found")
    void deleteContact_notFound_throws() {
        when(contactRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> contactService.deleteContact(99L))
                .isInstanceOf(ResourceNotFoundException.class);

        verify(contactRepository, never()).deleteById(any());
    }
}
