INSERT INTO users (name, email, password, role, enabled)
VALUES
    ('Admin Manager', 'admin@maison.test', '$2a$10$7EqJtq98hPqEX7fNZaFWoOhiQZPX0Zt4RxyQQo0PVOUV3SMEjcv8W', 'ADMIN', TRUE),
    ('Lina Nguyen', 'lina.nguyen@maison.test', '$2a$10$7EqJtq98hPqEX7fNZaFWoOhiQZPX0Zt4RxyQQo0PVOUV3SMEjcv8W', 'USER', TRUE),
    ('Ava Tran', 'ava.tran@maison.test', '$2a$10$7EqJtq98hPqEX7fNZaFWoOhiQZPX0Zt4RxyQQo0PVOUV3SMEjcv8W', 'USER', TRUE)
ON CONFLICT (email) DO NOTHING;

UPDATE users SET role = 'USER' WHERE role = 'CUSTOMER';

INSERT INTO categories (name, slug, description, active)
VALUES
    ('Men', 'men', 'Modern menswear essentials, refined layers, and everyday staples.', TRUE),
    ('Women', 'women', 'Polished womenswear staples with easy silhouettes and premium finishes.', TRUE),
    ('Shoes', 'shoes', 'Versatile footwear for commuting, weekends, and smart casual styling.', TRUE),
    ('Accessories', 'accessories', 'Bags, belts, eyewear, and finishing pieces for daily wear.', TRUE)
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    active = EXCLUDED.active,
    updated_at = NOW();

