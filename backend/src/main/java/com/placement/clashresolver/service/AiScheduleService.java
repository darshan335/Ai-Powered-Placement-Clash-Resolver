package com.placement.clashresolver.service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.stereotype.Service;

import com.placement.clashresolver.dto.AiRecommendationResponse;
import com.placement.clashresolver.dto.AiScheduleRequest;
import com.placement.clashresolver.dto.ConflictReport;
import com.placement.clashresolver.dto.ScheduleCheckRequest;
import com.placement.clashresolver.dto.ScheduleCheckResponse;
import com.placement.clashresolver.dto.SlotRecommendation;
import com.placement.clashresolver.dto.SlotRecommendationResponse;
import com.placement.clashresolver.entity.Eligibility;
import com.placement.clashresolver.entity.PlacementDrive;
import com.placement.clashresolver.repository.EligibilityRepository;

@Service
public class AiScheduleService {

	private final ClashDetectionService clashDetectionService;
	private final AiRecommendationService aiRecommendationService;
	private final EligibilityRepository eligibilityRepository;

	public AiScheduleService(ClashDetectionService clashDetectionService,
			AiRecommendationService aiRecommendationService, EligibilityRepository eligibilityRepository) {

		this.clashDetectionService = clashDetectionService;
		this.aiRecommendationService = aiRecommendationService;
		this.eligibilityRepository = eligibilityRepository;
	}

	public AiRecommendationResponse analyzeSchedule(AiScheduleRequest request) {

		ScheduleCheckRequest scheduleRequest = new ScheduleCheckRequest();

		scheduleRequest.setCompanyId(request.getCompanyId());

		scheduleRequest.setJobRole(request.getJobRole());

		scheduleRequest.setDriveDate(LocalDate.parse(request.getDriveDate()));

		scheduleRequest.setStartTime(LocalTime.parse(request.getStartTime()));

		scheduleRequest.setEndTime(LocalTime.parse(request.getEndTime()));

		scheduleRequest.setVenue(request.getVenue());

		scheduleRequest.setPackageLpa(request.getPackageLpa());

		scheduleRequest.setEligibleStudentIds(request.getEligibleStudentIds());

		/*
		 * Check the proposed schedule against existing placement drives.
		 */
		ScheduleCheckResponse scheduleResponse = clashDetectionService.checkSchedule(scheduleRequest);

		List<ConflictReport> conflicts = scheduleResponse.getConflicts();

		/*
		 * Calculate affected students using the eligible students of the proposed drive
		 * and the existing conflicting drives.
		 */
		int affectedStudentCount = calculateAffectedStudents(request, conflicts);

		/*
		 * Find alternative placement slots.
		 */
		SlotRecommendationResponse slotResponse = clashDetectionService.recommendSlots(scheduleRequest);

		List<SlotRecommendation> slots = slotResponse.getRecommendations();

		/*
		 * Select the first available recommended slot.
		 */
		String suggestedDate = "";
		String suggestedStartTime = "";
		String suggestedEndTime = "";

		if (!slots.isEmpty()) {

			SlotRecommendation slot = slots.get(0);

			suggestedDate = slot.getDate().toString();

			suggestedStartTime = slot.getStartTime().toString();

			suggestedEndTime = slot.getEndTime().toString();
		}

		/*
		 * Build information for the AI.
		 */
		String conflictDetails = buildConflictDetails(request, conflicts);

		/*
		 * Ask Ollama to generate the recommendation explanation.
		 */
		return aiRecommendationService.analyzeConflict(conflictDetails, affectedStudentCount, suggestedDate,
				suggestedStartTime, suggestedEndTime);
	}

	private int calculateAffectedStudents(AiScheduleRequest request, List<ConflictReport> conflicts) {

		if (conflicts.isEmpty()) {
			return 0;
		}

		/*
		 * Students eligible for the proposed drive.
		 */
		Set<Long> proposedStudentIds = new HashSet<>(request.getEligibleStudentIds());

		Set<Long> affectedStudentIds = new HashSet<>();

		/*
		 * For every existing conflicting drive, find students eligible for that drive.
		 */
		for (ConflictReport conflict : conflicts) {

			PlacementDrive existingDrive = clashDetectionService.getDriveById(conflict.getDrive2Id());

			if (existingDrive == null) {
				continue;
			}

			List<Eligibility> existingEligibility = eligibilityRepository.findByDriveId(existingDrive.getId());

			/*
			 * Find intersection between:
			 *
			 * proposed drive students AND existing drive students
			 */
			for (Eligibility eligibility : existingEligibility) {

				Long studentId = eligibility.getStudent().getId();

				if (proposedStudentIds.contains(studentId)) {

					affectedStudentIds.add(studentId);
				}
			}
		}

		return affectedStudentIds.size();
	}

	private String buildConflictDetails(AiScheduleRequest request, List<ConflictReport> conflicts) {

		StringBuilder details = new StringBuilder();

		details.append("Proposed placement drive:\n");

		details.append("Company ID: ").append(request.getCompanyId()).append("\n");

		details.append("Job Role: ").append(request.getJobRole()).append("\n");

		details.append("Date: ").append(request.getDriveDate()).append("\n");

		details.append("Time: ").append(request.getStartTime()).append(" - ").append(request.getEndTime()).append("\n");

		details.append("Venue: ").append(request.getVenue()).append("\n");

		details.append("Package: ").append(request.getPackageLpa()).append(" LPA\n");

		details.append("Eligible students for proposed drive: ").append(request.getEligibleStudentIds().size())
				.append("\n\n");

		if (conflicts.isEmpty()) {

			details.append("No scheduling conflicts were detected.");

		} else {

			details.append("Detected scheduling conflicts:\n");

			for (ConflictReport conflict : conflicts) {

				details.append("- ").append(conflict.getCompany1()).append(" vs ").append(conflict.getCompany2())
						.append("\n");

				details.append("Date: ").append(conflict.getDate()).append("\n");

				details.append("Drive 1 time: ").append(conflict.getStartTime1()).append(" - ")
						.append(conflict.getEndTime1()).append("\n");

				details.append("Drive 2 time: ").append(conflict.getStartTime2()).append(" - ")
						.append(conflict.getEndTime2()).append("\n");

				details.append("Affected students: ").append(conflict.getAffectedStudentCount()).append("\n");

				details.append("Severity: ").append(conflict.getSeverity()).append("\n\n");
			}
		}

		return details.toString();
	}
}