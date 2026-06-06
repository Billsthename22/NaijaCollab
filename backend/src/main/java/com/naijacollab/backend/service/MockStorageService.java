package com.naijacollab.backend.service;

import java.util.UUID;
import org.springframework.stereotype.Service;

/**
 * Mock implementation of S3 storage for MVP development.
 * In Phase 2, this will be replaced with actual AWS SDK calls.
 */
@Service
public class MockStorageService {

    public String uploadFile(UUID userId, String filename, byte[] content) {
        // Mocking an S3 URL return
        String objectKey = userId.toString() + "/" + UUID.randomUUID() + "-" + filename;
        return "https://mock-s3-bucket.naijacollab.com/" + objectKey;
    }
}