INSERT INTO products (
    category_id, name, slug, description, price, compare_at_price, image_url,
    stock_quantity, featured, active
)
VALUES
    ((SELECT id FROM categories WHERE slug = 'men'), 'Men AIRSense Jacket', 'men-airsense-jacket', 'Lightweight stretch blazer with a clean drape, breathable lining, and wrinkle-resistant finish.', 129.90, 159.90, '/images/products/men_airsense_jacket_001.jpg', 34, TRUE, TRUE),
    ((SELECT id FROM categories WHERE slug = 'men'), 'Men Short Blouson Zip-Up Jacket', 'men-short-blouson-zip-up-jacket', 'Cropped zip jacket in a smooth technical weave with ribbed cuffs and a structured collar.', 99.90, 129.90, '/images/products/men_short_blouson_zip-up_jacket_001.jpg', 26, TRUE, TRUE),
    ((SELECT id FROM categories WHERE slug = 'men'), 'Men Baggy Jeans', 'men-baggy-jeans', 'Relaxed five-pocket denim with a modern wide leg, soft hand feel, and washed blue finish.', 69.90, 89.90, '/images/products/men_baggy_jeans_001.jpg', 48, FALSE, TRUE),
    ((SELECT id FROM categories WHERE slug = 'men'), 'Men Slim Fit Chino Pants', 'men-slim-fit-chino-pants', 'Tapered cotton chinos with comfortable stretch and a crisp finish for office-to-weekend wear.', 59.90, 79.90, '/images/products/men_slim_fit_chino_pants_001.jpg', 52, FALSE, TRUE),
    ((SELECT id FROM categories WHERE slug = 'men'), 'Men Henley Collar T-Shirt', 'men-henley-collar-t-shirt', 'Soft cotton-blend Henley with a subtle placket and relaxed shape for easy layering.', 34.90, 0.00, '/images/products/men_henley_collar_t-shirt_001.jpg', 65, FALSE, TRUE),
    ((SELECT id FROM categories WHERE slug = 'men'), 'Men Raglan T-Shirt', 'men-raglan-t-shirt', 'Casual raglan tee with contrast sleeves, breathable cotton jersey, and an athletic fit.', 29.90, 0.00, '/images/products/men_raglan_t-shirt_001.jpg', 72, FALSE, TRUE),
    ((SELECT id FROM categories WHERE slug = 'men'), 'Men DRY-EX T-Shirt', 'men-dry-ex-t-shirt', 'Quick-drying performance tee with airy mesh zones and a smooth feel for warm days.', 39.90, 49.90, '/images/products/man_dry-ex_t-shirt_001.jpg', 58, TRUE, TRUE),
    ((SELECT id FROM categories WHERE slug = 'women'), 'Women Oxford Shirt', 'woman-oxford-shirt', 'Crisp oxford button-down with a relaxed cut, curved hem, and year-round cotton texture.', 49.90, 69.90, '/images/products/woman_oxford_shirt_001.jpg', 45, TRUE, TRUE),
    ((SELECT id FROM categories WHERE slug = 'women'), 'Women Rayon Shirt', 'woman-rayon-shirt', 'Fluid rayon shirt with an elegant collar, soft drape, and polished everyday finish.', 44.90, 0.00, '/images/products/woman_rayon_shirt_001.jpg', 42, FALSE, TRUE),
    ((SELECT id FROM categories WHERE slug = 'women'), 'Women T-Shirt', 'woman-t-shirt', 'Premium cotton crewneck tee with a neat silhouette and a smooth, opaque finish.', 24.90, 0.00, '/images/products/woman_t-shirt_001.jpg', 90, TRUE, TRUE),
    ((SELECT id FROM categories WHERE slug = 'women'), 'Women Relaxed T-Shirt', 'woman-relaxed-t-shirt', 'Easy relaxed tee with soft jersey, dropped shoulders, and a versatile everyday fit.', 26.90, 0.00, '/images/products/woman_t-shirt_002.jpg', 84, FALSE, TRUE),
    ((SELECT id FROM categories WHERE slug = 'women'), 'Women V-Neck T-Shirt', 'woman-v-neck-t-shirt', 'Clean V-neck tee in breathable cotton with a flattering neckline and lightweight feel.', 24.90, 0.00, '/images/products/woman_V-neck_t-shirt_001.jpg', 76, FALSE, TRUE),
    ((SELECT id FROM categories WHERE slug = 'women'), 'Women Culottes Pants', 'woman-culottes-pants', 'Wide-leg culottes with an elastic back waist, pressed front, and breezy cropped length.', 54.90, 69.90, '/images/products/woman_culottes_pants_001.jpg', 36, TRUE, TRUE),
    ((SELECT id FROM categories WHERE slug = 'women'), 'Women Pleated Skirt Pants', 'woman-pleated-skirt-pants', 'Pleated skirt-pants hybrid with fluid movement, concealed comfort, and a refined shape.', 64.90, 79.90, '/images/products/woman_pleated_skirt_pants_001.jpg', 31, FALSE, TRUE),
    ((SELECT id FROM categories WHERE slug = 'women'), 'Women Jean Shorts', 'woman-jean-shorts', 'High-rise denim shorts with a clean hem, soft structure, and relaxed summer styling.', 39.90, 49.90, '/images/products/woman_jean_shorts_001.jpg', 44, FALSE, TRUE),
    ((SELECT id FROM categories WHERE slug = 'shoes'), 'Minimal Leather Sneakers', 'minimal-leather-sneakers', 'Low-profile sneakers with a smooth upper, cushioned footbed, and versatile court-inspired shape.', 89.90, 119.90, '/images/products/sneakers_001.jpg', 38, TRUE, TRUE),
    ((SELECT id FROM categories WHERE slug = 'accessories'), 'Italian Leather Belt', 'italian-leather-belt', 'Fine-grain Italian leather belt with a brushed buckle and timeless everyday width.', 49.90, 69.90, '/images/products/italian_leather_belt_001.jpg', 64, TRUE, TRUE),
    ((SELECT id FROM categories WHERE slug = 'accessories'), 'Reversible Bucket Hat', 'reversible-bucket-hat', 'Two-way bucket hat with a packable shape, durable cotton twill, and clean stitched brim.', 34.90, 0.00, '/images/products/reversible_bucket_hat_001.jpg', 55, FALSE, TRUE),
    ((SELECT id FROM categories WHERE slug = 'accessories'), 'Semicircle Bag', 'semicircle-bag', 'Compact semicircle shoulder bag with smooth finish, secure zip closure, and adjustable strap.', 79.90, 99.90, '/images/products/semicircle_bag_001.jpg', 29, TRUE, TRUE),
    ((SELECT id FROM categories WHERE slug = 'accessories'), 'Wellington Eyeglasses', 'wellington-eyeglasses', 'Classic Wellington frames with lightweight acetate, clear demo lenses, and a polished profile.', 59.90, 0.00, '/images/products/wellington_eyeglasses_001.jpg', 47, FALSE, TRUE)
ON CONFLICT (slug) DO UPDATE SET
    category_id = EXCLUDED.category_id,
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    price = EXCLUDED.price,
    compare_at_price = EXCLUDED.compare_at_price,
    image_url = EXCLUDED.image_url,
    stock_quantity = EXCLUDED.stock_quantity,
    featured = EXCLUDED.featured,
    active = EXCLUDED.active,
    updated_at = NOW();

