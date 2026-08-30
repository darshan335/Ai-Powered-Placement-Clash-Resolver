package com.placement.clashresolver.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.placement.clashresolver.entity.Company;

public interface CompanyRepository extends JpaRepository<Company, Long> {

}