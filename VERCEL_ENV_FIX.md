# 🚨 Correction de l'Erreur 500 - Variables d'Environnement Vercel

## 🔍 Problème Identifié
L'erreur 500 indique que les variables d'environnement ne sont pas correctement configurées sur Vercel.

## 🔧 Solution : Configuration des Variables sur Vercel

### 1. Accéder au Dashboard Vercel
1. Allez sur [vercel.com](https://vercel.com)
2. Connectez-vous à votre compte
3. Sélectionnez votre projet : `ambassade-mali-libye`

### 2. Configurer les Variables d'Environnement
1. Allez dans **Settings** → **Environment Variables**
2. Ajoutez ces 3 variables :

#### Variable 1 : DATABASE_URL
- **Name** : `DATABASE_URL`
- **Value** : `libsql://ambassade-mali-libye-[votre-org].turso.io?authToken=[votre-token]`
- **Environment** : Production, Preview, Development

#### Variable 2 : JWT_SECRET
- **Name** : `JWT_SECRET`
- **Value** : `007594abc7e5d8776523f55d8dacc178d193516dc374942adba4064ad63ed8e953839fdcf9972463b8f907f4852ac2d89938bd0332a38dd34de30d32c0284628`
- **Environment** : Production, Preview, Development

#### Variable 3 : NEXTAUTH_SECRET
- **Name** : `NEXTAUTH_SECRET`
- **Value** : `ddcaa73456a4e47c96a4431829758f5bcdf0543829e7089420ea8bb37f6c15cfbd680382adc2e0901a57fa8e050aec264c84374ef0df7e3410fee35ed2308f7d`
- **Environment** : Production, Preview, Development

### 3. Redéployer l'Application
1. Après avoir ajouté les variables, allez dans **Deployments**
2. Cliquez sur **Redeploy** sur le dernier déploiement
3. Ou poussez un nouveau commit pour déclencher un redéploiement

## 🔍 Vérification

### Test de l'API
```bash
curl "https://ambassade-mali-libye.vercel.app/api/articles?page=1&limit=6&published=true"
```

### Résultat Attendu
```json
{
  "success": true,
  "data": {
    "data": [...],
    "pagination": {...}
  }
}
```

## 🆘 Si le Problème Persiste

### 1. Vérifier les Logs Vercel
1. Allez dans **Functions** → **View Function Logs**
2. Regardez les erreurs récentes

### 2. Vérifier la Base de Données Turso
1. Allez sur [turso.tech](https://turso.tech)
2. Vérifiez que votre base de données est active
3. Testez la connexion depuis le dashboard

### 3. Variables d'Environnement Manquantes
Assurez-vous que toutes les variables sont configurées :
- ✅ `DATABASE_URL`
- ✅ `JWT_SECRET`
- ✅ `NEXTAUTH_SECRET`

## 📞 Support
Si le problème persiste après ces étapes, vérifiez :
1. Les logs Vercel pour des erreurs spécifiques
2. La connectivité de votre base Turso
3. La validité de vos tokens d'authentification
