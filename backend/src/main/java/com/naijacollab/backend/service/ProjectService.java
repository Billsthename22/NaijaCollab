package com.naijacollab.backend.service;

import com.naijacollab.backend.domain.ProjectEntity;
import com.naijacollab.backend.domain.UserEntity;
import com.naijacollab.backend.dto.messaging.ProjectResponse;
import com.naijacollab.backend.repository.ProjectRepository;
import com.naijacollab.backend.repository.UserRepository;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    public ProjectService(ProjectRepository projectRepository, UserRepository userRepository) {
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<ProjectResponse> getUserProjects(UUID userId) {
        return projectRepository.findByOwner_Id(userId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public ProjectResponse createProject(UUID ownerId, String name, String description) {
        UserEntity owner = userRepository.findById(ownerId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        ProjectEntity project = new ProjectEntity();
        project.setId(UUID.randomUUID());
        project.setOwner(owner);
        project.setName(name);
        project.setDescription(description);
        
        return toResponse(projectRepository.save(project));
    }

    private ProjectResponse toResponse(ProjectEntity entity) {
        return new ProjectResponse(
                entity.getId(),
                entity.getName(),
                entity.getDescription(),
                entity.getStatus(),
                entity.getOwner().getId(),
                entity.getCreatedAt());
    }
}
