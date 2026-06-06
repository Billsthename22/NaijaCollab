package com.naijacollab.backend.web;

import com.naijacollab.backend.dto.portfolio.PortfolioResponse;
import com.naijacollab.backend.security.AuthenticatedPrincipal;
import com.naijacollab.backend.service.PortfolioService;
import java.util.List;
import java.util.UUID;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/v1/portfolio")
public class PortfolioController {

    private final PortfolioService portfolioService;

    public PortfolioController(PortfolioService portfolioService) {
        this.portfolioService = portfolioService;
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<PortfolioResponse>> getPortfolio(@PathVariable UUID userId) {
        return ResponseEntity.ok(portfolioService.getUserPortfolio(userId));
    }

    @PostMapping
    public ResponseEntity<PortfolioResponse> uploadPortfolioItem(
            @AuthenticationPrincipal AuthenticatedPrincipal principal,
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam("file") MultipartFile file) {
        try {
            PortfolioResponse response = portfolioService.addPortfolioItem(
                    principal.userId(), title, description, file.getOriginalFilename(), file.getBytes());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
