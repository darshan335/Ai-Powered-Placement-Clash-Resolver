package com.placement.clashresolver.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PositiveOrZero;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AiAnalysisRequest {

    @NotBlank(message = "Conflict details are required")
    private String conflictDetails;

    @PositiveOrZero(message = "Affected student count cannot be negative")
    private int affectedStudentCount;

    @NotBlank(message = "Suggested date is required")
    private String suggestedDate;

    @NotBlank(message = "Suggested start time is required")
    private String suggestedStartTime;

    @NotBlank(message = "Suggested end time is required")
    private String suggestedEndTime;
}