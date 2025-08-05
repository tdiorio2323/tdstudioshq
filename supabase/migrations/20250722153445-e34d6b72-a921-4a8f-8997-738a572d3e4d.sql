-- Insert 8 flower products inspired by cereal box designs
INSERT INTO products (
  brand_id, 
  name, 
  description, 
  category, 
  price, 
  is_available, 
  thc_percentage, 
  cbd_percentage, 
  strain_type, 
  weight_grams
) VALUES 
-- Product 1: Ferrero Rocher White Chocolate inspired
(
  (SELECT id FROM brands LIMIT 1),
  'White Chocolate Kush',
  'Luxurious indica strain with creamy white chocolate notes and hazelnut undertones. Perfect for relaxation and stress relief.',
  'flower',
  4500,
  true,
  24.5,
  0.8,
  'Indica',
  3.5
),
-- Product 2: Cosmic Brownie inspired
(
  (SELECT id FROM brands LIMIT 1),
  'Cosmic Brownie',
  'Rich chocolatey hybrid strain with sweet fudge flavors and colorful candy-like effects. Takes you to another dimension.',
  'flower',
  3800,
  true,
  22.3,
  1.2,
  'Hybrid',
  3.5
),
-- Product 3: Häagen-Dazs Mango Sorbet inspired
(
  (SELECT id FROM brands LIMIT 1),
  'Mango Sorbet',
  'Tropical sativa strain bursting with fresh mango flavors and citrus notes. Uplifting and energizing effects.',
  'flower',
  4200,
  true,
  26.1,
  0.5,
  'Sativa',
  3.5
),
-- Product 4: Tampico Fruit Punch inspired
(
  (SELECT id FROM brands LIMIT 1),
  'Fruit Punch OG',
  'Sweet and fruity hybrid with a medley of tropical fruit flavors. Balanced effects perfect for any time of day.',
  'flower',
  3600,
  true,
  20.8,
  2.1,
  'Hybrid',
  3.5
),
-- Product 5: Princess Bubblegum inspired
(
  (SELECT id FROM brands LIMIT 1),
  'Princess Bubblegum',
  'Sweet indica strain with cotton candy and bubblegum flavors. Royal relaxation fit for royalty.',
  'flower',
  4100,
  true,
  23.7,
  1.0,
  'Indica',
  3.5
),
-- Product 6: Ice King Blueberry inspired
(
  (SELECT id FROM brands LIMIT 1),
  'Ice King Blueberry',
  'Frosty indica strain with intense blueberry flavors and icy cool effects. Rules over winter relaxation.',
  'flower',
  4400,
  true,
  25.9,
  0.7,
  'Indica',
  3.5
),
-- Product 7: Jake Birthday Cake inspired
(
  (SELECT id FROM brands LIMIT 1),
  'Birthday Cake',
  'Celebratory hybrid strain with vanilla cake and frosting flavors. Perfect for special occasions and good vibes.',
  'flower',
  3900,
  true,
  21.5,
  1.8,
  'Hybrid',
  3.5
),
-- Product 8: Finn Sour Green Apple inspired
(
  (SELECT id FROM brands LIMIT 1),
  'Sour Green Apple',
  'Adventurous sativa strain with tart green apple flavors and energizing effects. Ready for any quest.',
  'flower',
  3700,
  true,
  24.2,
  0.9,
  'Sativa',
  3.5
);