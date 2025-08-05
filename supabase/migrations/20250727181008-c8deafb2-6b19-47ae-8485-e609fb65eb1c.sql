-- Fix broken image links by using placeholder images from unsplash
UPDATE products 
SET image_url = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop'
WHERE id = '827c9e8f-e52c-4111-b558-4a439fa0409d';

UPDATE products 
SET image_url = 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=400&fit=crop'
WHERE id = 'd977bf94-1e24-4b66-b3b5-b73302d775c8';

UPDATE products 
SET image_url = 'https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=400&h=400&fit=crop'
WHERE id = '3ac99f80-ba0b-433d-828e-a166928f0627';

UPDATE products 
SET image_url = 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop'
WHERE id = '4d274c0a-2a30-496f-951f-ea44e8b60e80';

UPDATE products 
SET image_url = 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400&h=400&fit=crop'
WHERE id = '0e5b9bac-9355-45e9-8598-3d68320531a5';