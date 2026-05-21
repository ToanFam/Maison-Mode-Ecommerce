package com.maisonmode.repository;

import com.maisonmode.entity.Category;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Long> {
    Optional<Category> findBySlug(String slug);

    boolean existsBySlug(String slug);
}
