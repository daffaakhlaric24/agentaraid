# Backend Setup Example - TypeScript + Express

This document shows example structure and code for setting up a TypeScript backend that works with your React frontend.

## 📁 Recommended Project Structure

```
agentara/
├── frontend/              (Your current React app - keep as is)
│   ├── src/
│   ├── package.json
│   └── vite.config.ts
│
├── backend/               (New Express + TypeScript backend)
│   ├── src/
│   │   ├── index.ts              # Entry point
│   │   ├── app.ts                 # Express app setup
│   │   ├── config/
│   │   │   └── database.ts        # Database connection
│   │   ├── routes/
│   │   │   ├── auth.routes.ts
│   │   │   ├── properties.routes.ts
│   │   │   ├── leads.routes.ts
│   │   │   └── index.ts
│   │   ├── controllers/
│   │   │   ├── auth.controller.ts
│   │   │   ├── properties.controller.ts
│   │   │   └── leads.controller.ts
│   │   ├── models/
│   │   │   ├── User.model.ts
│   │   │   ├── Property.model.ts
│   │   │   └── Lead.model.ts
│   │   ├── middleware/
│   │   │   ├── auth.middleware.ts
│   │   │   └── error.middleware.ts
│   │   └── utils/
│   │       └── validators.ts
│   ├── package.json
│   ├── tsconfig.json
│   └── .env
│
└── shared/                (Shared TypeScript types)
    └── types/
        ├── Property.ts
        ├── Lead.ts
        ├── User.ts
        └── index.ts
```

## 📦 Backend package.json Example

```json
{
  "name": "agentara-backend",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "zod": "^3.22.4",
    "prisma": "^5.7.1",
    "@prisma/client": "^5.7.1",
    "multer": "^1.4.5-lts.1",
    "aws-sdk": "^2.1500.0"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/cors": "^2.8.17",
    "@types/bcryptjs": "^2.4.6",
    "@types/jsonwebtoken": "^9.0.5",
    "@types/multer": "^1.4.11",
    "@types/node": "^20.10.5",
    "tsx": "^4.7.0",
    "typescript": "^5.3.3"
  }
}
```

## 🔧 Backend tsconfig.json Example

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "lib": ["ES2022"],
    "moduleResolution": "node",
    "rootDir": "./src",
    "outDir": "./dist",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "types": ["node"]
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

## 🌐 Backend Entry Point (backend/src/index.ts)

```typescript
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { app } from './app.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
```

## 📱 Express App Setup (backend/src/app.ts)

```typescript
import express from 'express';
import cors from 'cors';
import { errorHandler } from './middleware/error.middleware.js';
import routes from './routes/index.js';

export const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', routes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling
app.use(errorHandler);
```

## 🛣️ Routes Setup (backend/src/routes/index.ts)

```typescript
import { Router } from 'express';
import authRoutes from './auth.routes.js';
import propertyRoutes from './properties.routes.js';
import leadRoutes from './leads.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/properties', propertyRoutes);
router.use('/leads', leadRoutes);

export default router;
```

## 🏠 Properties Routes Example (backend/src/routes/properties.routes.ts)

```typescript
import { Router } from 'express';
import { 
  getProperties, 
  getPropertyById, 
  createProperty, 
  updateProperty, 
  deleteProperty 
} from '../controllers/properties.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

// All routes require authentication
router.use(authenticate);

// GET /api/properties - Get all properties with filters
router.get('/', getProperties);

// GET /api/properties/:id - Get single property
router.get('/:id', getPropertyById);

// POST /api/properties - Create new property
router.post('/', createProperty);

// PUT /api/properties/:id - Update property
router.put('/:id', updateProperty);

// DELETE /api/properties/:id - Delete property
router.delete('/:id', deleteProperty);

export default router;
```

## 🎮 Properties Controller Example (backend/src/controllers/properties.controller.ts)

```typescript
import { Request, Response, NextFunction } from 'express';
import { PropertyService } from '../services/property.service.js';
import { Property } from '../../../shared/types/Property.js';

// Extend Express Request to include user
interface AuthRequest extends Request {
  user?: { id: string; email: string };
}

export const getProperties = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.id;
    const { search, priceMin, priceMax, location, bedrooms, bathrooms } = req.query;

    const filters = {
      userId,
      search: search as string | undefined,
      priceMin: priceMin ? Number(priceMin) : undefined,
      priceMax: priceMax ? Number(priceMax) : undefined,
      location: location as string | undefined,
      bedrooms: bedrooms ? Number(bedrooms) : undefined,
      bathrooms: bathrooms ? Number(bathrooms) : undefined,
    };

    const properties = await PropertyService.getProperties(filters);
    
    res.json({
      success: true,
      data: properties,
      count: properties.length
    });
  } catch (error) {
    next(error);
  }
};

export const getPropertyById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;

    const property = await PropertyService.getPropertyById(id, userId);
    
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    res.json({
      success: true,
      data: property
    });
  } catch (error) {
    next(error);
  }
};

export const createProperty = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.id;
    const propertyData: Omit<Property, 'id'> = req.body;

    const newProperty = await PropertyService.createProperty(userId, propertyData);
    
    res.status(201).json({
      success: true,
      data: newProperty,
      message: 'Property created successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const updateProperty = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;
    const updateData = req.body;

    const updatedProperty = await PropertyService.updateProperty(id, userId, updateData);
    
    res.json({
      success: true,
      data: updatedProperty,
      message: 'Property updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProperty = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;

    await PropertyService.deleteProperty(id, userId);
    
    res.json({
      success: true,
      message: 'Property deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
```

