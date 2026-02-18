-- 1) Garantir que o RLS esteja habilitado
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 2) Remover policies RESTRICTIVE existentes
DROP POLICY IF EXISTS "Admins can delete profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can insert profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can delete own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;

-- 3) POLICY PERMISSIVE: SELECT para usuários
CREATE POLICY "profiles_select_own_permissive"
ON public.profiles
AS PERMISSIVE
FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- 4) POLICY PERMISSIVE: UPDATE para usuários
CREATE POLICY "profiles_update_own_permissive"
ON public.profiles
AS PERMISSIVE
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- 5) POLICY PERMISSIVE: SELECT para admins verem todos
CREATE POLICY "profiles_admin_select_permissive"
ON public.profiles
AS PERMISSIVE
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- 6) POLICY PERMISSIVE: INSERT para trigger de novos usuários (via service role)
-- O handle_new_user trigger usa SECURITY DEFINER, então não precisa de policy específica