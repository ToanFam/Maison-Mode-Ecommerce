package com.maisonmode.repository;

import com.maisonmode.entity.CartItem;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    List<CartItem> findByUserIdOrderByUpdatedAtDesc(Long userId);

    Optional<CartItem> findByUserIdAndProductIdAndSizeAndColor(Long userId, Long productId, String size, String color);

    void deleteByUserId(Long userId);
}
