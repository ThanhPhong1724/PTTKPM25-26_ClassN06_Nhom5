-- Test single UTF-8 insert
DELETE FROM cake_options WHERE category = 'size';

INSERT INTO cake_options (category, name, description, price, is_default, display_order) 
VALUES ('size', 'Nhỏ (15cm)', 'Phù hợp cho 4-6 người', 0, true, 1);

SELECT encode(name::bytea, 'hex') as name_hex, name, description FROM cake_options WHERE category = 'size';

