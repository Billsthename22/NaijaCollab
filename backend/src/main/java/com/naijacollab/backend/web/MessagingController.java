package com.naijacollab.backend.web;

import com.naijacollab.backend.dto.messaging.MessageResponse;
import com.naijacollab.backend.security.AuthenticatedPrincipal;
import com.naijacollab.backend.service.MessagingService;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/messages")
public class MessagingController {

    private final MessagingService messagingService;

    public MessagingController(MessagingService messagingService) {
        this.messagingService = messagingService;
    }

    /**
     * Polling endpoint. Clients should call this every 5 seconds.
     * Use the `since` param to fetch only new messages.
     */
    @GetMapping("/{conversationId}")
    public ResponseEntity<List<MessageResponse>> pollMessages(
            @AuthenticationPrincipal AuthenticatedPrincipal principal,
            @PathVariable UUID conversationId,
            @RequestParam(required = false) Instant since) {
        
        // MVP logic: Assume user has access to conversation if they know the ID.
        // Production: Validate that `principal.userId()` is a member of the conversation.
        List<MessageResponse> messages = messagingService.pollMessages(conversationId, since);
        return ResponseEntity.ok(messages);
    }

    @PostMapping("/{conversationId}")
    public ResponseEntity<MessageResponse> sendMessage(
            @AuthenticationPrincipal AuthenticatedPrincipal principal,
            @PathVariable UUID conversationId,
            @RequestBody MessageSendRequest request) {
        
        MessageResponse response = messagingService.sendMessage(
                conversationId, principal.userId(), request.content());
        return ResponseEntity.ok(response);
    }
}

record MessageSendRequest(String content) {}
