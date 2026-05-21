package com.maisonmode.dto;

import com.maisonmode.entity.Product;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public record ProductResponse(
        Long id,
        String name,
        String slug,
        String description,
        BigDecimal price,
        BigDecimal compareAtPrice,
        String imageUrl,
        Long categoryId,
        String category,
        String categoryName,
        String categorySlug,
        List<String> sizes,
        List<String> colors,
        Integer stock,
        Integer stockQuantity,
        boolean featured,
        boolean active,
        Instant createdAt,
        Instant updatedAt
) {
    public static ProductResponse from(Product product) {
        return new ProductResponse(
                product.getId(),
                product.getName(),
                product.getSlug(),
                product.getDescription(),
                product.getPrice(),
                product.getCompareAtPrice(),
                product.getImageUrl(),
                product.getCategory().getId(),
                product.getCategory().getSlug().toUpperCase(),
                product.getCategory().getName(),
                product.getCategory().getSlug(),
                List.copyOf(product.getSizes()),
                List.copyOf(product.getColors()),
                product.getStockQuantity(),
                product.getStockQuantity(),
                product.isFeatured(),
                product.isActive(),
                product.getCreatedAt(),
                product.getUpdatedAt()
        );
    }
}
