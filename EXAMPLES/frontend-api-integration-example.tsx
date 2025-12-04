// Example: How to integrate API calls in your React components
// This shows how to replace mock data with real API calls

import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Property } from '../types';

// ============================================
// Example 1: ListingsPage with API Integration
// ============================================

const ListingsPageExample: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState({
    priceMin: '',
    priceMax: '',
    location: 'All areas',
    bedrooms: 'Any',
    bathrooms: 'Any',
  });

  // Fetch properties from API
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await api.getProperties({
          search: searchQuery || undefined,
          priceMin: activeFilters.priceMin 
            ? parsePriceValue(activeFilters.priceMin) 
            : undefined,
          priceMax: activeFilters.priceMax 
            ? parsePriceValue(activeFilters.priceMax) 
            : undefined,
          location: activeFilters.location !== 'All areas' 
            ? activeFilters.location 
            : undefined,
          bedrooms: activeFilters.bedrooms !== 'Any' 
            ? Number(activeFilters.bedrooms) 
            : undefined,
          bathrooms: activeFilters.bathrooms !== 'Any' 
            ? Number(activeFilters.bathrooms) 
            : undefined,
        });

        setProperties(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load properties');
        console.error('Error fetching properties:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [searchQuery, activeFilters]);

  const parsePriceValue = (price: string) => {
    const match = price.match(/([\d.,]+)/);
    if (!match) return 0;
    const normalized = match[1].replace(/[^\d]/g, '');
    return Number(normalized || '0');
  };

  const handleCreateProperty = async (propertyData: Omit<Property, 'id'>) => {
    try {
      const newProperty = await api.createProperty(propertyData);
      setProperties(prev => [newProperty, ...prev]);
      return { success: true };
    } catch (err) {
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to create property' 
      };
    }
  };

  if (loading) {
    return <div>Loading properties...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      {/* Your existing UI */}
      {properties.map(property => (
        <div key={property.id}>{property.name}</div>
      ))}
    </div>
  );
};

// ============================================
// Example 2: LeadsPage with API Integration
// ============================================

import { Lead } from '../types';

const LeadsPageExample: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    dateRange: 'all',
    source: 'all',
    status: 'all',
  });

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        setLoading(true);
        const data = await api.getLeads({
          dateRange: filters.dateRange !== 'all' ? filters.dateRange : undefined,
          source: filters.source !== 'all' ? filters.source : undefined,
          status: filters.status !== 'all' ? filters.status : undefined,
        });
        setLeads(data);
      } catch (err) {
        console.error('Error fetching leads:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, [filters]);

  return (
    <div>
      {leads.map(lead => (
        <div key={lead.id}>{lead.name}</div>
      ))}
    </div>
  );
};

// ============================================
// Example 3: Authentication Hook
// ============================================

import { useState, createContext, useContext } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  plan: string;
  tokens: number;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on mount
    const token = localStorage.getItem('token');
    if (token) {
      // Verify token and get user data
      api.getCurrentUser()
        .then(userData => setUser(userData))
        .catch(() => {
          localStorage.removeItem('token');
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const { token, user: userData } = await api.login(email, password);
    localStorage.setItem('token', token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

// ============================================
// Example 4: Protected Route Component
// ============================================

import { Navigate } from 'react-router-dom';

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// ============================================
// Example 5: Content Creation with API
// ============================================

const CreateContentPageExample: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isPosting, setIsPosting] = useState(false);

  useEffect(() => {
    // Fetch properties for selection
    api.getProperties().then(setProperties);
  }, []);

  const handlePostContent = async (
    propertyId: string,
    accounts: string[],
    format: string,
    caption: string,
    description: string
  ) => {
    try {
      setIsPosting(true);
      
      // Call API to create and post content
      await api.postContent({
        propertyId,
        accounts,
        format,
        caption,
        description,
      });

      // Show success message
      alert('Content posted successfully!');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to post content');
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <div>
      {/* Your existing UI */}
      <button 
        onClick={() => handlePostContent('id', ['account1'], 'post', 'caption', 'desc')}
        disabled={isPosting}
      >
        {isPosting ? 'Posting...' : 'Post Content'}
      </button>
    </div>
  );
};

// ============================================
// Example 6: Error Handling Component
// ============================================

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  { hasError: boolean; error: Error | null }
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    // Send to error tracking service (e.g., Sentry)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div>
          <h2>Something went wrong</h2>
          <p>{this.state.error?.message}</p>
          <button onClick={() => this.setState({ hasError: false, error: null })}>
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}


