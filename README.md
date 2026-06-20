# DevDeploy

A production-grade DevOps SaaS platform for deploying applications from GitHub repositories to a Kubernetes cluster.

## Architecture
- **Frontend**: Next.js 15, Tailwind CSS, shadcn/ui, Recharts.
- **Backend**: Node.js, Express, TypeScript, Prisma.
- **Database**: PostgreSQL
- **Infrastructure Engine**: Dockerode (for building images locally), @kubernetes/client-node (for applying manifests).

## Prerequisites
- Node.js v18+
- Docker Desktop (must be running for backend to build images)
- Minikube (must be running to deploy applications)
- PostgreSQL (can be run via docker compose)

## Setup Instructions

### 1. Database Setup
Start the local PostgreSQL database using Docker Compose:
```bash
docker compose up -d
```

### 2. Backend Setup
Navigate to the backend directory, install dependencies, generate the Prisma client, and start the server:
```bash
cd backend
npm install
npx prisma generate
npx prisma db push
npm run dev
```

### 3. Frontend Setup
Navigate to the frontend directory, install dependencies, and start the Next.js development server:
```bash
cd frontend
npm install
npm run dev
```

## Features
- **Dashboard**: High-level overview of applications, pods, and deployments.
- **Deployment**: Enter a GitHub URL to automatically clone, build a Docker image, and deploy to Minikube.
- **Monitoring**: Live-updating CPU/Memory usage graphs using Recharts.
- **Logs Viewer**: Stream logs from your running pods.
