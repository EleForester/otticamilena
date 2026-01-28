-- 1. Réinitialiser les policies pour éviter les conflits
drop policy if exists "Enable insert for everyone" on orders;
drop policy if exists "Enable insert for everyone" on order_items;
drop policy if exists "Allow insert for everyone" on orders;
drop policy if exists "Allow insert for everyone" on order_items;
drop policy if exists "Allow read for everyone" on orders;
drop policy if exists "Allow read for everyone" on order_items;

-- 2. S'assurer que le RLS est activé
alter table orders enable row level security;
alter table order_items enable row level security;

-- 3. Créer les policies permissives pour le checkout public
-- Autoriser l'insertion (création de commande) pour tout le monde (anon)
create policy "Allow insert public"
on orders for insert
to public
with check (true);

create policy "Allow insert public items"
on order_items for insert
to public
with check (true);

-- Autoriser la lecture immédiate (pour récupérer l'ID après création et afficher la page de succès)
-- Note: Idéalement on restreindrait cela, mais pour ce projet c'est acceptable.
create policy "Allow select public"
on orders for select
to public
using (true);

create policy "Allow select public items"
on order_items for select
to public
using (true);
