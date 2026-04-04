package com.portfolio.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.portfolio.dto.ContactDTO;
import com.portfolio.exception.ResourceNotFoundException;
import com.portfolio.model.Contact;
import com.portfolio.service.ContactService;
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
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ContactController.class)
@DisplayName("ContactController MockMvc tests")
class ContactControllerTest {

    @Autowired private MockMvc mockMvc;
    @MockBean  private ContactService contactService;
    @Autowired private ObjectMapper objectMapper;

    private Contact sampleContact;
    private ContactDTO validDTO;

    @BeforeEach
    void setUp() {
        sampleContact = Contact.builder()
                .id(1L).name("Manideep").email("test@example.com")
                .subject("Business Website").message("I need a website for my restaurant.")
                .readStatus(false).build();

        validDTO = new ContactDTO();
        validDTO.setName("Manideep");
        validDTO.setEmail("test@example.com");
        validDTO.setSubject("Business Website");
        validDTO.setMessage("I need a website for my restaurant.");
    }

    @Test
    @DisplayName("POST /api/contact returns 201 on valid submission")
    void submitContact_valid_returns201() throws Exception {
        when(contactService.saveContact(any(ContactDTO.class))).thenReturn(sampleContact);

        mockMvc.perform(post("/api/contact")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(validDTO)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.name").value("Manideep"));
    }

    @Test
    @DisplayName("POST /api/contact returns 400 when name is blank")
    void submitContact_blankName_returns400() throws Exception {
        validDTO.setName("");
        mockMvc.perform(post("/api/contact")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(validDTO)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    @DisplayName("POST /api/contact returns 400 when email is invalid")
    void submitContact_invalidEmail_returns400() throws Exception {
        validDTO.setEmail("not-an-email");
        mockMvc.perform(post("/api/contact")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(validDTO)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("GET /api/contact returns list of all contacts")
    void getAllContacts_returns200() throws Exception {
        when(contactService.getAllContacts()).thenReturn(List.of(sampleContact));
        mockMvc.perform(get("/api/contact"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data[0].email").value("test@example.com"));
    }

    @Test
    @DisplayName("GET /api/contact/unread-count returns count")
    void getUnreadCount_returns200() throws Exception {
        when(contactService.getUnreadCount()).thenReturn(3L);
        mockMvc.perform(get("/api/contact/unread-count"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.count").value(3));
    }

    @Test
    @DisplayName("PUT /api/contact/{id}/read returns updated contact")
    void markAsRead_returns200() throws Exception {
        sampleContact.setReadStatus(true);
        when(contactService.markAsRead(1L)).thenReturn(sampleContact);
        mockMvc.perform(put("/api/contact/1/read"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.readStatus").value(true));
    }

    @Test
    @DisplayName("PUT /api/contact/{id}/read returns 404 when not found")
    void markAsRead_notFound_returns404() throws Exception {
        when(contactService.markAsRead(99L)).thenThrow(new ResourceNotFoundException("Contact", 99L));
        mockMvc.perform(put("/api/contact/99/read"))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("DELETE /api/contact/{id} returns 200")
    void deleteContact_returns200() throws Exception {
        doNothing().when(contactService).deleteContact(1L);
        mockMvc.perform(delete("/api/contact/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }
}
