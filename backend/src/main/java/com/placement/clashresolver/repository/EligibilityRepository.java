package com.placement.clashresolver.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.placement.clashresolver.entity.Eligibility;
import com.placement.clashresolver.entity.Student;

public interface EligibilityRepository extends JpaRepository<Eligibility, Long> {

	List<Eligibility> findByDriveId(Long driveId);

	List<Eligibility> findByStudentId(Long studentId);

	List<Eligibility> findByDriveIdAndStudentId(Long driveId, Long studentId);
}