package com.maisonmode.dto;

public record AdminStatsResponse(
        long users,
        long products,
        long orders
) {
}
