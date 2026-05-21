package com.maisonmode.dto;

public record AuthResponse(
        String token,
        UserResponse user
) {
}
