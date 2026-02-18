-- Limpa policies anteriores da tabela profiles
DROP POLICY IF EXISTS "profiles_select_own_permissive" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_own_permissive" ON public.profiles;
DROP POLICY IF EXISTS "profiles_admin_select_permissive" ON public.profiles;

-- SELECT: usuário vê o próprio perfil OU admin vê todos
CREATE POLICY "profiles_select_own_or_admin"
ON public.profiles
AS PERMISSIVE
FOR SELECT
TO authenticated
USING (auth.uid() = id OR public.has_role(auth.uid(), 'admin'));

-- UPDATE: usuário atualiza o próprio OU admin atualiza qualquer um
CREATE POLICY "profiles_update_own_or_admin"
ON public.profiles
AS PERMISSIVE
FOR UPDATE
TO authenticated
USING (auth.uid() = id OR public.has_role(auth.uid(), 'admin'))
WITH CHECK (auth.uid() = id OR public.has_role(auth.uid(), 'admin'));

-- INSERT: somente admin pode criar perfis manualmente (perfis são criados automaticamente via trigger)
CREATE POLICY "profiles_insert_admin_only"
ON public.profiles
AS PERMISSIVE
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- DELETE: somente admin pode deletar perfis
CREATE POLICY "profiles_delete_admin_only"
ON public.profiles
AS PERMISSIVE
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));