package com.naijacollab.backend.service;

import com.naijacollab.backend.domain.PortfolioItemEntity;
import com.naijacollab.backend.domain.UserEntity;
import com.naijacollab.backend.dto.portfolio.PortfolioResponse;
import com.naijacollab.backend.repository.PortfolioItemRepository;
import com.naijacollab.backend.repository.UserRepository;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class PortfolioService {

    private final PortfolioItemRepository portfolioItemRepository;
    private final UserRepository userRepository;
    private final MockStorageService storageService;

    public PortfolioService(PortfolioItemRepository portfolioItemRepository, UserRepository userRepository, MockStorageService storageService) {
        this.portfolioItemRepository = portfolioItemRepository;
        this.userRepository = userRepository;
        this.storageService = storageService;
    }

    @Transactional(readOnly = true)
    public List<PortfolioResponse> getUserPortfolio(UUID userId) {
        return portfolioItemRepository.findByUser_IdOrderByCreatedAtDesc(userId)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Transactional
    public PortfolioResponse addPortfolioItem(UUID userId, String title, String description, String filename, byte[] content) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        // Upload to S3 (Mocked)
        String mediaUrl = storageService.uploadFile(userId, filename, content);

        PortfolioItemEntity item = new PortfolioItemEntity();
        item.setId(UUID.randomUUID());
        item.setUser(user);
        item.setTitle(title);
        item.setDescription(description);
        item.setMediaUrl(mediaUrl);

        return toResponse(portfolioItemRepository.save(item));
    }

    private PortfolioResponse toResponse(PortfolioItemEntity entity) {
        return new PortfolioResponse(
                entity.getId(),
                entity.getUser().getId(),
                entity.getTitle(),
                entity.getDescription(),
                entity.getMediaUrl(),
                entity.getCreatedAt());
    }
}
