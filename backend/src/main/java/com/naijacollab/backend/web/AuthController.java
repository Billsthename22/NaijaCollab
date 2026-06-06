package com.naijacollab.backend.web;

import com.naijacollab.backend.config.AppSecurityProperties;
import com.naijacollab.backend.dto.auth.AuthResponse;
import com.naijacollab.backend.dto.auth.LoginRequest;
import com.naijacollab.backend.dto.auth.MeResponse;
import com.naijacollab.backend.dto.auth.RefreshRequest;
import com.naijacollab.backend.dto.auth.RegisterRequest;
import com.naijacollab.backend.dto.auth.ForgotPasswordRequest;
import com.naijacollab.backend.dto.auth.ResetPasswordRequest;
import com.naijacollab.backend.security.SecurityPrincipalAccessor;
import com.naijacollab.backend.service.AuthService;
import com.naijacollab.backend.service.ClientContext;
import com.naijacollab.backend.service.ProfileService;
import com.naijacollab.backend.service.UserService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import static org.springframework.http.HttpStatus.BAD_REQUEST;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AuthService authService;
    private final UserService userService;
    private final ProfileService profileService;
    private final AppSecurityProperties securityProperties;
    private final SecurityPrincipalAccessor principalAccessor;

    public AuthController(
            AuthService authService,
            UserService userService,
            ProfileService profileService,
            AppSecurityProperties securityProperties,
            SecurityPrincipalAccessor principalAccessor) {
        this.authService = authService;
        this.userService = userService;
        this.profileService = profileService;
        this.securityProperties = securityProperties;
        this.principalAccessor = principalAccessor;
    }

    @PostMapping("/register")
    public AuthResponse register(
            @Valid @RequestBody RegisterRequest request,
            HttpServletRequest httpRequest,
            HttpServletResponse httpResponse) {
        ClientContext clientContext = resolveClientContext(httpRequest);
        AuthResponse response = authService.register(request, clientContext);
        writeSessionCookies(httpRequest, httpResponse, response);
        return response;
    }

    @PostMapping("/login")
    public AuthResponse login(
            @Valid @RequestBody LoginRequest request,
            HttpServletRequest httpRequest,
            HttpServletResponse httpResponse) {
        ClientContext clientContext = resolveClientContext(httpRequest);
        AuthResponse response = authService.login(request, clientContext);
        writeSessionCookies(httpRequest, httpResponse, response);
        return response;
    }

    @PostMapping("/forgot-password")
    public void forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        authService.forgotPassword(request);
    }

    @PostMapping("/reset-password")
    public void resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        authService.resetPassword(request);
    }

    @PostMapping("/refresh")
    public AuthResponse refresh(
            @RequestBody(required = false) RefreshRequest request,
            HttpServletRequest httpRequest,
            HttpServletResponse httpResponse) {
        String refreshToken =
                request != null && request.refreshToken() != null && !request.refreshToken().isBlank()
                        ? request.refreshToken()
                        : readCookie(httpRequest, securityProperties.getRefreshCookieName());
        if (refreshToken == null || refreshToken.isBlank()) {
            throw new ResponseStatusException(BAD_REQUEST, "Refresh token is required");
        }

        ClientContext clientContext = resolveClientContext(httpRequest);
        AuthResponse response = authService.refresh(refreshToken, clientContext);
        writeSessionCookies(httpRequest, httpResponse, response);
        return response;
    }

    @PostMapping("/logout")
    public void logout(
            @RequestBody(required = false) RefreshRequest request,
            HttpServletRequest httpRequest,
            HttpServletResponse httpResponse) {
        String refreshToken =
                request != null && request.refreshToken() != null && !request.refreshToken().isBlank()
                        ? request.refreshToken()
                        : readCookie(httpRequest, securityProperties.getRefreshCookieName());
        authService.logout(refreshToken);
        clearCookies(httpRequest, httpResponse);
    }

    @PostMapping("/logout-all")
    public void logoutAll(HttpServletRequest httpRequest, HttpServletResponse httpResponse) {
        authService.logoutAll(principalAccessor.requireUserId());
        clearCookies(httpRequest, httpResponse);
    }

    @GetMapping("/me")
    public MeResponse me() {
        var principal = principalAccessor.requirePrincipal();
        return new MeResponse(
                userService.getUserDto(principal.userId()),
                profileService.getByUserId(principal.userId()));
    }

    private void writeSessionCookies(
            HttpServletRequest request, HttpServletResponse response, AuthResponse session) {
        String sameSite = isLocalRequest(request) ? "Lax" : "None";
        ResponseCookie accessCookie =
                ResponseCookie.from(securityProperties.getAccessCookieName(), session.accessToken())
                        .httpOnly(true)
                        .secure(securityProperties.isSecureCookies() || !isLocalRequest(request))
                        .path("/")
                        .maxAge(securityProperties.getAccessTokenTtl())
                        .sameSite(sameSite)
                        .build();

        ResponseCookie refreshCookie =
                ResponseCookie.from(securityProperties.getRefreshCookieName(), session.refreshToken())
                        .httpOnly(true)
                        .secure(securityProperties.isSecureCookies() || !isLocalRequest(request))
                        .path("/")
                        .maxAge(securityProperties.getRefreshTokenTtl())
                        .sameSite(sameSite)
                        .build();

        response.addHeader(HttpHeaders.SET_COOKIE, accessCookie.toString());
        response.addHeader(HttpHeaders.SET_COOKIE, refreshCookie.toString());
    }

    private void clearCookies(HttpServletRequest request, HttpServletResponse response) {
        String sameSite = isLocalRequest(request) ? "Lax" : "None";
        ResponseCookie accessCookie =
                ResponseCookie.from(securityProperties.getAccessCookieName(), "")
                        .httpOnly(true)
                        .secure(securityProperties.isSecureCookies() || !isLocalRequest(request))
                        .path("/")
                        .maxAge(0)
                        .sameSite(sameSite)
                        .build();
        ResponseCookie refreshCookie =
                ResponseCookie.from(securityProperties.getRefreshCookieName(), "")
                        .httpOnly(true)
                        .secure(securityProperties.isSecureCookies() || !isLocalRequest(request))
                        .path("/")
                        .maxAge(0)
                        .sameSite(sameSite)
                        .build();
        response.addHeader(HttpHeaders.SET_COOKIE, accessCookie.toString());
        response.addHeader(HttpHeaders.SET_COOKIE, refreshCookie.toString());
    }

    private String readCookie(HttpServletRequest request, String name) {
        if (request.getCookies() == null) {
            return null;
        }
        for (Cookie cookie : request.getCookies()) {
            if (name.equals(cookie.getName())) {
                return cookie.getValue();
            }
        }
        return null;
    }

    private ClientContext resolveClientContext(HttpServletRequest request) {
        String forwardedFor = request.getHeader("X-Forwarded-For");
        String ipAddress = request.getRemoteAddr();
        if (forwardedFor != null && !forwardedFor.isBlank()) {
            String first = forwardedFor.split(",")[0];
            if (!first.isBlank()) {
                ipAddress = first.trim();
            }
        }
        return new ClientContext(
                request.getHeader("X-Device-Fingerprint"),
                request.getHeader(HttpHeaders.USER_AGENT),
                ipAddress,
                request.getHeader("X-Country-Code"),
                request.getHeader("X-City"));
    }

    private boolean isLocalRequest(HttpServletRequest request) {
        String host = request.getServerName();
        return "localhost".equalsIgnoreCase(host) || "127.0.0.1".equals(host);
    }
}
