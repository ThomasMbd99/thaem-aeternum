# Administration et autorisations

L'interface `/admin` ne monte ses requêtes qu'après validation de `public.is_admin()`.
Une erreur réseau, une fonction absente ou un compte non autorisé entraîne un refus.
La sécurité des appels directs repose sur les règles RLS et les privilèges PostgreSQL.

La migration `supabase/migrations/20261019000100_lock_down_admin.sql` remplace les anciennes politiques permissives.
Elle conserve le catalogue et les articles publiés en lecture publique, réserve les modifications et les promotions aux administrateurs,
et limite la lecture des commandes et des profils aux utilisateurs autorisés. Les commandes et leurs montants ne peuvent être créés que côté serveur.
Les écritures du bucket `parfums` et les RPC privilégiées sont également protégées.
L'envoi d'expédition vérifie le même rôle et récupère le destinataire et le suivi depuis la commande en base.

## Attribuer ou révoquer un administrateur

Exécuter depuis le SQL Editor Supabase avec un compte opérateur de confiance.
Remplacer l'email ci-dessous par celui du compte déjà inscrit et confirmé :

```sql
insert into private.admin_users (user_id)
select id from auth.users
where lower(email) = lower('administrateur@example.com')
  and email_confirmed_at is not null
on conflict (user_id) do nothing;
```

La liste est privée et inaccessible aux clients, y compris aux administrateurs du site.
Un utilisateur ne peut pas se promouvoir via son profil ou ses métadonnées.
La révocation s'applique aux requêtes suivantes, même si un JWT est encore valide :

```sql
delete from private.admin_users
where user_id in (select id from auth.users where lower(email) = lower('administrateur@example.com'));
```

`VITE_ADMIN_EMAIL` n'est plus utilisé. Aucune clé `service_role` ni aucun secret ne doit être placé dans `VITE_*`.
Les comptes non confirmés et bannis n'obtiennent pas les droits d'administration.
La seconde migration verrouille aussi les chemins de résolution des fonctions privilégiées
et interdit aux visiteurs anonymes d'exécuter la vérification d'administration.

## Déployer et vérifier

Sur une installation existante disposant du schéma applicatif :

```sh
supabase db push
supabase functions deploy send-shipping-email --use-api
npm test
npm run build
supabase db query --linked --file supabase/tests/admin_security.sql
```

Publier ensuite l'interface et attribuer explicitement les comptes administrateurs.
La migration n'ajoute aucun administrateur automatiquement.
Le test SQL utilise des données temporaires, simule les rôles visiteur/client/admin,
vérifie la révocation et annule toutes ses écritures. Il n'envoie aucun email ni paiement.

Une migration appliquée via `db query --linked --file ...` doit être enregistrée avec
`supabase migration repair <version> --status applied --linked` avant un futur `db push`.

Le contrôle `is_admin()` est volontairement exécutable par les utilisateurs connectés :
il ne reçoit aucun identifiant en paramètre et ne renvoie que les droits de la session courante.
L'avertissement Supabase sur cette fonction SECURITY DEFINER correspond à cet usage prévu.
La protection Supabase contre les mots de passe compromis reste à activer dans les paramètres Auth
si l'offre du projet le permet ; elle est indépendante des autorisations d'administration.

## Exposition antérieure

L'audit a constaté des politiques de lecture publique sur `commandes` et `commande_items`,
de modification publique sur `parfums`, d'administration des articles pour tous les comptes connectés,
et de dépôt d'images trop permissives. La fermeture de ces accès ne permet pas d'établir si des données
ont été consultées auparavant. Les journaux Supabase doivent être examinés pour cette question.
