# Guide pour Appliquer la Migration de la Catégorie NOTE_DE_SERVICE

## 🚨 Problème
L'upload de documents échoue avec l'erreur :
```
invalid input value for enum "DocumentCategory": "NOTE_DE_SERVICE"
```

## 🔧 Solution

### Option 1: Via l'interface Vercel (Recommandée)

1. **Aller sur Vercel Dashboard**
   - [https://vercel.com/dashboard](https://vercel.com/dashboard)
   - Sélectionner le projet "ambassade-mali-libye"

2. **Accéder à la base de données**
   - Aller dans l'onglet **"Storage"**
   - Cliquer sur votre base de données PostgreSQL

3. **Exécuter la migration SQL**
   - Aller dans l'onglet **"Query"** ou **"SQL Editor"**
   - Exécuter cette commande SQL :
   ```sql
   ALTER TYPE "DocumentCategory" ADD VALUE 'NOTE_DE_SERVICE';
   ```

4. **Vérifier la migration**
   - Exécuter cette requête pour vérifier :
   ```sql
   SELECT unnest(enum_range(NULL::"DocumentCategory")) as category_values;
   ```
   - Vous devriez voir `NOTE_DE_SERVICE` dans la liste

### Option 2: Via psql (Si vous avez accès direct)

1. **Se connecter à la base de données**
   ```bash
   psql "votre_connection_string_postgresql"
   ```

2. **Exécuter la migration**
   ```sql
   ALTER TYPE "DocumentCategory" ADD VALUE 'NOTE_DE_SERVICE';
   ```

3. **Vérifier**
   ```sql
   SELECT unnest(enum_range(NULL::"DocumentCategory")) as category_values;
   ```

### Option 3: Via un script de migration

1. **Utiliser le fichier SQL fourni**
   - Le fichier `migration-add-note-de-service.sql` contient la migration
   - L'exécuter sur votre base de données

## ✅ Vérification

Après avoir appliqué la migration, l'upload de documents devrait fonctionner sans erreur.

## 🔄 Mise à jour du code

Une fois la migration appliquée, vous pouvez remettre `NOTE_DE_SERVICE` comme catégorie par défaut dans les APIs :

```typescript
category: (category as any) || 'NOTE_DE_SERVICE',
```

## 📝 Notes

- Cette migration est **irréversible** (on ne peut pas supprimer une valeur d'enum PostgreSQL)
- La migration est **sûre** et n'affecte pas les données existantes
- Tous les documents existants continueront de fonctionner normalement
