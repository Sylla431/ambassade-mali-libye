# Configuration Vercel

## Variables d'environnement requises

Pour que l'application fonctionne correctement sur Vercel, vous devez configurer les variables d'environnement suivantes :

### 1. JWT_SECRET
```
JWT_SECRET=your-super-secret-jwt-key-here
```
**Important** : Générez une clé sécurisée de 32+ caractères. Vous pouvez utiliser :
```bash
openssl rand -base64 32
```

### 2. DATABASE_URL
```
DATABASE_URL=postgresql://username:password@host:port/database
```

### 3. JWT_EXPIRES_IN (optionnel)
```
JWT_EXPIRES_IN=7d
```

## Comment configurer sur Vercel

1. Allez sur votre projet Vercel
2. Cliquez sur "Settings"
3. Allez dans "Environment Variables"
4. Ajoutez chaque variable avec sa valeur
5. Redéployez l'application

## Vérification

Après configuration, l'avertissement "JWT_SECRET not set" devrait disparaître et l'authentification devrait fonctionner correctement.
