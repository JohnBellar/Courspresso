package com.dhanesh.auth.portal.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.dhanesh.auth.portal.entity.SavedCourse;
import com.dhanesh.auth.portal.repository.UserRepository;
import com.dhanesh.auth.portal.service.SavedCourseService;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
@RequestMapping("/saved-courses")
public class SavedCourseController {

    private final SavedCourseService savedCourseService;
    private final UserRepository userRepository;

    private String extractUserId(UserDetails userDetails) {
        return userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found with email: " + userDetails.getUsername()))
                .getId();
    }

    @PostMapping
    public ResponseEntity<SavedCourse> saveCourse(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam String courseId) {
        return ResponseEntity.ok(savedCourseService.saveCourse(
                extractUserId(userDetails), courseId));
    }

    @GetMapping
    public ResponseEntity<List<SavedCourse>> getSavedCourses(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(savedCourseService.getSavedCourses(
                extractUserId(userDetails)));
    }

    @GetMapping("/exists")
    public ResponseEntity<Boolean> isCourseSaved(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam String courseId) {
        return ResponseEntity.ok(savedCourseService.isCourseSaved(
                extractUserId(userDetails), courseId));
    }

    @DeleteMapping("/{courseId}")
    public ResponseEntity<Void> removeSavedCourse(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable String courseId) {
        savedCourseService.removeSavedCourse(extractUserId(userDetails), courseId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/count")
    public ResponseEntity<Long> countSavedCourses(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(savedCourseService.getSavedCourseCount(
                extractUserId(userDetails)));
    }
}