## 🔐 Auth Middleware Example (backend/src/middleware/auth.middleware.ts)

```typescript
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface AuthRequest extends Request {
  user?: { id: string; email: string };
}

export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string; email: string };
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};
```

## 🗄️ Shared Types (shared/types/Property.ts)

```typescript
// This is the same type used in your frontend!
export interface Property {
  id: string;
  name: string;
  image: string;
  images?: string[];
  price: string;
  address: string;
  description?: string;
  specs: {
    lt: number;      // Land area
    lb: number;     // Build area
    rooms: number;  // Bedrooms
    toilets: number; // Bathrooms
  };
}

// Additional types for API requests/responses
export interface CreatePropertyDto {
  name: string;
  price: string;
  address: string;
  description?: string;
  specs: {
    lt: number;
    lb: number;
    rooms: number;
    toilets: number;
  };
}

export interface PropertyFilters {
  search?: string;
  priceMin?: number;
  priceMax?: number;
  location?: string;
  bedrooms?: number;
  bathrooms?: number;
}
```

## 🔌 Frontend API Client Example (frontend/src/services/api.ts)

```typescript
import { Property, Lead, Task } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ApiClient {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = localStorage.getItem('token');
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Something went wrong');
    }

    const data = await response.json();
    return data.data || data;
  }

  // Properties
  async getProperties(filters?: {
    search?: string;
    priceMin?: number;
    priceMax?: number;
    location?: string;
    bedrooms?: number;
    bathrooms?: number;
  }): Promise<Property[]> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value));
        }
      });
    }
    
    const query = params.toString();
    return this.request<Property[]>(`/properties${query ? `?${query}` : ''}`);
  }

  async getPropertyById(id: string): Promise<Property> {
    return this.request<Property>(`/properties/${id}`);
  }

  async createProperty(property: Omit<Property, 'id'>): Promise<Property> {
    return this.request<Property>('/properties', {
      method: 'POST',
      body: JSON.stringify(property),
    });
  }

  async updateProperty(id: string, property: Partial<Property>): Promise<Property> {
    return this.request<Property>(`/properties/${id}`, {
      method: 'PUT',
      body: JSON.stringify(property),
    });
  }

  async deleteProperty(id: string): Promise<void> {
    return this.request<void>(`/properties/${id}`, {
      method: 'DELETE',
    });
  }

  // Leads
  async getLeads(filters?: {
    dateRange?: string;
    source?: string;
    status?: string;
  }): Promise<Lead[]> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
    }
    
    const query = params.toString();
    return this.request<Lead[]>(`/leads${query ? `?${query}` : ''}`);
  }

  // Auth
  async login(email: string, password: string): Promise<{ token: string; user: any }> {
    return this.request<{ token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(userData: {
    email: string;
    password: string;
    name: string;
  }): Promise<{ token: string; user: any }> {
    return this.request<{ token: string; user: any }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }
}

export const api = new ApiClient();
```

## 📝 Example: Update Frontend to Use API (frontend/pages/ListingsPage.tsx)

```typescript
// Example of how to replace mock data with API calls
import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Property } from '../types';

const ListingsPage: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Replace mock data with API call
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const data = await api.getProperties({
          search: searchQuery,
          priceMin: activeFilters.priceMin ? parsePriceValue(activeFilters.priceMin) : undefined,
          priceMax: activeFilters.priceMax ? parsePriceValue(activeFilters.priceMax) : undefined,
          location: activeFilters.location !== 'All areas' ? activeFilters.location : undefined,
          bedrooms: activeFilters.bedrooms !== 'Any' ? Number(activeFilters.bedrooms) : undefined,
          bathrooms: activeFilters.bathrooms !== 'Any' ? Number(activeFilters.bathrooms) : undefined,
        });
        setProperties(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load properties');
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [searchQuery, activeFilters]);

  // Rest of your component...
};
```

## 🔑 Environment Variables (.env.example)

```env
# Server
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/agentara

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# AWS S3 (for file uploads)
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=ap-southeast-1
AWS_S3_BUCKET=agentara-uploads

# Payment (Midtrans)
MIDTRANS_SERVER_KEY=your-midtrans-server-key
MIDTRANS_CLIENT_KEY=your-midtrans-client-key

# Social Media APIs
INSTAGRAM_CLIENT_ID=your-instagram-client-id
INSTAGRAM_CLIENT_SECRET=your-instagram-client-secret
FACEBOOK_APP_ID=your-facebook-app-id
FACEBOOK_APP_SECRET=your-facebook-app-secret
```

## 🚀 Quick Start Commands

```bash
# 1. Create backend folder
mkdir backend
cd backend

# 2. Initialize npm
npm init -y

# 3. Install dependencies
npm install express cors dotenv bcryptjs jsonwebtoken zod prisma @prisma/client
npm install -D @types/express @types/cors @types/bcryptjs @types/jsonwebtoken @types/node tsx typescript

# 4. Initialize TypeScript
npx tsc --init

# 5. Create folder structure
mkdir -p src/{routes,controllers,models,middleware,utils,config}

# 6. Run in development
npm run dev
```

## 📚 Next Steps

1. Set up database (PostgreSQL with Prisma)
2. Implement authentication endpoints
3. Create property CRUD operations
4. Add file upload functionality
5. Connect frontend to backend API
6. Add error handling and validation
7. Set up environment variables
8. Deploy backend to production

This structure allows you to use TypeScript throughout your entire stack while keeping your frontend and backend separate but sharing types!


