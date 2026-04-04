package com.portfolio.model;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("Project Entity Unit Tests")
class ProjectModelTest {

    private Project project;
    private LocalDateTime testDateTime;

    @BeforeEach
    void setUp() {
        testDateTime = LocalDateTime.now();
    }

    @Test
    @DisplayName("Should create Project using builder with all fields")
    void testProjectBuilder_AllFields() {
        project = Project.builder()
                .id(1L)
                .title("E-Commerce Platform")
                .description("Full-stack e-commerce platform")
                .techStack("React,TypeScript,Spring Boot,PostgreSQL")
                .githubUrl("https://github.com/user/ecommerce")
                .liveUrl("https://ecommerce.example.com")
                .imageUrl("https://cdn.example.com/ecommerce.png")
                .featured(true)
                .sortOrder(1)
                .createdAt(testDateTime)
                .updatedAt(testDateTime)
                .build();

        assertNotNull(project);
        assertEquals(1L, project.getId());
        assertEquals("E-Commerce Platform", project.getTitle());
        assertEquals("Full-stack e-commerce platform", project.getDescription());
        assertEquals("React,TypeScript,Spring Boot,PostgreSQL", project.getTechStack());
        assertEquals("https://github.com/user/ecommerce", project.getGithubUrl());
        assertEquals("https://ecommerce.example.com", project.getLiveUrl());
        assertEquals("https://cdn.example.com/ecommerce.png", project.getImageUrl());
        assertTrue(project.getFeatured());
        assertEquals(1, project.getSortOrder());
        assertEquals(testDateTime, project.getCreatedAt());
    }

    @Test
    @DisplayName("Should have default featured as false")
    void testProjectBuilder_DefaultFeatured() {
        project = Project.builder()
                .id(2L)
                .title("Blog Platform")
                .description("Blogging platform")
                .techStack("Next.js,MongoDB")
                .build();

        assertFalse(project.getFeatured());
    }

    @Test
    @DisplayName("Should have default sortOrder as 0")
    void testProjectBuilder_DefaultSortOrder() {
        project = Project.builder()
                .id(3L)
                .title("Task Manager")
                .description("Task management app")
                .techStack("Vue.js,Firebase")
                .build();

        assertEquals(0, project.getSortOrder());
    }

    @Test
    @DisplayName("Should override default values when explicitly set")
    void testProjectBuilder_ExplicitDefaults() {
        project = Project.builder()
                .id(4L)
                .title("Portfolio Website")
                .description("Portfolio showcase")
                .techStack("React,Tailwind")
                .featured(true)
                .sortOrder(5)
                .build();

        assertTrue(project.getFeatured());
        assertEquals(5, project.getSortOrder());
    }

    @Test
    @DisplayName("Should create Project with no-arg constructor and set fields via setters")
    void testProjectNoArgConstructor() {
        project = new Project();
        project.setId(5L);
        project.setTitle("Chat Application");
        project.setDescription("Real-time chat app");
        project.setTechStack("Angular,Socket.io,Node.js");
        project.setGithubUrl("https://github.com/user/chat");
        project.setLiveUrl("https://chat.example.com");
        project.setImageUrl("https://cdn.example.com/chat.png");
        project.setFeatured(true);
        project.setSortOrder(2);

        assertEquals(5L, project.getId());
        assertEquals("Chat Application", project.getTitle());
        assertEquals("Angular,Socket.io,Node.js", project.getTechStack());
        assertTrue(project.getFeatured());
        assertEquals(2, project.getSortOrder());
    }

    @Test
    @DisplayName("Should create Project with all-arg constructor")
    void testProjectAllArgConstructor() {
        project = new Project(
                6L,
                "Video Streaming",
                "Video streaming platform",
                "Express,MongoDB,FFmpeg",
                "https://github.com/user/video",
                "https://videos.example.com",
                "https://cdn.example.com/video.png",
                false,
                3,
                testDateTime,
                testDateTime
        );

        assertEquals(6L, project.getId());
        assertEquals("Video Streaming", project.getTitle());
        assertEquals("Express,MongoDB,FFmpeg", project.getTechStack());
        assertFalse(project.getFeatured());
        assertEquals(3, project.getSortOrder());
    }

