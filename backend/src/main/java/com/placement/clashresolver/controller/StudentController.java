package com.placement.clashresolver.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import com.placement.clashresolver.entity.Student;
import com.placement.clashresolver.service.StudentService;

@RestController
@RequestMapping("/api/students")
public class StudentController {

    private final StudentService studentService;

    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    // =====================================================
    // CREATE STUDENT
    // =====================================================

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Student createStudent(@RequestBody Student student) {
        return studentService.createStudent(student);
    }

    // =====================================================
    // GET ALL STUDENTS
    // =====================================================

    @GetMapping
    public List<Student> getAllStudents() {
        return studentService.getAllStudents();
    }

    // =====================================================
    // GET STUDENT BY ID
    // =====================================================

    @GetMapping("/{id}")
    public Student getStudentById(@PathVariable Long id) {
        return studentService.getStudentById(id);
    }

    // =====================================================
    // UPDATE STUDENT
    // =====================================================

    @PutMapping("/{id}")
    public Student updateStudent(
            @PathVariable Long id,
            @RequestBody Student student) {

        return studentService.updateStudent(id, student);
    }

    // =====================================================
    // DELETE STUDENT
    // =====================================================

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteStudent(@PathVariable Long id) {
        studentService.deleteStudent(id);
    }
}