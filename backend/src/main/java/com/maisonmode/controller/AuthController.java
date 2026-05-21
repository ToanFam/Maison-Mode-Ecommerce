package com.maisonmode.controller;

import com.maisonmode.dto.ApiResponse;
import com.maisonmode.dto.AuthResponse;
import com.maisonmode.dto.LoginRequest;
import com.maisonmode.dto.RegisterRequest;
import com.maisonmode.dto.UserResponse;
import com.maisonmode.security.UserPrincipal;
import com.maisonmode.service.AuthService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private static final Logger log = LoggerFactory.getLogger(AuthController.class);

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        log.info("POST /api/auth/register email={}", request.email());
        return ApiResponse.success("Registration complete", authService.register(request));
    }

    @PostMapping("/login")
    public ApiResponse<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ApiResponse.success("Login complete", authService.login(request));
    }

    @GetMapping("/me")
    public ApiResponse<UserResponse> me(Authentication authentication) {
        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();
        return ApiResponse.success(UserResponse.from(principal.getUser()));
    }

    @PostMapping("/logout")
    public ApiResponse<Void> logout() {
        // JWT is stateless. Clients complete logout by deleting their stored token.
        return ApiResponse.<Void>success("Logout complete", null);
    }
}
