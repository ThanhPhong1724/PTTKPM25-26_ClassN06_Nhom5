-- Xóa dữ liệu cũ (nếu có)
TRUNCATE TABLE products CASCADE;
TRUNCATE TABLE categories CASCADE;

-- Insert Categories
INSERT INTO categories (id, name, description, img, "createdAt", "updatedAt") VALUES
('c001', 'Bánh kem truyền thống', 'Các loại bánh kem cổ điển với hương vị truyền thống', NULL, NOW(), NOW()),
('c002', 'Bánh kem tình yêu', 'Bánh kem dành cho các dịp kỷ niệm tình yêu', NULL, NOW(), NOW()),
('c003', 'Bánh mousse', 'Bánh mousse với các hương vị độc đáo', NULL, NOW(), NOW());

-- Insert Products
INSERT INTO products (id, name, description, price, "stockQuantity", "categoryId", "createdAt", "updatedAt", img) VALUES
-- Bánh kem truyền thống
('p001', 'Bánh kem Choco Tiger', 'Bánh kem sô cô la với họa tiết hổ vằn độc đáo', 350000, 10, 'c001', NOW(), NOW(), 'https://product.hstatic.net/200000411281/product/bnh_ho_1_24cb450018fe49938a3889b3a4e80400_medium.jpg'),
('p002', 'Bánh kem Rainbow Magic', 'Bánh kem nhiều màu sắc rực rỡ như cầu vồng', 380000, 10, 'c001', NOW(), NOW(), 'https://product.hstatic.net/200000411281/product/banh_cau_vong_1_827084431afd46659bf4cc5427941900_medium.jpg'),
('p003', 'Bánh kem Regal Planet', 'Bánh kem với thiết kế vũ trụ độc đáo', 400000, 10, 'c001', NOW(), NOW(), 'https://product.hstatic.net/200000411281/product/regal_plannet_8_1_1767561c74bd4e04b7f6243b35277c38_master.png'),
('p004', 'Bánh kem Amber Spirit', 'Bánh kem với màu hổ phách quyến rũ', 420000, 10, 'c001', NOW(), NOW(), 'https://product.hstatic.net/200000411281/product/amber_spirit_6_1_4bde9c0073e746339af994c3ab0a5362_master.png'),

-- Bánh kem tình yêu
('p005', 'Bánh kem Kiss Of Lady', 'Bánh kem dành cho phái đẹp', 450000, 10, 'c002', NOW(), NOW(), 'https://product.hstatic.net/200000411281/product/kiss_of_lady_8_247c2cf000bc4a53a4fc2fb3ba61b636_medium.png'),
('p006', 'Bánh kem Forever Love', 'Bánh kem tình yêu vĩnh cửu', 480000, 10, 'c002', NOW(), NOW(), 'https://product.hstatic.net/200000411281/product/forever_love_8_2e65f47e0cf14fcb8700eb25a4f0da42_master.png'),
('p007', 'Bánh kem Sweet Love', 'Bánh kem ngọt ngào tình yêu', 450000, 10, 'c002', NOW(), NOW(), 'https://product.hstatic.net/200000411281/product/sweetlove_8_a43c559b16ed43b2ac43d4026692cdea_master.png'),
('p008', 'Bánh kem Rossie Love', 'Bánh kem tình yêu với hoa hồng', 460000, 10, 'c002', NOW(), NOW(), 'https://product.hstatic.net/200000411281/product/rossie_love_8_3b838395565c41769c21a14fd42720fb_master.png'),

-- Bánh mousse
('p009', 'Bánh Mousse Hawaii', 'Bánh mousse hương vị nhiệt đới', 320000, 10, 'c003', NOW(), NOW(), 'https://product.hstatic.net/200000411281/product/mousse_hawaii_8_1_e7ed3973bf7f40589f22bd302482261f_master.jpg'),
('p010', 'Bánh Mousse Mango', 'Bánh mousse hương vị xoài', 300000, 10, 'c003', NOW(), NOW(), 'https://product.hstatic.net/200000411281/product/mousse_mango_8_5d2c792e930b43fe9786cd81c74531f9_master.jpg'),
('p011', 'Bánh Passion Fruit Mousse', 'Bánh mousse chanh leo', 310000, 10, 'c003', NOW(), NOW(), 'https://product.hstatic.net/200000411281/product/mousse_chanh_leo_8_1_d4f37b82c29f41af9bfa3c4a1920f50b_master.png'),
('p012', 'Bánh kem Caramel Jelly', 'Bánh kem caramel với thạch', 340000, 10, 'c003', NOW(), NOW(), 'https://product.hstatic.net/200000411281/product/caramel_jelly_8_35f8a43b5ca944b39b11858e0d6d08d2_master.png');