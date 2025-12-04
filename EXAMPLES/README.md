# Backend Integration Examples

This folder contains example code showing how to set up and integrate a TypeScript backend with your React frontend.

## Files

1. **backend-service-example.ts** - Example service layer showing business logic
2. **prisma-schema-example.prisma** - Database schema example using Prisma
3. **frontend-api-integration-example.tsx** - React components showing API integration

## Quick Start Guide

### Step 1: Set Up Backend Structure

```bash
# Create backend folder
mkdir backend
cd backend

# Initialize npm
npm init -y

# Install dependencies
npm install express cors dotenv bcryptjs jsonwebtoken zod prisma @prisma/client
npm install -D @types/express @types/cors @types/bcryptjs @types/jsonwebtoken @types/node tsx typescript

# Initialize TypeScript
npx tsc --init
```

### Step 2: Set Up Database

```bash
# Initialize Prisma
npx prisma init

# Copy the schema from prisma-schema-example.prisma to prisma/schema.prisma
# Update DATABASE_URL in .env

# Create database
npx prisma migrate dev --name init

# Generate Prisma Client
npx prisma generate
```

### Step 3: Create Backend Files

Copy the example code from `BACKEND_SETUP_EXAMPLE.md` and create:
- `src/index.ts` - Entry point
- `src/app.ts` - Express app
- `src/routes/` - API routes
- `src/controllers/` - Request handlers
- `src/services/` - Business logic
- `src/middleware/` - Auth and error handling

### Step 4: Set Up Frontend API Client

1. Create `frontend/src/services/api.ts` (see example in `BACKEND_SETUP_EXAMPLE.md`)
2. Update your components to use the API client instead of mock data
3. Add authentication context (see `frontend-api-integration-example.tsx`)

### Step 5: Environment Variables

Create `.env` files:

**Backend `.env`:**
```env
PORT=5000
DATABASE_URL=postgresql://user:password@localhost:5432/agentara
JWT_SECRET=your-secret-key
FRONTEND_URL=http://localhost:3000
```

**Frontend `.env`:**
```env
VITE_API_URL=http://localhost:5000/api
```

### Step 6: Run Both Servers

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```

## Key Concepts

### 1. Shared Types
- Create a `shared/types/` folder
- Both frontend and backend import from the same types
- Ensures type safety across the stack

### 2. API Client Pattern
- Single `api.ts` file handles all HTTP requests
- Automatic token injection
- Consistent error handling

### 3. Service Layer
- Business logic separated from controllers
- Reusable across different endpoints
- Easier to test

### 4. Middleware
- Authentication middleware protects routes
- Error middleware handles all errors consistently
- Request validation middleware

## Next Steps

1. Implement authentication endpoints
2. Create property CRUD operations
3. Add file upload functionality
4. Integrate payment gateway
5. Connect social media APIs
6. Add real-time features with WebSockets

## Resources

- [Express.js Documentation](https://expressjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React Query](https://tanstack.com/query) - For better data fetching (optional)


