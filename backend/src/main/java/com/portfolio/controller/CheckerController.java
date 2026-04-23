package com.portfolio.controller;

import com.portfolio.service.CheckerService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/checker")
@Validated
public class CheckerController {

    private final CheckerService checkerService;

    public CheckerController(CheckerService checkerService) {
        this.checkerService = checkerService;
    }

    @PostMapping(value = "/analyze", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<AnalyzeResponse> analyze(
            @RequestParam("resume") MultipartFile resume,
            @RequestParam(value = "jobDescription", required = false) String jobDescription
    ) {
        CheckerService.AnalysisResult result = checkerService.analyze(resume, jobDescription);

        return ResponseEntity.ok(new AnalyzeResponse(
                System.currentTimeMillis(),
                result.score(),
                result.overallAssessment(),
                result.strengths(),
                result.issuesFound(),
                result.tips(),
                result.fileName(),
                result.roleContext(),
                result.detectedData()
        ));
    }

    public record AnalyzeResponse(
            long runId,
            int score,
            String overallAssessment,
            java.util.List<String> strengths,
            java.util.List<String> issuesFound,
            java.util.List<String> tips,
            String fileName,
            String roleContext,
            CheckerService.DetectedData detectedData
    ) {
    }
}