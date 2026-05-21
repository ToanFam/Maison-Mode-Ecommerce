package com.maisonmode.controller;

import com.maisonmode.dto.ApiResponse;
import com.maisonmode.dto.PageResponse;
import com.maisonmode.dto.ProductResponse;
import com.maisonmode.service.ProductService;
import org.springframework.data.domain.Pageable;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private static final Logger log = LoggerFactory.getLogger(ProductController.class);
    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public ApiResponse<PageResponse<ProductResponse>> findAll(
            @RequestParam(defaultValue = "") String search,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) Boolean featured,
            Pageable pageable
    ) {
        log.debug("Fetching products search={} category={} featured={} page={}", search, category, featured, pageable);
        return ApiResponse.success(PageResponse.from(productService.findAll(search, category, featured, pageable)));
    }

    @GetMapping("/{id:\\d+}")
    public ApiResponse<ProductResponse> findById(@PathVariable Long id) {
        log.debug("Fetching product id={}", id);
        return ApiResponse.success(productService.findById(id));
    }

    @GetMapping("/slug/{slug}")
    public ApiResponse<ProductResponse> findBySlug(@PathVariable String slug) {
        log.debug("Fetching product slug={}", slug);
        return ApiResponse.success(productService.findBySlug(slug));
    }
}
