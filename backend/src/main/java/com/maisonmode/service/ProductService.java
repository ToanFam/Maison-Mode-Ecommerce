package com.maisonmode.service;

import com.maisonmode.dto.ProductResponse;
import com.maisonmode.entity.Product;
import com.maisonmode.exception.ResourceNotFoundException;
import com.maisonmode.repository.ProductRepository;
import com.maisonmode.specification.ProductSpecifications;
import com.maisonmode.util.PaginationUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Transactional(readOnly = true)
    public Page<ProductResponse> findAll(String search, String category, Boolean featured, Pageable pageable) {
        Pageable sanitizedPageable = PaginationUtils.sanitize(pageable, Sort.by(Sort.Direction.DESC, "createdAt"));
        return productRepository.findAll(
                        ProductSpecifications.active(true)
                                .and(ProductSpecifications.search(search))
                                .and(ProductSpecifications.categorySlug(category))
                                .and(ProductSpecifications.featured(featured)),
                        sanitizedPageable
                )
                .map(ProductResponse::from);
    }

    @Transactional(readOnly = true)
    public ProductResponse findById(Long id) {
        return productRepository.findById(id)
                .filter(Product::isActive)
                .map(ProductResponse::from)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
    }

    @Transactional(readOnly = true)
    public ProductResponse findBySlug(String slug) {
        return productRepository.findBySlug(slug)
                .filter(Product::isActive)
                .map(ProductResponse::from)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
    }
}
