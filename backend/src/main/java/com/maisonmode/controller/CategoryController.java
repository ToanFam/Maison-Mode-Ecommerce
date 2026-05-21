package com.maisonmode.controller;

import com.maisonmode.dto.ApiResponse;
import com.maisonmode.dto.CategoryResponse;
import com.maisonmode.repository.CategoryRepository;
import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    private final CategoryRepository categoryRepository;

    public CategoryController(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @GetMapping
    public ApiResponse<List<CategoryResponse>> findAll() {
        return ApiResponse.success(categoryRepository.findAll(Sort.by(Sort.Direction.ASC, "name")).stream()
                .filter(category -> category.isActive())
                .map(CategoryResponse::from)
                .toList());
    }
}
