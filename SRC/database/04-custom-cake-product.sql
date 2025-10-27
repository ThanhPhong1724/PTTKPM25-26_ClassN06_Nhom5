-- Create a placeholder product for Custom Cake Builder
-- This allows custom cakes to be added to cart with a valid UUID
-- This product will NOT appear in /products page (filtered in frontend)

-- Delete old product if exists
DELETE FROM products WHERE id = '35537564-76ef-47c0-83b0-1115a1c4505c' OR name = 'Bánh Tùy Chỉnh';

-- Insert custom cake product (using a real UUID v4)
-- Note: The UUID '35537564-76ef-47c0-83b0-1115a1c4505c' must match frontend constant
INSERT INTO products (
    id, 
    name, 
    description, 
    price, 
    "stockQuantity", 
    "categoryId", 
    img,
    "createdAt",
    "updatedAt"
)
VALUES (
    '35537564-76ef-47c0-83b0-1115a1c4505c'::uuid,
    'Bánh Tùy Chỉnh',
    'Thiết kế bánh của bạn với các tùy chọn cá nhân hóa - Giá sẽ được tính dựa trên các lựa chọn của bạn',
    0, -- Base price is 0, actual price calculated from customization options
    999999, -- Unlimited stock for custom cakes
    (SELECT id FROM categories LIMIT 1), -- Get first category
    'https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lplrb621nuen19',
    NOW(),
    NOW()
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    img = EXCLUDED.img;

-- Verify
SELECT id, name, price, img FROM products WHERE id = '35537564-76ef-47c0-83b0-1115a1c4505c';

