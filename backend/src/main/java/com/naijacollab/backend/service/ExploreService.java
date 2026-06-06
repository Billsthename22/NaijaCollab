package com.naijacollab.backend.service;

import com.naijacollab.backend.domain.MatchEntity;
import com.naijacollab.backend.domain.UserEntity;
import com.naijacollab.backend.dto.explore.MatchResponse;
import com.naijacollab.backend.repository.MatchRepository;
import com.naijacollab.backend.repository.UserRepository;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service handling user discovery and the core matching heuristic algorithm.
 * 
 * According to SYSTEM_ANALYSIS_MVP_BACKEND.md:
 * Score formula (0-100):
 * - Skill overlap: 35%
 * - Role compatibility: 20%
 * - Location preference: 15%
 * - Activity freshness: 10%
 * - Portfolio proxy: 10%
 * - Responsiveness: 10%
 */
@Service
public class ExploreService {

    private final MatchRepository matchRepository;
    private final UserRepository userRepository;

    public ExploreService(MatchRepository matchRepository, UserRepository userRepository) {
        this.matchRepository = matchRepository;
        this.userRepository = userRepository;
    }

    /**
     * Retrieves the top matches for a given user.
     * In a production scenario, this would likely query a pre-computed table
     * or use a specialized matching engine (like Elasticsearch or Redis).
     * For MVP, we fetch from the matches table which can be populated via a cron job.
     * 
     * @param userId The requesting user's ID
     * @return List of highest-scoring matches
     */
    @Transactional(readOnly = true)
    public List<MatchResponse> getMatchesForUser(UUID userId) {
        List<MatchEntity> rawMatches = matchRepository.findTopMatchesForUser(userId);
        
        return rawMatches.stream().map(match -> {
            // Determine which side of the match is the OTHER user
            UserEntity otherUser = match.getUserA().getId().equals(userId) ? match.getUserB() : match.getUserA();
            
            return new MatchResponse(
                    match.getId(),
                    otherUser.getId(),
                    otherUser.getUsername(),
                    otherUser.getDisplayName(),
                    match.getScore(),
                    match.getReasonsJsonb(),
                    match.getCreatedAt()
            );
        }).collect(Collectors.toList());
    }

    /**
     * Recomputes matches for a specific user.
     * This is a stub for the MVP matching logic.
     * 
     * @param userId The user to recompute matches for
     */
    @Transactional
    public void recomputeMatchesForUser(UUID userId) {
        // TODO: Implement the full 0-100 heuristic scoring loop here.
        // 1. Fetch active users excluding blocked/suspended.
        // 2. Fetch ProfileSkillEntity for userId and candidates.
        // 3. Compute skill overlap (35%), role compatibility (20%), etc.
        // 4. Upsert MatchEntity records.
    }
}
