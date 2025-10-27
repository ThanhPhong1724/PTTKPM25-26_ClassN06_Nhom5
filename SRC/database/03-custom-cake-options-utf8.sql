-- Migration: Custom Cake Options (UTF-8)
-- ======================================

-- TRUNCATE existing data
TRUNCATE TABLE cake_options CASCADE;

-- CATEGORY 1: SIZE (Kích thước)
INSERT INTO cake_options (category, name, description, price, is_default, display_order) VALUES
('size', 'Nhỏ (15cm)', 'Phù hợp cho 4-6 người', 0, true, 1),
('size', 'Trung (20cm)', 'Phù hợp cho 8-10 người', 50000, false, 2),
('size', 'Lớn (25cm)', 'Phù hợp cho 12-15 người', 100000, false, 3),
('size', 'Siêu lớn (30cm)', 'Phù hợp cho 20+ người', 200000, false, 4);

-- CATEGORY 2: CAKE BASE (Cốt bánh)
INSERT INTO cake_options (category, name, description, price, is_default, display_order) VALUES
('cake_base', 'Cốt Bông Lan', 'Mềm mịn, nhẹ nhàng', 0, true, 1),
('cake_base', 'Cốt Chocolate', 'Đậm đà socola nguyên chất', 30000, false, 2),
('cake_base', 'Cốt Red Velvet', 'Nhung đỏ sang trọng', 50000, false, 3),
('cake_base', 'Cốt Matcha', 'Trà xanh Nhật Bản', 40000, false, 4),
('cake_base', 'Cốt Tiramisu', 'Hương vị cà phê Italy', 60000, false, 5);

-- CATEGORY 3: FROSTING (Kem phủ)
INSERT INTO cake_options (category, name, description, price, is_default, display_order) VALUES
('frosting', 'Kem Tươi Truyền Thống', 'Kem tươi nguyên chất', 0, true, 1),
('frosting', 'Kem Cheese', 'Cream cheese mịn màng', 40000, false, 2),
('frosting', 'Kem Bơ Phủ', 'Buttercream creamy', 30000, false, 3),
('frosting', 'Kem Chocolate Ganache', 'Socola đậm đà', 50000, false, 4),
('frosting', 'Kem Mascarpone', 'Kem Italy cao cấp', 70000, false, 5);

-- CATEGORY 4: FLAVOR (Hương vị)
INSERT INTO cake_options (category, name, description, price, is_default, display_order) VALUES
('flavor', 'Vani Tự Nhiên', 'Hương vani Madagascar', 0, true, 1),
('flavor', 'Dâu Tây Tươi', 'Dâu tây Đà Lạt', 35000, false, 2),
('flavor', 'Chocolate Đen', 'Socola 70% cacao', 40000, false, 3),
('flavor', 'Caramel', 'Caramel bơ mặn', 30000, false, 4),
('flavor', 'Trái Cây Nhiệt Đới', 'Xoài, Passion fruit', 45000, false, 5),
('flavor', 'Cà Phê Espresso', 'Cà phê Robusta đậm', 35000, false, 6);

-- CATEGORY 5: DECORATION (Trang trí)
INSERT INTO cake_options (category, name, description, price, is_default, display_order) VALUES
('decoration', 'Trang Trí Cơ Bản', 'Kem và hoa quả đơn giản', 0, true, 1),
('decoration', 'Hoa Tươi Cao Cấp', 'Hoa hồng và lan cao cấp', 80000, false, 2),
('decoration', 'Chocolate Curls', 'Chocolate cuộn nghệ thuật', 60000, false, 3),
('decoration', 'Macarons Pháp', '6 macarons nhiều màu', 100000, false, 4),
('decoration', 'Hoa Kem 3D', 'Hoa kem tạo hình 3D', 120000, false, 5),
('decoration', 'Fresh Berries', 'Dâu, việt quất, mâm xôi', 70000, false, 6),
('decoration', 'Gold Leaf', 'Lá vàng ăn được (edible)', 150000, false, 7);

