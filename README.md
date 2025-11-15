# 📝 Gestionnaire de Tâches - Todo App

Une application moderne de gestion de tâches construite avec React, TypeScript, Node.js, Express et MongoDB. Interface fluide et intuitive avec authentification sécurisée.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![React](https://img.shields.io/badge/React-18-blue)
![Node.js](https://img.shields.io/badge/Node.js-20-green)

## ✨ Fonctionnalités

- 🔐 **Authentification sécurisée** : Inscription et connexion avec JWT
- ✅ **Gestion de tâches** : Créer, modifier, supprimer et filtrer vos tâches
- 🎨 **Interface moderne** : Design fluide avec Tailwind CSS et shadcn/ui
- 📊 **Statistiques** : Vue d'ensemble de vos tâches par statut
- 🔄 **Changement rapide de statut** : Dropdown intuitif pour mettre à jour le statut
- 👤 **Multi-utilisateurs** : Chaque utilisateur a ses propres tâches
- 📱 **Responsive** : Fonctionne sur desktop, tablette et mobile
- 🎯 **Filtrage avancé** : Filtrer par statut (À faire, En cours, Terminé)

## 🛠️ Stack Technique

### Frontend
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + shadcn/ui
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **State Management**: React Hooks (useState, useEffect)
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js + Express.js
- **Language**: TypeScript
- **Database**: MongoDB + Mongoose
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **Validation**: Express middleware

## 📦 Installation

### Prérequis
- Node.js 18+ 
- MongoDB (local ou Atlas)
- npm ou yarn

### 1. Cloner le repository


## 🔌 API Endpoints

### Authentication
| Endpoint | Méthode | Description |
|----------|---------|-------------|
| `/api/auth/register` | POST | Inscription d'un nouvel utilisateur |
| `/api/auth/login` | POST | Connexion utilisateur |

### Todos (Authentification requise)
| Endpoint | Méthode | Description |
|----------|---------|-------------|
| `/api/todos` | GET | Récupérer toutes les tâches de l'utilisateur |
| `/api/todos` | POST | Créer une nouvelle tâche |
| `/api/todos/:id` | GET | Récupérer une tâche spécifique |
| `/api/todos/:id` | PUT | Mettre à jour une tâche |
| `/api/todos/:id` | DELETE | Supprimer une tâche |

### Exemple de requête

**Créer une tâche**

## 🎨 Captures d'écran

### Page d'authentification
Interface moderne avec gradient et animations

### Dashboard
Vue d'ensemble avec statistiques et filtres

### Gestion des tâches
Cartes avec changement de statut rapide via dropdown

## 🚀 Déploiement

### Backend (exemple avec Render)
1. Créer un compte sur [Render](https://render.com)
2. Connecter votre repository GitHub
3. Configurer les variables d'environnement
4. Déployer

### Frontend (exemple avec Vercel)
1. Créer un compte sur [Vercel](https://vercel.com)
2. Importer votre projet depuis GitHub
3. Configurer la variable `VITE_API_URL`
4. Déployer

## 🤝 Contribution

Les contributions sont les bienvenues ! Pour contribuer :

1. Forkez le projet
2. Créez une branche (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Pushez vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## 📝 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 👨‍💻 Auteur

**Martin Manampisoa**
- GitHub: [@Martin42746284](https://github.com/Martin42746284)
- Email: martin.manampisoa42@gmail.com

## 🙏 Remerciements

- [shadcn/ui](https://ui.shadcn.com/) pour les composants UI
- [Lucide](https://lucide.dev/) pour les icônes
- [Tailwind CSS](https://tailwindcss.com/) pour le styling

---

⭐ Si ce projet vous a été utile, n'hésitez pas à lui donner une étoile !
