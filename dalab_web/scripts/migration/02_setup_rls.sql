-- 02_setup_rls.sql
-- Run this in the Supabase SQL Editor

-- 1. Enable RLS on all tables
ALTER TABLE "Category" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "Store" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "Product" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "ProductVariant" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "ProductImage" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "Cart" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "CartItem" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "Order" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "OrderItem" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "Review" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "Wishlist" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "Notification" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "Address" ENABLE ROW LEVEL SECURITY;

-- 2. Basic Policies (Example: Public can view Categories and Active Products)
CREATE POLICY "Public Categories are viewable by everyone" ON "Category" FOR
SELECT USING (true);

CREATE POLICY "Active Products are viewable by everyone" ON "Product" FOR
SELECT USING (status = 'ACTIVE');

-- 3. User Specific Policies (Users can only access their own data)
CREATE POLICY "Users can only see their own profile" ON "User"
    FOR SELECT USING (auth.uid()::text = "supabaseId");

CREATE POLICY "Users can update their own profile" ON "User"
    FOR UPDATE USING (auth.uid()::text = "supabaseId");

CREATE POLICY "Users can see their own addresses" ON "Address"
    FOR SELECT USING (auth.uid()::text IN (SELECT "supabaseId" FROM "User" WHERE id = "userId"));

-- 4. Automatic User Creation Trigger
-- This ensures that when someone signs up via Supabase Auth,
-- they automatically get a record in our Prisma 'User' table.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public."User" (id, email, name, role, "supabaseId", "updatedAt")
  VALUES (
    gen_random_uuid(),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', ''),
    'USER',
    NEW.id,
    NOW()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();