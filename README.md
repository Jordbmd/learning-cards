# Learning Cards

Application d'aide à l'apprentissage basée sur des fiches (flashcards) et la répétition espacée utilisant l'algorithme de Leitner.

## 🏗️ Architecture

- **Architecture** : DDD (Domain-Driven Design) + Hexagonale
- **Algorithme** : Système de Leitner avec 7 catégories + statut DONE
- **Monorepo** :
  - `back/` : API REST en Node.js/TypeScript avec Express
  - `front/` : Interface React/TypeScript avec Material-UI

## 📋 Prérequis

- **Docker** et **Docker Compose** installés

## 🚀 Installation et démarrage

1. **Cloner le projet** :
   ```bash
   git clone <repository-url> learning-cards
   cd learning-cards
   ```

2. **Démarrer l'application** :
   ```bash
   cd docker
   docker-compose up --build
   ```

3. **Accéder à l'application** :
   - Frontend : http://localhost:5173
   - Backend API : http://localhost:8080
   - PostgreSQL : localhost:5432

4. **Arrêter l'application** :
   ```bash
   docker-compose down
   ```

## 🧪 Tests

### Backend

```bash
cd back

# Exécuter tous les tests
npm test

# Exécuter les tests avec la couverture
npm run test:coverage

# Les résultats de couverture seront dans back/coverage/
```

**Tests disponibles** :
- Tests unitaires des entités (Card, User)
- Tests des use cases (CreateCard, AnswerCard, GetQuizzCards, etc.)
- Tests des repositories (InMemoryCardRepository, InMemoryUserRepository)

### Frontend

```bash
cd front

# Exécuter tous les tests
npm test

# Exécuter les tests avec interface graphique
npm run test:ui

# Exécuter les tests avec la couverture
npm run test:coverage

# Les résultats de couverture seront dans front/coverage/
```

**Tests disponibles** :
- Tests des services (cardService, notificationService)
- Tests des types et enums (Card, Category)
- Tests unitaires des composants

### Couverture de tests

La couverture est calculée avec Vitest et @vitest/coverage-v8 pour les deux projets.

**Backend** : fichiers de tests unitaires couvrant :
- Entités du domaine
- Use cases de l'application
- Repositories en mémoire

**Frontend** : fichiers de tests couvrant :
- Services API
- Types et utilitaires
- Gestion des notifications

## 📁 Structure du projet

```
learning-cards/
├── back/                          # API Backend
│   ├── src/
│   │   ├── domain/               # Entités et interfaces du domaine
│   │   │   ├── entities/         # Card, User
│   │   │   └── repositories/     # ICardRepository, IUserRepository
│   │   ├── application/          # Use cases métier
│   │   │   └── usecases/         # CreateCard, AnswerCard, GetQuizzCards...
│   │   ├── infrastructure/       # Implémentations techniques
│   │   │   ├── database/         # PostgreSQL pool, schema
│   │   │   └── repositories/     # PostgreSQLCardRepository
│   │   └── interfaces/           # Contrôleurs HTTP
│   │       └── http/             # Express routes et controllers
│   └── test/
│       ├── unit/                 # Tests unitaires
│       └── integration/          # Tests d'intégration
├── front/                        # Frontend React
│   ├── src/
│   │   ├── components/           # Composants réutilisables
│   │   ├── pages/                # Pages de l'application
│   │   ├── services/             # Services API
│   │   ├── domain/               # Types TypeScript
│   │   └── config/               # Configuration
│   └── test/                     # Tests unitaires
├── docker/                       # Configuration Docker
│   ├── docker-compose.yml
│   ├── back.Dockerfile
│   └── front.Dockerfile
└── docs/                         # Documentation
    ├── specs/                    # Spécifications OpenAPI
    └── architecture/             # Diagrammes d'architecture
```

## 🔑 Fonctionnalités principales

### API Backend (Port 8080)

- `GET /cards` - Récupérer toutes les cartes (avec filtrage par tags optionnel)
- `POST /cards` - Créer une nouvelle carte
- `GET /cards/quizz` - Récupérer les cartes du quiz du jour (système Leitner)
- `PATCH /cards/{cardId}/answer` - Répondre à une carte (correct/incorrect)

### Interface Frontend (Port 5173)

- Création et gestion de cartes
- Quiz quotidien basé sur l'algorithme de Leitner
- Notifications pour rappels de révision
- Visualisation de la progression par catégorie

## 🗄️ Base de données

**PostgreSQL 16** avec le schéma suivant :

- **cards** : stockage des flashcards avec catégorie Leitner
- **users** : gestion des utilisateurs (à venir)

## 📚 Algorithme de Leitner

Le système utilise 8 catégories :
- **FIRST (1)** : Nouvelles cartes (révision quotidienne)
- **SECOND (2)** : Cartes revues 1 fois (révision après 1 jour)
- **THIRD (3)** : Cartes revues 2 fois (révision après 2 jours)
- **FOURTH (4)** : Cartes revues 3 fois (révision après 4 jours)
- **FIFTH (5)** : Cartes revues 4 fois (révision après 8 jours)
- **SIXTH (6)** : Cartes revues 5 fois (révision après 16 jours)
- **SEVENTH (7)** : Cartes revues 6 fois (révision après 32 jours)
- **DONE (8)** : Cartes maîtrisées (révision après 64 jours)

En cas de mauvaise réponse, la carte retourne en catégorie FIRST.

## 🛠️ Technologies utilisées

### Backend
- Node.js + TypeScript
- Express.js
- PostgreSQL + pg
- Vitest

### Frontend
- React 19
- TypeScript
- Material-UI (MUI)
- Vite
- Vitest

## 📄 API Documentation

Le contrat d'interface OpenAPI est disponible dans `docs/specs/Contrat d'interface.yml`.
