package com.maisonmode.service;

import com.maisonmode.dto.AddCartItemRequest;
import com.maisonmode.dto.CartResponse;
import com.maisonmode.dto.UpdateCartItemRequest;
import com.maisonmode.entity.CartItem;
import com.maisonmode.entity.Product;
import com.maisonmode.entity.User;
import com.maisonmode.exception.ResourceNotFoundException;
import com.maisonmode.repository.CartItemRepository;
import com.maisonmode.repository.ProductRepository;
import com.maisonmode.validator.CartValidator;
import java.util.List;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CartService {

    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final AuthenticatedUserService authenticatedUserService;
    private final CartValidator cartValidator;

    public CartService(
            CartItemRepository cartItemRepository,
            ProductRepository productRepository,
            AuthenticatedUserService authenticatedUserService,
            CartValidator cartValidator
    ) {
        this.cartItemRepository = cartItemRepository;
        this.productRepository = productRepository;
        this.authenticatedUserService = authenticatedUserService;
        this.cartValidator = cartValidator;
    }

    @Transactional(readOnly = true)
    public CartResponse getCart(Authentication authentication) {
        User user = authenticatedUserService.currentUser(authentication);
        return CartResponse.from(findUserItems(user));
    }

    @Transactional
    public CartResponse addItem(AddCartItemRequest request, Authentication authentication) {
        User user = authenticatedUserService.currentUser(authentication);
        Product product = findPurchasableProduct(request.productId());
        cartValidator.validateVariant(product, request.size(), request.color());

        CartItem item = cartItemRepository
                .findByUserIdAndProductIdAndSizeAndColor(user.getId(), product.getId(), request.size(), request.color())
                .orElseGet(() -> newCartItem(user, product, request.size(), request.color()));
        int nextQuantity = item.getQuantity() == null ? request.quantity() : item.getQuantity() + request.quantity();
        cartValidator.validateStock(product, nextQuantity);
        item.setQuantity(nextQuantity);
        cartItemRepository.save(item);

        return CartResponse.from(findUserItems(user));
    }

    @Transactional
    public CartResponse updateItem(Long itemId, UpdateCartItemRequest request, Authentication authentication) {
        User user = authenticatedUserService.currentUser(authentication);
        CartItem item = findUserCartItem(itemId, user);
        cartValidator.validateStock(item.getProduct(), request.quantity());
        item.setQuantity(request.quantity());
        cartItemRepository.save(item);

        return CartResponse.from(findUserItems(user));
    }

    @Transactional
    public CartResponse removeItem(Long itemId, Authentication authentication) {
        User user = authenticatedUserService.currentUser(authentication);
        CartItem item = findUserCartItem(itemId, user);
        cartItemRepository.delete(item);

        return CartResponse.from(findUserItems(user));
    }

    @Transactional
    public CartResponse clear(Authentication authentication) {
        User user = authenticatedUserService.currentUser(authentication);
        cartItemRepository.deleteByUserId(user.getId());
        return CartResponse.from(List.of());
    }

    private List<CartItem> findUserItems(User user) {
        return cartItemRepository.findByUserIdOrderByUpdatedAtDesc(user.getId());
    }

    private CartItem findUserCartItem(Long itemId, User user) {
        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found"));
        if (!item.getUser().getId().equals(user.getId())) {
            throw new ResourceNotFoundException("Cart item not found");
        }
        return item;
    }

    private Product findPurchasableProduct(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        cartValidator.validatePurchasable(product);
        return product;
    }

    private CartItem newCartItem(User user, Product product, String size, String color) {
        CartItem item = new CartItem();
        item.setUser(user);
        item.setProduct(product);
        item.setSize(size);
        item.setColor(color);
        item.setQuantity(0);
        return item;
    }
}
