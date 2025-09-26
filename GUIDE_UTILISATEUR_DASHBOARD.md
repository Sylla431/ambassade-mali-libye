# 📋 Guide Utilisateur - Dashboard d'Administration
## Ambassade du Mali en Libye

---

## 🚀 **Accès au Dashboard**

### **URL d'accès**
- **URL** : `https://ambassade-mali-libye.vercel.app/admin`
- **Connexion** : Utilisez vos identifiants administrateur

### **Première connexion**
1. Allez sur `/admin/login`
2. Entrez votre email et mot de passe
3. Cliquez sur "Se connecter"

---

## 🏠 **Tableau de Bord Principal**

### **Vue d'ensemble**
Le tableau de bord affiche :
- **Statistiques générales** : Nombre d'articles, événements, demandes de visa, messages, documents et annonces
- **Actions rapides** : Liens directs vers les fonctionnalités principales
- **Activité récente** : Derniers articles publiés

### **Actions rapides disponibles**
- 📝 **Nouvel article** : Créer un nouvel article
- 📅 **Nouvel événement** : Planifier un événement
- 📄 **Uploader un document** : Ajouter des documents officiels
- 📢 **Nouvelle annonce** : Publier une annonce

---

## 📝 **Gestion des Articles**

### **Accès**
- **Menu** : Articles → Tous les articles
- **URL** : `/admin/articles`

### **Fonctionnalités**

#### **Créer un nouvel article**
1. Cliquez sur "Nouvel article" (bouton bleu)
2. Remplissez le formulaire :
   - **Titre** : Titre de l'article (obligatoire)
   - **Titre en arabe** : Version arabe du titre (optionnel)
   - **Contenu** : Corps de l'article avec éditeur riche
   - **Contenu en arabe** : Version arabe (optionnel)
   - **Extrait** : Résumé court de l'article
   - **Catégorie** : Choisir une catégorie existante
   - **Image principale** : Uploader une image de couverture
   - **Statut** : Brouillon ou Publié
   - **Article à la une** : Cocher si c'est un article important

#### **Gérer les articles existants**
- **Recherche** : Utilisez la barre de recherche pour trouver un article
- **Filtres** : Filtrez par statut (Tous, Publiés, Brouillons)
- **Actions disponibles** :
  - 👁️ **Voir** : Prévisualiser l'article
  - ✏️ **Modifier** : Éditer l'article
  - 🗑️ **Supprimer** : Supprimer définitivement
  - 📌 **Mettre en vedette** : Marquer comme article important

