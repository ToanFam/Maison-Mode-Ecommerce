package com.maisonmode.controller;

import com.maisonmode.dto.ApiResponse;
import com.maisonmode.dto.CheckoutRequest;
import com.maisonmode.dto.CreateOrderRequest;
import com.maisonmode.dto.OrderResponse;
import com.maisonmode.service.OrderService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<OrderResponse> create(@Valid @RequestBody CreateOrderRequest request, Authentication authentication) {
        return ApiResponse.success("Order created", orderService.create(request, authentication));
    }

    @PostMapping("/checkout")
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<OrderResponse> checkout(@Valid @RequestBody CheckoutRequest request, Authentication authentication) {
        return ApiResponse.success("Checkout complete", orderService.checkout(request, authentication));
    }

    @GetMapping("/me")
    public ApiResponse<List<OrderResponse>> findMine(Authentication authentication) {
        return ApiResponse.success(orderService.findMine(authentication));
    }
}
