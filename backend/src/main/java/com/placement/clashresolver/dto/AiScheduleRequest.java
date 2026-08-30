package com.placement.clashresolver.dto;

import java.util.List;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AiScheduleRequest {

	@NotNull(message = "Company ID is required")
	private Long companyId;

	@NotBlank(message = "Job role is required")
	private String jobRole;

	@NotNull(message = "Drive date is required")
	private String driveDate;

	@NotBlank(message = "Start time is required")
	private String startTime;

	@NotBlank(message = "End time is required")
	private String endTime;

	private String venue;

	private Double packageLpa;

	@NotEmpty(message = "At least one eligible student is required")
	private List<Long> eligibleStudentIds;
}