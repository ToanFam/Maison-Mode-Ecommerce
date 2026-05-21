package com.maisonmode.controller;

import com.maisonmode.dto.AdminStatsResponse;
import com.maisonmode.dto.ApiResponse;
import com.maisonmode.dto.CategoryResponse;
import com.maisonmode.dto.ImageUploadResponse;
import com.maisonmode.dto.OrderResponse;
import com.maisonmode.dto.OrderStatusUpdateRequest;
import com.maisonmode.dto.PageResponse;
import com.maisonmode.dto.ProductRequest;
import com.maisonmode.dto.ProductResponse;
import com.maisonmode.repository.CategoryRepository;
import com.maisonmode.repository.ProductRepository;
import com.maisonmode.repository.UserRepository;
import com.maisonmode.entity.OrderStatus;
import com.maisonmode.service.AdminOrderService;
import com.maisonmode.service.AdminProductService;
import com.maisonmode.service.FileStorageService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private static final Logger log = LoggerFactory.getLogger(AdminController.class);
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final AdminProductService adminProductService;
    private final AdminOrderService adminOrderService;
    private final FileStorageService fileStorageService;

    public AdminController(
            UserRepository userRepository,
            ProductRepository productRepository,
            CategoryRepository categoryRepository,
            AdminProductService adminProductService,
            AdminOrderService adminOrderService,
            FileStorageService fileStorageService
    ) {
        this.userRepository = userRepository;
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.adminProductService = adminProductService;
        this.adminOrderService = adminOrderService;
        this.fileStorageService = fileStorageService;
    }

    @GetMapping("/stats")
    public ApiResponse<AdminStatsResponse> stats() {
        return ApiResponse.success(new AdminStatsResponse(
                userRepository.count(),
                productRepository.count(),
                adminOrderService.count()
        ));
    }

    @GetMapping("/categories")
    public ApiResponse<List<CategoryResponse>> categories() {
        return ApiResponse.success(categoryRepository.findAll().stream()
                .filter(category -> category.isActive())
                .map(CategoryResponse::from)
                .toList());
    }

    @GetMapping("/products")
    public ApiResponse<PageResponse<ProductResponse>> products(
            @RequestParam(defaultValue = "") String search,
            Pageable pageable
    ) {
        log.debug("Admin product search search={} page={}", search, pageable);
        return ApiResponse.success(PageResponse.from(adminProductService.search(search, pageable)));
    }

    @PostMapping("/products")
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<ProductResponse> createProduct(@Valid @RequestBody ProductRequest request) {
        return ApiResponse.success("Product created", adminProductService.create(request));
    }

    @PutMapping("/products/{productId}")
    public ApiResponse<ProductResponse> updateProduct(
            @PathVariable Long productId,
            @Valid @RequestBody ProductRequest request
    ) {
        return ApiResponse.success("Product updated", adminProductService.update(productId, request));
    }

    @DeleteMapping("/products/{productId}")
    public ApiResponse<Void> deleteProduct(@PathVariable Long productId) {
        adminProductService.delete(productId);
        return ApiResponse.<Void>success("Product archived", null);
    }

    @PostMapping("/uploads/product-image")
    public ApiResponse<ImageUploadResponse> uploadProductImage(@RequestParam("file") MultipartFile file) {
        return ApiResponse.success("Image uploaded", new ImageUploadResponse(fileStorageService.storeProductImage(file)));
    }

    @GetMapping("/orders")
    public ApiResponse<PageResponse<OrderResponse>> orders(
            @RequestParam(required = false) OrderStatus status,
            Pageable pageable
    ) {
        return ApiResponse.success(PageResponse.from(adminOrderService.search(status, pageable)));
    }

    @PatchMapping("/orders/{orderId}/status")
    public ApiResponse<OrderResponse> updateOrderStatus(
            @PathVariable Long orderId,
            @Valid @RequestBody OrderStatusUpdateRequest request
    ) {
        return ApiResponse.success("Order status updated", adminOrderService.updateStatus(orderId, request));
    }
}
