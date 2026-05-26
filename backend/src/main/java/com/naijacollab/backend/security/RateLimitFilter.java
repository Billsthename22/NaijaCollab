package com.naijacollab.backend.security;

import com.naijacollab.backend.service.RateLimitService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Optional;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
public class RateLimitFilter extends OncePerRequestFilter {

    private final RateLimitService rateLimitService;
    private final SecurityPrincipalAccessor principalAccessor;

    public RateLimitFilter(
            RateLimitService rateLimitService, SecurityPrincipalAccessor principalAccessor) {
        this.rateLimitService = rateLimitService;
        this.principalAccessor = principalAccessor;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        Map<String, String> checks = resolveChecks(request);
        for (Map.Entry<String, String> entry : checks.entrySet()) {
            RateLimitService.Decision decision =
                    rateLimitService.checkAndIncrement(entry.getKey(), entry.getValue());
            if (!decision.allowed()) {
                response.setStatus(429);
                response.setHeader("Retry-After", String.valueOf(decision.retryAfterSeconds()));
                response.setContentType(MediaType.APPLICATION_JSON_VALUE);
                response.getWriter()
                        .write(
                                "{\"message\":\"Too many requests\",\"code\":\"RATE_LIMITED\",\"details\":[]}");
                return;
            }
        }
        filterChain.doFilter(request, response);
    }

    private Map<String, String> resolveChecks(HttpServletRequest request) {
        String path = request.getRequestURI();
        String method = request.getMethod();
        String ipKey = "ip:" + resolveIp(request);
        Optional<String> userId = resolveUserId();

        Map<String, String> checks = new LinkedHashMap<>();
        if ("POST".equals(method) && "/api/v1/auth/login".equals(path)) {
            checks.put("auth_login_ip", ipKey);
            userId.ifPresent(id -> checks.put("auth_login_user", "user:" + id));
        } else if ("POST".equals(method) && "/api/v1/auth/register".equals(path)) {
            checks.put("auth_register_ip", ipKey);
        } else if ("POST".equals(method) && "/api/v1/moderation/reports".equals(path)) {
            checks.put("moderation_report_ip", ipKey);
            userId.ifPresent(id -> checks.put("moderation_report_user", "user:" + id));
        }
        return checks;
    }

    private Optional<String> resolveUserId() {
        try {
            return Optional.of(principalAccessor.requireUserId().toString());
        } catch (Exception ignored) {
            return Optional.empty();
        }
    }

    private String resolveIp(HttpServletRequest request) {
        String forwardedFor = request.getHeader("X-Forwarded-For");
        if (forwardedFor != null && !forwardedFor.isBlank()) {
            String first = forwardedFor.split(",")[0];
            if (!first.isBlank()) {
                return first.trim();
            }
        }
        return request.getRemoteAddr();
    }
}
