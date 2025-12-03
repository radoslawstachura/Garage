# Garage — Microservices Backend & Frontend

## Overview

**Garage** is a full-stack application implemented with a microservices backend and a modern React + Next.js frontend. The system is designed for managing cars, mechanics, repairs and related statistics. Backend microservices are written in **Express.js** with **TypeScript** and each service runs with its own PostgreSQL and Redis instances inside the project's Docker network. Authentication uses **JWT** and there is a dedicated **redis-blacklist** service that stores revoked tokens.


## Architecture

- **Microservices**: `cars`, `mechanics`, `repairs`, `statistics`, `user`
- **Per-microservice storage**: Each microservice has its own **PostgreSQL** database and a **Redis** instance (all running on the project's Docker network).
- **Redis blacklist**: A shared Redis instance (`redis-blacklist`) holds revoked JWTs.
- **Authentication**: JSON Web Tokens (JWT) used for authentication and authorization across services. Revoked tokens are stored in `redis-blacklist`.
- **Reverse proxy / gateway**: An **NGINX** reverse-proxy exposes the backend API and acts as the single access point on port **8080**.
- **Frontend**: React + Next.js application written in TypeScript using the **ui.shadcn** component library.


## Technology Stack

- Backend: Express.js + TypeScript
- Frontend: React + Next.js + TypeScript + ui.shadcn
- Databases: PostgreSQL (one per microservice)
- Caching / session / token blacklist: Redis (one per microservice) + `redis-blacklist`
- Containerization & orchestration: Docker, Docker Compose
- Reverse proxy: NGINX (port **8080**)


## Key Features

- Microservice architecture (separate services for cars, mechanics, repairs, statistics, user)
- JWT-based authentication with centralized token revocation
- Per-service PostgreSQL databases for isolation
- Per-service Redis instances for caching and fast lookups
- Central `redis-blacklist` for invalidated JWTs
- Error handling and input validation throughout backend services
- One-command local startup: `docker compose up --build`


## Getting Started (Local Development)

### Prerequisites

- Docker
- Docker Compose
- (Optional) Node.js and yarn/npm if you want to run services locally without Docker


### Run the whole application

From the project's root directory run:

```bash
docker compose up --build
```

This will build images and start all microservices, their PostgreSQL and Redis instances, the `redis-blacklist` service and the NGINX reverse proxy. The reverse-proxy listens on port **8080** by default — point your browser or API client to `http://localhost:8080`.


### Useful Docker Compose commands

```bash
# Build and start
docker compose up --build

# Stop and remove containers
docker compose down

## Authentication & Security

- Authentication is handled with JWT tokens signed using `JWT_SECRET`.
- Revoked tokens are stored in the `redis-blacklist` service; middleware checks tokens against the blacklist on protected endpoints.
- All services perform input validation and centralized error handling to avoid leaking sensitive info.


## Error Handling & Validation

- Backend services implement structured error-handling middleware that returns consistent error responses.
- Input validation is performed at API boundaries (e.g., request body/query/path validation) to guard against invalid or malicious input.


## Frontend

**Note:** In the provided Docker Compose configuration, the frontend runs on **port 3000**.

- Built with **Next.js** and **React** (TypeScript).
- Uses **ui.shadcn** components for a consistent design system.
- Communicates with the backend through the NGINX gateway at `http://localhost:8080` (or the configured base URL).