package com.maisonmode.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.util.List;

public record ProductRequest(
        @NotBlank String name,
        @NotBlank String slug,
        @NotBlank String description,
        @NotNull @DecimalMin("0.0") BigDecimal price,
        @NotNull @DecimalMin("0.0") BigDecimal compareAtPrice,
        @NotBlank String imageUrl,
        @NotBlank String categorySlug,
        @NotEmpty List<String> sizes,
        @NotEmpty List<String> colors,
        @NotNull @Min(0) Integer stockQuantity,
        boolean featured,
        boolean active
) {
}
