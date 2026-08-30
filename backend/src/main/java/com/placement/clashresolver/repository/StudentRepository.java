package com.placement.clashresolver.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.placement.clashresolver.entity.Student;

public interface StudentRepository extends JpaRepository<Student, Long> {

}