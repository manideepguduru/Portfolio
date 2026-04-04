package com.portfolio.model;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("Service Entity Unit Tests")
class ServiceModelTest {

    private Service service;
    private LocalDateTime testDateTime;

    @BeforeEach
    void setUp() {
        testDateTime = LocalDateTime.now();
    }

    @Test
    @DisplayName("Should create Service using builder with all fields")
    void testServiceBuilder_AllFields() {
        service = Service.builder()
                .id(1L)
                .title("Website Development")
                .description("Custom website development services")
                .icon("🌐")
                .priceRange("$500-$5000")
                .sortOrder(1)
                .active(true)
                .createdAt(testDateTime)
                .updatedAt(testDateTime)
                .build();

        assertNotNull(service);
        assertEquals(1L, service.getId());
        assertEquals("Website Development", service.getTitle());
        assertEquals("Custom website development services", service.getDescription());
        assertEquals("🌐", service.getIcon());
        assertEquals("$500-$5000", service.getPriceRange());
        assertEquals(1, service.getSortOrder());
        assertTrue(service.getActive());
        assertEquals(testDateTime, service.getCreatedAt());
        assertEquals(testDateTime, service.getUpdatedAt());
    }

    @Test
    @DisplayName("Should have default sortOrder as 0")
    void testServiceBuilder_DefaultSortOrder() {
        service = Service.builder()
                .id(2L)
                .title("Mobile App Development")
                .description("iOS and Android app development")
                .build();

        assertEquals(0, service.getSortOrder());
    }

    @Test
    @DisplayName("Should have default active status as true")
    void testServiceBuilder_DefaultActive() {
        service = Service.builder()
                .id(3L)
                .title("UI/UX Design")
                .description("Modern UI/UX design services")
                .build();

        assertTrue(service.getActive());
    }

    @Test
    @DisplayName("Should override default values when explicitly set")
    void testServiceBuilder_ExplicitDefaults() {
        service = Service.builder()
                .id(4L)
                .title("Consulting")
                .description("Technical consulting services")
                .sortOrder(10)
                .active(false)
                .build();

        assertEquals(10, service.getSortOrder());
        assertFalse(service.getActive());
    }

    @Test
    @DisplayName("Should create Service with no-arg constructor and set fields via setters")
    void testServiceNoArgConstructor() {
        service = new Service();
        service.setId(5L);
        service.setTitle("API Development");
        service.setDescription("RESTful API development");
        service.setIcon("⚙️");
        service.setPriceRange("$1000-$10000");
        service.setSortOrder(2);
        service.setActive(true);

        assertEquals(5L, service.getId());
        assertEquals("API Development", service.getTitle());
        assertEquals("⚙️", service.getIcon());
        assertEquals(2, service.getSortOrder());
        assertTrue(service.getActive());
    }

    @Test
    @DisplayName("Should create Service with all-arg constructor")
    void testServiceAllArgConstructor() {
        service = new Service(
                6L,
                "Database Design",
                "Database architecture and optimization",
                "🗄️",
                "$800-$8000",
                3,
                true,
                testDateTime,
                testDateTime
        );

        assertEquals(6L, service.getId());
        assertEquals("Database Design", service.getTitle());
        assertEquals("🗄️", service.getIcon());
        assertEquals(3, service.getSortOrder());
        assertTrue(service.getActive());
    }

    @Test
    @DisplayName("Should handle emoji and special characters in icon field")
    void testServiceWithVariousIcons() {
        String[] icons = {"🌐", "📱", "💻", "⚙️", "🎨", "🚀", "✨"};

        for (int i = 0; i < icons.length; i++) {
            service = Service.builder()
                    .id((long) i)
                    .title("Service " + i)
                    .description("Description")
                    .icon(icons[i])
                    .build();

            assertEquals(icons[i], service.getIcon());
        }
    }

    @Test
    @DisplayName("Should handle long description content")
    void testServiceWithLongDescription() {
        String longDescription = "D".repeat(500);
        service = Service.builder()
                .id(7L)
                .title("Long Description Service")
                .description(longDescription)
                .build();

        assertEquals(longDescription.length(), service.getDescription().length());
    }

