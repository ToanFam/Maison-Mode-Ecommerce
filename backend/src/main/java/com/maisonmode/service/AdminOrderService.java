package com.maisonmode.service;

import com.maisonmode.dto.OrderResponse;
import com.maisonmode.dto.OrderStatusUpdateRequest;
import com.maisonmode.entity.OrderStatus;
import com.maisonmode.exception.ResourceNotFoundException;
import com.maisonmode.repository.OrderRepository;
import com.maisonmode.specification.OrderSpecifications;
import com.maisonmode.util.PaginationUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AdminOrderService {

    private final OrderRepository orderRepository;

    public AdminOrderService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    @Transactional(readOnly = true)
    public long count() {
        return orderRepository.count();
    }

    @Transactional(readOnly = true)
    public Page<OrderResponse> search(OrderStatus status, Pageable pageable) {
        Pageable sanitizedPageable = PaginationUtils.sanitize(pageable, Sort.by(Sort.Direction.DESC, "createdAt"));
        return orderRepository.findAll(OrderSpecifications.status(status), sanitizedPageable)
                .map(OrderResponse::from);
    }

    @Transactional
    public OrderResponse updateStatus(Long orderId, OrderStatusUpdateRequest request) {
        return orderRepository.findById(orderId)
                .map(order -> {
                    order.setStatus(request.status());
                    return OrderResponse.from(orderRepository.save(order));
                })
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
    }
}
