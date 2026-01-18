-- ==============================================================================
-- SUPABASE SECURITY HARDENING SCRIPT (V2 - FIXED)
-- ==============================================================================

-- 1. ENABLE ROW LEVEL SECURITY (RLS)
-- ==============================================================================

-- Enable RLS on 'bookings' safely
DO $$
BEGIN
    ALTER TABLE IF EXISTS public.bookings ENABLE ROW LEVEL SECURITY;
EXCEPTION
    WHEN OTHERS THEN NULL;
END $$;

-- Policies for 'bookings'
DROP POLICY IF EXISTS "Enable insert for everyone" ON public.bookings;
CREATE POLICY "Enable insert for everyone" 
ON public.bookings FOR INSERT 
TO public, anon
WITH CHECK (true);

DROP POLICY IF EXISTS "Enable select for authenticated users only" ON public.bookings;
CREATE POLICY "Enable select for authenticated users only" 
ON public.bookings FOR SELECT 
TO authenticated, service_role
USING (true);


-- Enable RLS on 'quiz_leads' safely
DO $$
BEGIN
    ALTER TABLE IF EXISTS public.quiz_leads ENABLE ROW LEVEL SECURITY;
EXCEPTION
    WHEN OTHERS THEN NULL;
END $$;

-- Policies for 'quiz_leads'
DROP POLICY IF EXISTS "Enable insert for everyone" ON public.quiz_leads;
CREATE POLICY "Enable insert for everyone" 
ON public.quiz_leads FOR INSERT 
TO public, anon
WITH CHECK (true);

DROP POLICY IF EXISTS "Enable select for authenticated users only" ON public.quiz_leads;
CREATE POLICY "Enable select for authenticated users only" 
ON public.quiz_leads FOR SELECT 
TO authenticated, service_role
USING (true);


-- 2. SECURE DATABASE FUNCTIONS (Search Path)
-- ==============================================================================
-- We use DO blocks to check existence before altering to avoid errors

DO $$
BEGIN
    -- Fix validate_promo_code (params: varchar, decimal)
    IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'validate_promo_code') THEN
        ALTER FUNCTION public.validate_promo_code(VARCHAR, DECIMAL) SET search_path = public;
    END IF;

    -- Fix handle_new_user
    IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'handle_new_user') THEN
        ALTER FUNCTION public.handle_new_user() SET search_path = public;
    END IF;

    -- Fix update_updated_at_column
    IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'update_updated_at_column') THEN
        ALTER FUNCTION public.update_updated_at_column() SET search_path = public;
    END IF;

    -- Fix generate_order_number (if exists)
    IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'generate_order_number') THEN
        ALTER FUNCTION public.generate_order_number() SET search_path = public;
    END IF;
END $$;


-- 3. HARDEN EXISTING POLICIES
-- ==============================================================================

-- Hardening 'contacts'
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'contacts' AND schemaname = 'public') THEN
        DROP POLICY IF EXISTS "Enable read access for all users" ON public.contacts;
        
        -- Re-create stricter policy if it doesn't exist
        IF NOT EXISTS (
            SELECT 1 FROM pg_policies 
            WHERE tablename = 'contacts' AND policyname = 'Enable read access for service_role only'
        ) THEN
            CREATE POLICY "Enable read access for service_role only" 
            ON public.contacts FOR SELECT 
            TO service_role
            USING (true);
        END IF;
    END IF;
END $$;