#### **Galerie d'images d'article**
- **Accès** : Articles → [Nom de l'article] → Galerie
- **Fonctionnalités** :
  - Uploader plusieurs images
  - Ajouter des légendes en français et arabe
  - Réorganiser l'ordre des images
  - Supprimer des images

---

## 📅 **Gestion des Événements**

### **Accès**
- **Menu** : Événements → Tous les événements
- **URL** : `/admin/events`

### **Créer un nouvel événement**
1. Cliquez sur "Nouvel événement" (bouton vert)
2. Remplissez le formulaire :
   - **Titre** : Nom de l'événement
   - **Description** : Détails de l'événement
   - **Lieu** : Où se déroule l'événement
   - **Date de début** : Date et heure de début
   - **Date de fin** : Date et heure de fin (optionnel)
   - **Image** : Image de l'événement
   - **Statut** : Brouillon ou Publié

### **Gérer les événements**
- **Recherche et filtres** : Même système que les articles
- **Actions** : Voir, Modifier, Supprimer

---

## 👥 **Gestion des Demandes de Visa**

### **Accès**
- **Menu** : Demandes de visa
- **URL** : `/admin/visa`

### **Fonctionnalités**
- **Voir toutes les demandes** : Liste complète des demandes
- **Filtrer par statut** :
  - ⏳ En attente
  - 🔍 En cours d'examen
  - ✅ Approuvée
  - ❌ Rejetée
  - 🚫 Annulée
- **Actions disponibles** :
  - Voir les détails complets
  - Changer le statut
  - Ajouter des notes
  - Télécharger les documents

---

## 💬 **Gestion des Messages de Contact**

### **Accès**
- **Menu** : Messages
- **URL** : `/admin/contact`

### **Fonctionnalités**
- **Voir tous les messages** : Liste des messages reçus
- **Filtrer par statut** : Lus/Non lus
- **Actions** :
  - Marquer comme lu
  - Voir les détails complets
  - Supprimer les messages

---

## 📄 **Gestion des Documents**

### **Accès**
- **Menu** : Documents
- **URL** : `/admin/documents`

### **Uploader des documents**
1. Cliquez sur "Télécharger" (bouton violet)
2. Sélectionnez un ou plusieurs fichiers
3. **Types supportés** : PDF, Word, Excel, PowerPoint, images
4. **Taille maximale** : 100MB par fichier
5. **Catégories disponibles** :
   - Formulaires de visa
   - Documents légaux
   - Notes de service
   - Actualités
   - Annonces
   - Culturel
   - Économique
   - Politique

### **Gérer les documents**
- **Recherche** : Par nom ou contenu
- **Filtres** : Par catégorie et visibilité
- **Actions** :
  - 👁️ **Voir** : Prévisualiser le document
  - 📥 **Télécharger** : Télécharger le fichier
  - ✏️ **Modifier** : Changer le titre, description, catégorie
  - 🔒 **Visibilité** : Rendre public ou privé
  - 🗑️ **Supprimer** : Supprimer définitivement

### **Barre de progression**
- L'upload de gros fichiers affiche une barre de progression
- Les fichiers sont uploadés par parties (chunks) pour éviter les erreurs

---

## 📢 **Gestion des Annonces**

### **Accès**
- **Menu** : Annonces → Toutes les annonces
- **URL** : `/admin/announcements`

### **Créer une nouvelle annonce**
1. Cliquez sur "Nouvelle annonce" (bouton rouge)
2. Remplissez le formulaire :
   - **Titre** : Titre de l'annonce
   - **Contenu** : Texte de l'annonce
   - **Priorité** : Basse, Normale, Haute, Urgente
   - **Dates** : Date de début et fin d'affichage
   - **Statut** : Active/Inactive

### **Gérer les annonces**
- **Filtres** : Par priorité et statut
- **Actions** : Voir, Modifier, Supprimer

---

## 🖼️ **Gestion des Galeries**

### **Accès**
- **Menu** : Galeries
- **URL** : `/admin/galleries`

### **Fonctionnalités**
- **Uploader des images** : Ajouter des images générales
- **Gérer les images** : Voir, supprimer, organiser
- **Filtres** : Par type (articles, événements, général)
- **Recherche** : Par nom ou légende

---

## 🏷️ **Gestion des Catégories**

### **Accès**
- **Menu** : Catégories
- **URL** : `/admin/categories`

### **Fonctionnalités**
- **Créer une catégorie** : Ajouter une nouvelle catégorie
- **Modifier** : Changer le nom, description, couleur
- **Supprimer** : Supprimer une catégorie (attention : vérifier qu'aucun contenu n'y est associé)

---

## ⚙️ **Paramètres**

### **Accès**
- **Menu** : Paramètres
- **URL** : `/admin/settings`

### **Fonctionnalités**
- **Profil utilisateur** : Modifier vos informations
- **Préférences** : Paramètres d'affichage
- **Sécurité** : Changer le mot de passe

---

## 🔧 **Fonctionnalités Techniques**

### **Upload de fichiers**
- **Images** : JPG, PNG, GIF, WebP (max 10MB)
- **Documents** : PDF, Word, Excel, PowerPoint (max 100MB)
- **Upload par chunks** : Les gros fichiers sont uploadés par parties

### **Éditeur de texte**
- **Formatage** : Gras, italique, listes, liens
- **Multilingue** : Support français et arabe
- **Images** : Insertion d'images dans le contenu

### **Recherche et filtres**
- **Recherche en temps réel** : Résultats instantanés
- **Filtres multiples** : Par statut, catégorie, date
- **Pagination** : Navigation par pages

---

## 🚨 **Bonnes Pratiques**

### **Sécurité**
- **Déconnexion** : Toujours vous déconnecter après utilisation
- **Mots de passe** : Utilisez des mots de passe forts
- **Sauvegarde** : Sauvegardez régulièrement votre travail

### **Contenu**
- **Images** : Optimisez les images avant upload
- **Textes** : Vérifiez l'orthographe avant publication
- **Multilingue** : Remplissez les versions arabe et française

### **Organisation**
- **Catégories** : Utilisez les catégories pour organiser le contenu
- **Statuts** : Utilisez les brouillons pour préparer le contenu
- **Dates** : Planifiez les publications avec les dates

---

## 🆘 **Support et Aide**

### **Problèmes courants**
- **Upload échoue** : Vérifiez la taille du fichier (max 100MB)
- **Page ne se charge pas** : Rafraîchissez la page (F5)
- **Erreur de connexion** : Vérifiez votre connexion internet

### **Contact technique**
- **Email** : [votre-email-technique]
- **Téléphone** : [votre-numéro-technique]

---

## 📱 **Utilisation Mobile**

Le dashboard est **entièrement responsive** et fonctionne sur :
- 📱 **Smartphones** : Interface adaptée tactile
- 📱 **Tablettes** : Navigation optimisée
- 💻 **Ordinateurs** : Interface complète

---

*Dernière mise à jour : [Date actuelle]*
*Version du guide : 1.0*
