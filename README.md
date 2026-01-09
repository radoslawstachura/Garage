# Garage — Microservices Backend & Frontend

## Technology Stack

- **Backend:** Express.js + TypeScript  
- **Frontend:** React + Next.js + TypeScript + **ui.shadcn**  
- **Databases:** PostgreSQL (one per microservice)  
- **Caching / session / token blacklist:** Redis (one per microservice) + central `redis-blacklist`  
- **Messaging / Event Bus:** Apache Kafka + Zookeeper  
- **Containerization & orchestration:** Docker, Docker Compose  
- **Reverse proxy / gateway:** NGINX (port **8080**)

---

## Architecture Overview

- **Microservices:** `cars`, `mechanics`, `repairs`, `statistics`, `user`  
- **Per-service storage:** Each microservice has its own **PostgreSQL** database and **Redis** cache  
- **Central Redis blacklist:** Shared Redis instance (`redis-blacklist`) for revoked JWTs  
- **Event bus:** Kafka with Zookeeper provides reliable event streaming and inter-service communication  
- **Authentication:** JSON Web Tokens (JWT), validated and checked against `redis-blacklist`  
- **Reverse proxy / gateway:** NGINX exposes the backend API through port **8080**  
- **Frontend:** React + Next.js + TypeScript using **ui.shadcn** components

---

## Key Features

- **Microservice architecture** with isolated databases and caches  
- **Event-driven communication** using Kafka topics  
- **JWT authentication** with centralized token revocation  
- **Dedicated Redis for caching** and **redis-blacklist** for revoked JWTs  
- **Structured error handling** and input validation in all backend services  
- **One-command local startup**: `docker compose up --build`

---

## Getting Started (Local Development)

### Prerequisites

- Docker  
- Docker Compose  
- (Optional) Node.js + yarn/npm to run services locally

### Environment files

Example `.env` files for each microservice are included in the project to simplify setup.

### Run the whole application

From the project's root directory:

docker compose up --build

This will:

- Build Docker images for all microservices  
- Start **PostgreSQL**, **Redis**, **Kafka + Zookeeper**, **redis-blacklist**, backend services, and frontend  
- Start **NGINX reverse proxy** on port **8080**  
- Ensure microservices can communicate via Kafka and Redis

---

### Useful Docker Compose commands

docker compose up --build  
docker compose down

---

## Messaging & Kafka

- **Kafka** handles inter-service events asynchronously  
- Each microservice can **produce and consume events** on Kafka topics  
- **Zookeeper** is required for Kafka cluster coordination  
- Kafka topics are created automatically if they do not exist

---

## Authentication & Security

- JWT tokens are used for authentication  
- Revoked tokens are stored in **redis-blacklist** and checked on protected endpoints  
- Services enforce input validation and structured error handling to prevent leaks

---

## Error Handling & Validation

- Structured middleware returns consistent error responses  
- Input validation is enforced at API boundaries to prevent invalid or malicious input

---

## Frontend

- Runs on **port 3000** (Docker Compose default)  
- Communicates with backend via **NGINX gateway** (`http://localhost:8080`)  
- Built with **Next.js** and **React**, using **ui.shadcn** components  
- Handles edge cases such as missing or deleted owners gracefully  
- Example `.env` files are included for frontend configuration

