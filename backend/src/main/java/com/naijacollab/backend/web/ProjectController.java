package com.naijacollab.backend.web;

import com.naijacollab.backend.dto.messaging.ProjectResponse;
import com.naijacollab.backend.security.AuthenticatedPrincipal;
import com.naijacollab.backend.service.ProjectService;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/projects")
public class ProjectController {

    private final ProjectService projectService;

    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @GetMapping
    public ResponseEntity<List<ProjectResponse>> getMyProjects(
            @AuthenticationPrincipal AuthenticatedPrincipal principal) {
        return ResponseEntity.ok(projectService.getUserProjects(principal.userId()));
    }

    @PostMapping
    public ResponseEntity<ProjectResponse> createProject(
            @AuthenticationPrincipal AuthenticatedPrincipal principal,
            @RequestBody ProjectCreateRequest request) {
        ProjectResponse response = projectService.createProject(
                principal.userId(), request.name(), request.description());
        return ResponseEntity.ok(response);
    }
}

record ProjectCreateRequest(String name, String description) {}