    @Test
    @DisplayName("Should handle various techStack combinations")
    void testProjectWithVariousTechStacks() {
        String[] techStacks = {
                "React,TypeScript",
                "React,TypeScript,Spring Boot,PostgreSQL",
                "Vue.js,Firebase",
                "Angular,Node.js,MongoDB",
                "Django,React,PostgreSQL",
                "Laravel,Vue.js,MySQL"
        };

        for (int i = 0; i < techStacks.length; i++) {
            project = Project.builder()
                    .id((long) i)
                    .title("Project " + i)
                    .description("Description")
                    .techStack(techStacks[i])
                    .build();

            assertEquals(techStacks[i], project.getTechStack());
        }
    }

    @Test
    @DisplayName("Should handle GitHub URL variations")
    void testProjectWithVariousGithubUrls() {
        String[] githubUrls = {
                "https://github.com/user/repo",
                "https://github.com/org/project",
                "https://github.com/username/project-name",
                null
        };

        for (int i = 0; i < githubUrls.length; i++) {
            project = Project.builder()
                    .id((long) i)
                    .title("Project " + i)
                    .description("Description")
                    .techStack("React")
                    .githubUrl(githubUrls[i])
                    .build();

            assertEquals(githubUrls[i], project.getGithubUrl());
        }
    }

    @Test
    @DisplayName("Should handle live URL variations")
    void testProjectWithVariousLiveUrls() {
        String[] liveUrls = {
                "https://example.com",
                "https://project.example.com",
                "https://demo.example.org",
                null
        };

        for (int i = 0; i < liveUrls.length; i++) {
            project = Project.builder()
                    .id((long) i)
                    .title("Project " + i)
                    .description("Description")
                    .techStack("React")
                    .liveUrl(liveUrls[i])
                    .build();

            assertEquals(liveUrls[i], project.getLiveUrl());
        }
    }

    @Test
    @DisplayName("Should handle long description content")
    void testProjectWithLongDescription() {
        String longDescription = "D".repeat(500);
        project = Project.builder()
                .id(7L)
                .title("Long Description Project")
                .description(longDescription)
                .techStack("React")
                .build();

        assertEquals(longDescription.length(), project.getDescription().length());
    }

    @Test
    @DisplayName("Should support featured projects")
    void testFeaturedProjects() {
        project = Project.builder()
                .id(8L)
                .title("Featured Project")
                .description("This is a featured project")
                .techStack("React,TypeScript")
                .featured(true)
                .sortOrder(1)
                .build();

        assertTrue(project.getFeatured());
        assertEquals(1, project.getSortOrder());
    }

    @Test
    @DisplayName("Should support sorting with different order values")
    void testProjectWithVariousSortOrders() {
        int[] sortOrders = {0, 1, 2, 5, 10, 100};

        for (int i = 0; i < sortOrders.length; i++) {
            project = Project.builder()
                    .id((long) i)
                    .title("Project " + i)
                    .description("Description")
                    .techStack("React")
                    .sortOrder(sortOrders[i])
                    .build();

            assertEquals(sortOrders[i], project.getSortOrder());
        }
    }

    @Test
    @DisplayName("Should support toggling featured status")
    void testProjectFeaturedToggle() {
        project = Project.builder()
                .id(9L)
                .title("Toggle Project")
                .description("Project to test toggle")
                .techStack("React")
                .featured(false)
                .build();

        assertFalse(project.getFeatured());
        project.setFeatured(true);
        assertTrue(project.getFeatured());
        project.setFeatured(false);
        assertFalse(project.getFeatured());
    }

    @Test
    @DisplayName("Should support equality comparison")
    void testProjectEquality() {
        Project project1 = Project.builder()
                .id(10L)
                .title("Test Project")
                .description("Test Description")
                .techStack("React")
                .build();

        Project project2 = Project.builder()
                .id(10L)
                .title("Test Project")
                .description("Test Description")
                .techStack("React")
                .build();

        assertEquals(project1, project2);
    }

