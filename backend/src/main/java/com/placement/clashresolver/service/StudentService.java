package com.placement.clashresolver.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.placement.clashresolver.entity.Student;
import com.placement.clashresolver.repository.StudentRepository;

@Service
public class StudentService {

    private final StudentRepository studentRepository;

    public StudentService(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    // =====================================================
    // CREATE STUDENT
    // =====================================================

    public Student createStudent(Student student) {
        return studentRepository.save(student);
    }

    // =====================================================
    // GET ALL STUDENTS
    // =====================================================

    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    // =====================================================
    // GET STUDENT BY ID
    // =====================================================

    public Student getStudentById(Long id) {
        return studentRepository.findById(id)
                .orElse(null);
    }

    // =====================================================
    // UPDATE STUDENT
    // =====================================================

    public Student updateStudent(Long id, Student updatedStudent) {

        Student existingStudent = studentRepository.findById(id)
                .orElseThrow(() ->
                    new RuntimeException(
                        "Student not found with id: " + id
                    )
                );

        existingStudent.setName(updatedStudent.getName());

        existingStudent.setEmail(updatedStudent.getEmail());

        existingStudent.setBranch(updatedStudent.getBranch());

        existingStudent.setCgpa(updatedStudent.getCgpa());

        existingStudent.setGraduationYear(
                updatedStudent.getGraduationYear()
        );

        existingStudent.setBacklogs(
                updatedStudent.getBacklogs()
        );

        return studentRepository.save(existingStudent);
    }

    // =====================================================
    // DELETE STUDENT
    // =====================================================

    public void deleteStudent(Long id) {
        studentRepository.deleteById(id);
    }
}