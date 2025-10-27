-- Enable UUID extension
-- TypeORM sẽ tự động tạo tất cả tables (products, categories, reviews, etc.) khi services khởi động
-- File này chỉ cần enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";