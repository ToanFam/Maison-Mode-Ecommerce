package com.maisonmode.config;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import java.util.List;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

@Validated
@ConfigurationProperties(prefix = "app")
public record AppProperties(
        @Valid Jwt jwt,
        @Valid Cors cors,
        @Valid RateLimit rateLimit
) {
    public record Jwt(
            @NotBlank @Size(min = 32) String secret,
            @Min(60000) long expirationMs
    ) {
    }

    public record Cors(
            @NotEmpty List<@NotBlank String> allowedOrigins
    ) {
    }

    public record RateLimit(
            boolean enabled,
            @Min(1) int capacity,
            @Min(1) int windowSeconds
    ) {
    }
}
