package com.naijacollab.backend.service;

import com.naijacollab.backend.domain.UserEntity;
import com.naijacollab.backend.dto.auth.AuthUserDto;
import com.naijacollab.backend.repository.UserRepository;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
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
}

