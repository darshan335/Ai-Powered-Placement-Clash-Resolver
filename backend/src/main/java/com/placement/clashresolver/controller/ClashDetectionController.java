package com.placement.clashresolver.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.placement.clashresolver.dto.ConflictReport;
import com.placement.clashresolver.dto.ScheduleCheckRequest;
import com.placement.clashresolver.dto.ScheduleCheckResponse;
import com.placement.clashresolver.dto.SlotRecommendationResponse;
import com.placement.clashresolver.entity.PlacementDrive;
import com.placement.clashresolver.entity.Student;
import com.placement.clashresolver.service.ClashDetectionService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/clashes")
public class ClashDetectionController {

    private final ClashDetectionService clashDetectionService;

    public ClashDetectionController(
            ClashDetectionService clashDetectionService) {

        this.clashDetectionService = clashDetectionService;
    }

    // =====================================================
    // FIND CLASHING DRIVES
    // =====================================================

    @GetMapping("/drive/{driveId}")
    public List<PlacementDrive> findClashingDrives(
            @PathVariable Long driveId) {

        PlacementDrive drive =
                clashDetectionService.getDriveById(driveId);

        return clashDetectionService.findClashingDrives(drive);
    }

    // =====================================================
    // FIND AFFECTED STUDENTS
    // =====================================================

    @GetMapping("/drive/{driveId}/affected-students/{otherDriveId}")
    public List<Student> findAffectedStudents(
            @PathVariable Long driveId,
            @PathVariable Long otherDriveId) {

        PlacementDrive drive1 =
                clashDetectionService.getDriveById(driveId);

        PlacementDrive drive2 =
                clashDetectionService.getDriveById(otherDriveId);

        return clashDetectionService.findAffectedStudents(
                drive1,
                drive2);
    }

    // =====================================================
    // GET ELIGIBLE STUDENTS FOR ONE DRIVE
    // =====================================================

    @GetMapping("/drive/{driveId}/eligible-students")
    public List<Student> getEligibleStudents(
            @PathVariable Long driveId) {

        PlacementDrive drive =
                clashDetectionService.getDriveById(driveId);

        return clashDetectionService
                .getEligibleStudentsForDrive(drive);
    }

    // =====================================================
    // GET NOT ELIGIBLE STUDENTS FOR ONE DRIVE
    // =====================================================

    @GetMapping("/drive/{driveId}/not-eligible-students")
    public List<Student> getNotEligibleStudents(
            @PathVariable Long driveId) {

        PlacementDrive drive =
                clashDetectionService.getDriveById(driveId);

        return clashDetectionService
                .getNotEligibleStudentsForDrive(drive);
    }

    // =====================================================
    // GENERATE CONFLICT REPORT
    // =====================================================

    @GetMapping("/report/{drive1Id}/{drive2Id}")
    public ConflictReport generateConflictReport(
            @PathVariable Long drive1Id,
            @PathVariable Long drive2Id) {

        PlacementDrive drive1 =
                clashDetectionService.getDriveById(drive1Id);

        PlacementDrive drive2 =
                clashDetectionService.getDriveById(drive2Id);

        return clashDetectionService.generateConflictReport(
                drive1,
                drive2);
    }

    // =====================================================
    // GET ALL CONFLICTS
    // =====================================================

    @GetMapping
    public List<ConflictReport> getAllConflicts() {

        return clashDetectionService
                .findAllConflictReports();
    }

    // =====================================================
    // CHECK SCHEDULE
    // =====================================================

    @PostMapping("/check")
    public ScheduleCheckResponse checkSchedule(
            @Valid @RequestBody ScheduleCheckRequest request) {

        return clashDetectionService
                .checkSchedule(request);
    }

    // =====================================================
    // RECOMMEND SLOTS
    // =====================================================

    @PostMapping("/recommend")
    public SlotRecommendationResponse recommendSlots(
            @Valid @RequestBody ScheduleCheckRequest request) {

        return clashDetectionService
                .recommendSlots(request);
    }

    // =====================================================
    // RECOMMEND SLOT FOR SPECIFIC CONFLICT
    // =====================================================

    @GetMapping("/recommend/{drive1Id}/{drive2Id}")
    public SlotRecommendationResponse recommendSlotsForConflict(
            @PathVariable Long drive1Id,
            @PathVariable Long drive2Id) {

        return clashDetectionService
                .recommendSlotsForConflict(
                        drive1Id,
                        drive2Id);
    }
}