DELETE FROM product_sizes WHERE product_id IN (
    SELECT id FROM products WHERE slug IN (
        'men-airsense-jacket', 'men-short-blouson-zip-up-jacket', 'men-baggy-jeans',
        'men-slim-fit-chino-pants', 'men-henley-collar-t-shirt', 'men-raglan-t-shirt',
        'men-dry-ex-t-shirt', 'woman-oxford-shirt', 'woman-rayon-shirt', 'woman-t-shirt',
        'woman-relaxed-t-shirt', 'woman-v-neck-t-shirt', 'woman-culottes-pants',
        'woman-pleated-skirt-pants', 'woman-jean-shorts', 'minimal-leather-sneakers',
        'italian-leather-belt', 'reversible-bucket-hat', 'semicircle-bag', 'wellington-eyeglasses'
    )
);

DELETE FROM product_colors WHERE product_id IN (
    SELECT id FROM products WHERE slug IN (
        'men-airsense-jacket', 'men-short-blouson-zip-up-jacket', 'men-baggy-jeans',
        'men-slim-fit-chino-pants', 'men-henley-collar-t-shirt', 'men-raglan-t-shirt',
        'men-dry-ex-t-shirt', 'woman-oxford-shirt', 'woman-rayon-shirt', 'woman-t-shirt',
        'woman-relaxed-t-shirt', 'woman-v-neck-t-shirt', 'woman-culottes-pants',
        'woman-pleated-skirt-pants', 'woman-jean-shorts', 'minimal-leather-sneakers',
        'italian-leather-belt', 'reversible-bucket-hat', 'semicircle-bag', 'wellington-eyeglasses'
    )
);

INSERT INTO product_sizes (product_id, size)
SELECT p.id, s.size
FROM products p
JOIN (
    VALUES
        ('men-airsense-jacket', 'S'), ('men-airsense-jacket', 'M'), ('men-airsense-jacket', 'L'), ('men-airsense-jacket', 'XL'),
        ('men-short-blouson-zip-up-jacket', 'S'), ('men-short-blouson-zip-up-jacket', 'M'), ('men-short-blouson-zip-up-jacket', 'L'), ('men-short-blouson-zip-up-jacket', 'XL'),
        ('men-baggy-jeans', '29'), ('men-baggy-jeans', '30'), ('men-baggy-jeans', '31'), ('men-baggy-jeans', '32'), ('men-baggy-jeans', '34'), ('men-baggy-jeans', '36'),
        ('men-slim-fit-chino-pants', '29'), ('men-slim-fit-chino-pants', '30'), ('men-slim-fit-chino-pants', '31'), ('men-slim-fit-chino-pants', '32'), ('men-slim-fit-chino-pants', '34'), ('men-slim-fit-chino-pants', '36'),
        ('men-henley-collar-t-shirt', 'S'), ('men-henley-collar-t-shirt', 'M'), ('men-henley-collar-t-shirt', 'L'), ('men-henley-collar-t-shirt', 'XL'),
        ('men-raglan-t-shirt', 'S'), ('men-raglan-t-shirt', 'M'), ('men-raglan-t-shirt', 'L'), ('men-raglan-t-shirt', 'XL'),
        ('men-dry-ex-t-shirt', 'S'), ('men-dry-ex-t-shirt', 'M'), ('men-dry-ex-t-shirt', 'L'), ('men-dry-ex-t-shirt', 'XL'),
        ('woman-oxford-shirt', 'XS'), ('woman-oxford-shirt', 'S'), ('woman-oxford-shirt', 'M'), ('woman-oxford-shirt', 'L'),
        ('woman-rayon-shirt', 'XS'), ('woman-rayon-shirt', 'S'), ('woman-rayon-shirt', 'M'), ('woman-rayon-shirt', 'L'),
        ('woman-t-shirt', 'XS'), ('woman-t-shirt', 'S'), ('woman-t-shirt', 'M'), ('woman-t-shirt', 'L'), ('woman-t-shirt', 'XL'),
        ('woman-relaxed-t-shirt', 'XS'), ('woman-relaxed-t-shirt', 'S'), ('woman-relaxed-t-shirt', 'M'), ('woman-relaxed-t-shirt', 'L'), ('woman-relaxed-t-shirt', 'XL'),
        ('woman-v-neck-t-shirt', 'XS'), ('woman-v-neck-t-shirt', 'S'), ('woman-v-neck-t-shirt', 'M'), ('woman-v-neck-t-shirt', 'L'),
        ('woman-culottes-pants', 'XS'), ('woman-culottes-pants', 'S'), ('woman-culottes-pants', 'M'), ('woman-culottes-pants', 'L'),
        ('woman-pleated-skirt-pants', 'XS'), ('woman-pleated-skirt-pants', 'S'), ('woman-pleated-skirt-pants', 'M'), ('woman-pleated-skirt-pants', 'L'),
        ('woman-jean-shorts', '24'), ('woman-jean-shorts', '25'), ('woman-jean-shorts', '26'), ('woman-jean-shorts', '27'), ('woman-jean-shorts', '28'), ('woman-jean-shorts', '29'),
        ('minimal-leather-sneakers', '36'), ('minimal-leather-sneakers', '37'), ('minimal-leather-sneakers', '38'), ('minimal-leather-sneakers', '39'), ('minimal-leather-sneakers', '40'), ('minimal-leather-sneakers', '41'), ('minimal-leather-sneakers', '42'), ('minimal-leather-sneakers', '43'),
        ('italian-leather-belt', 'S'), ('italian-leather-belt', 'M'), ('italian-leather-belt', 'L'),
        ('reversible-bucket-hat', 'One size'), ('semicircle-bag', 'One size'), ('wellington-eyeglasses', 'One size')
) AS s(slug, size) ON p.slug = s.slug;

