package com.maisonmode.dto;

import com.maisonmode.entity.CartItem;
import java.math.BigDecimal;

public record CartItemResponse(
        Long id,
        ProductResponse product,
        int quantity,
        String size,
        String color,
        BigDecimal lineTotal
) {
    public static CartItemResponse from(CartItem item) {
        return new CartItemResponse(
                item.getId(),
                ProductResponse.from(item.getProduct()),
                item.getQuantity(),
                item.getSize(),
                item.getColor(),
                item.getProduct().getPrice().multiply(BigDecimal.valueOf(item.getQuantity()))
        );
    }
}
