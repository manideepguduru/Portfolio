package com.portfolio.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.tika.Tika;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class CheckerService {

    private static final Pattern JSON_BLOCK_PATTERN = Pattern.compile("\\{.*}", Pattern.DOTALL);
    private static final Pattern KEYWORD_SPLIT_PATTERN = Pattern.compile("[^a-zA-Z0-9+#.]+");
    private static final Pattern EMAIL_PATTERN = Pattern.compile("[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}");
    private static final Pattern PHONE_PATTERN = Pattern.compile("(?:\\+?\\d[\\d\\s().-]{7,}\\d)");
    private static final Set<String> STOP_WORDS = Set.of(
            "the", "and", "with", "for", "are", "you", "your", "from", "that", "this", "will", "have", "has", "had",
            "but", "not", "all", "any", "job", "role", "team", "years", "year", "work", "using", "use", "into", "who",
            "what", "when", "where", "their", "they", "them", "then", "than", "must", "should", "can", "could", "would"
    );

    private final Tika tika = new Tika();
    private final ObjectMapper objectMapper;
    private final HttpClient httpClient;
    private final String cohereApiKey;
    private final String cohereModel;
    private final String cohereUrl;

    public CheckerService(
            @Value("${cohere.api.key:}") String cohereApiKey,
            @Value("${cohere.model:command-r}") String cohereModel,
            @Value("${cohere.url:https://api.cohere.com/v2/chat}") String cohereUrl,
            ObjectMapper objectMapper
    ) {
        this.cohereApiKey = cohereApiKey;
        this.cohereModel = cohereModel;
        this.cohereUrl = cohereUrl;
        this.objectMapper = objectMapper;
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(20))
                .build();
    }

    public AnalysisResult analyze(MultipartFile resumeFile, String jobDescription) {
        String resumeText = extractResumeText(resumeFile);
        String fileName = resumeFile.getOriginalFilename() == null ? "uploaded-resume" : resumeFile.getOriginalFilename();
        String roleContext = normalizeRoleContext(jobDescription);
        AiReviewResult aiReview;

        try {
            aiReview = requestAiReview(resumeText, roleContext);
        } catch (RuntimeException exception) {
            aiReview = buildFallbackReview(resumeText, roleContext, exception.getMessage());
        }

        List<String> strengths = new ArrayList<>(normalizeList(
                aiReview.strengths(),
                "Clear core experience is present in the resume."
        ));
        List<String> issues = new ArrayList<>(normalizeList(
                aiReview.issuesFound(),
                "No major issue was detected, but tailoring can improve results."
        ));
        List<String> tips = new ArrayList<>(normalizeList(
                aiReview.tips(),
                "Tighten section headings and quantify achievements to improve ATS performance."
        ));

        addMinorQualityFeedback(resumeText, roleContext, issues, tips, strengths);
        int calibratedScore = calibrateScore(clampScore(aiReview.score()), resumeText, roleContext, issues);

        return new AnalysisResult(
                calibratedScore,
                defaultText(aiReview.overallAssessment(), "Resume review completed."),
                trimList(strengths, 8),
                trimList(issues, 10),
                trimList(tips, 10),
                fileName,
                roleContext,
                new DetectedData(
                        defaultText(aiReview.detectedData().candidateName(), "Not clearly present"),
                        defaultText(aiReview.detectedData().email(), "Not clearly present"),
                        defaultText(aiReview.detectedData().phone(), "Not clearly present"),
                        defaultText(aiReview.detectedData().targetRole(), "Not clearly present"),
                        normalizeList(aiReview.detectedData().topSkills(), "Not clearly present")
                )
        );
    }

    private void addMinorQualityFeedback(
            String resumeText,
            String roleContext,
            List<String> issues,
            List<String> tips,
            List<String> strengths
    ) {
        String lower = resumeText.toLowerCase();
        int wordCount = countWords(resumeText);

        if (wordCount < 220) {
            addUnique(issues, "Resume appears short for ATS depth and keyword coverage.");
            addUnique(tips, "Expand project and experience bullets with concrete impact details.");
        }

        if (!containsBulletPoints(resumeText)) {
            addUnique(issues, "Bullet-style achievements are limited or missing.");
            addUnique(tips, "Use bullet points for each role to improve ATS readability.");
        } else {
            addUnique(strengths, "Bullet formatting supports ATS readability.");
        }

        if (!containsMeasurableImpact(resumeText)) {
            addUnique(issues, "Few measurable outcomes found (numbers, percentages, timelines).");
            addUnique(tips, "Add measurable outcomes, such as percentages, counts, timelines, and impact metrics.");
        } else {
            addUnique(strengths, "Resume includes measurable impact indicators.");
        }

        if (resumeText.contains("  ")) {
            addUnique(issues, "Found extra spacing inconsistencies.");
            addUnique(tips, "Clean up repeated spaces for a more polished resume format.");
        }

        if (hasOverlongLines(resumeText)) {
            addUnique(issues, "Some lines are too long and may reduce ATS parsing quality.");
            addUnique(tips, "Split very long lines into shorter bullets or sentences.");
        }

        if (!lower.contains("summary")) {
            addUnique(issues, "Professional summary heading is missing.");
            addUnique(tips, "Add a short SUMMARY section tailored to your target role.");
        }

        if (!"General ATS review".equals(roleContext)) {
            List<String> missingContextKeywords = getMissingContextKeywords(resumeText, roleContext);
            if (missingContextKeywords.size() >= 4) {
                addUnique(issues, "Resume does not include enough role-specific terms from the provided context.");
                addUnique(tips, "Blend these terms naturally into summary and experience: " +
                        String.join(", ", missingContextKeywords.subList(0, Math.min(6, missingContextKeywords.size()))) + ".");
            } else {
                addUnique(strengths, "Resume reflects the provided job context reasonably well.");
            }
        }
    }

    private int calibrateScore(int aiScore, String resumeText, String roleContext, List<String> issues) {
        int score = aiScore;
        String lower = resumeText.toLowerCase();
        int wordCount = countWords(resumeText);

        if (wordCount < 220) {
            score -= 12;
        } else if (wordCount < 320) {
            score -= 6;
        }
        if (!lower.contains("experience")) {
            score -= 12;
        }
        if (!lower.contains("skills")) {
            score -= 10;
        }
        if (!lower.contains("education")) {
            score -= 8;
        }
        if (!lower.contains("summary")) {
            score -= 5;
        }
        if (!EMAIL_PATTERN.matcher(resumeText).find()) {
            score -= 8;
        }
        if (!PHONE_PATTERN.matcher(resumeText).find()) {
            score -= 6;
        }
        if (!containsMeasurableImpact(resumeText)) {
            score -= 8;
        }

        int issueCount = issues.size();
        if (issueCount >= 8) {
            score -= 12;
        } else if (issueCount >= 5) {
            score -= 8;
        } else if (issueCount >= 3) {
            score -= 4;
        }

        if (!"General ATS review".equals(roleContext)) {
            int missingContext = getMissingContextKeywords(resumeText, roleContext).size();
            if (missingContext >= 8) {
                score -= 12;
            } else if (missingContext >= 5) {
                score -= 8;
            } else if (missingContext >= 3) {
                score -= 4;
            } else if (missingContext == 0) {
                score += 2;
            }
        }

        if (score > 88 && issueCount >= 3) {
            score = 84;
        }
        if (score > 80 && issueCount >= 5) {
            score = 78;
        }

        return Math.max(25, Math.min(98, score));
    }

    private int countWords(String text) {
        if (text == null || text.isBlank()) {
            return 0;
        }
        return text.trim().split("\\s+").length;
    }

    private boolean containsBulletPoints(String text) {
        String[] lines = text.split("\\R");
        for (String line : lines) {
            String trimmed = line.trim();
            if (trimmed.startsWith("-") || trimmed.startsWith("*") || trimmed.startsWith("•")) {
                return true;
            }
        }
        return false;
    }

    private boolean containsMeasurableImpact(String text) {
        return text.matches("(?s).*(\\d+%|\\d+\\+|\\$\\d+|\\d+ years|\\d+ months|\\d+ projects|\\d+ users).*");
    }

    private boolean hasOverlongLines(String text) {
        String[] lines = text.split("\\R");
        for (String line : lines) {
            if (line.length() > 170) {
                return true;
            }
        }
        return false;
    }

    private void addUnique(List<String> target, String value) {
        for (String existing : target) {
            if (existing.equalsIgnoreCase(value)) {
                return;
            }
        }
        target.add(value);
    }

    private List<String> trimList(List<String> list, int max) {
        if (list.size() <= max) {
            return list;
        }
        return list.subList(0, max);
    }

    private String extractResumeText(MultipartFile resumeFile) {
        if (resumeFile == null || resumeFile.isEmpty()) {
            throw new IllegalArgumentException("Upload a PDF, DOCX, or TXT resume file.");
        }

        try (InputStream inputStream = resumeFile.getInputStream()) {
            String extracted = tika.parseToString(inputStream);
            if (extracted == null || extracted.isBlank()) {
                throw new IllegalArgumentException("The uploaded resume could not be read. Use a text-based PDF, DOCX, or TXT file.");
            }
            return extracted;
        } catch (IOException exception) {
            throw new IllegalArgumentException("Failed to read the uploaded resume file.", exception);
        } catch (Exception exception) {
            throw new IllegalArgumentException("Unsupported resume file. Upload a text-based PDF, DOCX, or TXT file.", exception);
        }
    }

    private AiReviewResult requestAiReview(String resumeText, String roleContext) {
        if (cohereApiKey == null || cohereApiKey.isBlank()) {
            throw new IllegalStateException("COHERE_API_KEY is not configured for resume analysis.");
        }

        String prompt = "You are an expert ATS resume reviewer. Review the full uploaded resume text only. " +
                "Return strict JSON and nothing else using this schema: " +
                "{\"score\": number between 0 and 100, \"overallAssessment\": string, \"strengths\": string[], \"issuesFound\": string[], \"tips\": string[], \"detectedData\": {\"candidateName\": string, \"email\": string, \"phone\": string, \"targetRole\": string, \"topSkills\": string[]}}. " +
                "Score based on ATS readability, section structure, clarity, measurable impact, skills specificity, consistency, spelling quality, and professionalism. " +
                "If data is missing, set the field to 'Not clearly present'. " +
                "Target role or job description context: " + roleContext + ". Resume text:\n\n" + resumeText;

        List<String> candidateUrls = buildCandidateUrls();
        List<String> candidateModels = buildCandidateModels();
        String lastError = "Unknown Cohere error.";

        for (String url : candidateUrls) {
            for (String model : candidateModels) {
                try {
                    String requestBody = buildCohereRequestBody(prompt, url, model);
                    HttpRequest request = HttpRequest.newBuilder()
                            .uri(URI.create(url))
                            .timeout(Duration.ofSeconds(60))
                            .header("Authorization", "Bearer " + cohereApiKey)
                            .header("Content-Type", "application/json")
                            .header("Accept", "application/json")
                            .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                            .build();

                    HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
                    if (response.statusCode() >= 400) {
                        lastError = "Cohere API returned status " + response.statusCode() +
                                " at " + url +
                                " model=" + model +
                                " body=" + shortBody(response.body());
                        continue;
                    }

                    JsonNode root = objectMapper.readTree(response.body());
                    String text = extractCohereText(root);
                    if (text.isBlank()) {
                        lastError = "Cohere API returned empty text at " + url + " model=" + model;
                        continue;
                    }

                    String jsonPayload = extractJsonPayload(text);
                    return objectMapper.readValue(jsonPayload, AiReviewResult.class);
                } catch (InterruptedException exception) {
                    Thread.currentThread().interrupt();
                    throw new IllegalStateException("Resume analysis failed.", exception);
                } catch (Exception exception) {
                    lastError = "Cohere request failed at " + url + " model=" + model + " error=" + exception.getMessage();
                }
            }
        }

        throw new IllegalStateException(lastError);
    }

    private List<String> buildCandidateUrls() {
        Set<String> urls = new LinkedHashSet<>();
        urls.add("https://api.cohere.com/v2/chat");
        urls.add(cohereUrl);
        urls.add("https://api.cohere.ai/v1/chat");
        return new ArrayList<>(urls);
    }

    private List<String> buildCandidateModels() {
        Set<String> models = new LinkedHashSet<>();
        models.add(cohereModel);
        models.add("command-r");
        models.add("command-r7b-12-2024");
        models.add("command-a-03-2025");
        return new ArrayList<>(models);
    }

    private String buildCohereRequestBody(String prompt, String url, String model) throws IOException {
        if (url != null && url.contains("/v1/")) {
            return objectMapper.writeValueAsString(new CohereV1Request(model, prompt, 0.2));
        }
        return objectMapper.writeValueAsString(
                new CohereV2Request(
                        model,
                        List.of(new CohereMessage("user", prompt)),
                        0.2
                )
        );
    }

    private String extractCohereText(JsonNode root) {
        String directText = root.path("text").asText("");
        if (!directText.isBlank()) {
            return directText;
        }

        JsonNode messageContent = root.path("message").path("content");
        if (messageContent.isArray() && !messageContent.isEmpty()) {
            JsonNode first = messageContent.get(0);
            String v2Text = first.path("text").asText("");
            if (!v2Text.isBlank()) {
                return v2Text;
            }
        }
        return "";
    }

    private String shortBody(String responseBody) {
        if (responseBody == null) {
            return "";
        }
        if (responseBody.length() <= 180) {
            return responseBody;
        }
        return responseBody.substring(0, 180) + "...";
    }

    private String extractJsonPayload(String text) {
        Matcher matcher = JSON_BLOCK_PATTERN.matcher(text.trim());
        if (matcher.find()) {
            return matcher.group();
        }
        throw new IllegalStateException("AI response was not valid JSON.");
    }

    private int clampScore(int score) {
        return Math.max(0, Math.min(100, score));
    }

    private String defaultText(String value, String fallback) {
        return value == null || value.isBlank() ? fallback : value;
    }

    private String normalizeRoleContext(String roleContext) {
        if (roleContext == null || roleContext.isBlank()) {
            return "General ATS review";
        }
        return roleContext.trim();
    }

    private List<String> normalizeList(List<String> values, String fallback) {
        if (values == null || values.isEmpty()) {
            return List.of(fallback);
        }
        return values.stream()
                .filter(item -> item != null && !item.isBlank())
                .limit(5)
                .toList();
    }

    private AiReviewResult buildFallbackReview(String resumeText, String roleContext, String failureReason) {
        int score = estimateFallbackScore(resumeText, roleContext);
        String overallAssessment = "Review service is temporarily unavailable. Showing local ATS-style analysis. Reason: " +
                defaultText(failureReason, "Unknown error") + ".";

        List<String> strengths = new ArrayList<>();
        List<String> issues = new ArrayList<>();
        List<String> tips = new ArrayList<>();

        String lower = resumeText.toLowerCase();
        if (lower.contains("experience")) {
            strengths.add("Experience section is present.");
        } else {
            issues.add("Experience section heading is missing.");
            tips.add("Add a clear EXPERIENCE heading with role, company, and dates.");
        }
        if (lower.contains("skills")) {
            strengths.add("Skills section is present.");
        } else {
            issues.add("Skills section heading is missing.");
            tips.add("Add a dedicated SKILLS section with tools and technologies.");
        }
        if (lower.contains("education")) {
            strengths.add("Education section is present.");
        } else {
            issues.add("Education section heading is missing.");
            tips.add("Add an EDUCATION section with degree, institution, and graduation dates.");
        }
        if (!EMAIL_PATTERN.matcher(resumeText).find()) {
            issues.add("Email is not clearly detected.");
            tips.add("Place your email near the top of the resume.");
        }
        if (!PHONE_PATTERN.matcher(resumeText).find()) {
            issues.add("Phone number is not clearly detected.");
            tips.add("Place a valid phone number near contact details.");
        }
        if (resumeText.length() < 500) {
            issues.add("Resume content appears short for ATS matching.");
            tips.add("Add role-specific project details and quantified achievements.");
        } else {
            strengths.add("Resume contains substantial content.");
        }

        if (!"General ATS review".equals(roleContext)) {
            List<String> missingContextKeywords = getMissingContextKeywords(resumeText, roleContext);
            if (!missingContextKeywords.isEmpty()) {
                issues.add("Resume does not strongly reflect the provided role or job description context.");
                tips.add("Include role-relevant terms naturally: " +
                        String.join(", ", missingContextKeywords.subList(0, Math.min(5, missingContextKeywords.size()))) + ".");
            } else {
                strengths.add("Resume aligns well with the provided role or job description context.");
            }
        }

        if (strengths.isEmpty()) {
            strengths.add("Basic resume content is present and parseable.");
        }
        if (issues.isEmpty()) {
            issues.add("No major structural issue detected by fallback analysis.");
        }
        if (tips.isEmpty()) {
            tips.add("Tailor your summary and bullet points for the target role.");
        }

        return new AiReviewResult(
                score,
                overallAssessment,
                strengths,
                issues,
                tips,
                new AiDetectedData(
                        extractCandidateName(resumeText),
                        extractEmail(resumeText),
                        extractPhone(resumeText),
                        inferTargetRole(resumeText),
                        inferTopSkills(resumeText)
                )
        );
    }

    private int estimateFallbackScore(String resumeText, String roleContext) {
        int score = 40;
        String lower = resumeText.toLowerCase();
        if (lower.contains("summary")) {
            score += 10;
        }
        if (lower.contains("skills")) {
            score += 15;
        }
        if (lower.contains("experience")) {
            score += 15;
        }
        if (lower.contains("education")) {
            score += 10;
        }
        if (EMAIL_PATTERN.matcher(resumeText).find()) {
            score += 5;
        }
        if (PHONE_PATTERN.matcher(resumeText).find()) {
            score += 5;
        }
        if (resumeText.length() > 1000) {
            score += 10;
        }
        if (!"General ATS review".equals(roleContext) && getMissingContextKeywords(resumeText, roleContext).size() <= 2) {
            score += 5;
        }
        return clampScore(score);
    }

    private List<String> getMissingContextKeywords(String resumeText, String roleContext) {
        Set<String> resumeTokens = new LinkedHashSet<>(extractKeywords(resumeText));
        List<String> contextTokens = extractKeywords(roleContext);
        List<String> missing = new ArrayList<>();
        for (String token : contextTokens) {
            if (!resumeTokens.contains(token)) {
                missing.add(token);
            }
        }
        return missing;
    }

    private List<String> extractKeywords(String input) {
        if (input == null || input.isBlank()) {
            return List.of();
        }
        String[] rawTokens = KEYWORD_SPLIT_PATTERN.split(input.toLowerCase());
        Set<String> unique = new LinkedHashSet<>();
        for (String token : rawTokens) {
            String normalized = token.trim();
            if (normalized.length() < 3) {
                continue;
            }
            if (STOP_WORDS.contains(normalized)) {
                continue;
            }
            unique.add(normalized);
            if (unique.size() >= 30) {
                break;
            }
        }
        return new ArrayList<>(unique);
    }

    private String extractCandidateName(String resumeText) {
        String[] lines = resumeText.split("\\R");
        for (String line : lines) {
            String trimmed = line.trim();
            if (trimmed.length() >= 3 && trimmed.length() <= 60 && trimmed.matches("[A-Za-z .'-]+")) {
                return trimmed;
            }
        }
        return "Not clearly present";
    }

    private String extractEmail(String resumeText) {
        Matcher matcher = EMAIL_PATTERN.matcher(resumeText);
        return matcher.find() ? matcher.group() : "Not clearly present";
    }

    private String extractPhone(String resumeText) {
        Matcher matcher = PHONE_PATTERN.matcher(resumeText);
        return matcher.find() ? matcher.group().trim() : "Not clearly present";
    }

    private String inferTargetRole(String resumeText) {
        String lower = resumeText.toLowerCase();
        if (lower.contains("software")) {
            return "Software-related role";
        }
        if (lower.contains("data")) {
            return "Data-related role";
        }
        if (lower.contains("bioinformatics")) {
            return "Bioinformatics role";
        }
        return "Not clearly present";
    }

    private List<String> inferTopSkills(String resumeText) {
        String lower = resumeText.toLowerCase();
        List<String> skills = new ArrayList<>();
        if (lower.contains("python")) {
            skills.add("Python");
        }
        if (lower.contains("java")) {
            skills.add("Java");
        }
        if (lower.contains("sql")) {
            skills.add("SQL");
        }
        if (lower.contains("machine learning")) {
            skills.add("Machine Learning");
        }
        if (lower.contains("react")) {
            skills.add("React");
        }
        if (skills.isEmpty()) {
            skills.add("Not clearly present");
        }
        return skills;
    }

    public record AnalysisResult(
            int score,
            String overallAssessment,
            List<String> strengths,
            List<String> issuesFound,
            List<String> tips,
            String fileName,
            String roleContext,
            DetectedData detectedData
    ) {
    }

    public record DetectedData(
            String candidateName,
            String email,
            String phone,
            String targetRole,
            List<String> topSkills
    ) {
    }

    public record AiReviewResult(
            int score,
            String overallAssessment,
            List<String> strengths,
            List<String> issuesFound,
            List<String> tips,
            AiDetectedData detectedData
    ) {
        public AiDetectedData detectedData() {
            return detectedData == null ? new AiDetectedData(null, null, null, null, List.of()) : detectedData;
        }
    }

    public record AiDetectedData(
            String candidateName,
            String email,
            String phone,
            String targetRole,
            List<String> topSkills
    ) {
    }

    public record CohereV1Request(String model, String message, double temperature) {
    }

    public record CohereV2Request(String model, List<CohereMessage> messages, double temperature) {
    }

    public record CohereMessage(String role, String content) {
    }
}