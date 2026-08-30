package com.placement.clashresolver.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.placement.clashresolver.entity.Company;
import com.placement.clashresolver.repository.CompanyRepository;

@Service
public class CompanyService {

	private final CompanyRepository companyRepository;

	public CompanyService(CompanyRepository companyRepository) {
		this.companyRepository = companyRepository;
	}

	public Company createCompany(Company company) {
		return companyRepository.save(company);
	}

	public List<Company> getAllCompanies() {
		return companyRepository.findAll();
	}

	public Company getCompanyById(Long id) {
		return companyRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Company not found with id: " + id));
	}

	public Company updateCompany(Long id, Company updatedCompany) {

		Company existingCompany = getCompanyById(id);

		existingCompany.setName(updatedCompany.getName());
		existingCompany.setDescription(updatedCompany.getDescription());
		existingCompany.setWebsite(updatedCompany.getWebsite());
		existingCompany.setIndustry(updatedCompany.getIndustry());

		return companyRepository.save(existingCompany);
	}

	public void deleteCompany(Long id) {
		companyRepository.deleteById(id);
	}
}