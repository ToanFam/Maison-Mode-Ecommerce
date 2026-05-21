package com.maisonmode.controller;

import com.maisonmode.dto.AddCartItemRequest;
import com.maisonmode.dto.ApiResponse;
import com.maisonmode.dto.CartResponse;
import com.maisonmode.dto.UpdateCartItemRequest;
import com.maisonmode.service.CartService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private static final Logger log = LoggerFactory.getLogger(CartController.class);
    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping
    public ApiResponse<CartResponse> getCart(Authentication authentication) {
        return ApiResponse.success(cartService.getCart(authentication));
    }

    @PostMapping("/items")
    public ApiResponse<CartResponse> addItem(
            @Valid @RequestBody AddCartItemRequest request,
            Authentication authentication
    ) {
        log.info("Adding product {} to cart", request.productId());
        return ApiResponse.success("Cart item added", cartService.addItem(request, authentication));
    }

    @PatchMapping("/items/{itemId}")
    public ApiResponse<CartResponse> updateItem(
            @PathVariable Long itemId,
            @Valid @RequestBody UpdateCartItemRequest request,
            Authentication authentication
    ) {
        return ApiResponse.success("Cart item updated", cartService.updateItem(itemId, request, authentication));
    }

    @DeleteMapping("/items/{itemId}")
    public ApiResponse<CartResponse> removeItem(@PathVariable Long itemId, Authentication authentication) {
        return ApiResponse.success("Cart item removed", cartService.removeItem(itemId, authentication));
    }

    @DeleteMapping
    public ApiResponse<CartResponse> clear(Authentication authentication) {
        return ApiResponse.success("Cart cleared", cartService.clear(authentication));
    }
}
