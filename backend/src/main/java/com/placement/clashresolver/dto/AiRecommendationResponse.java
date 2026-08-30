package com.placement.clashresolver.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AiRecommendationResponse {

	private String recommendation;

	private String reason;

	private int affectedStudentCount;

	private String suggestedDate;

	private String suggestedStartTime;

	private String suggestedEndTime;
}