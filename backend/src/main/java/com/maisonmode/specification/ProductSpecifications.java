package com.maisonmode.specification;

import com.maisonmode.entity.Product;
import com.maisonmode.util.SearchUtils;
import org.springframework.data.jpa.domain.Specification;

public final class ProductSpecifications {

    private ProductSpecifications() {
    }

    public static Specification<Product> search(String search) {
        return (root, query, criteriaBuilder) -> {
            if (!SearchUtils.hasText(search)) {
                return criteriaBuilder.conjunction();
            }
            String pattern = SearchUtils.like(search);
            return criteriaBuilder.or(
                    criteriaBuilder.like(criteriaBuilder.lower(root.get("name")), pattern),
                    criteriaBuilder.like(criteriaBuilder.lower(root.get("description")), pattern),
                    criteriaBuilder.like(criteriaBuilder.lower(root.get("slug")), pattern)
            );
        };
    }

    public static Specification<Product> categorySlug(String categorySlug) {
        return (root, query, criteriaBuilder) -> {
            if (!SearchUtils.hasText(categorySlug)) {
                return criteriaBuilder.conjunction();
            }
            return criteriaBuilder.equal(root.get("category").get("slug"), SearchUtils.normalize(categorySlug));
        };
    }

    public static Specification<Product> featured(Boolean featured) {
        return (root, query, criteriaBuilder) -> featured == null
                ? criteriaBuilder.conjunction()
                : criteriaBuilder.equal(root.get("featured"), featured);
    }

    public static Specification<Product> active(Boolean active) {
        return (root, query, criteriaBuilder) -> active == null
                ? criteriaBuilder.conjunction()
                : criteriaBuilder.equal(root.get("active"), active);
    }
}
