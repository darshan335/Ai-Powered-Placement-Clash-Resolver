package com.placement.clashresolver.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.placement.clashresolver.dto.AiRecommendationResponse;
import com.placement.clashresolver.dto.AiScheduleRequest;
import com.placement.clashresolver.service.AiScheduleService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/ai")
public class AiScheduleController {

	private final AiScheduleService aiScheduleService;

	public AiScheduleController(AiScheduleService aiScheduleService) {

		this.aiScheduleService = aiScheduleService;
	}

	@PostMapping("/schedule")
	public ResponseEntity<AiRecommendationResponse> analyzeSchedule(@Valid @RequestBody AiScheduleRequest request) {

		AiRecommendationResponse response = aiScheduleService.analyzeSchedule(request);

		return ResponseEntity.ok(response);
	}
}