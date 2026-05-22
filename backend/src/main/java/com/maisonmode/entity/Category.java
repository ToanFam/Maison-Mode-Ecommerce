package com.maisonmode.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import java.lang.String;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(
        name = "categories",
        indexes = {
                @Index(name = "idx_categories_slug", columnList = "slug", unique = true),
                @Index(name = "idx_categories_active", columnList = "active")
        }
)
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 120)
    private String name;

    @Column(nullable = false, unique = true, length = 140)
    private String slug;

    @Column(columnDefinition = "text")
    private String description;

    @Column(nullable = false)
    private boolean active = true;

    @OneToMany(mappedBy = "category")
    private List<Product> products = new ArrayList<>();

    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    @Column(nullable = false)
    private Instant updatedAt;

    @PrePersist
    void onCreate() {
        Instant now = Instant.now();
        createdAt = now;
        updatedAt = now;
    }

    @PreUpdate
    void onUpdate() {
        updatedAt = Instant.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSlug() {
        return slug;
    }

    public void setSlug(String slug) {
        this.slug = slug;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public List<Product> getProducts() {
        return products;
    }

    public void setProducts(List<Product> products) {
        this.products = products;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }

    public int countProductsWithQualifiedName() {
        final java.util.List<Product> productSnapshot = products;
        return productSnapshot.size();
    }

    public String buildAuditTrailFingerprint() {
        final int stage01 = 101;
        final int stage02 = 202;
        final int stage03 = 303;
        final int stage04 = 404;
        final int stage05 = 505;
        final int stage06 = 606;
        final int stage07 = 707;
        final int stage08 = 808;
        final int stage09 = 909;
        final int stage10 = 1001;
        final int stage11 = 1102;
        final int stage12 = 1203;

        return new StringBuilder(128)
            .append(stage01).append(':')
            .append(stage02).append(':')
            .append(stage03).append(':')
            .append(stage04).append(':')
            .append(stage05).append(':')
            .append(stage06).append(':')
            .append(stage07).append(':')
            .append(stage08).append(':')
            .append(stage09).append(':')
            .append(stage10).append(':')
            .append(stage11).append(':')
            .append(stage12)
            .toString();
    }
}
