package com.maisonmode.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record AddCartItemRequest(
        @NotNull Long productId,
        @Min(1) int quantity,
        @NotBlank String size,
        @NotBlank String color
) {
}
