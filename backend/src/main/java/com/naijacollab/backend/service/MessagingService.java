package com.naijacollab.backend.service;

import com.naijacollab.backend.domain.ConversationEntity;
import com.naijacollab.backend.domain.MessageEntity;
import com.naijacollab.backend.domain.UserEntity;
import com.naijacollab.backend.dto.messaging.MessageResponse;
import com.naijacollab.backend.repository.ConversationRepository;
import com.naijacollab.backend.repository.MessageRepository;
import com.naijacollab.backend.repository.UserRepository;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class MessagingService {

    private final MessageRepository messageRepository;
    private final ConversationRepository conversationRepository;
    private final UserRepository userRepository;

    public MessagingService(MessageRepository messageRepository, ConversationRepository conversationRepository, UserRepository userRepository) {
        this.messageRepository = messageRepository;
        this.conversationRepository = conversationRepository;
        this.userRepository = userRepository;
    }

    /**
     * Supports the 5-second polling interval required by MVP.
     * Uses the `since` parameter to only fetch new messages since the last poll.
     */
    @Transactional(readOnly = true)
    public List<MessageResponse> pollMessages(UUID conversationId, Instant since) {
        List<MessageEntity> messages;
        if (since == null) {
            messages = messageRepository.findByConversation_IdOrderByCreatedAtAsc(conversationId);
        } else {
            messages = messageRepository.findByConversation_IdAndCreatedAtAfterOrderByCreatedAtAsc(conversationId, since);
        }
        
        return messages.stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Transactional
    public MessageResponse sendMessage(UUID conversationId, UUID senderId, String content) {
        ConversationEntity conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Conversation not found"));
        UserEntity sender = userRepository.findById(senderId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        MessageEntity message = new MessageEntity();
        message.setId(UUID.randomUUID());
        message.setConversation(conversation);
        message.setSender(sender);
        message.setContent(content);

        return toResponse(messageRepository.save(message));
    }

    private MessageResponse toResponse(MessageEntity entity) {
        return new MessageResponse(
                entity.getId(),
                entity.getConversation().getId(),
                entity.getSender().getId(),
                entity.getContent(),
                entity.getCreatedAt(),
                entity.getReadAt());
    }
}
