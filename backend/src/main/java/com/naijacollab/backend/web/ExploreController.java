package com.naijacollab.backend.web;

import com.naijacollab.backend.dto.explore.MatchResponse;
import com.naijacollab.backend.security.AuthenticatedPrincipal;
import com.naijacollab.backend.service.ExploreService;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/explore")
public class ExploreController {

    private final ExploreService exploreService;

    public ExploreController(ExploreService exploreService) {
        this.exploreService = exploreService;
    }

    /**
     * GET /api/v1/explore/matches
     * Returns the highest-scoring collaborative matches for the current user.
     */
    @GetMapping("/matches")
    public ResponseEntity<List<MatchResponse>> getMatches(
            @AuthenticationPrincipal AuthenticatedPrincipal principal) {
        List<MatchResponse> matches = exploreService.getMatchesForUser(principal.userId());
        return ResponseEntity.ok(matches);
    }

    /**
     * POST /api/v1/explore/recompute
     * Triggers a manual recomputation of matches.
     * (Typically this would be a scheduled batch job, but exposed here for MVP testing).
     */
    @PostMapping("/recompute")
    public ResponseEntity<Void> recomputeMatches(
            @AuthenticationPrincipal AuthenticatedPrincipal principal) {
        exploreService.recomputeMatchesForUser(principal.userId());
        return ResponseEntity.ok().build();
    }
}
