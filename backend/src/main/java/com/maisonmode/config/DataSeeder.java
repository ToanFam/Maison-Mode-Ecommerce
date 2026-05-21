package com.maisonmode.config;

import com.maisonmode.entity.Category;
import com.maisonmode.entity.Product;
import com.maisonmode.entity.Role;
import com.maisonmode.entity.User;
import com.maisonmode.repository.CategoryRepository;
import com.maisonmode.repository.ProductRepository;
import com.maisonmode.repository.UserRepository;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner seedDatabase(
            CategoryRepository categoryRepository,
            ProductRepository productRepository,
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JdbcTemplate jdbcTemplate
    ) {
        return args -> {
            ensureUserRoleConstraint(jdbcTemplate);
            seedUsers(userRepository, passwordEncoder);
            seedCategories(categoryRepository);
            seedProducts(productRepository, categoryRepository);
        };
    }

    private void ensureUserRoleConstraint(JdbcTemplate jdbcTemplate) {
        jdbcTemplate.execute("ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check");
        jdbcTemplate.execute("""
                ALTER TABLE users
                ADD CONSTRAINT users_role_check
                CHECK (role IN ('USER', 'CUSTOMER', 'ADMIN'))
                """);
        jdbcTemplate.update("UPDATE users SET role = 'USER' WHERE role = 'CUSTOMER'");
    }

    private void seedUsers(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        createUser(userRepository, passwordEncoder, "Admin Manager", "admin@maison.test", Role.ADMIN);
        createUser(userRepository, passwordEncoder, "Lina Nguyen", "lina.nguyen@maison.test", Role.USER);
        createUser(userRepository, passwordEncoder, "Ava Tran", "ava.tran@maison.test", Role.USER);
    }

    private void createUser(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            String name,
            String email,
            Role role
    ) {
        if (userRepository.existsByEmail(email)) {
            return;
        }

        User user = new User();
        user.setName(name);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode("password123"));
        user.setRole(role);
        userRepository.save(user);
    }

    private void seedCategories(CategoryRepository categoryRepository) {
        ensureCategory(categoryRepository, "Men", "men", "Modern menswear essentials, refined layers, and everyday staples.");
        ensureCategory(categoryRepository, "Women", "women", "Polished womenswear staples with easy silhouettes and premium finishes.");
        ensureCategory(categoryRepository, "Shoes", "shoes", "Versatile footwear for commuting, weekends, and smart casual styling.");
        ensureCategory(categoryRepository, "Accessories", "accessories", "Bags, belts, eyewear, and finishing pieces for daily wear.");
    }

    private void ensureCategory(CategoryRepository categoryRepository, String name, String slug, String description) {
        Category category = categoryRepository.findBySlug(slug).orElseGet(Category::new);
        category.setName(name);
        category.setSlug(slug);
        category.setDescription(description);
        category.setActive(true);
        categoryRepository.save(category);
    }

    private void seedProducts(ProductRepository productRepository, CategoryRepository categoryRepository) {
        Map<String, Category> categories = categoryRepository.findAll().stream()
                .collect(Collectors.toMap(Category::getSlug, Function.identity()));

        List<ProductSeed> products = List.of(
                new ProductSeed("Men AIRSense Jacket", "men-airsense-jacket",
                        "Lightweight stretch blazer with a clean drape, breathable lining, and wrinkle-resistant finish.",
                        "129.90", "159.90", "men_airsense_jacket_001.jpg", "men",
                        List.of("S", "M", "L", "XL"), List.of("Navy", "Black"), 34, true),
                new ProductSeed("Men Short Blouson Zip-Up Jacket", "men-short-blouson-zip-up-jacket",
                        "Cropped zip jacket in a smooth technical weave with ribbed cuffs and a structured collar.",
                        "99.90", "129.90", "men_short_blouson_zip-up_jacket_001.jpg", "men",
                        List.of("S", "M", "L", "XL"), List.of("Olive", "Black"), 26, true),
                new ProductSeed("Men Baggy Jeans", "men-baggy-jeans",
                        "Relaxed five-pocket denim with a modern wide leg, soft hand feel, and washed blue finish.",
                        "69.90", "89.90", "men_baggy_jeans_001.jpg", "men",
                        List.of("29", "30", "31", "32", "34", "36"), List.of("Blue"), 48, false),
                new ProductSeed("Men Slim Fit Chino Pants", "men-slim-fit-chino-pants",
                        "Tapered cotton chinos with comfortable stretch and a crisp finish for office-to-weekend wear.",
                        "59.90", "79.90", "men_slim_fit_chino_pants_001.jpg", "men",
                        List.of("29", "30", "31", "32", "34", "36"), List.of("Khaki", "Navy"), 52, false),
                new ProductSeed("Men Henley Collar T-Shirt", "men-henley-collar-t-shirt",
                        "Soft cotton-blend Henley with a subtle placket and relaxed shape for easy layering.",
                        "34.90", "0.00", "men_henley_collar_t-shirt_001.jpg", "men",
                        List.of("S", "M", "L", "XL"), List.of("White", "Charcoal"), 65, false),
                new ProductSeed("Men Raglan T-Shirt", "men-raglan-t-shirt",
                        "Casual raglan tee with contrast sleeves, breathable cotton jersey, and an athletic fit.",
                        "29.90", "0.00", "men_raglan_t-shirt_001.jpg", "men",
                        List.of("S", "M", "L", "XL"), List.of("Grey"), 72, false),
                new ProductSeed("Men DRY-EX T-Shirt", "men-dry-ex-t-shirt",
                        "Quick-drying performance tee with airy mesh zones and a smooth feel for warm days.",
                        "39.90", "49.90", "man_dry-ex_t-shirt_001.jpg", "men",
                        List.of("S", "M", "L", "XL"), List.of("Black", "Blue"), 58, true),

                new ProductSeed("Women Oxford Shirt", "woman-oxford-shirt",
                        "Crisp oxford button-down with a relaxed cut, curved hem, and year-round cotton texture.",
                        "49.90", "69.90", "woman_oxford_shirt_001.jpg", "women",
                        List.of("XS", "S", "M", "L"), List.of("White", "Blue"), 45, true),
                new ProductSeed("Women Rayon Shirt", "woman-rayon-shirt",
                        "Fluid rayon shirt with an elegant collar, soft drape, and polished everyday finish.",
                        "44.90", "0.00", "woman_rayon_shirt_001.jpg", "women",
                        List.of("XS", "S", "M", "L"), List.of("Cream", "Black"), 42, false),
                new ProductSeed("Women T-Shirt", "woman-t-shirt",
                        "Premium cotton crewneck tee with a neat silhouette and a smooth, opaque finish.",
                        "24.90", "0.00", "woman_t-shirt_001.jpg", "women",
                        List.of("XS", "S", "M", "L", "XL"), List.of("White", "Black"), 90, true),
                new ProductSeed("Women Relaxed T-Shirt", "woman-relaxed-t-shirt",
                        "Easy relaxed tee with soft jersey, dropped shoulders, and a versatile everyday fit.",
                        "26.90", "0.00", "woman_t-shirt_002.jpg", "women",
                        List.of("XS", "S", "M", "L", "XL"), List.of("Grey", "Pink"), 84, false),
                new ProductSeed("Women V-Neck T-Shirt", "woman-v-neck-t-shirt",
                        "Clean V-neck tee in breathable cotton with a flattering neckline and lightweight feel.",
                        "24.90", "0.00", "woman_V-neck_t-shirt_001.jpg", "women",
                        List.of("XS", "S", "M", "L"), List.of("White", "Navy"), 76, false),
                new ProductSeed("Women Culottes Pants", "woman-culottes-pants",
                        "Wide-leg culottes with an elastic back waist, pressed front, and breezy cropped length.",
                        "54.90", "69.90", "woman_culottes_pants_001.jpg", "women",
                        List.of("XS", "S", "M", "L"), List.of("Black", "Beige"), 36, true),
                new ProductSeed("Women Pleated Skirt Pants", "woman-pleated-skirt-pants",
                        "Pleated skirt-pants hybrid with fluid movement, concealed comfort, and a refined shape.",
                        "64.90", "79.90", "woman_pleated_skirt_pants_001.jpg", "women",
                        List.of("XS", "S", "M", "L"), List.of("Black", "Taupe"), 31, false),
                new ProductSeed("Women Jean Shorts", "woman-jean-shorts",
                        "High-rise denim shorts with a clean hem, soft structure, and relaxed summer styling.",
                        "39.90", "49.90", "woman_jean_shorts_001.jpg", "women",
                        List.of("24", "25", "26", "27", "28", "29"), List.of("Light Blue"), 44, false),

                new ProductSeed("Minimal Leather Sneakers", "minimal-leather-sneakers",
                        "Low-profile sneakers with a smooth upper, cushioned footbed, and versatile court-inspired shape.",
                        "89.90", "119.90", "sneakers_001.jpg", "shoes",
                        List.of("36", "37", "38", "39", "40", "41", "42", "43"), List.of("White"), 38, true),

                new ProductSeed("Italian Leather Belt", "italian-leather-belt",
                        "Fine-grain Italian leather belt with a brushed buckle and timeless everyday width.",
                        "49.90", "69.90", "italian_leather_belt_001.jpg", "accessories",
                        List.of("S", "M", "L"), List.of("Black", "Brown"), 64, true),
                new ProductSeed("Reversible Bucket Hat", "reversible-bucket-hat",
                        "Two-way bucket hat with a packable shape, durable cotton twill, and clean stitched brim.",
                        "34.90", "0.00", "reversible_bucket_hat_001.jpg", "accessories",
                        List.of("One size"), List.of("Black", "Khaki"), 55, false),
                new ProductSeed("Semicircle Bag", "semicircle-bag",
                        "Compact semicircle shoulder bag with smooth finish, secure zip closure, and adjustable strap.",
                        "79.90", "99.90", "semicircle_bag_001.jpg", "accessories",
                        List.of("One size"), List.of("Black", "Cream"), 29, true),
                new ProductSeed("Wellington Eyeglasses", "wellington-eyeglasses",
                        "Classic Wellington frames with lightweight acetate, clear demo lenses, and a polished profile.",
                        "59.90", "0.00", "wellington_eyeglasses_001.jpg", "accessories",
                        List.of("One size"), List.of("Black", "Tortoise"), 47, false)
        );

        products.forEach(seed -> upsertProduct(productRepository, categories, seed));
        archiveLegacyDemoCatalog(productRepository, categoryRepository);
    }

    private void upsertProduct(ProductRepository productRepository, Map<String, Category> categories, ProductSeed seed) {
        Product product = productRepository.findBySlug(seed.slug()).orElseGet(Product::new);
        product.setName(seed.name());
        product.setSlug(seed.slug());
        product.setDescription(seed.description());
        product.setPrice(new BigDecimal(seed.price()));
        product.setCompareAtPrice(new BigDecimal(seed.compareAtPrice()));
        product.setImageUrl("/images/products/" + seed.imageFileName());
        product.setCategory(categories.get(seed.categorySlug()));
        product.setSizes(seed.sizes());
        product.setColors(seed.colors());
        product.setStockQuantity(seed.stockQuantity());
        product.setFeatured(seed.featured());
        product.setActive(true);
        productRepository.save(product);
    }

    private void archiveLegacyDemoCatalog(
            ProductRepository productRepository,
            CategoryRepository categoryRepository
    ) {
        List<String> legacyProductSlugs = List.of(
                "column-knit-dress",
                "silk-wrap-midi-dress",
                "tailored-shirt-dress",
                "pleated-evening-dress",
                "ribbed-tank-dress",
                "sculpted-linen-blazer",
                "double-face-wool-coat",
                "cropped-trench-jacket",
                "leather-moto-jacket",
                "quilted-city-vest",
                "leather-slingback-heel",
                "suede-ankle-boot",
                "minimal-leather-sneaker",
                "square-toe-ballet-flat",
                "strappy-evening-sandal",
                "minimal-crescent-bag",
                "silk-square-scarf",
                "gold-hoop-earrings",
                "structured-tote-bag"
        );

        legacyProductSlugs.forEach(slug -> productRepository.findBySlug(slug).ifPresent(product -> {
            product.setActive(false);
            productRepository.save(product);
        }));

        List.of("dresses", "outerwear").forEach(slug -> categoryRepository.findBySlug(slug).ifPresent(category -> {
            category.setActive(false);
            categoryRepository.save(category);
        }));
    }

    private record ProductSeed(
            String name,
            String slug,
            String description,
            String price,
            String compareAtPrice,
            String imageFileName,
            String categorySlug,
            List<String> sizes,
            List<String> colors,
            Integer stockQuantity,
            boolean featured
    ) {
    }
}