    @Test
    @DisplayName("Should support inequality comparison")
    void testProjectInequality() {
        Project project1 = Project.builder()
                .id(11L)
                .title("Project One")
                .description("Description 1")
                .techStack("React")
                .build();

        Project project2 = Project.builder()
                .id(12L)
                .title("Project Two")
                .description("Description 2")
                .techStack("Vue.js")
                .build();

        assertNotEquals(project1, project2);
    }

    @Test
    @DisplayName("Should allow null URLs")
    void testProjectWithNullUrls() {
        project = Project.builder()
                .id(13L)
                .title("No URL Project")
                .description("Project without URLs")
                .techStack("React")
                .githubUrl(null)
                .liveUrl(null)
                .imageUrl(null)
                .build();

        assertNull(project.getGithubUrl());
        assertNull(project.getLiveUrl());
        assertNull(project.getImageUrl());
    }

    @Test
    @DisplayName("Should update fields after creation")
    void testProjectFieldUpdates() {
        project = Project.builder()
                .id(14L)
                .title("Original Title")
                .description("Original Description")
                .techStack("React")
                .featured(false)
                .build();

        project.setTitle("Updated Title");
        project.setFeatured(true);

        assertEquals("Updated Title", project.getTitle());
        assertTrue(project.getFeatured());
        assertEquals("Original Description", project.getDescription()); // Unchanged
    }

    @Test
    @DisplayName("Should parse techStack array from comma-separated string")
    void testParseTechStack() {
        project = Project.builder()
                .id(15L)
                .title("Tech Stack Test")
                .description("Test project")
                .techStack("React,TypeScript,Tailwind,Spring Boot")
                .build();

        String[] technologies = project.getTechStack().split(",");
        assertEquals(4, technologies.length);
        assertEquals("React", technologies[0]);
        assertEquals("TypeScript", technologies[1]);
        assertEquals("Tailwind", technologies[2]);
        assertEquals("Spring Boot", technologies[3]);
    }

    @Test
    @DisplayName("Should generate valid toString representation")
    void testProjectToString() {
        project = Project.builder()
                .id(16L)
                .title("E-Commerce Platform")
                .description("Test")
                .techStack("React")
                .build();

        String toString = project.toString();
        assertNotNull(toString);
        assertTrue(toString.contains("16") || toString.contains("E-Commerce"));
    }

    @Test
    @DisplayName("Should generate valid hashCode")
    void testProjectHashCode() {
        project = Project.builder()
                .id(17L)
                .title("Test Project")
                .description("Test")
                .techStack("React")
                .build();

        int hashCode1 = project.hashCode();
        int hashCode2 = project.hashCode();
        assertEquals(hashCode1, hashCode2);
    }

    @Test
    @DisplayName("Should handle timestamps correctly")
    void testProjectTimestamps() {
        LocalDateTime createdTime = LocalDateTime.now().minusDays(7);
        LocalDateTime updatedTime = LocalDateTime.now();

        project = Project.builder()
                .id(18L)
                .title("Project with timestamps")
                .description("Description")
                .techStack("React")
                .createdAt(createdTime)
                .updatedAt(updatedTime)
                .build();

        assertEquals(createdTime, project.getCreatedAt());
        assertEquals(updatedTime, project.getUpdatedAt());
        assertTrue(project.getUpdatedAt().isAfter(project.getCreatedAt()));
    }

    @Test
    @DisplayName("Should handle complex techStack with many technologies")
    void testProjectWithComplexTechStack() {
        String complexStack = "React,TypeScript,Redux,Axios,React Router," +
                "Spring Boot,Spring Data JPA,Spring Security,PostgreSQL," +
                "Docker,Kubernetes,GitHub Actions";

        project = Project.builder()
                .id(19L)
                .title("Complex Project")
                .description("Full-stack project with many technologies")
                .techStack(complexStack)
                .build();

        String[] technologies = project.getTechStack().split(",");
        assertEquals(12, technologies.length);
        assertTrue(project.getTechStack().contains("React"));
        assertTrue(project.getTechStack().contains("Spring Boot"));
        assertTrue(project.getTechStack().contains("Docker"));
    }
}
