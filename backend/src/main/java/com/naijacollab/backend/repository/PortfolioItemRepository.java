package com.naijacollab.backend.repository;

import com.naijacollab.backend.domain.PortfolioItemEntity;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PortfolioItemRepository extends JpaRepository<PortfolioItemEntity, UUID> {
    List<PortfolioItemEntity> findByUser_IdOrderByCreatedAtDesc(UUID userId);
}
