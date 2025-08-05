-- Update remaining products with appropriate placeholder images
UPDATE products SET image_url = 'https://via.placeholder.com/400x400/8B5CF6/FFFFFF?text=Birthday+Cake' WHERE name = 'Birthday Cake' AND image_url IS NULL;
UPDATE products SET image_url = 'https://via.placeholder.com/400x400/F59E0B/FFFFFF?text=Fruit+Punch' WHERE name = 'Fruit Punch OG' AND image_url IS NULL;
UPDATE products SET image_url = 'https://via.placeholder.com/400x400/10B981/FFFFFF?text=Hybrid+Gummies' WHERE name = 'Hybrid Gummies' AND image_url IS NULL;
UPDATE products SET image_url = 'https://via.placeholder.com/400x400/3B82F6/FFFFFF?text=Ice+King' WHERE name = 'Ice King Blueberry' AND image_url IS NULL;
UPDATE products SET image_url = 'https://via.placeholder.com/400x400/F97316/FFFFFF?text=Mango+Sorbet' WHERE name = 'Mango Sorbet' AND image_url IS NULL;
UPDATE products SET image_url = 'https://via.placeholder.com/400x400/059669/FFFFFF?text=OG+Kush' WHERE name = 'OG Kush' AND image_url IS NULL;
UPDATE products SET image_url = 'https://via.placeholder.com/400x400/EC4899/FFFFFF?text=Princess' WHERE name = 'Princess Bubblegum' AND image_url IS NULL;
UPDATE products SET image_url = 'https://via.placeholder.com/400x400/EAB308/FFFFFF?text=Sour+Diesel' WHERE name = 'Sour Diesel' AND image_url IS NULL;