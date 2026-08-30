package com.placement.clashresolver.service;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.placement.clashresolver.dto.ConflictReport;
import com.placement.clashresolver.dto.ScheduleCheckRequest;
import com.placement.clashresolver.dto.ScheduleCheckResponse;
import com.placement.clashresolver.dto.SlotRecommendation;
import com.placement.clashresolver.dto.SlotRecommendationResponse;
import com.placement.clashresolver.entity.Company;
import com.placement.clashresolver.entity.PlacementDrive;
import com.placement.clashresolver.entity.Student;
import com.placement.clashresolver.repository.CompanyRepository;
import com.placement.clashresolver.repository.PlacementDriveRepository;
import com.placement.clashresolver.repository.StudentRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ClashDetectionService {

	private final PlacementDriveRepository placementDriveRepository;
	private final CompanyRepository companyRepository;
	private final StudentRepository studentRepository;

	// =========================================================
	// 1. CHECK TIME CLASH
	// =========================================================

	public boolean hasTimeClash(PlacementDrive drive1, PlacementDrive drive2) {

		if (drive1 == null || drive2 == null) {
			return false;
		}

		if (drive1.getDriveDate() == null || drive2.getDriveDate() == null) {
			return false;
		}

		if (drive1.getStartTime() == null || drive1.getEndTime() == null || drive2.getStartTime() == null
				|| drive2.getEndTime() == null) {
			return false;
		}

		if (!drive1.getDriveDate().equals(drive2.getDriveDate())) {

			return false;
		}

		return drive1.getStartTime().isBefore(drive2.getEndTime())
				&& drive2.getStartTime().isBefore(drive1.getEndTime());
	}

	// =========================================================
	// 2. FIND CLASHING DRIVES
	// =========================================================

	public List<PlacementDrive> findClashingDrives(PlacementDrive drive) {

		if (drive == null) {
			return List.of();
		}

		List<PlacementDrive> allDrives = placementDriveRepository.findAll();

		return allDrives.stream()
				.filter(existingDrive -> existingDrive != null && existingDrive.getId() != null && drive.getId() != null
						&& !existingDrive.getId().equals(drive.getId()))
				.filter(existingDrive -> hasTimeClash(drive, existingDrive)).toList();
	}

	// =========================================================
	// 3. GET DRIVE BY ID
	// =========================================================

	public PlacementDrive getDriveById(Long driveId) {

		if (driveId == null) {
			return null;
		}

		return placementDriveRepository.findById(driveId).orElse(null);
	}

	// =========================================================
	// 4. CHECK STUDENT ELIGIBILITY
	// =========================================================

	private boolean isStudentEligible(Student student, PlacementDrive drive) {

		if (student == null || drive == null) {
			return false;
		}

		// -----------------------------------------------------
		// CGPA
		// -----------------------------------------------------

		if (drive.getMinimumCgpa() != null) {

			if (student.getCgpa() == null) {
				return false;
			}

			if (student.getCgpa() < drive.getMinimumCgpa()) {

				return false;
			}
		}

		// -----------------------------------------------------
		// BACKLOGS
		// -----------------------------------------------------

		if (drive.getMaximumBacklogs() != null) {

			if (student.getBacklogs() == null) {
				return false;
			}

			if (student.getBacklogs() > drive.getMaximumBacklogs()) {

				return false;
			}
		}

		return true;
	}

	// =========================================================
	// 5. GET ELIGIBLE STUDENTS
	// =========================================================

	private List<Student> getEligibleStudents(PlacementDrive drive) {

		if (drive == null) {
			return List.of();
		}

		List<Student> students = studentRepository.findAll();

		if (students == null || students.isEmpty()) {

			return List.of();
		}

		return students.stream().filter(student -> student != null && isStudentEligible(student, drive)).toList();
	}

	// =========================================================
	// 6. GET ELIGIBLE STUDENTS FOR DRIVE
	// =========================================================

	public List<Student> getEligibleStudentsForDrive(PlacementDrive drive) {

		return getEligibleStudents(drive);
	}

	// =========================================================
	// 7. GET NOT ELIGIBLE STUDENTS
	// =========================================================

	public List<Student> getNotEligibleStudentsForDrive(PlacementDrive drive) {

		if (drive == null) {
			return List.of();
		}

		List<Student> students = studentRepository.findAll();

		if (students == null || students.isEmpty()) {

			return List.of();
		}

		return students.stream().filter(student -> student != null && !isStudentEligible(student, drive)).toList();
	}

	// =========================================================
	// 8. FIND AFFECTED STUDENTS
	// =========================================================

	public List<Student> findAffectedStudents(PlacementDrive drive1, PlacementDrive drive2) {

		if (drive1 == null || drive2 == null) {
			return List.of();
		}

		List<Student> drive1Students = getEligibleStudents(drive1);

		List<Student> drive2Students = getEligibleStudents(drive2);

		List<Long> drive2StudentIds = drive2Students.stream().filter(student -> student.getId() != null)
				.map(Student::getId).toList();

		return drive1Students.stream()
				.filter(student -> student.getId() != null && drive2StudentIds.contains(student.getId())).toList();
	}

	// =========================================================
	// 9. GENERATE CONFLICT REPORT
	// =========================================================

	public ConflictReport generateConflictReport(PlacementDrive drive1, PlacementDrive drive2) {

		if (drive1 == null || drive2 == null) {
			return null;
		}

		List<Student> affectedStudents = findAffectedStudents(drive1, drive2);

		int affectedCount = affectedStudents.size();

		String severity = calculateSeverity(affectedCount);

		return new ConflictReport(drive1.getId(), drive1.getCompany().getName(), drive2.getId(),
				drive2.getCompany().getName(), drive1.getDriveDate().toString(), drive1.getStartTime().toString(),
				drive1.getEndTime().toString(), drive2.getStartTime().toString(), drive2.getEndTime().toString(),
				affectedCount, severity);
	}

	// =========================================================
	// 10. CALCULATE SEVERITY
	// =========================================================

	private String calculateSeverity(int affectedStudentCount) {

		if (affectedStudentCount == 0) {
			return "LOW";
		}

		if (affectedStudentCount <= 10) {
			return "MEDIUM";
		}

		if (affectedStudentCount <= 50) {
			return "HIGH";
		}

		return "CRITICAL";
	}

	// =========================================================
	// 11. FIND ALL CONFLICT REPORTS
	// =========================================================

	public List<ConflictReport> findAllConflictReports() {

		List<PlacementDrive> drives = placementDriveRepository.findAll();

		List<ConflictReport> reports = new ArrayList<>();

		if (drives == null || drives.size() < 2) {

			return reports;
		}

		for (int i = 0; i < drives.size(); i++) {

			for (int j = i + 1; j < drives.size(); j++) {

				PlacementDrive drive1 = drives.get(i);

				PlacementDrive drive2 = drives.get(j);

				if (hasTimeClash(drive1, drive2)) {

					ConflictReport report = generateConflictReport(drive1, drive2);

					if (report != null) {
						reports.add(report);
					}
				}
			}
		}

		return reports;
	}

	// =========================================================
	// 12. CHECK NEW SCHEDULE
	// =========================================================

	public ScheduleCheckResponse checkSchedule(ScheduleCheckRequest request) {

		List<PlacementDrive> existingDrives = placementDriveRepository.findAll();

		List<ConflictReport> conflicts = new ArrayList<>();

		Company company = companyRepository.findById(request.getCompanyId()).orElse(null);

		if (company == null) {

			return new ScheduleCheckResponse(false, "Company not found.", conflicts);
		}

		// =====================================================
		// CREATE TEMPORARY DRIVE
		// =====================================================

		PlacementDrive proposedDrive = new PlacementDrive();

		proposedDrive.setId(-1L);

		proposedDrive.setCompany(company);

		proposedDrive.setJobRole(request.getJobRole());

		proposedDrive.setDriveDate(request.getDriveDate());

		proposedDrive.setStartTime(request.getStartTime());

		proposedDrive.setEndTime(request.getEndTime());

		proposedDrive.setVenue(request.getVenue());

		proposedDrive.setPackageLpa(request.getPackageLpa());

		proposedDrive.setMinimumCgpa(request.getMinimumCgpa());

		proposedDrive.setMaximumBacklogs(request.getMaximumBacklogs());

		// =====================================================
		// CHECK EXISTING DRIVES
		// =====================================================

		for (PlacementDrive existingDrive : existingDrives) {

			if (!hasTimeClash(proposedDrive, existingDrive)) {

				continue;
			}

			List<Student> affectedStudents = findAffectedStudents(proposedDrive, existingDrive);

			int affectedCount = affectedStudents.size();

			String severity = calculateSeverity(affectedCount);

			ConflictReport report = new ConflictReport(proposedDrive.getId(), proposedDrive.getCompany().getName(),
					existingDrive.getId(), existingDrive.getCompany().getName(),
					proposedDrive.getDriveDate().toString(), proposedDrive.getStartTime().toString(),
					proposedDrive.getEndTime().toString(), existingDrive.getStartTime().toString(),
					existingDrive.getEndTime().toString(), affectedCount, severity);

			conflicts.add(report);
		}

		// =====================================================
		// NO CONFLICT
		// =====================================================

		if (conflicts.isEmpty()) {

			return new ScheduleCheckResponse(true, "No scheduling conflicts found.", conflicts);
		}

		// =====================================================
		// CONFLICT FOUND
		// =====================================================

		return new ScheduleCheckResponse(false, "Scheduling conflict detected.", conflicts);
	}

	// =========================================================
	// 13. RECOMMEND SLOTS FOR NEW SCHEDULE
	// =========================================================

	public SlotRecommendationResponse recommendSlots(ScheduleCheckRequest request) {

		List<PlacementDrive> existingDrives = placementDriveRepository.findAll();

		List<SlotRecommendation> recommendations = new ArrayList<>();

		LocalDate requestedDate = request.getDriveDate();

		LocalTime requestedStart = request.getStartTime();

		LocalTime requestedEnd = request.getEndTime();

		long durationMinutes = Duration.between(requestedStart, requestedEnd).toMinutes();

		for (int day = 0; day < 7; day++) {

			LocalDate candidateDate = requestedDate.plusDays(day);

			for (int hour = 9; hour <= 18; hour++) {

				LocalTime candidateStart = LocalTime.of(hour, 0);

				LocalTime candidateEnd = candidateStart.plusMinutes(durationMinutes);

				if (candidateEnd.isAfter(LocalTime.of(18, 0))) {

					continue;
				}

				boolean conflict = false;

				for (PlacementDrive existingDrive : existingDrives) {

					if (!candidateDate.equals(existingDrive.getDriveDate())) {

						continue;
					}

					PlacementDrive candidateDrive = new PlacementDrive();

					candidateDrive.setDriveDate(candidateDate);

					candidateDrive.setStartTime(candidateStart);

					candidateDrive.setEndTime(candidateEnd);

					if (hasTimeClash(candidateDrive, existingDrive)) {

						conflict = true;
						break;
					}
				}

				if (!conflict) {

					recommendations.add(new SlotRecommendation(candidateDate, candidateStart, candidateEnd,
							"No conflicting placement drive found.", 0));
				}

				if (recommendations.size() >= 5) {

					return new SlotRecommendationResponse(true, "Alternative slots found.", recommendations);
				}
			}
		}

		if (recommendations.isEmpty()) {

			return new SlotRecommendationResponse(true, "No available alternative slots found in the next 7 days.",
					recommendations);
		}

		return new SlotRecommendationResponse(true, "Alternative slots found.", recommendations);
	}

	// =========================================================
	// 14. RECOMMEND SLOT FOR SPECIFIC CONFLICT
	// =========================================================

	public SlotRecommendationResponse recommendSlotsForConflict(Long drive1Id, Long drive2Id) {

		PlacementDrive drive1 = getDriveById(drive1Id);

		PlacementDrive drive2 = getDriveById(drive2Id);

		// =====================================================
		// VALIDATE DRIVES
		// =====================================================

		if (drive1 == null || drive2 == null) {

			return new SlotRecommendationResponse(false, "Unable to find the selected placement drives.",
					new ArrayList<>());
		}

		// =====================================================
		// MAKE SURE THERE IS ACTUALLY A CLASH
		// =====================================================

		if (!hasTimeClash(drive1, drive2)) {

			return new SlotRecommendationResponse(false, "The selected drives do not have a scheduling conflict.",
					new ArrayList<>());
		}

		// =====================================================
		// DRIVE 1 IS THE DRIVE WE WANT TO MOVE
		// =====================================================

		LocalDate requestedDate = drive1.getDriveDate();

		LocalTime requestedStart = drive1.getStartTime();

		LocalTime requestedEnd = drive1.getEndTime();

		long durationMinutes = Duration.between(requestedStart, requestedEnd).toMinutes();

		// =====================================================
		// GET ALL EXISTING DRIVES
		// =====================================================

		List<PlacementDrive> existingDrives = placementDriveRepository.findAll();

		List<SlotRecommendation> recommendations = new ArrayList<>();

		// =====================================================
		// SEARCH NEXT 7 DAYS
		// =====================================================

		for (int day = 0; day < 7; day++) {

			LocalDate candidateDate = requestedDate.plusDays(day);

			// -------------------------------------------------
			// SEARCH FROM 9 AM
			// -------------------------------------------------

			for (int hour = 9; hour <= 18; hour++) {

				LocalTime candidateStart = LocalTime.of(hour, 0);

				LocalTime candidateEnd = candidateStart.plusMinutes(durationMinutes);

				// -------------------------------------------------
				// MUST FINISH BY 6 PM
				// -------------------------------------------------

				if (candidateEnd.isAfter(LocalTime.of(18, 0))) {

					continue;
				}

				boolean conflict = false;

				// =================================================
				// CHECK CANDIDATE AGAINST EXISTING DRIVES
				// =================================================

				for (PlacementDrive existingDrive : existingDrives) {

					if (existingDrive == null) {
						continue;
					}

					/*
					 * IMPORTANT:
					 *
					 * Ignore ONLY drive1 because that is the drive we are moving.
					 *
					 * DO NOT ignore drive2.
					 *
					 * Drive2 must remain in the conflict check.
					 */
					if (existingDrive.getId() != null && existingDrive.getId().equals(drive1Id)) {

						continue;
					}

					// Different date = no conflict
					if (!candidateDate.equals(existingDrive.getDriveDate())) {

						continue;
					}

					// Temporary candidate drive
					PlacementDrive candidateDrive = new PlacementDrive();

					candidateDrive.setDriveDate(candidateDate);

					candidateDrive.setStartTime(candidateStart);

					candidateDrive.setEndTime(candidateEnd);

					// Check time overlap
					if (hasTimeClash(candidateDrive, existingDrive)) {

						conflict = true;
						break;
					}
				}

				// =================================================
				// SLOT IS AVAILABLE
				// =================================================

				if (!conflict) {

					int affectedStudentCount = findAffectedStudents(drive1, drive2).size();

					String reason = "No conflicting placement drive found.";

					recommendations.add(new SlotRecommendation(candidateDate, candidateStart, candidateEnd, reason,
							affectedStudentCount));
				}

				// =================================================
				// RETURN FIRST 5 AVAILABLE SLOTS
				// =================================================

				if (recommendations.size() >= 5) {

					return new SlotRecommendationResponse(true, "Alternative slots found.", recommendations);
				}
			}
		}

		// =====================================================
		// NO SLOT FOUND
		// =====================================================

		if (recommendations.isEmpty()) {

			return new SlotRecommendationResponse(true, "No available alternative slots found in the next 7 days.",
					recommendations);
		}

		return new SlotRecommendationResponse(true, "Alternative slots found.", recommendations);
	}
}