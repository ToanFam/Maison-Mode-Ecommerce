package com.maisonmode.service;

import com.maisonmode.dto.ProductRequest;
import com.maisonmode.dto.ProductResponse;
import com.maisonmode.entity.Category;
import com.maisonmode.entity.Product;
import com.maisonmode.exception.ConflictException;
import com.maisonmode.exception.ResourceNotFoundException;
import com.maisonmode.repository.CategoryRepository;
import com.maisonmode.repository.ProductRepository;
import com.maisonmode.specification.ProductSpecifications;
import com.maisonmode.util.PaginationUtils;
import com.maisonmode.validator.ProductValidator;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AdminProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final ProductValidator productValidator;

    public AdminProductService(
            ProductRepository productRepository,
            CategoryRepository categoryRepository,
            ProductValidator productValidator
    ) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.productValidator = productValidator;
    }

    @Transactional(readOnly = true)
    public Page<ProductResponse> search(String search, Pageable pageable) {
        Pageable sanitizedPageable = PaginationUtils.sanitize(pageable, Sort.by(Sort.Direction.DESC, "createdAt"));
        return productRepository
                .findAll(ProductSpecifications.search(search), sanitizedPageable)
                .map(ProductResponse::from);
    }

    @Transactional
    public ProductResponse create(ProductRequest request) {
        productValidator.validate(request);
        if (productRepository.findBySlug(request.slug()).isPresent()) {
            throw new ConflictException("Product slug already exists");
        }
        Product product = new Product();
        apply(product, request);
        return ProductResponse.from(productRepository.save(product));
    }

    @Transactional
    public ProductResponse update(Long productId, ProductRequest request) {
        productValidator.validate(request);
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        productRepository.findBySlug(request.slug())
                .filter(existing -> !existing.getId().equals(productId))
                .ifPresent(existing -> {
                    throw new ConflictException("Product slug already exists");
                });
        apply(product, request);
        return ProductResponse.from(product);
    }

    @Transactional
    public void delete(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        product.setActive(false);
    }

    private void apply(Product product, ProductRequest request) {
        Category category = categoryRepository.findBySlug(request.categorySlug())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
        product.setName(request.name());
        product.setSlug(request.slug());
        product.setDescription(request.description());
        product.setPrice(request.price());
        product.setCompareAtPrice(request.compareAtPrice());
        product.setImageUrl(request.imageUrl());
        product.setCategory(category);
        product.setSizes(request.sizes());
        product.setColors(request.colors());
        product.setStockQuantity(request.stockQuantity());
        product.setFeatured(request.featured());
        product.setActive(request.active());
    }
}
