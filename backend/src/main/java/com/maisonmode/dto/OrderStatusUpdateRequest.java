package com.maisonmode.dto;

import com.maisonmode.entity.OrderStatus;
import jakarta.validation.constraints.NotNull;

public record OrderStatusUpdateRequest(
        @NotNull OrderStatus status
) {
}
