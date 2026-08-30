package com.placement.clashresolver.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import com.placement.clashresolver.entity.Eligibility;
import com.placement.clashresolver.service.EligibilityService;

@RestController
@RequestMapping("/api/eligibility")
public class EligibilityController {

    private final EligibilityService eligibilityService;

    public EligibilityController(EligibilityService eligibilityService) {
        this.eligibilityService = eligibilityService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Eligibility createEligibility(
            @RequestBody Eligibility eligibility) {

        return eligibilityService.createEligibility(eligibility);
    }

    @GetMapping
    public List<Eligibility> getAllEligibility() {
        return eligibilityService.getAllEligibility();
    }

    @GetMapping("/{id}")
    public Eligibility getEligibilityById(@PathVariable Long id) {
        return eligibilityService.getEligibilityById(id);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteEligibility(@PathVariable Long id) {
        eligibilityService.deleteEligibility(id);
    }
}