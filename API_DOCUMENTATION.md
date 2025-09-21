# Documentation API - Ambassade du Mali en Libye

## Vue d'ensemble

Cette API REST a été développée avec Next.js 14 et Prisma pour gérer le contenu et les services de l'Ambassade du Mali en Libye.

## Base URL

```
http://localhost:3000/api
```

## Authentification

L'API utilise JWT (JSON Web Tokens) pour l'authentification des administrateurs.

### Connexion

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@ambassade-mali-libye.ml",
  "password": "admin123"
}
```

**Réponse :**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "clx...",
      "email": "admin@ambassade-mali-libye.ml",
      "name": "Administrateur Principal",
      "role": "SUPER_ADMIN"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "Connexion réussie"
}
```

### Vérification du token

```http
GET /api/auth/me
Authorization: Bearer <token>
```

## Endpoints

### Articles

#### Récupérer tous les articles
```http
GET /api/articles?published=true&page=1&limit=10&search=mot-clé
```

#### Créer un article (Admin)
```http
POST /api/articles
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Titre de l'article",
  "titleAr": "عنوان المقال",
  "content": "Contenu de l'article...",
  "contentAr": "محتوى المقال...",
  "excerpt": "Résumé",
  "excerptAr": "ملخص",
  "slug": "titre-article",
  "featured": false,
  "published": true,
  "imageUrl": "https://example.com/image.jpg",
  "tags": "[\"actualités\", \"mali\"]",
  "category": "actualités"
}
```

#### Récupérer un article par ID
```http
GET /api/articles/{id}
```

#### Mettre à jour un article (Admin)
```http
PUT /api/articles/{id}
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Nouveau titre",
  "published": true
}
```

#### Supprimer un article (Admin)
```http
DELETE /api/articles/{id}
Authorization: Bearer <token>
```

### Événements

#### Récupérer tous les événements
```http
GET /api/events?published=true&page=1&limit=10
```

#### Créer un événement (Admin)
```http
POST /api/events
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Journée de la Culture Malienne",
  "titleAr": "يوم الثقافة المالية",
  "description": "Description de l'événement...",
  "descriptionAr": "وصف الحدث...",
  "location": "Ambassade du Mali, Tripoli",
  "startDate": "2024-01-15T10:00:00Z",
  "endDate": "2024-01-15T18:00:00Z",
  "isRecurring": false,
  "imageUrl": "https://example.com/event.jpg",
  "published": true
}
```

### Demandes de Visa

#### Soumettre une demande de visa (Public)
```http
POST /api/visa
Content-Type: application/json

{
  "firstName": "Jean",
  "lastName": "Dupont",
  "email": "jean.dupont@email.com",
  "phone": "+33 1 23 45 67 89",
  "nationality": "Français",
  "passportNumber": "12AB34567",
  "visaType": "TOURIST",
  "purpose": "Tourisme",
  "entryDate": "2024-02-01T00:00:00Z",
  "exitDate": "2024-02-15T00:00:00Z",
  "documents": "[\"passport.pdf\", \"photo.jpg\"]",
  "notes": "Notes additionnelles"
}
```

#### Récupérer toutes les demandes (Admin)
```http
GET /api/visa?status=PENDING&page=1&limit=10
Authorization: Bearer <token>
```

#### Mettre à jour le statut d'une demande (Admin)
```http
PUT /api/visa/{id}
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "APPROVED",
  "notes": "Demande approuvée"
}
```

### Messages de Contact

#### Envoyer un message (Public)
```http
POST /api/contact
Content-Type: application/json

{
  "name": "Jean Dupont",
  "email": "jean.dupont@email.com",
  "phone": "+33 1 23 45 67 89",
  "subject": "Question sur les visas",
  "message": "Bonjour, j'aimerais savoir..."
}
```

#### Récupérer tous les messages (Admin)
```http
GET /api/contact?page=1&limit=10&search=visa
Authorization: Bearer <token>
```

### Annonces

#### Récupérer toutes les annonces
```http
GET /api/announcements?active=true&page=1&limit=10
```

#### Créer une annonce (Admin)
```http
POST /api/announcements
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Nouveaux horaires",
  "titleAr": "أوقات عمل جديدة",
  "content": "L'ambassade sera fermée...",
  "contentAr": "ستكون السفارة مغلقة...",
  "priority": "HIGH",
  "isActive": true,
  "startDate": "2024-01-01T00:00:00Z",
  "endDate": "2024-12-31T23:59:59Z"
}
```

## Codes de statut

- `200` - Succès
- `400` - Erreur de validation
- `401` - Non autorisé
- `403` - Accès interdit
- `404` - Ressource non trouvée
- `500` - Erreur interne du serveur

## Format des réponses

### Succès
```json
{
  "success": true,
  "data": { ... },
  "message": "Message de succès"
}
```

### Erreur
```json
{
  "success": false,
  "error": "Message d'erreur",
  "details": [ ... ] // Pour les erreurs de validation
}
```

### Pagination
```json
{
  "success": true,
  "data": {
    "data": [ ... ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 100,
      "totalPages": 10
    }
  }
}
```

## Types de données

### Rôles d'administrateur
- `SUPER_ADMIN` - Accès complet
- `ADMIN` - Gestion des contenus et demandes
- `EDITOR` - Création et modification de contenu

### Types de visa
- `TOURIST` - Tourisme
- `BUSINESS` - Affaires
- `DIPLOMATIC` - Diplomatique
- `STUDENT` - Étudiant
- `WORK` - Travail
- `TRANSIT` - Transit

### Statuts de demande de visa
- `PENDING` - En attente
- `UNDER_REVIEW` - En cours d'examen
- `APPROVED` - Approuvée
- `REJECTED` - Rejetée
- `CANCELLED` - Annulée

### Priorités d'annonce
- `LOW` - Faible
- `NORMAL` - Normale
- `HIGH` - Élevée
- `URGENT` - Urgente

## Configuration

### Variables d'environnement

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="votre-secret-jwt-tres-securise"
JWT_EXPIRES_IN="7d"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### Scripts disponibles

```bash
# Développement
npm run dev

# Base de données
npm run db:generate    # Générer le client Prisma
npm run db:push        # Synchroniser le schéma
npm run db:seed        # Initialiser avec des données d'exemple
npm run db:studio      # Interface graphique Prisma

# Production
npm run build
npm run start
```

## Sécurité

- Authentification JWT obligatoire pour les endpoints admin
- Validation des données avec Zod
- Hachage des mots de passe avec bcrypt
- Protection CSRF intégrée à Next.js
- Validation des types de fichiers pour les uploads

## Support multilingue

L'API supporte le français et l'arabe pour tous les contenus :
- `title` / `titleAr`
- `content` / `contentAr`
- `excerpt` / `excerptAr`
- `description` / `descriptionAr`
