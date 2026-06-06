package com.naijacollab.backend.service;

import com.naijacollab.backend.domain.UserEntity;
import com.naijacollab.backend.dto.auth.AuthUserDto;
import com.naijacollab.backend.repository.UserRepository;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.naijacollab.backend.dto.user.UserUpdateRequest;
import com.naijacollab.backend.dto.user.ChangePasswordRequest;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuditLogService auditLogService;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, AuditLogService auditLogService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.auditLogService = auditLogService;
    }

    @Transactional(readOnly = true)
    public AuthUserDto getUserDto(UUID userId) {
        UserEntity user =
                userRepository
                        .findById(userId)
                        .orElseThrow(
                                () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        return new AuthUserDto(user.getId(), user.getEmail(), user.getUsername(), user.getDisplayName());
    }

    @Transactional(isolation = Isolation.REPEATABLE_READ)
    public AuthUserDto updateUser(UUID userId, UserUpdateRequest request) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        if (request.username() != null && !request.username().trim().isEmpty() 
                && !request.username().equalsIgnoreCase(user.getUsername())) {
            if (userRepository.existsByUsernameIgnoreCase(request.username().trim())) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "Username already exists");
            }
            user.setUsername(request.username().trim());
        }

        if (request.displayName() != null && !request.displayName().trim().isEmpty()) {
            user.setDisplayName(request.displayName().trim());
        }

        userRepository.save(user);
        auditLogService.logEvent(userId, "USER_UPDATED", "USER", userId.toString());

        return new AuthUserDto(user.getId(), user.getEmail(), user.getUsername(), user.getDisplayName());
    }

    @Transactional
    public void changePassword(UUID userId, ChangePasswordRequest request) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        if (!passwordEncoder.matches(request.oldPassword(), user.getPasswordHash())) {
            auditLogService.logEvent(userId, "PASSWORD_CHANGE_FAILED", "USER", userId.toString());
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid old password");
        }

        user.setPasswordHash(passwordEncoder.encode(request.newPassword()));
        userRepository.save(user);
        auditLogService.logEvent(userId, "PASSWORD_CHANGED", "USER", userId.toString());
    }
}

