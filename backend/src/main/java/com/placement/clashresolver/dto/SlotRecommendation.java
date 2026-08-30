package com.placement.clashresolver.dto;

import java.time.LocalDate;
import java.time.LocalTime;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SlotRecommendation {

	private LocalDate date;

	private LocalTime startTime;

	private LocalTime endTime;

	private String reason;

	private int affectedStudentCount;
}