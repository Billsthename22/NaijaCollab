package com.naijacollab.backend.repository;

import com.naijacollab.backend.domain.MatchEntity;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface MatchRepository extends JpaRepository<MatchEntity, UUID> {
    
    @Query("SELECT m FROM MatchEntity m WHERE m.userA.id = :userId OR m.userB.id = :userId ORDER BY m.score DESC")
    List<MatchEntity> findTopMatchesForUser(@Param("userId") UUID userId);

    @Query("SELECT m FROM MatchEntity m WHERE (m.userA.id = :userA AND m.userB.id = :userB) OR (m.userA.id = :userB AND m.userB.id = :userA)")
    Optional<MatchEntity> findByUsers(@Param("userA") UUID userA, @Param("userB") UUID userB);
}