    @Test
    @DisplayName("Should handle various price ranges")
    void testServiceWithVariousPriceRanges() {
        String[] priceRanges = {
                "$100-$500",
                "$500-$1000",
                "$1000-$5000",
                "$5000-$10000",
                "Custom Quote",
                "Hourly: $50-$150"
        };

        for (int i = 0; i < priceRanges.length; i++) {
            service = Service.builder()
                    .id((long) i)
                    .title("Service " + i)
                    .description("Description")
                    .priceRange(priceRanges[i])
                    .build();

            assertEquals(priceRanges[i], service.getPriceRange());
        }
    }

    @Test
    @DisplayName("Should support sorting with different order values")
    void testServiceWithVariousSortOrders() {
        int[] sortOrders = {0, 1, 2, 5, 10, 100};

        for (int i = 0; i < sortOrders.length; i++) {
            service = Service.builder()
                    .id((long) i)
                    .title("Service " + i)
                    .description("Description")
                    .sortOrder(sortOrders[i])
                    .build();

            assertEquals(sortOrders[i], service.getSortOrder());
        }
    }

    @Test
    @DisplayName("Should support toggling active status")
    void testServiceActiveToggle() {
        service = Service.builder()
                .id(8L)
                .title("Toggle Service")
                .description("Service to test toggle")
                .active(true)
                .build();

        assertTrue(service.getActive());
        service.setActive(false);
        assertFalse(service.getActive());
        service.setActive(true);
        assertTrue(service.getActive());
    }

    @Test
    @DisplayName("Should support equality comparison")
    void testServiceEquality() {
        Service service1 = Service.builder()
                .id(9L)
                .title("Test Service")
                .description("Test Description")
                .icon("🔧")
                .build();

        Service service2 = Service.builder()
                .id(9L)
                .title("Test Service")
                .description("Test Description")
                .icon("🔧")
                .build();

        assertEquals(service1, service2);
    }

    @Test
    @DisplayName("Should support inequality comparison")
    void testServiceInequality() {
        Service service1 = Service.builder()
                .id(10L)
                .title("Service One")
                .description("Description 1")
                .build();

        Service service2 = Service.builder()
                .id(11L)
                .title("Service Two")
                .description("Description 2")
                .build();

        assertNotEquals(service1, service2);
    }

    @Test
    @DisplayName("Should allow null priceRange")
    void testServiceWithNullPriceRange() {
        service = Service.builder()
                .id(12L)
                .title("Free Service")
                .description("A free service")
                .priceRange(null)
                .build();

        assertNull(service.getPriceRange());
    }

    @Test
    @DisplayName("Should allow null icon")
    void testServiceWithNullIcon() {
        service = Service.builder()
                .id(13L)
                .title("Service without icon")
                .description("Description")
                .icon(null)
                .build();

        assertNull(service.getIcon());
    }

    @Test
    @DisplayName("Should update fields after creation")
    void testServiceFieldUpdates() {
        service = Service.builder()
                .id(14L)
                .title("Original Title")
                .description("Original Description")
                .active(true)
                .build();

        service.setTitle("Updated Title");
        service.setActive(false);

        assertEquals("Updated Title", service.getTitle());
        assertFalse(service.getActive());
        assertEquals("Original Description", service.getDescription()); // Unchanged
    }

    @Test
    @DisplayName("Should generate valid toString representation")
    void testServiceToString() {
        service = Service.builder()
                .id(15L)
                .title("Website Development")
                .description("Custom development")
                .build();

        String toString = service.toString();
        assertNotNull(toString);
        assertTrue(toString.contains("15") || toString.contains("Website"));
    }

    @Test
    @DisplayName("Should generate valid hashCode")
    void testServiceHashCode() {
        service = Service.builder()
                .id(16L)
                .title("Test Service")
                .description("Test")
                .build();

        int hashCode1 = service.hashCode();
        int hashCode2 = service.hashCode();
        assertEquals(hashCode1, hashCode2);
    }

    @Test
    @DisplayName("Should handle timestamps correctly")
    void testServiceTimestamps() {
        LocalDateTime createdTime = LocalDateTime.now().minusDays(1);
        LocalDateTime updatedTime = LocalDateTime.now();

        service = Service.builder()
                .id(17L)
                .title("Service with timestamps")
                .description("Description")
                .createdAt(createdTime)
                .updatedAt(updatedTime)
                .build();

        assertEquals(createdTime, service.getCreatedAt());
        assertEquals(updatedTime, service.getUpdatedAt());
        assertTrue(service.getUpdatedAt().isAfter(service.getCreatedAt()));
    }
}
