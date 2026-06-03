package com.naijacollab.backend.repository;

import com.naijacollab.backend.domain.ConversationEntity;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ConversationRepository extends JpaRepository<ConversationEntity, UUID> {
}
