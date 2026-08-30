package com.placement.clashresolver.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import com.placement.clashresolver.entity.PlacementDrive;
import com.placement.clashresolver.service.PlacementDriveService;

@RestController
@RequestMapping("/api/drives")
public class PlacementDriveController {

	private final PlacementDriveService placementDriveService;

	public PlacementDriveController(PlacementDriveService placementDriveService) {

		this.placementDriveService = placementDriveService;
	}

	// =====================================================
	// CREATE DRIVE
	// =====================================================

	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	public PlacementDrive createDrive(@RequestBody PlacementDrive drive) {

		return placementDriveService.createDrive(drive);
	}

	// =====================================================
	// GET ALL DRIVES
	// =====================================================

	@GetMapping
	public List<PlacementDrive> getAllDrives() {

		return placementDriveService.getAllDrives();
	}

	// =====================================================
	// GET DRIVE BY ID
	// =====================================================

	@GetMapping("/{id}")
	public PlacementDrive getDriveById(@PathVariable Long id) {

		return placementDriveService.getDriveById(id);
	}

	// =====================================================
	// UPDATE DRIVE
	// =====================================================

	@PutMapping("/{id}")
	public PlacementDrive updateDrive(@PathVariable Long id, @RequestBody PlacementDrive drive) {

		return placementDriveService.updateDrive(id, drive);
	}

	// =====================================================
	// DELETE DRIVE
	// =====================================================

	@DeleteMapping("/{id}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	public void deleteDrive(@PathVariable Long id) {

		placementDriveService.deleteDrive(id);
	}
}