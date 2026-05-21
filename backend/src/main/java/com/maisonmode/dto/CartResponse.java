package com.maisonmode.dto;

import com.maisonmode.entity.CartItem;
import java.math.BigDecimal;
import java.util.List;

public record CartResponse(
        List<CartItemResponse> items,
        BigDecimal subtotal,
        int itemCount
) {
    public static CartResponse from(List<CartItem> items) {
        BigDecimal subtotal = items.stream()
                .map(item -> item.getProduct().getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        int itemCount = items.stream().mapToInt(CartItem::getQuantity).sum();

        return new CartResponse(
                items.stream().map(CartItemResponse::from).toList(),
                subtotal,
                itemCount
        );
    }
}
