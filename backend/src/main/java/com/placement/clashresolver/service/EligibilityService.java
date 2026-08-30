package com.placement.clashresolver.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.placement.clashresolver.entity.Eligibility;
import com.placement.clashresolver.repository.EligibilityRepository;

@Service
public class EligibilityService {

	private final EligibilityRepository eligibilityRepository;

	public EligibilityService(EligibilityRepository eligibilityRepository) {
		this.eligibilityRepository = eligibilityRepository;
	}

	public Eligibility createEligibility(Eligibility eligibility) {
		return eligibilityRepository.save(eligibility);
	}

	public List<Eligibility> getAllEligibility() {
		return eligibilityRepository.findAll();
	}

	public Eligibility getEligibilityById(Long id) {
		return eligibilityRepository.findById(id).orElse(null);
	}

	public void deleteEligibility(Long id) {
		eligibilityRepository.deleteById(id);
	}
}