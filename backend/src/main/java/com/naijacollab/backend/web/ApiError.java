package com.naijacollab.backend.web;

import java.time.Instant;
import java.util.List;

public record ApiError(String message, String code, Instant timestamp, List<String> details) {}

