package com.naijacollab.backend.service;

public record ClientContext(
        String deviceFingerprint,
        String userAgent,
        String ipAddress,
        String countryCode,
        String city) {}
