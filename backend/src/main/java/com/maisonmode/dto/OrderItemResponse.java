package com.maisonmode.dto;

import com.maisonmode.entity.OrderItem;
import java.math.BigDecimal;

public record OrderItemResponse(
        Long productId,
        String productName,
        int quantity,
        String size,
        String color,
        BigDecimal unitPrice
) {
    public static OrderItemResponse from(OrderItem item) {
        return new OrderItemResponse(
                item.getProduct().getId(),
                item.getProductName(),
                item.getQuantity(),
                item.getSize(),
                item.getColor(),
                item.getUnitPrice()
        );
    }
}
