# 🔧 Configuration des Variables d'Environnement Supabase

## 📋 Variables Requises pour Vercel

### 1. Variables de Base de Données
```bash
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
```

### 2. Variables Supabase
```bash
NEXT_PUBLIC_SUPABASE_URL=https://[PROJECT-REF].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[ANON_KEY]
```

### 3. Variables d'Authentification
```bash
JWT_SECRET=007594abc7e5d8776523f55d8dacc178d193516dc374942adba4064ad63ed8e953839fdcf9972463b8f907f4852ac2d89938bd0332a38dd34de30d32c0284628
NEXTAUTH_SECRET=ddcaa73456a4e47c96a4431829758f5bcdf0543829e7089420ea8bb37f6c15cfbd680382adc2e0901a57fa8e050aec264c84374ef0df7e3410fee35ed2308f7d
```

## 🚀 Configuration sur Vercel

### 1. Accéder au Dashboard Vercel
1. Allez sur [vercel.com](https://vercel.com)
2. Sélectionnez votre projet : `ambassade-mali-libye`
3. Allez dans **Settings** → **Environment Variables**

### 2. Ajouter les Variables
Cliquez sur **Add New** pour chaque variable :

#### Variable 1 : DATABASE_URL
- **Name** : `DATABASE_URL`
- **Value** : `postgresql://postgres:[VOTRE-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres`
- **Environment** : ✅ Production, ✅ Preview, ✅ Development

#### Variable 2 : NEXT_PUBLIC_SUPABASE_URL
- **Name** : `NEXT_PUBLIC_SUPABASE_URL`
- **Value** : `https://[PROJECT-REF].supabase.co`
- **Environment** : ✅ Production, ✅ Preview, ✅ Development

#### Variable 3 : NEXT_PUBLIC_SUPABASE_ANON_KEY
- **Name** : `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Value** : `[VOTRE-ANON-KEY]`
- **Environment** : ✅ Production, ✅ Preview, ✅ Development

#### Variable 4 : JWT_SECRET
- **Name** : `JWT_SECRET`
- **Value** : `007594abc7e5d8776523f55d8dacc178d193516dc374942adba4064ad63ed8e953839fdcf9972463b8f907f4852ac2d89938bd0332a38dd34de30d32c0284628`
- **Environment** : ✅ Production, ✅ Preview, ✅ Development

#### Variable 5 : NEXTAUTH_SECRET
- **Name** : `NEXTAUTH_SECRET`
- **Value** : `ddcaa73456a4e47c96a4431829758f5bcdf0543829e7089420ea8bb37f6c15cfbd680382adc2e0901a57fa8e050aec264c84374ef0df7e3410fee35ed2308f7d`
- **Environment** : ✅ Production, ✅ Preview, ✅ Development

## 🔍 Où Trouver les Valeurs Supabase

### 1. DATABASE_URL
1. Allez dans votre projet Supabase
2. **Settings** → **Database**
3. Copiez la **Connection string** sous "Connection parameters"
4. Remplacez `[YOUR-PASSWORD]` par votre mot de passe

### 2. NEXT_PUBLIC_SUPABASE_URL
1. **Settings** → **API**
2. Copiez la **Project URL**

### 3. NEXT_PUBLIC_SUPABASE_ANON_KEY
1. **Settings** → **API**
2. Copiez la **anon public** key

## ✅ Vérification

### Test de Connexion
```bash
curl "https://ambassade-mali-libye.vercel.app/api/articles?page=1&limit=6&published=true"
```

### Résultat Attendu
```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": "...",
        "title": "...",
        "content": "...",
        "published": true
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 6,
      "total": 14,
      "totalPages": 3
    }
  }
}
```

## 🆘 Dépannage

### Erreur 500 Persistante
1. Vérifiez que toutes les variables sont configurées
2. Vérifiez que le mot de passe DATABASE_URL est correct
3. Vérifiez que le projet Supabase est actif
4. Redéployez l'application après configuration

### Erreur de Connexion
1. Vérifiez la syntaxe de DATABASE_URL
2. Vérifiez que les clés Supabase sont correctes
3. Vérifiez que le projet Supabase n'est pas en pause

## 📞 Support
- **Documentation Supabase** : [supabase.com/docs](https://supabase.com/docs)
- **Support Vercel** : [vercel.com/help](https://vercel.com/help)
