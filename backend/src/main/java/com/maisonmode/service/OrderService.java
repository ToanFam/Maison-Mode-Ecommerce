package com.maisonmode.service;

import com.maisonmode.dto.CheckoutRequest;
import com.maisonmode.dto.CreateOrderItemRequest;
import com.maisonmode.dto.CreateOrderRequest;
import com.maisonmode.dto.OrderResponse;
import com.maisonmode.entity.CartItem;
import com.maisonmode.entity.Order;
import com.maisonmode.entity.OrderItem;
import com.maisonmode.entity.Product;
import com.maisonmode.entity.User;
import com.maisonmode.exception.BusinessRuleException;
import com.maisonmode.exception.ConflictException;
import com.maisonmode.exception.ResourceNotFoundException;
import com.maisonmode.repository.CartItemRepository;
import com.maisonmode.repository.OrderRepository;
import com.maisonmode.repository.ProductRepository;
import com.maisonmode.validator.CartValidator;
import java.math.BigDecimal;
import java.util.List;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final CartItemRepository cartItemRepository;
    private final AuthenticatedUserService authenticatedUserService;
    private final CartValidator cartValidator;

    public OrderService(
            OrderRepository orderRepository,
            ProductRepository productRepository,
            CartItemRepository cartItemRepository,
            AuthenticatedUserService authenticatedUserService,
            CartValidator cartValidator
    ) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
        this.cartItemRepository = cartItemRepository;
        this.authenticatedUserService = authenticatedUserService;
        this.cartValidator = cartValidator;
    }

    @Transactional
    public OrderResponse create(CreateOrderRequest request, Authentication authentication) {
        User user = authenticatedUserService.currentUser(authentication);
        Order order = new Order();
        order.setUser(user);
        order.setShippingName(user.getName());
        order.setShippingAddress("123 Maison Mode Avenue");
        order.setShippingCity("Ho Chi Minh City");
        order.setShippingCountry("Vietnam");

        BigDecimal total = BigDecimal.ZERO;

        for (CreateOrderItemRequest itemRequest : request.items()) {
            Product product = productRepository.findById(itemRequest.productId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

            cartValidator.validateStock(product, itemRequest.quantity());

            OrderItem item = new OrderItem();
            item.setOrder(order);
            item.setProduct(product);
            item.setQuantity(itemRequest.quantity());
            item.setSize(itemRequest.size());
            item.setColor(itemRequest.color());
            item.setProductName(product.getName());
            item.setUnitPrice(product.getPrice());

            order.getItems().add(item);
            total = total.add(product.getPrice().multiply(BigDecimal.valueOf(itemRequest.quantity())));
            product.setStockQuantity(product.getStockQuantity() - itemRequest.quantity());
        }

        order.setSubtotal(total);
        order.setTotal(total);
        return OrderResponse.from(orderRepository.save(order));
    }

    @Transactional
    public OrderResponse checkout(CheckoutRequest request, Authentication authentication) {
        User user = authenticatedUserService.currentUser(authentication);
        List<CartItem> cartItems = cartItemRepository.findByUserIdOrderByUpdatedAtDesc(user.getId());

        if (cartItems.isEmpty()) {
            throw new BusinessRuleException("Cart is empty");
        }

        Order order = new Order();
        order.setUser(user);
        order.setShippingName(request.shippingName());
        order.setShippingAddress(request.shippingAddress());
        order.setShippingCity(request.shippingCity());
        order.setShippingCountry(request.shippingCountry());

        BigDecimal subtotal = BigDecimal.ZERO;

        for (CartItem cartItem : cartItems) {
            Product product = cartItem.getProduct();
            if (!product.isActive()) {
                throw new BusinessRuleException(product.getName() + " is no longer available");
            }
            if (product.getStockQuantity() < cartItem.getQuantity()) {
                throw new ConflictException(product.getName() + " is out of stock");
            }

            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProduct(product);
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setSize(cartItem.getSize());
            orderItem.setColor(cartItem.getColor());
            orderItem.setProductName(product.getName());
            orderItem.setUnitPrice(product.getPrice());

            order.getItems().add(orderItem);
            subtotal = subtotal.add(product.getPrice().multiply(BigDecimal.valueOf(cartItem.getQuantity())));
            product.setStockQuantity(product.getStockQuantity() - cartItem.getQuantity());
        }

        BigDecimal shippingFee = subtotal.compareTo(BigDecimal.valueOf(250)) >= 0 ? BigDecimal.ZERO : BigDecimal.valueOf(12);
        order.setSubtotal(subtotal);
        order.setShippingFee(shippingFee);
        order.setTotal(subtotal.add(shippingFee));

        Order savedOrder = orderRepository.save(order);
        cartItemRepository.deleteByUserId(user.getId());
        return OrderResponse.from(savedOrder);
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> findMine(Authentication authentication) {
        User user = authenticatedUserService.currentUser(authentication);
        return orderRepository.findByUserIdOrderByCreatedAtDesc(user.getId()).stream()
                .map(OrderResponse::from)
                .toList();
    }
}