INSERT INTO product_colors (product_id, color)
SELECT p.id, c.color
FROM products p
JOIN (
    VALUES
        ('men-airsense-jacket', 'Navy'), ('men-airsense-jacket', 'Black'),
        ('men-short-blouson-zip-up-jacket', 'Olive'), ('men-short-blouson-zip-up-jacket', 'Black'),
        ('men-baggy-jeans', 'Blue'),
        ('men-slim-fit-chino-pants', 'Khaki'), ('men-slim-fit-chino-pants', 'Navy'),
        ('men-henley-collar-t-shirt', 'White'), ('men-henley-collar-t-shirt', 'Charcoal'),
        ('men-raglan-t-shirt', 'Grey'),
        ('men-dry-ex-t-shirt', 'Black'), ('men-dry-ex-t-shirt', 'Blue'),
        ('woman-oxford-shirt', 'White'), ('woman-oxford-shirt', 'Blue'),
        ('woman-rayon-shirt', 'Cream'), ('woman-rayon-shirt', 'Black'),
        ('woman-t-shirt', 'White'), ('woman-t-shirt', 'Black'),
        ('woman-relaxed-t-shirt', 'Grey'), ('woman-relaxed-t-shirt', 'Pink'),
        ('woman-v-neck-t-shirt', 'White'), ('woman-v-neck-t-shirt', 'Navy'),
        ('woman-culottes-pants', 'Black'), ('woman-culottes-pants', 'Beige'),
        ('woman-pleated-skirt-pants', 'Black'), ('woman-pleated-skirt-pants', 'Taupe'),
        ('woman-jean-shorts', 'Light Blue'),
        ('minimal-leather-sneakers', 'White'),
        ('italian-leather-belt', 'Black'), ('italian-leather-belt', 'Brown'),
        ('reversible-bucket-hat', 'Black'), ('reversible-bucket-hat', 'Khaki'),
        ('semicircle-bag', 'Black'), ('semicircle-bag', 'Cream'),
        ('wellington-eyeglasses', 'Black'), ('wellington-eyeglasses', 'Tortoise')
) AS c(slug, color) ON p.slug = c.slug;

UPDATE products
SET active = FALSE, updated_at = NOW()
WHERE slug IN (
    'column-knit-dress', 'silk-wrap-midi-dress', 'tailored-shirt-dress',
    'pleated-evening-dress', 'ribbed-tank-dress', 'sculpted-linen-blazer',
    'double-face-wool-coat', 'cropped-trench-jacket', 'leather-moto-jacket',
    'quilted-city-vest', 'leather-slingback-heel', 'suede-ankle-boot',
    'minimal-leather-sneaker', 'square-toe-ballet-flat', 'strappy-evening-sandal',
    'minimal-crescent-bag', 'silk-square-scarf', 'gold-hoop-earrings',
    'structured-tote-bag'
);

UPDATE categories
SET active = FALSE, updated_at = NOW()
WHERE slug IN ('dresses', 'outerwear');
