package com.placement.clashresolver.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.placement.clashresolver.entity.PlacementDrive;
import com.placement.clashresolver.repository.PlacementDriveRepository;

@Service
public class PlacementDriveService {

	private final PlacementDriveRepository placementDriveRepository;
	private final ClashDetectionService clashDetectionService;

	public PlacementDriveService(PlacementDriveRepository placementDriveRepository,
			ClashDetectionService clashDetectionService) {
		this.placementDriveRepository = placementDriveRepository;
		this.clashDetectionService = clashDetectionService;
	}

	public PlacementDrive createDrive(PlacementDrive drive) {
		return placementDriveRepository.save(drive);
	}

	public List<PlacementDrive> getAllDrives() {
		return placementDriveRepository.findAll();
	}

	public PlacementDrive getDriveById(Long id) {
		return placementDriveRepository.findById(id).orElse(null);
	}

	public void deleteDrive(Long id) {
		placementDriveRepository.deleteById(id);
	}

	public PlacementDrive updateDrive(Long id, PlacementDrive updatedDrive) {

		PlacementDrive existingDrive = placementDriveRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Placement drive not found with id: " + id));

		existingDrive.setCompany(updatedDrive.getCompany());

		existingDrive.setJobRole(updatedDrive.getJobRole());

		existingDrive.setDriveDate(updatedDrive.getDriveDate());

		existingDrive.setStartTime(updatedDrive.getStartTime());

		existingDrive.setEndTime(updatedDrive.getEndTime());

		existingDrive.setVenue(updatedDrive.getVenue());

		existingDrive.setPackageLpa(updatedDrive.getPackageLpa());

		existingDrive.setStatus(updatedDrive.getStatus());

		existingDrive.setMinimumCgpa(updatedDrive.getMinimumCgpa());

		existingDrive.setMaximumBacklogs(updatedDrive.getMaximumBacklogs());

		return placementDriveRepository.save(existingDrive);
	}
}