package com.maisonmode.dto;

import jakarta.validation.constraints.NotBlank;

public record CheckoutRequest(
        @NotBlank String shippingName,
        @NotBlank String shippingAddress,
        @NotBlank String shippingCity,
        @NotBlank String shippingCountry
) {
}
