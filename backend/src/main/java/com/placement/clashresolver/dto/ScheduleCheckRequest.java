package com.placement.clashresolver.dto;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import jakarta.validation.constraints.NotNull;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ScheduleCheckRequest {

    @NotNull
    private Long companyId;

    private String jobRole;

    @NotNull
    private LocalDate driveDate;

    @NotNull
    private LocalTime startTime;

    @NotNull
    private LocalTime endTime;

    private String venue;

    private Double packageLpa;

    // Optional eligibility criteria
    private Double minimumCgpa;

    private Integer maximumBacklogs;

    // Keep this temporarily for compatibility
    private List<Long> eligibleStudentIds;
}