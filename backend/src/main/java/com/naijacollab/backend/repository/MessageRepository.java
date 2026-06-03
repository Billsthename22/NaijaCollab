package com.naijacollab.backend.repository;

import com.naijacollab.backend.domain.MessageEntity;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MessageRepository extends JpaRepository<MessageEntity, UUID> {
    List<MessageEntity> findByConversation_IdOrderByCreatedAtAsc(UUID conversationId);
    List<MessageEntity> findByConversation_IdAndCreatedAtAfterOrderByCreatedAtAsc(UUID conversationId, Instant since);
}
