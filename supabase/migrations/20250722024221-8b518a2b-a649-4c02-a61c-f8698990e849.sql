-- First, let's insert the missing brand that the code references
INSERT INTO brands (id, name, is_active) 
VALUES ('550e8400-e29b-41d4-a716-446655440000', 'Demo Brand', true)
ON CONFLICT (id) DO NOTHING;

-- Also insert the brand that BrandDashboard is trying to fetch
INSERT INTO brands (id, name, is_active) 
VALUES ('11111111-1111-1111-1111-111111111111', 'Test Brand', true)
ON CONFLICT (id) DO NOTHING;