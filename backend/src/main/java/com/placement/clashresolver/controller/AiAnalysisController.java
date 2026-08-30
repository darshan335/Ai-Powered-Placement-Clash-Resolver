package com.placement.clashresolver.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.placement.clashresolver.dto.AiAnalysisRequest;
import com.placement.clashresolver.dto.AiRecommendationResponse;
import com.placement.clashresolver.service.AiRecommendationService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/ai")
public class AiAnalysisController {

    private final AiRecommendationService aiRecommendationService;

    public AiAnalysisController(
            AiRecommendationService aiRecommendationService) {

        this.aiRecommendationService =
                aiRecommendationService;
    }

    @PostMapping("/analyze")
    public ResponseEntity<AiRecommendationResponse> analyzeConflict(
            @Valid @RequestBody AiAnalysisRequest request) {

        AiRecommendationResponse response =
                aiRecommendationService.analyzeConflict(
                        request.getConflictDetails(),
                        request.getAffectedStudentCount(),
                        request.getSuggestedDate(),
                        request.getSuggestedStartTime(),
                        request.getSuggestedEndTime()
                );

        return ResponseEntity.ok(response);
    }
}